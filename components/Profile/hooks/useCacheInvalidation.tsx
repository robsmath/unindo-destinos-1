import { createContext, useContext, useRef } from 'react';

interface CacheInvalidationContextType {
  invalidateCache: (keys: string[]) => void;
  registerInvalidationCallback: (key: string, callback: () => void) => void;
  unregisterInvalidationCallback: (key: string) => void;
}

const CacheInvalidationContext = createContext<CacheInvalidationContextType | null>(null);

export const CacheInvalidationProvider = ({ children }: { children: React.ReactNode }) => {
  const callbacks = useRef<Map<string, () => void>>(new Map());

  const invalidateCache = (keys: string[]) => {
    keys.forEach(key => {
      const callback = callbacks.current.get(key);
      if (callback) {
        callback();
      }
    });
  };

  const registerInvalidationCallback = (key: string, callback: () => void) => {
    callbacks.current.set(key, callback);
  };

  const unregisterInvalidationCallback = (key: string) => {
    callbacks.current.delete(key);
  };

  return (
    <CacheInvalidationContext.Provider
      value={{
        invalidateCache,
        registerInvalidationCallback,
        unregisterInvalidationCallback,
      }}
    >
      {children}
    </CacheInvalidationContext.Provider>
  );
};

export const useCacheInvalidation = () => {
  const context = useContext(CacheInvalidationContext);
  if (!context) {
    throw new Error('useCacheInvalidation deve ser usado dentro de CacheInvalidationProvider');
  }
  return context;
};
