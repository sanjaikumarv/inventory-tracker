import { type NextRequest, NextResponse } from "next/server"
import { ensureConnection } from "@/lib/database"
import { InventoryItem } from "@/models/InventoryItem"
import { middleware } from "@/lib/middleware"

export async function GET(request: NextRequest) {
  try {
    await ensureConnection()

    // Check middleware response
    const middlewareResponse = await middleware(request)
    if (middlewareResponse) {
      return middlewareResponse
    }

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
    await middleware(request)

    const body = await request.json()
    const { name, unit, currentQuantity, reorderThreshold } = body

    if (!name || !unit || currentQuantity === undefined || reorderThreshold === undefined) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    if (currentQuantity < 0 || reorderThreshold < 0) {
      return NextResponse.json({ message: "Quantities cannot be negative" }, { status: 400 })
    }

    const existingItem = await InventoryItem.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } })
    if (existingItem) {
      return NextResponse.json({ message: "Item with this name already exists" }, { status: 400 })
    }

    const item = new InventoryItem({
      name,
      unit,
      currentQuantity,
      reorderThreshold,
      status: "IN_STOCK",
    })

    await item.save()
    return NextResponse.json({ message: "Item added successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureConnection()

    // Check middleware response
    const middlewareResponse = await middleware(request)
    if (middlewareResponse) {
      return middlewareResponse // Return the error response
    }

    const body = await request.json()
    const { itemId, quantity } = body

    if (!itemId || quantity === undefined) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 })
    }

    const existingItem = await InventoryItem.findById(itemId)
    if (!existingItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 })
    }

    if (quantity <= 0) {
      return NextResponse.json({ message: "Quantity must be greater than 0" }, { status: 400 })
    }

    const newQuantity = existingItem.currentQuantity + quantity
    const newStatus = newQuantity > existingItem.reorderThreshold ? "IN_STOCK" : "LOW_STOCK"

    await InventoryItem.findByIdAndUpdate(itemId, {
      currentQuantity: newQuantity,
      updatedAt: new Date(),
      status: newStatus,
    })

    return NextResponse.json({ message: "Item quantity updated" }, { status: 200 })
  } catch (error) {
    console.error("Error updating item:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
