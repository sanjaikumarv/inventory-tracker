import { NextResponse } from "next/server"
import { ensureConnection } from "@/lib/database"
import { InventoryItem } from "@/models/InventoryItem"

export async function GET() {
  try {
    await ensureConnection()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const alerts = await InventoryItem.aggregate([
      {
        $lookup: {
          from: "inventoryConsumptions",
          let: { itemId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$itemId", "$$itemId"] },
                    { $gte: ["$date", thirtyDaysAgo] }
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
          "consumptionLogs.0": { $exists: true } // Only items with at least one consumption log
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