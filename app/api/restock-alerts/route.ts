import { NextRequest, NextResponse } from "next/server"
import { ensureConnection } from "@/lib/database"
import { InventoryItem } from "@/models/InventoryItem"
import { middleware } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    await ensureConnection()
    await middleware(request)

    const alerts = await InventoryItem.aggregate([
      {
        $lookup: {
          from: "inventoryConsumptions",
          let: { itemId: "$_id", updatedDate: "$updatedAt" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$itemId", "$$itemId"] },
                    { $gte: ["$date", "$updatedAt"] }
                  ]
                }
              }
            },
            {
              $sort: { date: -1 }
            }
          ],
          as: "consumptionLogs"
        }
      },
      {
        $match: {
          "consumptionLogs.0": { $exists: true }
        }
      },
      {
        $addFields: {
          totalConsumption: { $sum: "$consumptionLogs.quantity" },
          daysWithData: { $size: "$consumptionLogs" }
        }
      },
      {
        $match: {
          totalConsumption: { $gt: 0 }
        }
      },

      {
        $addFields: {
          averageDailyConsumption: {
            $divide: ["$totalConsumption", "$daysWithData"]
          }
        }
      },
      {
        $addFields: {
          daysUntilEmpty: {
            $divide: ["$currentQuantity", "$averageDailyConsumption"]
          }
        }
      },
      {
        $match: {
          daysUntilEmpty: { $lte: 3 },
        },
      },
      {
        $project: {
          item: {
            _id: "$_id",
            name: "$name",
            currentQuantity: "$currentQuantity",
            unit: "$unit",
            reorderThreshold: "$reorderThreshold",
            category: "$category",
            status: "$status"
          },
          daysUntilEmpty: { $round: ["$daysUntilEmpty", 2] },
          averageDailyConsumption: { $round: ["$averageDailyConsumption", 2] },
          totalConsumption: "$totalConsumption",
          daysWithData: "$daysWithData"
        }
      },

      {
        $sort: { daysUntilEmpty: 1 }
      }
    ])

    return NextResponse.json(alerts)
  } catch (error) {
    console.error("Error generating restock alerts:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}