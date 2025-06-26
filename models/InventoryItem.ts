import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    currentQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    reorderThreshold: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  },
)

export const InventoryItem = mongoose.models.InventoryItem || mongoose.model("InventoryItem", ItemSchema, 'inventoryItems')
