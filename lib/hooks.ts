"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken'
import { tokenStorage } from "./tokenStorage";
import { useAuth } from "./AuthContext";

function ErrorFunction(error: unknown, onError: (error?: unknown) => void) {
    const { logout } = useAuth()
    if (onError) {
        if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
            if (error.response.status === 401) {
                logout()
            }
            onError(error.response.data.message || 'Something went wrong');

        }
    }

}

function isTokenExpired(token: string) {
    if (!token) {
        return
    }
    const accessTokenDecoded = jwt.decode(token) as { exp: number }
    const expirationTime = accessTokenDecoded?.exp
    const currentTime = Math.floor(Date.now() / 1000)
    if (expirationTime && currentTime >= expirationTime) {
        return
    }
    return token
}
export function GetData<D>(url: string, { onSuccess, onError }: { onSuccess?: (result: D) => void; onError?: (error: unknown) => void } = {}, disbled = false) {
    const [data, setData] = useState<D>();
    const [loading, setLoading] = useState(false);
    const headers: Record<string, string> = {}
    const validToken = isTokenExpired(tokenStorage.getToken() as string)
    if (validToken) {
        headers.Authorization = `${validToken}`
    }
    const fetch = async () => {
        setLoading(true);
        try {
            const result = await axios.get(url, { headers });
            setData(result.data || []);
            if (onSuccess)
                onSuccess(result.data)
            setLoading(false);
        } catch (error: unknown) {
            ErrorFunction(error, () => onError)
            setLoading(false);
        }
    };

    useEffect(() => {
        if (disbled === false) {
            fetch();
        }
    }, [url, disbled]);

    return { data: data, loading, fetch };
}

export function SubmitData<V, D>(url: string, { onSuccess, onError }: { onSuccess?: (result: D) => void; onError?: (error: string) => void } = {}, method = 'POST') {
    const [loading, setLoading] = useState(false);
    const headers: Record<string, string> = {}
    const validToken = isTokenExpired(tokenStorage.getToken() as string)
    if (validToken) {
        headers.Authorization = `${validToken}`
    }
    const submitForm = async (values: V) => {
        setLoading(true)
        switch (method) {
            case 'POST':
                try {
                    const response = await axios.post(url, values, { headers })
                    if (onSuccess)
                        onSuccess(response.data)
                } catch (error: unknown) {
                    console.error("Error fetching data:", error);
                    ErrorFunction(error, () => onError)
                    setLoading(false)
                }
                break;
            case 'PUT':
                try {
                    const response = await axios.put(url, values)
                    if (onSuccess)
                        onSuccess(response.data)
                } catch (error: unknown) {
                    console.error("Error fetching data:", error);
                    ErrorFunction(error, () => onError)
                    setLoading(false)
                }
                break;

            default:
                break;
        }
    }
    return { submitForm, loading }
}
