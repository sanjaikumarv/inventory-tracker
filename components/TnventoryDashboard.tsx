"use client"

import { Package, AlertTriangle, CheckCircle } from "lucide-react"

interface InventoryItem {
  _id: string
  name: string
  unit: string
  currentQuantity: number
  reorderThreshold: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  createdAt: string
}

interface InventoryDashboardProps {
  items: InventoryItem[]
}

export function InventoryDashboard({ items }: InventoryDashboardProps) {
  const getStatusIcon = (status: InventoryItem["status"]) => {
    const base = "w-4 h-4"
    switch (status) {
      case "In Stock":
        return <CheckCircle className={`${base} text-green-500`} />
      case "Low Stock":
        return <AlertTriangle className={`${base} text-orange-500`} />
      case "Out of Stock":
        return <Package className={`${base} text-red-500`} />
      default:
        return <Package className={`${base} text-gray-500`} />
    }
  }

  const getStatusBadge = (status: InventoryItem["status"]) => {
    const base = "text-xs font-semibold px-2 py-1 rounded"
    switch (status) {
      case "In Stock":
        return <span className={`${base} bg-green-100 text-green-800`}>In Stock</span>
      case "Low Stock":
        return <span className={`${base} bg-orange-100 text-orange-800`}>Low Stock</span>
      case "Out of Stock":
        return <span className={`${base} bg-red-100 text-red-800`}>Out of Stock</span>
      default:
        return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>
    }
  }

  if (items.length === 0) {
    return (
      <div className="border rounded-lg p-6 bg-white">
        <div className="flex items-center gap-2 text-lg font-semibold mb-4">
          <Package className="h-5 w-5" />
          Inventory Dashboard
        </div>
        <div className="text-center py-8">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No inventory items found</h3>
          <p className="text-gray-500">Start by adding your first inventory item.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-6 bg-white overflow-x-auto">
      <div className="flex items-center gap-2 text-lg font-semibold mb-4">
        <Package className="h-5 w-5" />
        Inventory Dashboard
      </div>

      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border-b font-medium">Item Name</th>
            <th className="p-3 border-b font-medium">Quantity</th>
            <th className="p-3 border-b font-medium">Unit</th>
            <th className="p-3 border-b font-medium">Reorder Threshold</th>
            <th className="p-3 border-b font-medium">Status</th>
            <th className="p-3 border-b font-medium">Date Added</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{item.name}</td>
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <span className={item.status === "Out of Stock" ? "text-red-600 font-semibold" : ""}>
                    {item.currentQuantity}
                  </span>
                </div>
              </td>
              <td className="p-3">{item.unit}</td>
              <td className="p-3">{item.reorderThreshold}</td>
              <td className="p-3">{getStatusBadge(item.status)}</td>
              <td className="p-3">{new Date(item.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-sm text-gray-500">
        <strong>Total Items:</strong> {items.length}
      </div>
    </div>
  )
}
