"use client"
import { useState } from "react"
import { Plus, Package, Clock } from "lucide-react"
import { GetData } from "@/lib/hooks"
import InventoryConsumptionForm from "./InventoryConsumptionForm"
import { InventoryConsumption } from "./Types"
import PopupModel from "./PopupModel"
import LoadingData from "./LoadingData"

export default function InventoryConsumptions() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const { data: inventoryConsumptions = [], loading, fetch } = GetData<InventoryConsumption[]>(`api/consumption`)

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                                Inventory Consumption
                            </h1>
                            <p className="text-gray-600 text-xl font-medium">
                                Monitor and track your inventory usage patterns
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white rounded-2xl text-lg font-semibold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:border-white/50 hover:scale-105 hover:shadow-2xl"
                    >
                        <Plus className="h-6 w-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                        Add Consumption
                    </button>
                </div>
            </div>
            <div className="px-8 py-8">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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
                                            Consumption Date
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Quantity Used
                                        </th>
                                        <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Reorder Level
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {inventoryConsumptions.map((item, index) => (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                                        <Package className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-bold text-gray-900">{item.itemId.name}</div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            Unit: {item.itemId.unit} • ID: {item._id.slice(-8)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-gray-400" />
                                                    <div className="text-sm font-semibold text-gray-900">{formatDate(item.date)}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                                                    {item.quantity} {item.itemId.unit}
                                                </div>
                                            </td>

                                            <td className="px-8 py-6">
                                                <div className="text-sm text-gray-600 font-medium">
                                                    {item.itemId.reorderThreshold} {item.itemId.unit}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!loading && inventoryConsumptions.length === 0 && (
                        <div className="text-center py-20">
                            <div className="flex flex-col items-center gap-6">
                                <div className="p-6 bg-gray-100 rounded-full">
                                    <Package className="h-16 w-16 text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                        No consumption records found
                                    </h3>
                                    <p className="text-gray-600 mb-6 max-w-md">
                                        Get started by recording your first inventory consumption.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-base font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg"
                                >
                                    <Plus className="h-5 w-5 mr-3" />
                                    Record First Consumption
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Enhanced Modal */}
            <PopupModel open={isModalOpen} setClose={() => setIsModalOpen(false)}>
                <InventoryConsumptionForm fetch={fetch} onClose={() => setIsModalOpen(false)} />
            </PopupModel>
        </div>
    )
}
