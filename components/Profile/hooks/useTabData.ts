import { useState, useRef, useEffect } from 'react';
import { useCacheInvalidation } from './useCacheInvalidation';

export const useTabData = <T>(loadDataFn: () => Promise<T>, cacheKey?: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const loadPromise = useRef<Promise<T> | null>(null);
  const { registerInvalidationCallback, unregisterInvalidationCallback } = useCacheInvalidation();

  useEffect(() => {
    if (cacheKey) {
      const invalidateCallback = () => {
        setLoaded(false);
        setData(null);
      };
      
      registerInvalidationCallback(cacheKey, invalidateCallback);
      
      return () => {
        unregisterInvalidationCallback(cacheKey);
      };
    }
  }, [cacheKey, registerInvalidationCallback, unregisterInvalidationCallback]);

  const loadData = async (force = false) => {
    if (loaded && !force) {
      return data;
    }

    if (loading && loadPromise.current) {
      return loadPromise.current;
    }

    setLoading(true);
    
    loadPromise.current = loadDataFn();
    
    try {
      const result = await loadPromise.current;
      setData(result);
      setLoaded(true);
      return result;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      throw error;
    } finally {
      setLoading(false);
      loadPromise.current = null;
    }
  };

  const refreshData = () => loadData(true);

  return {
    data,
    loading,
    loaded,
    loadData,
    refreshData,
    setData
  };
};
