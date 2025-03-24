import {useCallback, useEffect, useState} from 'react';

interface ApiOptions<T> {
    initialData?: T;
    deps?: any[];
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
}

export function useApi<T>(
    apiFunction: () => Promise<T>,
    options: ApiOptions<T> = {}
) {
    const {initialData, deps = [], onSuccess, onError} = options;
    const [data, setData] = useState<T | undefined>(initialData);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction();
            setData(result);
            if (onSuccess) {
                onSuccess(result);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error(String(err)));
            if (onError) {
                onError(err instanceof Error ? err : new Error(String(err)));
            }
        } finally {
            setLoading(false);
        }
    }, [apiFunction, onSuccess, onError]);

    useEffect(() => {
        fetchData();
    }, [...deps, fetchData]);

    return {data, loading, error, refetch: fetchData};
}

export function useMutation<T, D = any>(
    mutationFunction: (data: D) => Promise<T>,
    options: Omit<ApiOptions<T>, 'initialData' | 'deps'> = {}
) {
    const {onSuccess, onError} = options;
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(
        async (mutationData: D) => {
            try {
                setLoading(true);
                setError(null);
                const result = await mutationFunction(mutationData);
                setData(result);
                if (onSuccess) {
                    onSuccess(result);
                }
                return result;
            } catch (err) {
                const errorObj = err instanceof Error ? err : new Error(String(err));
                setError(errorObj);
                if (onError) {
                    onError(errorObj);
                }
                throw errorObj;
            } finally {
                setLoading(false);
            }
        },
        [mutationFunction, onSuccess, onError]
    );

    return {mutate, data, loading, error, reset: () => setError(null)};
}

export default {useApi, useMutation};
