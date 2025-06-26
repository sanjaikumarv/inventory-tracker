"use client"

import { useState } from "react"
import { BarChart3, Plus, ClipboardList, Menu, X, Package } from "lucide-react"
import Link from "next/link"

export function Sidebar() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const tabs = [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "inventory-items", label: "Inventory Item", icon: Plus },
        { id: "inventory-consumptions", label: "Inventory Consumption", icon: ClipboardList },
    ]

    const handleTabClick = (tabId: string) => {
        setActiveTab(tabId)
        setIsMobileOpen(false) // Close mobile menu when tab is selected
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-gray-200"
            >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 h-full bg-white z-40 transition-all duration-300 ${"w-72"
                    } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                {/* Header */}
                <div className="relative">
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Package className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Inventory</h1>
                                <p className="text-blue-100 text-sm">Management System</p>
                            </div>
                        </div>
                    </div>

                    {/* Collapse Button - Desktop Only */}
                    {/* <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden lg:flex absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </button> */}
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <Link
                                key={tab.id}
                                href={`/${tab.id}`}
                                onClick={() => handleTabClick(tab.id)}
                                aria-current={isActive ? "page" : undefined}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${isActive
                                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                <div
                                    className={`p-2 rounded-lg transition-all duration-200 ${isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-600 group-hover:text-gray-900"}`} />
                                </div>
                                <div className="flex-1">
                                    <span className="font-medium">{tab.label}</span>
                                    {tab.id === "alerts" && (
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs opacity-75">2 active alerts</span>
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                                        </div>
                                    )}
                                </div>
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                    {tab.label}
                                </div>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                        <div>
                            <h3 className="font-semibold text-gray-900 text-sm">Need Help?</h3>
                            <p className="text-gray-600 text-xs mt-1">Contact support for assistance</p>
                            <button className="mt-2 text-blue-600 text-xs font-medium hover:text-blue-700">Get Support</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
