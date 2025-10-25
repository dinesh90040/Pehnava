import React from "react";
import { cn } from "@/lib/utils";

const LoadingSpinner = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-gray-300 border-t-pink-500",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

const LoadingDots = ({ className }) => {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div
        className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <div
        className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
};

const LoadingSkeleton = ({ className, lines = 3 }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {[...Array(lines)].map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 rounded mb-2"
          style={{ width: `${100 - index * 10}%` }}
        />
      ))}
    </div>
  );
};

const LoadingCard = ({ className }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md p-6 animate-pulse",
        className
      )}
    >
      <div className="h-48 bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded mb-2" />
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  );
};

export { LoadingSpinner, LoadingDots, LoadingSkeleton, LoadingCard };
