import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Trash2,
  Star,
  Plus,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Rating } from "../components/ui/rating";
import { useToast } from "../components/ui/use-toast";
import { LoadingSpinner } from "../components/ui/loading";

const ComparePage = ({
  compareItems = [],
  onRemoveFromCompare,
  onAddToCart,
  onAddToWishlist,
  onClearCompare,
  onAddToCompare,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const maxCompareItems = 4;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle add to cart
  const handleAddToCart = async (item) => {
    setIsLoading(true);
    try {
      await onAddToCart({
        productId: item.productId,
        quantity: 1,
        size: item.sizes?.[0] || "",
        color: item.colors?.[0] || "",
      });
      toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = async (item) => {
    setIsLoading(true);
    try {
      await onAddToWishlist(item.productId);
      toast({
        title: "Added to Wishlist",
        description: `${item.name} has been added to your wishlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove from compare
  const handleRemoveFromCompare = async (itemId) => {
    setIsLoading(true);
    try {
      await onRemoveFromCompare(itemId);
      toast({
        title: "Removed from Compare",
        description: "Item has been removed from comparison",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from comparison",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clear all
  const handleClearAll = async () => {
    if (
      window.confirm(
        "Are you sure you want to clear all items from comparison?"
      )
    ) {
      setIsLoading(true);
      try {
        await onClearCompare();
        toast({
          title: "Comparison Cleared",
          description: "All items have been removed from comparison",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to clear comparison",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Get comparison features
  const getComparisonFeatures = () => {
    const features = [
      { key: "price", label: "Price", type: "price" },
      { key: "originalPrice", label: "Original Price", type: "price" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "reviewCount", label: "Reviews", type: "number" },
      { key: "brand", label: "Brand", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "subcategory", label: "Subcategory", type: "text" },
      { key: "inStock", label: "Availability", type: "boolean" },
      { key: "stockQuantity", label: "Stock Quantity", type: "number" },
      { key: "materials", label: "Materials", type: "array" },
      { key: "colors", label: "Colors", type: "array" },
      { key: "sizes", label: "Sizes", type: "array" },
      { key: "weight", label: "Weight (g)", type: "text" },
      { key: "careInstructions", label: "Care Instructions", type: "text" },
      { key: "warranty", label: "Warranty", type: "text" },
      { key: "shipping", label: "Shipping", type: "text" },
      { key: "isNew", label: "New Arrival", type: "boolean" },
      { key: "isBestSeller", label: "Best Seller", type: "boolean" },
      { key: "isFeatured", label: "Featured", type: "boolean" },
      { key: "isOnSale", label: "On Sale", type: "boolean" },
    ];

    return features;
  };

  const features = getComparisonFeatures();

  if (compareItems.length === 0) {
    return (
      <div className={`min-h-screen bg-gray-50 py-8 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Compare Products
              </h1>
              <p className="text-gray-600">
                Compare features and specifications
              </p>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <RotateCcw className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No products to compare
            </h3>
            <p className="text-gray-600 mb-6 text-center max-w-md">
              Add products to compare their features, specifications, and prices
              side by side.
            </p>
            <Link to="/">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Compare Products
              </h1>
              <p className="text-gray-600">
                Comparing {compareItems.length} of {maxCompareItems} products
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {compareItems.map((item, index) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative aspect-square">
                    <img
                      src={item.images?.[0] || item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Remove Button */}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveFromCompare(item.productId)}
                      disabled={isLoading}
                      className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <Badge variant="destructive" className="text-xs">
                            -
                            {Math.round(
                              ((item.originalPrice - item.price) /
                                item.originalPrice) *
                                100
                            )}
                            %
                          </Badge>
                        )}
                      {item.isNew && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-500 text-white"
                        >
                          NEW
                        </Badge>
                      )}
                      {item.isBestSeller && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-orange-500 text-white"
                        >
                          BESTSELLER
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500 mb-2">{item.brand}</p>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-semibold text-sm">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice &&
                        item.originalPrice > item.price && (
                          <span className="text-xs text-gray-500 line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <Rating value={item.rating || 0} readOnly size="sm" />
                      <span className="text-xs text-gray-500">
                        ({item.reviewCount || 0})
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(item)}
                        disabled={isLoading || !item.inStock}
                        className="w-full"
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {item.inStock ? "Add to Cart" : "Out of Stock"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToWishlist(item)}
                        disabled={isLoading}
                        className="w-full"
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        Add to Wishlist
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900 w-64">
                      Features
                    </th>
                    {compareItems.map((item) => (
                      <th
                        key={item.productId}
                        className="text-center p-4 font-semibold text-gray-900 min-w-48"
                      >
                        <div className="flex flex-col items-center">
                          <img
                            src={item.images?.[0] || item.thumbnail}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded mb-2"
                          />
                          <span className="text-sm line-clamp-2">
                            {item.name}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, index) => (
                    <tr
                      key={feature.key}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="p-4 font-medium text-gray-700 border-r border-gray-200">
                        {feature.label}
                      </td>
                      {compareItems.map((item) => (
                        <td
                          key={item.productId}
                          className="p-4 text-center border-r border-gray-200"
                        >
                          {(() => {
                            const value = item[feature.key];

                            switch (feature.type) {
                              case "price":
                                return value ? (
                                  <div className="font-semibold">
                                    {formatPrice(value)}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                );

                              case "rating":
                                return (
                                  <div className="flex items-center justify-center gap-1">
                                    <Rating
                                      value={value || 0}
                                      readOnly
                                      size="sm"
                                    />
                                    <span className="text-xs text-gray-500">
                                      ({item.reviewCount || 0})
                                    </span>
                                  </div>
                                );

                              case "number":
                                return (
                                  <span className="text-sm font-medium">
                                    {value || "-"}
                                  </span>
                                );

                              case "boolean":
                                return (
                                  <Badge
                                    variant={value ? "default" : "secondary"}
                                  >
                                    {value ? "Yes" : "No"}
                                  </Badge>
                                );

                              case "array":
                                return value && value.length > 0 ? (
                                  <div className="text-sm">
                                    {value.slice(0, 3).join(", ")}
                                    {value.length > 3 &&
                                      ` +${value.length - 3} more`}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                );

                              case "text":
                              default:
                                return (
                                  <span className="text-sm">
                                    {value || "-"}
                                  </span>
                                );
                            }
                          })()}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
