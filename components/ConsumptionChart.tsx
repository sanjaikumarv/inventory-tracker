"use client"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { TrendingUp } from "lucide-react"
import { GetData } from "@/lib/hooks"

interface ConsumptionData {
  date: string
  quantity: number
  itemId: {
    name: string
  }
}


export function ConsumptionChart() {

  const { data: consumptionChartData = [], loading } = GetData<ConsumptionData[]>('/api/consumption/chartsummary')

  if (loading) {
    return (
      <div className="border border-gray-200 overflow-hidden rounded-lg shadow-sm bg-white p-6">
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-800">
          <TrendingUp className="h-5 w-5" />
          Consumption Analytics
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading consumption data...</p>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="border rounded-lg shadow-sm bg-white p-6">
      <div className="w-full bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Inventory Consumption Analysis</h2>
          <p className="text-gray-600 mt-1">Comparison of total consumption vs current quantity for each item</p>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={consumptionChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="itemName" tick={{ fontSize: 12 }} interval={0} angle={-45} textAnchor="end" height={80} />
              <YAxis tick={{ fontSize: 12 }} label={{ value: "Quantity", angle: -90, position: "insideLeft" }} />
              <Tooltip
                formatter={(value, name) => [
                  value,
                  name === "Total Consumption" ? "Total Consumption" : "Current Quantity",
                ]}
                labelFormatter={(label) => `Item: ${label}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Bar dataKey="totalConsumption" fill="#ef4444" name="Total Consumption" radius={[2, 2, 0, 0]} />
              <Bar dataKey="currentQuantity" fill="#22c55e" name="Current Quantity" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
