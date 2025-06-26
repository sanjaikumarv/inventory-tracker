import { ErrorMessage } from 'formik'
import { AlertCircle } from 'lucide-react'
import React from 'react'

export default function FormErrorMessage({ name }: { name: string }) {
    return (
        <ErrorMessage name={name}>
            {(msg) => (
                <div className="text-red-600 text-sm font-medium mt-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {msg}
                </div>
            )}
        </ErrorMessage>
    )
}
