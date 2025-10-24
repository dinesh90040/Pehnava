import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock wishlist data - in real app, this would come from context/state management
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Royal Silk Saree",
      price: 25000,
      originalPrice: 30000,
      imageUrl: "/images/Royal Silk Saree.png",
      occasion: "Wedding",
      rating: 4.9,
      reviewCount: 127,
      inStock: true,
    },
    {
      id: 2,
      name: "Bridal Lehenga Set",
      price: 85000,
      originalPrice: 95000,
      imageUrl: "/images/Bridal Lehenga Set.png",
      occasion: "Wedding",
      rating: 4.8,
      reviewCount: 89,
      inStock: true,
    },
    {
      id: 3,
      name: "Embroidered Sherwani",
      price: 30000,
      originalPrice: 35000,
      imageUrl: "/images/Embroidered Sherwani.png",
      occasion: "Wedding",
      rating: 4.9,
      reviewCount: 98,
      inStock: false,
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist.",
    });
  };

  const addToCart = (item) => {
    // In real app, this would add to cart context/state
    toast({
      title: "Added to Cart! 🛒",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const viewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (wishlistItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Your Wishlist | Pehenava</title>
          <meta name="description" content="Your wishlist at Pehenava" />
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
                Your Wishlist
              </h1>
            </div>

            {/* Empty Wishlist */}
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Save items you love by clicking the heart icon on any product.
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
        <title>Your Wishlist | Pehenava</title>
        <meta name="description" content="Your wishlist at Pehenava" />
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
                Your Wishlist ({wishlistItems.length} items)
              </h1>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm group"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-amber-100 to-rose-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => viewProduct(item.id)}
                      className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-sm"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-full shadow-sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}

                  {/* Discount Badge */}
                  {item.originalPrice && (
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {Math.round(
                          ((item.originalPrice - item.price) /
                            item.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold font-playfair text-gray-800 mb-2 line-clamp-2">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-3">{item.occasion}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(item.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {item.rating} ({item.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xl font-bold text-amber-600">
                      ₹{item.price.toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() => viewProduct(item.id)}
                      variant="outline"
                      className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    <Button
                      onClick={() => addToCart(item)}
                      className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                      disabled={!item.inStock}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      {item.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Love what you see?
              </h2>
              <p className="text-gray-600 mb-6">
                Add all items to your cart and proceed to checkout for a
                seamless shopping experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/marketplace")}
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={() => navigate("/cart")}
                  className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white px-8"
                >
                  View Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
