"use client"

import type React from "react"
import { useState } from "react"
import {
    Plus,
    Package,
    Calendar,
    AlertTriangle,
    CheckCircle,
    Search,
    Filter,
    TrendingDown,
} from "lucide-react"
import { GetData } from "@/lib/hooks"
import { AddItemForm } from "./AddTtemForm"
import { CardOption, InventoryItem } from "./Types"
import PopupModel from "./PopupModel"
import { AddItemQuantity } from "./AddItemQuantity"
import Card from "./Card"
import LoadingData from "./LoadingData"

export default function InventoryItems() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [item, setItem] = useState<{
        item: {
            reorderThreshold: number,
            _id: string
        },
        popup: boolean
    }>({
        popup: false,
        item: {
            reorderThreshold: 0,
            _id: ''
        }
    })

    const { data: inventoryItems = [], loading, fetch } = GetData<InventoryItem[]>(`api/items`)

    const getStockStatus = (status: string) => {
        switch (status) {
            case "OUT_OF_STOCK":
                return {
                    status: "Out of Stock",
                    color: "text-red-700 bg-red-100 border-red-200",
                    icon: AlertTriangle,
                    priority: 3,
                }

            case "LOW_STOCK":
                return {
                    status: "Low Stock",
                    color: "text-amber-700 bg-amber-100 border-amber-200",
                    icon: TrendingDown,
                    priority: 2,
                }

            default:
                return {
                    status: "In Stock",
                    color: "text-green-700 bg-green-100 border-green-200",
                    icon: CheckCircle,
                    priority: 1,
                };
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const filteredItems = inventoryItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
        if (filterStatus === "all") return matchesSearch

        const status = getStockStatus(item.status)
        return matchesSearch && status.status.toLowerCase().replace(" ", "") === filterStatus
    })

    const stats = {
        total: inventoryItems.length,
        inStock: inventoryItems.filter((item) => item.currentQuantity > item.reorderThreshold).length,
        lowStock: inventoryItems.filter((item) => item.currentQuantity <= item.reorderThreshold && item.currentQuantity > 0)
            .length,
        outOfStock: inventoryItems.filter((item) => item.currentQuantity === 0).length,
    }

    const cardData: CardOption[] = [
        {
            heading: "Total Items",
            count: stats.total,
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
            count: stats.lowStock,
            des: "Items need attention",
            status: "LOW_STOCK"
        },
        {
            heading: "Out of Stock",
            count: stats.outOfStock,
            des: "Urgent reorder",
            status: "OUT_OF_STOCK"
        },

    ]
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Enhanced Header */}
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                                Inventory Items
                            </h1>
                            <p className="text-gray-600 text-xl font-medium">
                                Manage your restaurant inventory with precision
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105 hover:shadow-2xl"
                    >
                        <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                        Add New Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 px-8">
                {cardData.map((cd, idx) => <Card data={cd} key={idx} />)}
            </div>
            <div className="px-8 py-8">
                {/* Enhanced Search and Filter */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search inventory items..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 text-black pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-14 pr-8 py-4 border text-black border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white text-lg min-w-[200px]"
                            >
                                <option value="all">All Status</option>
                                <option value="instock">In Stock</option>
                                <option value="lowstock">Low Stock</option>
                                <option value="outofstock">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Enhanced Table */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
                    {loading ? (
                        <LoadingData />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Item Details
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Unit
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Current Stock
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Reorder Level
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Last Updated
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredItems.map((item, index) => {
                                        const stockStatus = getStockStatus(item.status)
                                        const StatusIcon = stockStatus.icon

                                        return (
                                            <tr
                                                key={item._id}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">

                                                        <div>
                                                            <div className="text-lg font-bold text-gray-900 mb-1">{item.name}</div>
                                                            <div className="text-sm text-gray-500">ID: {item._id.slice(-8)}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                                                        {item.unit}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-xl font-bold text-gray-900">{item.currentQuantity}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="text-lg text-gray-600 font-medium">{item.reorderThreshold}</div>
                                                </td>
                                                <td className="py-6 flex items-center">
                                                    <span
                                                        className={`inline-flex items-center gap-2 px-2 py-2 rounded-full text-sm font-bold border ${stockStatus.color}`}
                                                    >
                                                        <StatusIcon className="h-4 w-4" />
                                                        {stockStatus.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(item.updatedAt)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-6">
                                                    <button
                                                        onClick={() => {
                                                            setItem({
                                                                item: item,
                                                                popup: true
                                                            })
                                                        }}
                                                        className="group inline-flex items-center px-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl text-md font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105 hover:shadow-2xl"
                                                    >

                                                        Re-stock
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && filteredItems.length === 0 && (
                        <div className="text-center py-10">
                            <div className="flex flex-col items-center gap-8">
                                <div className="p-8 bg-gray-100 rounded-full">
                                    <Package className="h-10 w-10 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                        {searchTerm || filterStatus !== "all" ? "No matching items found" : "No inventory items found"}
                                    </h3>
                                    <p className="text-gray-600 mb-8 max-w-md text-lg">
                                        {searchTerm || filterStatus !== "all"
                                            ? "Try adjusting your search or filter criteria to find what you're looking for."
                                            : "Get started by adding your first inventory item to begin tracking your restaurant supplies."}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-xl"
                                >
                                    <Plus className="h-6 w-6 mr-3" />
                                    {searchTerm || filterStatus !== "all" ? "Add New Item" : "Add First Item"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <PopupModel open={isModalOpen} setClose={() => setIsModalOpen(false)}>
                <AddItemForm fetch={fetch} onClose={() => setIsModalOpen(false)} />
            </PopupModel>
            <PopupModel open={item.popup} setClose={() => setItem({
                item: {
                    reorderThreshold: 0,
                    _id: ''
                }, popup: false
            })}>
                <AddItemQuantity
                    fetch={fetch}
                    onClose={() => setItem({
                        item: {
                            reorderThreshold: 0,
                            _id: ''
                        }, popup: false
                    })}
                    item={item.item}
                />
            </PopupModel>

        </div>
    )
}
