import { NextRequest, NextResponse } from 'next/server';
import { ensureConnection } from '@/lib/database';
import { InventoryConsumption } from '@/models/InventoryConsumption';
import { middleware } from '@/lib/middleware';

export async function GET(request: NextRequest) {
    try {
        await ensureConnection();
        await middleware(request)
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
                        from: "inventoryItems",
                        localField: "_id",
                        foreignField: "_id",
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
                        itemName: "$itemDetails.name",
                        currentQuantity: "$itemDetails.currentQuantity",
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