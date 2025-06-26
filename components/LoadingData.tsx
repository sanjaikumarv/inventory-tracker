import React from 'react'

export default function LoadingData() {
    return (
        <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <div className="animate-ping absolute top-0 left-0 rounded-full h-16 w-16 border-4 border-blue-300 opacity-20"></div>
                </div>
                <p className="text-gray-600 font-semibold text-lg">Loading data...</p>
            </div>
        </div>
    )
}
