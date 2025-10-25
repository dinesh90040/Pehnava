import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowLeft,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock cart data - in real app, this would come from context/state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Royal Silk Saree",
      price: 25000,
      originalPrice: 30000,
      imageUrl: "/images/Royal Silk Saree.png",
      quantity: 1,
      size: "Free Size",
      color: "Red",
      inStock: true,
    },
    {
      id: 2,
      name: "Embroidered Sherwani",
      price: 30000,
      originalPrice: 35000,
      imageUrl: "/images/Embroidered Sherwani.png",
      quantity: 1,
      size: "L",
      color: "Cream",
      inStock: true,
    },
  ]);

  const [wishlistItems, setWishlistItems] = useState([]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const moveToWishlist = (item) => {
    setWishlistItems((prev) => [...prev, item]);
    setCartItems((items) =>
      items.filter((cartItem) => cartItem.id !== item.id)
    );
    toast({
      title: "Moved to Wishlist ❤️",
      description: `${item.name} has been moved to your wishlist.`,
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateDiscount = () => {
    return cartItems.reduce((total, item) => {
      const itemDiscount = (item.originalPrice - item.price) * item.quantity;
      return total + itemDiscount;
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 2000 ? 0 : 150; // Free shipping above ₹2000
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateShipping();
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Add some items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Cart | Pehenava</title>
          <meta name="description" content="Your shopping cart at Pehenava" />
        </Helmet>

        <div className="pt-24 min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center mb-8">
              <button
                onClick={() => navigate("/marketplace")}
                className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </button>
              <h1 className="text-3xl font-playfair font-bold text-gray-800">
                Your Cart
              </h1>
            </div>

            {/* Empty Cart */}
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Button
                onClick={() => navigate("/marketplace")}
                className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white px-8 py-3"
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Your Cart | Pehenava</title>
        <meta name="description" content="Your shopping cart at Pehenava" />
      </Helmet>

      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/marketplace")}
                className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Continue Shopping
              </button>
              <h1 className="text-3xl font-playfair font-bold text-gray-800">
                Your Cart ({cartItems.length} items)
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                      </div>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-amber-600">
                          ₹{item.price.toLocaleString()}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                        {item.originalPrice && (
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                            {Math.round(
                              ((item.originalPrice - item.price) /
                                item.originalPrice) *
                                100
                            )}
                            % OFF
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 border border-gray-300 rounded min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => moveToWishlist(item)}
                            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            <span className="text-sm">Move to Wishlist</span>
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            <span className="text-sm">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-800">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toLocaleString()}</span>
                  </div>

                  {calculateDiscount() > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{calculateDiscount().toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {calculateShipping() === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${calculateShipping()}`
                      )}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white py-3 text-lg mb-4"
                >
                  Proceed to Checkout
                </Button>

                {/* Trust Badges */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-green-600" />
                    <span>Free shipping on orders above ₹2,000</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-blue-600" />
                    <span>Secure payment with SSL encryption</span>
                  </div>
                  <div className="flex items-center">
                    <RotateCcw className="h-4 w-4 mr-2 text-purple-600" />
                    <span>7 days easy return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;
