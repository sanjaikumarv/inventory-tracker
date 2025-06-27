"use client"

import { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { Plus, CheckCircle, AlertCircle, Package, Hash, Scale, Target } from "lucide-react"
import FormErrorMessage from "./FormErrorMessage"
import { SubmitData } from "@/lib/hooks"

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Item name is required"),
  unit: Yup.string().required("Unit of measure is required"),
  currentQuantity: Yup.number()
    .min(0, "Quantity cannot be negative")
    .required("Current quantity is required")
    .typeError("Please enter a valid number"),
  reorderThreshold: Yup.number()
    .min(0, "Threshold cannot be negative")
    .required("Reorder threshold is required")
    .typeError("Please enter a valid number")
    .test("threshold-validation", "Reorder threshold should be less than current quantity", function (value) {
      const { currentQuantity } = this.parent
      if (currentQuantity && value) {
        return value < currentQuantity
      }
      return true
    }),
})

interface FormValues {
  name: string
  unit: string
  currentQuantity: string
  reorderThreshold: string
}

interface ItemFormFieldsProps {
  loading: boolean
  message: { type: "success" | "error"; text: string } | null
  values: FormValues
}

function ItemFormFields({ loading, message }: ItemFormFieldsProps) {
  const units = [
    { label: "Kilograms (kg)", value: "KG", icon: "⚖️" },
    { label: "Liters (L)", value: "LITER", icon: "🥤" },
  ]


  return (
    <Form className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Add New Inventory Item</h2>
              <p className="text-blue-100 mt-1 text-lg">Expand your restaurant inventory with detailed tracking</p>
            </div>
          </div>
        </div>

        <div className="p-8">
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

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Package className="h-4 w-4 text-blue-600" />
                  Item Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    placeholder="e.g., Fresh Tomatoes, Chicken Breast"
                    className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  />
                  <FormErrorMessage name="name" />
                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="unit" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Scale className="h-4 w-4 text-purple-600" />
                  Unit of Measure <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="unit"
                    name="unit"
                    className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  >
                    <option className="text-black" value="" disabled>
                      Choose unit of measurement
                    </option>
                    {units.map((unit, idx) => (
                      <option className="text-black" key={idx} value={unit.value}>
                        {unit.icon} {unit.label}
                      </option>
                    ))}
                  </Field>

                  <FormErrorMessage name="unit" />

                </div>
              </div>

              <div className="space-y-3">
                <label htmlFor="currentQuantity" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                  <Hash className="h-4 w-4 text-green-600" />
                  Current Quantity <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    id="currentQuantity"
                    name="currentQuantity"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="e.g., 50.5"
                    className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  />
                  <FormErrorMessage name="currentQuantity" />
                </div>
              </div>

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
  )
}

export function AddItemForm({ fetch, onClose }: { fetch: () => void; onClose: () => void }) {
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
  }, 'POST')

  return (
    <Formik
      initialValues={{
        name: "",
        unit: "",
        currentQuantity: "",
        reorderThreshold: "",
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={(values: FormValues, { setSubmitting }) => {
        submitForm(values)
        setSubmitting(false)
      }}
    >
      {({ values }) => <ItemFormFields loading={loading} message={message} values={values} />}
    </Formik>
  )
}
