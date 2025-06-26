"use client"

import { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { TrendingDown, CheckCircle, AlertCircle, Calendar, Hash, Package } from "lucide-react"
import { GetData, SubmitData } from "@/lib/hooks"
import FormErrorMessage from "./FormErrorMessage"
import { InventoryItem } from "./Types"


const validationSchema = Yup.object({
  itemId: Yup.string().required("Please select an inventory item"),
  date: Yup.date().max(new Date(), "Date cannot be in the future").required("Date is required"),
  quantity: Yup.number()
    .min(0.01, "Quantity must be greater than 0")
    .required("Quantity is required")
    .typeError("Please enter a valid number")
    .test("stock-validation", "Cannot consume more than available stock", function (value) {
      const { itemId } = this.parent
      const { items } = this.options.context || {}
      if (items && itemId && value) {
        const selectedItem = items.find((item: InventoryItem) => item._id === itemId)
        return selectedItem ? value <= selectedItem.currentQuantity : true
      }
      return true
    }),
})

interface FormValues {
  itemId: string
  date: string
  quantity: string
}

interface ConsumptionFormFieldsProps {
  loading: boolean
  message: { type: "success" | "error"; text: string } | null
  items: InventoryItem[]
  values: FormValues
}

function ConsumptionFormFields({ loading, message, items, values }: ConsumptionFormFieldsProps) {
  const selectedItem = items.find((item) => item._id === values?.itemId)

  return (
    <Form className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <TrendingDown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Log Inventory Consumption</h2>
              <p className="text-green-100 mt-1 text-lg">Track daily usage of your restaurant inventory items</p>
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
              {/* Select Item */}
              <div className="space-y-3 lg:col-span-2">
                <label htmlFor="itemId" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Package className="h-4 w-4 text-green-600" />
                  Select Inventory Item <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="itemId"
                    name="itemId"
                    className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 hover:border-gray-300 border-gray-200 focus:border-green-500 focus:ring-green-100"
                  >
                    <option className="text-black" value="">
                      Choose an inventory item...
                    </option>
                    {items.map((item) => (
                      <option className="text-black" key={item._id} value={item._id}>
                        {item.name} ({item.currentQuantity} {item.unit} available)
                      </option>
                    ))}
                  </Field>
                  <FormErrorMessage name="itemId" />
                </div>
              </div>

              {/* Date */}
              <div className="space-y-3">
                <label htmlFor="date" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Consumption Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    id="date"
                    name="date"
                    type="date"
                    className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  />
                  <FormErrorMessage name="date" />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-3">
                <label htmlFor="quantity" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Hash className="h-4 w-4 text-purple-600" />
                  Quantity Consumed <span className="text-red-500">*</span>
                  {selectedItem && <span className="text-gray-500">({selectedItem.unit})</span>}
                </label>
                <div className="relative">
                  <Field
                    id="quantity"
                    name="quantity"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedItem?.currentQuantity || undefined}
                    placeholder="e.g., 5.5"
                    className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-purple-500 focus:ring-purple-100"

                  />
                  <FormErrorMessage name="quantity" />
                </div>
                {selectedItem && (
                  <p className="text-sm text-gray-500 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                    <AlertCircle className="h-4 w-4" />
                    Maximum available: {selectedItem.currentQuantity} {selectedItem.unit}
                  </p>
                )}
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
                    Logging Consumption...
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-6 w-6 mr-3" />
                    Log Consumption
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Form>
  )
}

export default function InventoryConsumptionForm({ onClose, fetch }: { onClose: () => void, fetch: () => void }) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const { data: items = [] } = GetData<InventoryItem[]>("api/items")

  const { submitForm, loading } = SubmitData<FormValues, { message: string }>('api/consumption', {
    onSuccess(data) {
      setMessage({ type: "success", text: data.message })
      fetch()
      onClose()
    },
    onError(message: string) {
      setMessage({ type: "error", text: message })
    },
  }, 'POST')
  return (
    <Formik
      initialValues={{
        itemId: "",
        date: new Date().toISOString().split("T")[0],
        quantity: "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values: FormValues, { setSubmitting }) => {
        submitForm(values)
        setSubmitting(false)
      }}
    >
      {({ values }) => <ConsumptionFormFields values={values} loading={loading} message={message} items={items} />}
    </Formik>
  )
}
