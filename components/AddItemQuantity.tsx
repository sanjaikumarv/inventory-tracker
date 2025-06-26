"use client"

import { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Plus, CheckCircle, AlertCircle, Package, Hash, Target } from "lucide-react"
import FormErrorMessage from "./FormErrorMessage"
import { SubmitData } from "@/lib/hooks"

const validationSchema = Yup.object({

    quantity: Yup.number()
        .min(0, "Quantity cannot be negative")
        .required("Current quantity is required")
        .typeError("Please enter a valid number")
        .test("threshold-validation", "Quantity should be greather then reorder threshold  quantity", function (value) {
            const { reorderThreshold } = this.parent
            if (reorderThreshold && value) {
                return reorderThreshold < value
            }
            return true
        }),
    reorderThreshold: Yup.number()
        .min(0, "Threshold cannot be negative")
        .required("Reorder threshold is required")
        .typeError("Please enter a valid number")

})

interface FormValues {
    quantity: number
    reorderThreshold: number
    itemId: string
}


export function AddItemQuantity({ fetch, onClose, item }: {
    fetch: () => void; onClose: () => void, item: {
        reorderThreshold: number,
        _id: string
    }
}) {
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

    const { submitForm, loading } = SubmitData<FormValues, { message: string }>('/api/items', {
        onSuccess(data) {
            setMessage({ type: "success", text: data.message })
            fetch()
            onClose()
        },
        onError(message: string) {
            setMessage({ type: "error", text: message })
        },
    }, 'PUT')
    return (
        <Formik
            initialValues={{
                quantity: 0,
                reorderThreshold: item.reorderThreshold || 0,
                itemId: item._id || ""
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={(values: FormValues, { setSubmitting }) => {
                values.itemId = item._id
                submitForm(values)
                setSubmitting(false)
            }}
        >
            {() => (
                <Form className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Package className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white">Update Inventory quantity</h2>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Success/Error Message */}
                            {message && (
                                <div
                                    className={`flex items-center gap-4 mb-8 px-6 py-5 rounded-2xl border-2 shadow-lg ${message.type === "success"
                                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800"
                                        : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-800"
                                        }`}
                                >
                                    <div className={`p-2 rounded-xl ${message.type === "success" ? "bg-green-100" : "bg-red-100"}`}>
                                        {message.type === "success" ? <CheckCircle className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{message.type === "success" ? "Success!" : "Error"}</h4>
                                        <p className="font-medium">{message.text}</p>
                                    </div>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Item Name */}


                                    {/* Unit of Measure */}


                                    {/* Current Quantity */}
                                    <div className="space-y-3">
                                        <label htmlFor="currentQuantity" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Hash className="h-4 w-4 text-green-600" />
                                            Quantity <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Field
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                step="0.01"
                                                min={item.reorderThreshold}
                                                placeholder="e.g., 50.5"
                                                className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                            />
                                            <FormErrorMessage name="quantity" />
                                        </div>
                                    </div>

                                    {/* Reorder Threshold */}
                                    <div className="space-y-3">
                                        <label htmlFor="reorderThreshold" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                            <Target className="h-4 w-4 text-orange-600" />
                                            Reorder Threshold <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <Field
                                                id="reorderThreshold"
                                                name="reorderThreshold"
                                                type="number"
                                                disabled={true}
                                                step="0.01"
                                                min="0"
                                                placeholder="e.g., 10.0"
                                                className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                            />
                                            <FormErrorMessage name="reorderThreshold" />

                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            System will alert when quantity falls below this level
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white rounded-2xl text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                                                Adding Item...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-6 w-6 mr-3" />
                                                Add Item to Inventory
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}
