import { NextResponse } from 'next/server';
import { ensureConnection } from '@/lib/database';
import { InventoryConsumption } from '@/models/InventoryConsumption';

export async function GET() {
    try {
        await ensureConnection();
        const consumptionLogs = await InventoryConsumption.aggregate(
            [
                {
                    $group: {
                        _id: "$itemId",
                        totalConsumption: { $sum: "$quantity" }
                    }
                },
                {
                    $lookup: {
                        from: "inventoryItems", // Replace with your actual items collection name
                        localField: "_id",
                        foreignField: "_id", // Adjust based on your items collection structure
                        as: "itemDetails"
                    }
                },
                {
                    $unwind: {
                        path: "$itemDetails",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 0,
                        itemId: "$_id",
                        itemName: "$itemDetails.name", // Adjust field name based on your items schema
                        currentQuantity: "$itemDetails.currentQuantity", // Get actual current quantity from inventory
                        totalConsumption: 1
                    }
                },
            ]
        )
        return NextResponse.json(consumptionLogs);
    } catch (error) {
        console.error('Error fetching consumption logs:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}