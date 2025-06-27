"use client"

import type React from "react"
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { tokenStorage } from "@/lib/tokenStorage"
import { Sidebar } from "@/components/Sidebar"
import { useRouter } from "next/navigation"

interface AuthContextType {
    token: string
    setToken: Dispatch<SetStateAction<string>>
    logout: () => void
}

const AuthContext = createContext<AuthContextType>({
    token: "",
    logout: () => { },
    setToken: function (): void {
        throw new Error("Function not implemented.")
    }
})
export const useAuth = () => useContext(AuthContext) || {}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState("")
    const router = useRouter()

    useEffect(() => {
        const acToken = tokenStorage.getToken() || ""
        setToken(acToken)
        if (acToken) {
            router.push("/dashboard")
        }
    }, [token])

    const logout = () => {
        tokenStorage.clearToken()
        setToken("")
        router.push("/login")
    }

    return (
        <AuthContext.Provider value={{ token, setToken, logout }}>
            <div>
                {token && <Sidebar />}
                <div className={`${token && "ml-72"}`}>{children}</div>
            </div>
        </AuthContext.Provider>
    )
}
