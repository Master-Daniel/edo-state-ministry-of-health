import { useState, useEffect } from "react";
import { getCookie } from "../utils/custom-functions";

interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetch<T>(url: string | null, options?: RequestInit) {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    useEffect(() => {
        if (!url) return; // Prevent fetching if URL is empty

        let isMounted = true;
        setState((prev) => ({ ...prev, loading: true }));

        const fetchData = async () => {
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

                if (!response.ok) throw new Error(`Error: ${response.statusText}`);

                const data: T = await response.json();
                if (isMounted) setState({ data, loading: false, error: null });
            } catch (error) {
                if (isMounted)
                    setState({
                        data: null,
                        loading: false,
                        error: (error as Error).message,
                    });
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [url, options]);

    return state;
}
