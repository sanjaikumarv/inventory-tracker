
import { AlertTriangle, Bell, Package, TrendingDown } from 'lucide-react'
import React from 'react'
import { StatusType } from './Types'


export default function Card({ data }: { data: { heading: string, count: number, des: string, status: StatusType } }) {

    const colorOp = {
        TOTAL: {
            iconBg: "text-blue-600",
            icon: Package,
            iconGBg: "from-blue-100 to-blue-200"
        },
        LOW_STOCK: {
            iconBg: "text-amber-600",
            icon: TrendingDown,
            iconGBg: "from-amber-100 to-amber-200"
        },
        OUT_OF_STOCK: {
            iconBg: "text-red-600",
            icon: AlertTriangle,
            iconGBg: "from-red-100 to-red-200"
        },
        IN_STOCK: {
            iconBg: "text-purple-600",
            iconGBg: "from-purple-100 to-purple-200",
            icon: Bell
        }

    }
    const Icon = colorOp[data.status]
    return (
        <div>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-gray-600 uppercase tracking-wide">{data.heading}</h3>
                    <div className={`p-4 bg-gradient-to-br ${Icon.iconGBg}  rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon.icon className={`h-8 w-8 ${Icon.iconBg}`} />
                    </div>
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">{data.count}</div>
                <div className="text-sm text-gray-500">{data.des}</div>
            </div>
        </div>
    )
}
