import { type NextRequest, NextResponse } from "next/server"
import { ensureConnection } from "@/lib/database"
import { InventoryItem } from "@/models/InventoryItem"

export async function GET() {
  try {
    await ensureConnection()
    const inventoryItems = await InventoryItem.find({}).sort({ createdAt: -1 })

    return NextResponse.json(inventoryItems)
  } catch (error) {
    console.error("Error fetching items:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureConnection()
    const body = await request.json()

    const { name, unit, currentQuantity, reorderThreshold } = body

    // Validation
    if (!name || !unit || currentQuantity === undefined || reorderThreshold === undefined) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (currentQuantity < 0 || reorderThreshold < 0) {
      return NextResponse.json({ message: "Quantities cannot be negative" }, { status: 400 })
    }

    // Check if item already exists
    const existingItem = await InventoryItem.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } })
    if (existingItem) {
      return NextResponse.json({ message: "Item with this name already exists" }, { status: 400 })
    }

    const item = new InventoryItem({
      name,
      unit,
      currentQuantity,
      reorderThreshold,
      status: "IN_STOCK"
    })

    await item.save()

    return NextResponse.json({ message: "Item added successfully", status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureConnection()
    const body = await request.json()

    const { itemId, quantity } = body

    // Validation
    if (!itemId || quantity === undefined) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    // Check if item already exists
    const existingItem = await InventoryItem.findById(itemId)
    if (!existingItem) {
      return NextResponse.json({ message: "Item with not found" }, { status: 400 })
    }

    if (quantity <= existingItem.reorderThreshold) {
      return NextResponse.json({ message: "Quantities greather then reorder threshold" }, { status: 400 })
    }

    await InventoryItem.findByIdAndUpdate(itemId, { currentQuantity: existingItem.currentQuantity + quantity, updatedAt: new Date(), status: "IN_STOCK" })

    return NextResponse.json({ message: "Item quanitity updated", status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
