import { useState, useEffect, useCallback } from 'react';

export function useApi(fetcher, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const run = useCallback(async () => {
    setLoading(true); setError(null);
    try { setData(await fetcher()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);
  return { data, loading, error, refetch: run, setData };
}

export function useMutation(mutFn) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true); setError(null);
    try { const res = await mutFn(...args); return res; }
    catch (e) { setError(e.message); throw e; }
    finally { setLoading(false); }
  }, [mutFn]);

  return { mutate, loading, error };
}
