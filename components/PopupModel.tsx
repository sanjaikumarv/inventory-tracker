import { X } from 'lucide-react'
import React from 'react'

export default function PopupModel({ open, setClose, children }: { open: boolean, setClose: () => void, children: React.ReactNode }) {
    return (
        <div>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute top-6 right-6 z-10">
                        <button
                            onClick={setClose}
                            className="p-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                        >
                            <X className="h-7 w-7" />
                        </button>
                    </div>
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                        onClick={setClose}
                    />
                    <div className="relative rounded-3xl  max-w-4xl  w-full  animate-in zoom-in-95 duration-300">

                        <div className="p-10">
                            {children}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
