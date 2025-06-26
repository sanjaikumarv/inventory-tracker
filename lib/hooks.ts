"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export function GetData<D>(url: string, { onSuccess, onError }: { onSuccess?: (result: D) => void; onError?: (error: unknown) => void } = {}, disbled = false) {
    const [data, setData] = useState<D>();
    const [loading, setLoading] = useState(false);
    const fetch = async () => {
        setLoading(true);
        try {
            const result = await axios.get(url);
            setData(result.data || []);
            if (onSuccess)
                onSuccess(result.data)
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            if (onError)
                onError(error)
            setLoading(false);
        }
    };


    useEffect(() => {
        if (!disbled) {
            fetch();
        }
    }, [url, disbled]);

    return { data: data, loading, fetch };
}

export function SubmitData<V, D>(url: string, { onSuccess, onError }: { onSuccess?: (result: D) => void; onError?: (error: string) => void } = {}, method = 'POST') {
    const [loading, setLoading] = useState(false);
    const submitForm = async (values: V) => {
        setLoading(true)
        switch (method) {
            case 'POST':
                try {
                    const response = await axios.post(url, values)
                    if (onSuccess)
                        onSuccess(response.data)
                } catch (error: unknown) {
                    if (onError) {
                        if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
                            onError(error.response.data.message || 'Something went wrong');
                        }
                    }
                    setLoading(false)
                }
                break;
            case 'PUT':
                try {
                    const response = await axios.put(url, values)
                    if (onSuccess)
                        onSuccess(response.data)
                } catch (error: unknown) {
                    if (onError) {
                        if (axios.isAxiosError(error) && error.response && error.response.data && error.response.data.message) {
                            onError(error.response.data.message || 'Something went wrong');
                        }
                    }
                    setLoading(false)
                }
                break;

            default:
                break;
        }
    }
    return { submitForm, loading }
}