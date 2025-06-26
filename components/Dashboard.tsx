"use client"

import type React from "react"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { GetData } from "@/lib/hooks"
import RestockAlerts from "./RestockAlerts"
import { ConsumptionChart } from "./ConsumptionChart"
import { CardOption, InventoryItem, RestockAlert } from "./Types"
import Card from "./Card"


// Main Home Component
export default function Dashboard() {
    const [alerts, setAlerts] = useState<RestockAlert[]>([])
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        inStock: 0,
    })
    const { loading } = GetData<InventoryItem[]>(`api/items`, {
        onSuccess(data) {

            const stats = {
                totalItems: data.length,
                inStock: data.filter((item) => item.currentQuantity > item.reorderThreshold).length,
                lowStockItems: data.filter((item) => item.currentQuantity <= item.reorderThreshold && item.currentQuantity > 0)
                    .length,
                outOfStockItems: data.filter((item) => item.currentQuantity === 0).length,
            }
            setStats(stats)
        },
    })

    const { loading: altLoading } = GetData<RestockAlert[]>(`api/restock-alerts`, {
        onSuccess(data) {
            setAlerts(data)
            setStats((prev) => ({ ...prev, alertsCount: data.length }))
        },
    })

    if (altLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="absolute  bottom-2 right-24 rounded-full h-20 w-20 border-4 border-transparent border-r-purple-400 animate-spin opacity-60"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
                    <p className="text-gray-600 font-medium text-lg">Fetching your inventory data...</p>
                </div>
            </div>
        )
    }
    const cardData: CardOption[] = [
        {
            heading: "Total Items",
            count: stats.totalItems,
            des: "Active inventory items",
            status: "TOTAL"
        },
        {
            heading: "In Stock",
            count: stats.inStock,
            des: "Well Stocked",
            status: "IN_STOCK"
        },
        {
            heading: "Low Stock",
            count: stats.lowStockItems,
            des: "Items need attention",
            status: "LOW_STOCK"
        },
        {
            heading: "Out of Stock",
            count: stats.outOfStockItems,
            des: "Urgent reorder",
            status: "OUT_OF_STOCK"
        },

    ]
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto p-8 space-y-10">
                {/* Enhanced Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                            Restaurant Inventory
                        </h1>
                        <p className="text-gray-600 text-xl font-medium">
                            Intelligent inventory management with predictive analytics
                        </p>
                    </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {cardData.map((cd: CardOption, idx: number) => <Card key={idx} data={cd} />)}
                </div>

                {/* Enhanced Alert Banner */}
                {alerts.length > 0 && (
                    <div className="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 border-2 border-red-200 rounded-3xl p-8 shadow-xl animate-pulse">
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-red-100 rounded-2xl">
                                <AlertTriangle className="h-10 w-10 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-800 text-2xl mb-2">🚨 Urgent Inventory Alert</h4>
                                <p className="text-red-700 text-lg">
                                    You have <span className="font-bold">{alerts.length}</span> item(s) that may run out of stock within 3
                                    days. Immediate action required to prevent stockouts.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {alerts.length > 0 && <RestockAlerts />}

                <ConsumptionChart />
            </div>
        </div>
    )
}
