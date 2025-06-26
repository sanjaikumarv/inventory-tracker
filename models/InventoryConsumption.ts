import mongoose from "mongoose"

const ConsumptionLogSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0.01,
    },
  },
  {
    timestamps: true,
  },
)

export const InventoryConsumption = mongoose.models.InventoryConsumption || mongoose.model("InventoryConsumption", ConsumptionLogSchema,'inventoryConsumptions')
