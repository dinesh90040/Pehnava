import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Heart,
  Share2,
  RotateCcw,
  Star,
  Truck,
  Shield,
  Plus,
  Minus,
  Eye,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Gift,
  Zap,
  Award,
  Users,
  MessageCircle,
  Camera,
  Download,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  Filter,
  SortAsc,
  Grid,
  List,
  Search,
  Bell,
  User,
  ShoppingBag,
  CreditCard,
  Package,
  RefreshCw,
  AlertCircle,
  Info,
  HelpCircle,
  Check,
  Trash2,
  Edit,
  Save,
  Upload,
  Send,
  Reply,
  Forward,
  Bookmark,
  BookmarkCheck,
  Calendar,
  Tag,
  Percent,
  DollarSign,
  IndianRupee,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
  Headphones,
  Speaker,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  Paperclip,
  Image,
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Archive,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Rating } from "../components/ui/rating";
import { LoadingSpinner } from "../components/ui/loading";
import { useToast } from "../components/ui/use-toast";
import ProductCard from "../components/ProductCard";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [showImageModal, setShowImageModal] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCompare, setIsInCompare] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: "",
    comment: "",
    images: [],
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadProduct();
    loadRelatedProducts();
    loadReviews();
    checkWishlistStatus();
    checkCompareStatus();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProduct(data);

      // Set default selections
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0]);
      }
    } catch (error) {
      console.error("Error loading product:", error);
      // Set fallback product
      setProduct({
        productId: productId,
        name: "Royal Silk Saree",
        price: 15000,
        originalPrice: 18000,
        category: "Sarees",
        subcategory: "Silk Sarees",
        brand: "Fabindia",
        description:
          "Elegant royal silk saree with intricate zari work and traditional motifs. Perfect for weddings and special occasions. This exquisite piece features handwoven silk with gold zari embroidery, creating a luxurious and timeless appeal.",
        shortDescription: "Royal silk saree with zari work",
        images: [
          "/images/Royal Silk Saree.png",
          "/images/sarees/silk-1.jpg",
          "/images/sarees/silk-2.jpg",
        ],
        thumbnail: "/images/Royal Silk Saree.png",
        colors: ["Red", "Maroon", "Gold", "Green"],
        sizes: ["Free Size"],
        materials: ["Pure Silk", "Zari Work"],
        careInstructions: "Dry clean only",
        inStock: true,
        stockQuantity: 25,
        weight: 800,
        dimensions: { length: 550, width: 110, height: 2 },
        tags: ["silk", "zari", "royal", "wedding", "traditional"],
        rating: 4.8,
        reviewCount: 156,
        viewCount: 1250,
        isFeatured: true,
        isNew: false,
        isBestSeller: true,
        isOnSale: true,
        shopId: "1",
        marketId: "1",
        sellerId: "seller-001",
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async () => {
    try {
      const response = await fetch(
        `/api/products?category=${encodeURIComponent(product?.category || "")}&limit=4`
      );
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.filter((p) => p.productId !== productId));
      }
    } catch (error) {
      console.error("Error loading related products:", error);
    }
  };

  const loadReviews = async () => {
    try {
      const response = await fetch(
        `/api/reviews/product/${productId}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
    }
  };

  const checkWishlistStatus = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlistItems") || "[]");
    setIsInWishlist(wishlist.some((item) => item.productId === productId));
  };

  const checkCompareStatus = () => {
    const compare = JSON.parse(localStorage.getItem("compareItems") || "[]");
    setIsInCompare(compare.some((item) => item.productId === productId));
  };

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      const cartItem = {
        id: `${productId}-${selectedSize || "default"}-${
          selectedColor || "default"
        }`,
        productId: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || product.thumbnail,
        brand: product.brand,
        quantity: quantity,
        size: selectedSize,
        color: selectedColor,
        inStock: product.inStock,
      };

      const existingCart = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
      const existingItem = existingCart.find(
        (item) =>
          item.productId === productId &&
          item.size === selectedSize &&
          item.color === selectedColor
      );

      if (existingItem) {
        const updatedCart = existingCart.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      } else {
        const updatedCart = [...existingCart, cartItem];
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }

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
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const wishlistItem = {
        id: productId,
        productId: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images?.[0] || product.thumbnail,
        brand: product.brand,
        inStock: product.inStock,
        addedAt: new Date().toISOString(),
      };

      const existingWishlist = JSON.parse(
        localStorage.getItem("wishlistItems") || "[]"
      );
      const updatedWishlist = [...existingWishlist, wishlistItem];
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      setIsInWishlist(true);

      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to wishlist",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromWishlist = async () => {
    try {
      const existingWishlist = JSON.parse(
        localStorage.getItem("wishlistItems") || "[]"
      );
      const updatedWishlist = existingWishlist.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      setIsInWishlist(false);

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
    }
  };

  const handleAddToCompare = async () => {
    try {
      const compareItems = JSON.parse(
        localStorage.getItem("compareItems") || "[]"
      );

      if (compareItems.length >= 4) {
        toast({
          title: "Compare Limit Reached",
          description: "You can compare up to 4 products at a time",
          variant: "destructive",
        });
        return;
      }

      const compareItem = {
        productId: productId,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images,
        thumbnail: product.thumbnail,
        brand: product.brand,
        category: product.category,
        subcategory: product.subcategory,
        rating: product.rating,
        reviewCount: product.reviewCount,
        inStock: product.inStock,
        materials: product.materials,
        colors: product.colors,
        sizes: product.sizes,
        weight: product.weight,
        careInstructions: product.careInstructions,
        isNew: product.isNew,
        isBestSeller: product.isBestSeller,
        isFeatured: product.isFeatured,
        isOnSale: product.isOnSale,
      };

      const updatedCompare = [...compareItems, compareItem];
      localStorage.setItem("compareItems", JSON.stringify(updatedCompare));
      setIsInCompare(true);

      toast({
        title: "Added to Compare",
        description: `${product.name} has been added to comparison`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to comparison",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFromCompare = async () => {
    try {
      const existingCompare = JSON.parse(
        localStorage.getItem("compareItems") || "[]"
      );
      const updatedCompare = existingCompare.filter(
        (item) => item.productId !== productId
      );
      localStorage.setItem("compareItems", JSON.stringify(updatedCompare));
      setIsInCompare(false);

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
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Product link has been copied to clipboard",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Product link has been copied to clipboard",
      });
    }
  };

  const handleSubmitReview = async () => {
    try {
      const reviewData = {
        userId: "user-001", // This would come from auth context
        productId: productId,
        orderId: "ORD-123456", // This would come from a completed order
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        images: reviewForm.images,
      };

      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        toast({
          title: "Review Submitted",
          description: "Thank you for your review!",
        });
        setShowReviewForm(false);
        setReviewForm({ rating: 0, title: "", comment: "", images: [] });
        loadReviews();
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
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
    if (product?.originalPrice && product.originalPrice > product.price) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();

  return (
    <>
      <Helmet>
        <title>{product.name} - Pehenava</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={
                    isInWishlist
                      ? handleRemoveFromWishlist
                      : handleAddToWishlist
                  }
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isInWishlist ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={
                    isInCompare ? handleRemoveFromCompare : handleAddToCompare
                  }
                >
                  <RotateCcw
                    className={`h-4 w-4 ${isInCompare ? "text-blue-500" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={product.images?.[selectedImage] || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setShowImageModal(true)}
                />
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded border-2 ${
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

            {/* Product Details */}
            <div className="space-y-6">
              {/* Brand and Title */}
              <div>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <Rating value={product.rating || 0} readOnly />
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        -{discount}% OFF
                      </Badge>
                    </>
                  )}
              </div>

              {/* Features */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  <span>Free Delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-1">
                  <Refresh className="h-4 w-4" />
                  <span>Easy Returns</span>
                </div>
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Size
                  </h3>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-12"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Color
                  </h3>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={
                          selectedColor === color ? "default" : "outline"
                        }
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>
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
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>
                <Button
                  variant="outline"
                  onClick={
                    isInWishlist
                      ? handleRemoveFromWishlist
                      : handleAddToWishlist
                  }
                  size="lg"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Product Tabs */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex border-b border-gray-200">
                  {[
                    { id: "description", label: "Description" },
                    { id: "specifications", label: "Specifications" },
                    {
                      id: "reviews",
                      label: `Reviews (${product.reviewCount || 0})`,
                    },
                    { id: "shipping", label: "Shipping & Returns" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {activeTab === "description" && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  {activeTab === "specifications" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Materials
                        </h4>
                        <p className="text-gray-600">
                          {product.materials?.join(", ")}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Weight</h4>
                        <p className="text-gray-600">{product.weight}g</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Care Instructions
                        </h4>
                        <p className="text-gray-600">
                          {product.careInstructions}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Dimensions
                        </h4>
                        <p className="text-gray-600">
                          {product.dimensions?.length}cm ×{" "}
                          {product.dimensions?.width}cm ×{" "}
                          {product.dimensions?.height}cm
                        </p>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <div className="space-y-6">
                      {/* Review Summary */}
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900">
                            {product.rating || 0}
                          </div>
                          <Rating
                            value={product.rating || 0}
                            readOnly
                            size="lg"
                          />
                          <div className="text-sm text-gray-600">
                            {product.reviewCount || 0} reviews
                          </div>
                        </div>
                        <div className="flex-1">
                          {/* Rating distribution would go here */}
                        </div>
                      </div>

                      {/* Write Review Button */}
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        variant="outline"
                      >
                        Write a Review
                      </Button>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <Card key={review.reviewId}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {review.title}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Rating
                                      value={review.rating}
                                      readOnly
                                      size="sm"
                                    />
                                    <span className="text-sm text-gray-600">
                                      by {review.userName || "Anonymous"}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "shipping" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-green-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Free Delivery
                          </h4>
                          <p className="text-gray-600">On orders over ₹1,000</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Delivery Time
                          </h4>
                          <p className="text-gray-600">3-5 business days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Refresh className="h-5 w-5 text-purple-500" />
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Returns
                          </h4>
                          <p className="text-gray-600">30-day return policy</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.productId}
                    product={relatedProduct}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    onRemoveFromWishlist={handleRemoveFromWishlist}
                    onAddToCompare={handleAddToCompare}
                    onRemoveFromCompare={handleRemoveFromCompare}
                    isInWishlist={false}
                    isInCompare={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
              onClick={() => setShowImageModal(false)}
            >
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={product.images?.[selectedImage] || product.thumbnail}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Review Form Modal */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowReviewForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Write a Review
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <Rating
                      value={reviewForm.rating}
                      onChange={(rating) =>
                        setReviewForm((prev) => ({ ...prev, rating }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <Input
                      value={reviewForm.title}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Review title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                      placeholder="Share your experience"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={reviewForm.rating === 0}
                    className="flex-1"
                  >
                    Submit Review
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ProductDetailPage;
