"use client"

import { GetData } from "@/lib/hooks"
import { AlertTriangle, Calendar, TrendingUp, Package, CheckCircle } from "lucide-react"
import type { RestockAlert } from "./Types"
import LoadingData from "./LoadingData"

export default function RestockAlerts() {
  const { data: alerts = [], loading } = GetData<RestockAlert[]>(`api/restock-alerts`)

  return (
    <main className="container mx-auto rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
      {loading ? <LoadingData /> : <Data alerts={alerts} />}
    </main>
  )
}

function Data({ alerts }: { alerts: RestockAlert[] }) {
  const getPriorityBadge = (days: number) => {
    switch (true) {
      case days <= 1:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            Critical
          </span>
        )
      case days <= 3:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            High
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            Medium
          </span>
        )
    }
  }

  const getPriorityColor = (days: number) => {
    switch (true) {
      case days <= 1:
        return "border-red-300 bg-gradient-to-br from-red-50 to-red-100 shadow-red-100"
      case days <= 3:
        return "border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100 shadow-orange-100"
      default:
        return "border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-yellow-100"
    }
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Restock Alerts</h2>
          </div>
        </div>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Package className="h-10 w-10 text-green-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-green-700">All Systems Green!</h3>
            <p className="text-gray-600 text-lg">
              No restock alerts at this time. Your inventory levels are healthy and well-maintained.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Restock Alerts</h2>
            </div>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white border border-white/30">
              {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-orange-100 rounded-full">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h4 className="font-semibold text-orange-800 mb-1">Inventory Alert</h4>
                <p className="text-orange-700 text-sm">
                  The following items are predicted to run out of stock within 3 days based on current consumption
                  patterns.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div
                key={alert.item._id}
                className={`${getPriorityColor(alert.daysUntilEmpty)} border-2 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-xl text-gray-800 mb-2">{alert.item.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Current stock:</span>
                        <span className="font-semibold text-gray-800">
                          {alert.item.currentQuantity} {alert.item.unit}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 text-black">{getPriorityBadge(alert.daysUntilEmpty)}</div>
                    <div className="ml-4 text-black"> {alert.daysUntilEmpty}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div className="bg-white/70 rounded-lg p-4 border border-white/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <span className="font-medium text-gray-700">Days Until Empty</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {alert.daysUntilEmpty === 0
                          ? "Today"
                          : `${alert.daysUntilEmpty} day${alert.daysUntilEmpty !== 1 ? "s" : ""}`}
                      </p>
                    </div>

                    <div className="bg-white/70 rounded-lg p-4 border border-white/50">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-700">Daily Usage</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {alert.averageDailyConsumption.toFixed(2)} {alert.item.unit}/day
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/80 rounded-lg p-4 border border-white/60">
                    <div className="flex items-start gap-2">
                      <div className="p-1 bg-blue-100 rounded-full mt-0.5">
                        <TrendingUp className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-700">
                        <span className="font-semibold">Prediction:</span> Based on recent consumption patterns, this
                        item will reach zero stock in approximately {alert.daysUntilEmpty} day
                        {alert.daysUntilEmpty !== 1 ? "s" : ""}. The recommended reorder quantity accounts for a 7-day
                        supply plus safety stock to prevent stockouts.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
