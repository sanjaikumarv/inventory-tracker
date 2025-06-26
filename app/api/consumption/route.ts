import { type NextRequest, NextResponse } from 'next/server';
import { ensureConnection } from '@/lib/database';
import { InventoryItem } from '@/models/InventoryItem';
import { InventoryConsumption } from '@/models/InventoryConsumption';

export async function GET() {
  try {
    await ensureConnection();
    const consumptionLogs = await InventoryConsumption.find({})
      .populate('itemId')
      .sort({ date: -1 });
    return NextResponse.json(consumptionLogs);
  } catch (error) {
    console.error('Error fetching consumption logs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureConnection();
    const body = await request.json();

    const { itemId, date, quantity } = body;

    // Validation
    if (!itemId || !date || quantity === undefined) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (quantity <= 0) {
      return NextResponse.json(
        { message: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if item exists
    const item = await InventoryItem.findById(itemId);
    if (!item) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 });
    }

    // Check if there's enough stock
    if (quantity > item.currentQuantity) {
      return NextResponse.json(
        {
          message: `Insufficient stock. Available: ${item.currentQuantity} ${item.unit}`,
        },
        { status: 400 }
      );
    }

    // Create consumption log
    const consumptionLog = new InventoryConsumption({
      itemId,
      date: new Date(date),
      quantity,
    });

    await consumptionLog.save();

    // Update item quantity
    item.currentQuantity -= quantity;
    if (item.currentQuantity - quantity <= 0) {
      item.status = "OUT_OF_STOCK"
    }
    if (item.currentQuantity - quantity <= item.reorderThreshold) {
      item.status = "LOW_STOCK"
    }
    await item.save();

    return NextResponse.json(consumptionLog, { status: 201 });
  } catch (error) {
    console.error('Error logging consumption:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

