"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  interactive = false, 
  onRatingChange 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starRating = index + 1;
        const isFilled = starRating <= rating;
        
        return (
          <Star
            key={index}
            className={`${sizeClasses[size]} ${
              isFilled 
                ? "text-yellow-400 fill-yellow-400" 
                : "text-gray-300"
            } ${
              interactive ? "cursor-pointer hover:text-yellow-400 transition-colors" : ""
            }`}
            onClick={() => handleStarClick(starRating)}
          />
        );
      })}
    </div>
  );
} 