"use client";

import { useState, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  maxRetries?: number;
  onRetrySuccess?: (newSrc: string) => void;
}

export default function SmartImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/common/beach.jpg",
  maxRetries = 2,
  onRetrySuccess
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (retryCount > 0 && onRetrySuccess) {
      onRetrySuccess(currentSrc);
    }
  }, [currentSrc, retryCount, onRetrySuccess]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    
    if (retryCount < maxRetries && currentSrc !== fallbackSrc) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      
      // Tenta novamente após um delay
      setTimeout(() => {
        if (retryCount === 0 && src !== fallbackSrc) {
          // Primeira tentativa: tenta a imagem original novamente com cache bust
          setCurrentSrc(`${src}?retry=${Date.now()}`);
        } else {
          // Tentativas subsequentes: usa a imagem fallback
          setCurrentSrc(fallbackSrc);
        }
        setIsRetrying(false);
        setIsLoading(true);
      }, 1000 * (retryCount + 1)); // Delay progressivo
    } else {
      setHasError(true);
      if (currentSrc !== fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsLoading(true);
      }
    }
  }, [currentSrc, retryCount, maxRetries, src, fallbackSrc]);

  const handleManualRetry = useCallback(() => {
    if (hasError && retryCount < maxRetries) {
      setHasError(false);
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      
      setTimeout(() => {
        setCurrentSrc(`${src}?retry=${Date.now()}`);
        setIsRetrying(false);
        setIsLoading(true);
      }, 500);
    }
  }, [hasError, retryCount, maxRetries, src]);

  return (
    <div className="relative w-full h-full">
      {/* Loader overlay */}
      {(isLoading || isRetrying) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
        </div>
      )}

      {/* Retry button overlay */}
      {hasError && retryCount < maxRetries && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 z-20">
          <button
            onClick={handleManualRetry}
            className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 hover:text-gray-800"
            disabled={isRetrying}
          >
            <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span className="text-sm">Tentar novamente</span>
          </button>
        </div>
      )}

      {/* Main image */}
      <img
        src={currentSrc}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        style={{ 
          display: (isLoading || isRetrying) ? 'none' : 'block'
        }}
      />
    </div>
  );
}
