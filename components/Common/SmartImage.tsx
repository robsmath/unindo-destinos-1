"use client";

import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onRetrySuccess?: (newSrc: string) => void;
}

export default function SmartImage({
  src,
  alt,
  className = "",
  fallbackSrc = "/images/common/beach.jpg",
  onRetrySuccess
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    if (onRetrySuccess && currentSrc !== src) {
      onRetrySuccess(currentSrc);
    }
  }, [currentSrc, src, onRetrySuccess]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
    } else {
      setHasError(true);
    }
  }, [currentSrc, fallbackSrc]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover ${className} ${isLoading ? "invisible" : "visible"}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={"lazy" as const}
      />

      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-500">
            <div className="text-2xl mb-2">📷</div>
            <p className="text-sm">Erro ao carregar imagem</p>
          </div>
        </div>
      )}    </div>
  );
};
