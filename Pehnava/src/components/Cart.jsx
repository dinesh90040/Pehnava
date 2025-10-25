import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Trash2,
  Heart,
  ArrowRight,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useToast } from "./ui/use-toast";
import { LoadingSpinner } from "./ui/loading";

const Cart = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onClearCart,
  onCheckout,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const { toast } = useToast();

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const shipping = subtotal > 1000 ? 0 : 100;
  const discount = appliedCoupon ? Math.min(appliedCoupon.value, subtotal) : 0;
  const total = subtotal + tax + shipping - discount;

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle quantity update
  const handleQuantityUpdate = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsLoading(true);
    try {
      await onUpdateQuantity(itemId, newQuantity);
      toast({
        title: "Cart Updated",
        description: "Item quantity has been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    setIsLoading(true);
    try {
      await onRemoveItem(itemId);
      toast({
        title: "Item Removed",
        description: "Item has been removed from cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle move to wishlist
  const handleMoveToWishlist = async (item) => {
    setIsLoading(true);
    try {
      await onMoveToWishlist(item);
      await onRemoveItem(item.id);
      toast({
        title: "Moved to Wishlist",
        description: `${item.name} has been moved to your wishlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to move item to wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsLoading(true);
    setCouponError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock coupon validation
      const mockCoupons = {
        WELCOME10: { value: 100, type: "fixed" },
        SAVE20: { value: 20, type: "percentage" },
        FIRST50: { value: 50, type: "fixed" },
      };

      if (mockCoupons[couponCode.toUpperCase()]) {
        setAppliedCoupon(mockCoupons[couponCode.toUpperCase()]);
        toast({
          title: "Coupon Applied",
          description: "Your discount has been applied",
        });
      } else {
        setCouponError("Invalid coupon code");
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is not valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      setCouponError("Failed to apply coupon");
      toast({
        title: "Error",
        description: "Failed to apply coupon code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    onCheckout();
    onClose();
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

          {/* Cart Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 ${className}`}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Shopping Cart</h2>
                  <Badge variant="secondary" className="text-xs">
                    {cartItems.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Add some items to get started
                    </p>
                    <Button onClick={onClose}>Continue Shopping</Button>
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Cart Items */}
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-3 p-3 border border-gray-200 rounded-lg"
                      >
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">
                            {item.brand}
                          </p>
                          {item.size && (
                            <p className="text-xs text-gray-500 mb-1">
                              Size: {item.size}
                            </p>
                          )}
                          {item.color && (
                            <p className="text-xs text-gray-500 mb-2">
                              Color: {item.color}
                            </p>
                          )}

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
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

                            {/* Quantity Controls */}
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={isLoading || item.quantity <= 1}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleQuantityUpdate(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={isLoading}
                                className="h-6 w-6 p-0"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveToWishlist(item)}
                              disabled={isLoading}
                              className="text-xs text-gray-600 hover:text-red-600"
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.id)}
                              disabled={isLoading}
                              className="text-xs text-gray-600 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Coupon Code */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={isLoading || !couponCode.trim()}
                          variant="outline"
                        >
                          {isLoading ? <LoadingSpinner size="sm" /> : "Apply"}
                        </Button>
                      </div>
                      {couponError && (
                        <p className="text-xs text-red-600 mt-1">
                          {couponError}
                        </p>
                      )}
                      {appliedCoupon && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                          <Shield className="h-4 w-4" />
                          <span>
                            Coupon applied: {formatPrice(appliedCoupon.value)}{" "}
                            off
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 p-4 space-y-4">
                  {/* Order Summary */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (GST)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-base border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      <span>Free delivery</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <RotateCcw className="h-3 w-3" />
                      <span>Easy returns</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckout}
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          Proceed to Checkout
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                      >
                        Continue Shopping
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onClearCart}
                        className="flex-1"
                      >
                        Clear Cart
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Cart;
