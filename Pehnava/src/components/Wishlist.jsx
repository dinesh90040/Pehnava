import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  ShoppingCart,
  Trash2,
  Share2,
  Eye,
  ArrowRight,
  Filter,
  SortAsc,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { LoadingSpinner } from "./ui/loading";
import ProductCard from "./ProductCard";

const Wishlist = ({
  isOpen,
  onClose,
  wishlistItems = [],
  onRemoveFromWishlist,
  onAddToCart,
  onMoveToCart,
  onClearWishlist,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("date-added"); // 'date-added', 'price-low', 'price-high', 'name'
  const [filterBy, setFilterBy] = useState("all"); // 'all', 'in-stock', 'on-sale'
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Filter and sort items
  const filteredItems = wishlistItems
    .filter((item) => {
      // Search filter
      if (
        searchQuery &&
        !item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Stock filter
      if (filterBy === "in-stock" && !item.inStock) {
        return false;
      }

      // Sale filter
      if (
        filterBy === "on-sale" &&
        (!item.originalPrice || item.originalPrice <= item.price)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "date-added":
        default:
          return new Date(b.addedAt) - new Date(a.addedAt);
      }
    });

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (itemId) => {
    setIsLoading(true);
    try {
      await onRemoveFromWishlist(itemId);
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async (item) => {
    setIsLoading(true);
    try {
      await onAddToCart({
        productId: item.productId,
        quantity: 1,
        size: item.size,
        color: item.color,
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

  // Handle move all to cart
  const handleMoveAllToCart = async () => {
    setIsLoading(true);
    try {
      for (const item of filteredItems) {
        if (item.inStock) {
          await onAddToCart({
            productId: item.productId,
            quantity: 1,
            size: item.size,
            color: item.color,
          });
        }
      }
      toast({
        title: "Items Added to Cart",
        description: "All available items have been added to your cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add some items to cart",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clear wishlist
  const handleClearWishlist = async () => {
    if (window.confirm("Are you sure you want to clear your wishlist?")) {
      setIsLoading(true);
      try {
        await onClearWishlist();
        toast({
          title: "Wishlist Cleared",
          description: "All items have been removed from your wishlist",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to clear wishlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle share wishlist
  const handleShareWishlist = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Wishlist",
          text: `Check out my wishlist with ${wishlistItems.length} items`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Wishlist link has been copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Wishlist link has been copied to clipboard",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Wishlist Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl z-50 ${className}`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h2 className="text-lg font-semibold">My Wishlist</h2>
                  <Badge variant="secondary" className="text-xs">
                    {wishlistItems.length}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShareWishlist}
                    className="h-8 w-8 p-0"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Filters and Search */}
              {wishlistItems.length > 0 && (
                <div className="p-4 border-b border-gray-200 space-y-3">
                  {/* Search */}
                  <div className="relative">
                    <Input
                      placeholder="Search wishlist..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Items</option>
                      <option value="in-stock">In Stock</option>
                      <option value="on-sale">On Sale</option>
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="date-added">Date Added</option>
                      <option value="name">Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMoveAllToCart}
                      disabled={
                        isLoading ||
                        filteredItems.filter((item) => item.inStock).length ===
                          0
                      }
                      className="flex-1"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add All to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearWishlist}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {wishlistItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Heart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Save items you love for later
                    </p>
                    <Button onClick={onClose}>Start Shopping</Button>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Filter className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No items match your filters
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search or filter criteria
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterBy("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="relative"
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                              {/* Product Image */}
                              <div className="relative aspect-square">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />

                                {/* Badges */}
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                  {item.originalPrice &&
                                    item.originalPrice > item.price && (
                                      <Badge
                                        variant="destructive"
                                        className="text-xs"
                                      >
                                        -
                                        {Math.round(
                                          ((item.originalPrice - item.price) /
                                            item.originalPrice) *
                                            100
                                        )}
                                        %
                                      </Badge>
                                    )}
                                  {!item.inStock && (
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-gray-500 text-white"
                                    >
                                      Out of Stock
                                    </Badge>
                                  )}
                                </div>

                                {/* Remove Button */}
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveFromWishlist(item.id)
                                  }
                                  disabled={isLoading}
                                  className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full shadow-md"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Product Details */}
                              <div className="p-3">
                                <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">
                                  {item.brand}
                                </p>

                                {/* Price */}
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="font-semibold text-sm">
                                    ₹{item.price.toLocaleString()}
                                  </span>
                                  {item.originalPrice &&
                                    item.originalPrice > item.price && (
                                      <span className="text-xs text-gray-500 line-through">
                                        ₹{item.originalPrice.toLocaleString()}
                                      </span>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToCart(item)}
                                    disabled={isLoading || !item.inStock}
                                    className="flex-1"
                                  >
                                    <ShoppingCart className="h-3 w-3 mr-1" />
                                    {item.inStock
                                      ? "Add to Cart"
                                      : "Out of Stock"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="px-2"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {wishlistItems.length > 0 && (
                <div className="border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>
                      {filteredItems.length} of {wishlistItems.length} items
                    </span>
                    <span>
                      {filteredItems.filter((item) => item.inStock).length}{" "}
                      available
                    </span>
                  </div>

                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full"
                  >
                    Continue Shopping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Wishlist;
