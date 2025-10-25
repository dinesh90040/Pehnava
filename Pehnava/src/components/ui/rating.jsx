import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const Rating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = "md", 
  interactive = false, 
  onRatingChange,
  className,
  showValue = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5",
    xl: "h-6 w-6"
  };

  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const value = index + 1;
          const isFilled = value <= (hoverRating || rating);
          
          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                isFilled ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
                interactive && "cursor-pointer hover:scale-110 transition-transform"
              )}
              onClick={() => handleClick(value)}
              onMouseEnter={() => handleMouseEnter(value)}
              onMouseLeave={handleMouseLeave}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          ({rating.toFixed(1)})
        </span>
      )}
    </div>
  );
};

export { Rating };
