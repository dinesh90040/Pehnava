import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Rating } from "./ui/rating";
import { useToast } from "./ui/use-toast";

const ProductCard = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onAddToCompare,
  onRemoveFromCompare,
  isInWishlist = false,
  isInCompare = false,
  showQuickView = true,
  showCompare = true,
  showWishlist = true,
  showCart = true,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickViewModal, setShowQuickViewModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { toast } = useToast();

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddToCart({
        productId: product.productId,
        quantity,
        size: selectedSize,
        color: selectedColor,
      });
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
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

  const handleWishlistToggle = async () => {
    setIsLoading(true);
    try {
      if (isInWishlist) {
        await onRemoveFromWishlist(product.productId);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        await onAddToWishlist(product.productId);
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareToggle = async () => {
    setIsLoading(true);
    try {
      if (isInCompare) {
        await onRemoveFromCompare(product.productId);
        toast({
          title: "Removed from Compare",
          description: `${product.name} has been removed from comparison`,
        });
      } else {
        await onAddToCompare(product.productId);
        toast({
          title: "Added to Compare",
          description: `${product.name} has been added to comparison`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update comparison",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.origin + `/product/${product.productId}`,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(
          window.location.origin + `/product/${product.productId}`
        );
        toast({
          title: "Link Copied",
          description: "Product link has been copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/product/${product.productId}`
      );
      toast({
        title: "Link Copied",
        description: "Product link has been copied to clipboard",
      });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <>
      <motion.div
        className={`relative group ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <Link to={`/product/${product.productId || product.slug}` }>
              <motion.img
                src={product.images?.[selectedImage] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                whileHover={{ scale: 1.05 }}
              />
            </Link>

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discount > 0 && (
                <Badge variant="destructive" className="text-xs font-semibold">
                  -{discount}%
                </Badge>
              )}
              {product.isNew && (
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold bg-green-500 text-white"
                >
                  NEW
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold bg-orange-500 text-white"
                >
                  BESTSELLER
                </Badge>
              )}
              {product.isFeatured && (
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold bg-purple-500 text-white"
                >
                  FEATURED
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {showWishlist && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full shadow-md"
                  onClick={handleWishlistToggle}
                  disabled={isLoading}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isInWishlist
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </Button>
              )}

              {showCompare && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 rounded-full shadow-md"
                  onClick={handleCompareToggle}
                  disabled={isLoading}
                >
                  <RotateCcw
                    className={`h-4 w-4 ${
                      isInCompare ? "text-blue-500" : "text-gray-600"
                    }`}
                  />
                </Button>
              )}

              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 rounded-full shadow-md"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 text-gray-600" />
              </Button>
            </div>

            {/* Quick View Button */}
            {showQuickView && (
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <Button
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => setShowQuickViewModal(true)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Quick View
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-4">
            {/* Brand */}
            {product.brand && (
              <p className="text-xs text-gray-500 mb-1 font-medium">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <Link to={`/product/${product.productId || product.slug}` }>
              <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <Rating value={product.rating || 0} readOnly size="sm" />
              <span className="text-xs text-gray-500">
                ({product.reviewCount || 0})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
            </div>

            {/* Features */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>Warranty</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            {showCart && (
              <Button
                className="w-full"
                onClick={handleAddToCart}
                disabled={isLoading || !product.inStock}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick View Modal */}
      {showQuickViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex">
              {/* Image Section */}
              <div className="w-1/2 p-6">
                <div className="aspect-square mb-4">
                  <img
                    src={product.images?.[selectedImage] || product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                {/* Image Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                          selectedImage === index
                            ? "border-blue-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="w-1/2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowQuickViewModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Rating value={product.rating || 0} readOnly />
                  <span className="text-sm text-gray-500">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice &&
                    product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-sm">
                      -{discount}% OFF
                    </Badge>
                  )}
                </div>

                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Size</h4>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={
                            selectedSize === size ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Color</h4>
                    <div className="flex gap-2">
                      {product.colors.map((color) => (
                        <Button
                          key={color}
                          variant={
                            selectedColor === color ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedColor(color)}
                        >
                          {color}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Quantity</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isLoading || !product.inStock}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    disabled={isLoading}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        isInWishlist ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
