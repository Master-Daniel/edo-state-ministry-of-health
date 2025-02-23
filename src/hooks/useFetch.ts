import { useState, useEffect } from "react";
import { getCookie } from "../utils/custom-functions";

type FetchOptions = RequestInit

export const useFetch = (initialUrl: string | null, initialOptions?: FetchOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch data manually
    const fetchData = async (url: string, options?: FetchOptions) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}${url}`,
                {
                    ...(options || {}),
                    method: options?.method || "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getCookie("edo-state-token") || ""}`,
                    },
                }
            );

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Something went wrong");

            setData(result);
            return { data: result, error: null };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
            return { data: null, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialUrl) fetchData(initialUrl, initialOptions);
    }, [initialOptions, initialUrl]);

    return { data, loading, error, fetchData };
};
