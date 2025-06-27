"use client"

import { useState } from "react"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import { LogIn, CheckCircle, AlertCircle, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react"
import FormErrorMessage from "./FormErrorMessage"
import { useRouter } from "next/navigation"
import { GetData, SubmitData } from "@/lib/hooks"
import { tokenStorage } from "@/lib/tokenStorage"
import { useAuth } from "@/lib/AuthContext"

const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
})

interface FormValues {
    email: string
    password: string
}

interface LoginFormFieldsProps {
    loading: boolean
    message: { type: "success" | "error"; text: string } | null
    values: FormValues
}

function LoginFormFields({ loading, message }: LoginFormFieldsProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <Form className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-8 py-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                            <Shield className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                            <p className="text-blue-100 mt-1 text-lg">Sign in to access your account</p>
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
                        <div className="space-y-3">
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Mail className="h-4 w-4 text-blue-600" />
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full px-5 py-4 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                />
                                <FormErrorMessage name="email" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="password" className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                <Lock className="h-4 w-4 text-purple-600" />
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Field
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full px-5 py-4 pr-12 text-black border-2 rounded-2xl text-base font-medium transition-all duration-300 focus:outline-none focus:ring-4 placeholder-gray-400 hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                                <FormErrorMessage name="password" />
                            </div>
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white rounded-2xl text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="h-6 w-6 mr-3" />
                                        Sign In
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

export default function Login() {

    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
    const { token, setToken } = useAuth()

    const router = useRouter()

    GetData(`/api/user`, {}, !!token)


    const { submitForm, loading } = SubmitData<FormValues, { message: string, token: string }>('/api/user', {
        onSuccess(data) {
            setMessage({ type: "success", text: data.message })
            tokenStorage.addToken(data.token)
            setToken(data.token)
            router.push('/dashboard')
        },
        onError(message: string) {
            setMessage({ type: "error", text: message })
        },
    }, 'POST')

    return (
        <div className="bg-white">
            {!token ? (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
                    <Formik
                        initialValues={{
                            email: "admin@gmail.com",
                            password: "123456",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={submitForm}
                    >
                        {({ values }) => <LoginFormFields loading={loading} message={message} values={values} />}
                    </Formik>
                </div>
            ) : <div className="bg-white min-h-screen"></div>}
        </div>
    )
}
