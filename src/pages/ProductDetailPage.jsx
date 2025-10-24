import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Share2,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  CheckCircle,
  User,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mock product data - in real app, this would come from API
  const products = {
    women: [
      {
        id: 1,
        name: "Royal Silk Saree",
        price: "₹25,000",
        originalPrice: "₹30,000",
        imageUrl: "/images/Royal Silk Saree.png",
        images: ["/images/Royal Silk Saree.png"],
        occasion: "Wedding",
        description:
          "Exquisite royal silk saree with intricate zari work and traditional motifs. Perfect for special occasions and weddings. Made with premium silk fabric and handcrafted embellishments.",
        features: [
          "Premium Silk Fabric",
          "Handcrafted Zari Work",
          "Traditional Motifs",
          "Comfortable Fit",
          "Easy Maintenance",
        ],
        sizes: ["Free Size"],
        colors: ["Red", "Maroon", "Gold"],
        inStock: true,
        rating: 4.9,
        reviewCount: 127,
        brand: "Pehenava Royal",
        material: "Pure Silk",
        care: "Dry Clean Only",
      },
      {
        id: 2,
        name: "Bridal Lehenga Set",
        price: "₹85,000",
        originalPrice: "₹95,000",
        imageUrl: "/images/Bridal Lehenga Set.png",
        images: ["/images/Bridal Lehenga Set.png"],
        occasion: "Wedding",
        description:
          "Stunning bridal lehenga set with heavy embroidery and sequin work. Designed for the most special day of your life with attention to every detail.",
        features: [
          "Heavy Embroidery",
          "Sequin Work",
          "Premium Fabric",
          "Perfect Fit",
          "Bridal Collection",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Red", "Pink", "Maroon"],
        inStock: true,
        rating: 4.8,
        reviewCount: 89,
        brand: "Pehenava Bridal",
        material: "Silk & Net",
        care: "Dry Clean Only",
      },
      {
        id: 3,
        name: "Festive Anarkali Suit",
        price: "₹15,000",
        originalPrice: "₹18,000",
        imageUrl: "/images/Festive Anarkali Suit.png",
        images: ["/images/Festive Anarkali Suit.png"],
        occasion: "Festive",
        description:
          "Elegant festive Anarkali suit with beautiful prints and comfortable fit. Perfect for festivals and special celebrations.",
        features: [
          "Festive Prints",
          "Comfortable Fit",
          "Premium Cotton",
          "Easy Care",
          "Versatile Style",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Green", "Purple"],
        inStock: true,
        rating: 4.7,
        reviewCount: 156,
        brand: "Pehenava Festive",
        material: "Cotton Blend",
        care: "Machine Wash",
      },
    ],
    men: [
      {
        id: 6,
        name: "Embroidered Sherwani",
        price: "₹30,000",
        originalPrice: "₹35,000",
        imageUrl: "/images/Embroidered Sherwani.png",
        images: ["/images/Embroidered Sherwani.png"],
        occasion: "Wedding",
        description:
          "Regal embroidered sherwani with intricate thread work and premium fabric. Perfect for weddings and formal occasions.",
        features: [
          "Intricate Embroidery",
          "Premium Fabric",
          "Perfect Fit",
          "Formal Occasion",
          "Royal Look",
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Cream", "White", "Gold"],
        inStock: true,
        rating: 4.9,
        reviewCount: 98,
        brand: "Pehenava Royal",
        material: "Silk & Brocade",
        care: "Dry Clean Only",
      },
      {
        id: 7,
        name: "Silk Kurta Set",
        price: "₹8,000",
        originalPrice: "₹10,000",
        imageUrl: "/images/Silk Kurta Set.png",
        images: ["/images/Silk Kurta Set.png"],
        occasion: "Festive",
        description:
          "Elegant silk kurta set with traditional patterns and comfortable fit. Perfect for festivals and special occasions.",
        features: [
          "Pure Silk",
          "Traditional Patterns",
          "Comfortable Fit",
          "Festive Collection",
          "Premium Quality",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Cream", "Beige"],
        inStock: true,
        rating: 4.6,
        reviewCount: 134,
        brand: "Pehenava Classic",
        material: "Pure Silk",
        care: "Dry Clean Only",
      },
      {
        id: 8,
        name: "Indo-Western Suit",
        price: "₹18,000",
        originalPrice: "₹22,000",
        imageUrl: "/images/Indo Western Suit.png",
        images: ["/images/Indo Western Suit.png"],
        occasion: "Ceremony",
        description:
          "Stylish Indo-Western suit combining traditional elegance with modern design. Perfect for ceremonies and formal events.",
        features: [
          "Indo-Western Design",
          "Modern Cut",
          "Premium Fabric",
          "Versatile Style",
          "Contemporary Look",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Navy", "Black", "Charcoal"],
        inStock: true,
        rating: 4.8,
        reviewCount: 76,
        brand: "Pehenava Modern",
        material: "Wool Blend",
        care: "Dry Clean Only",
      },
      {
        id: 9,
        name: "Linen Kurta",
        price: "₹4,000",
        originalPrice: "₹5,000",
        imageUrl: "/images/Linen Kurta.png",
        images: ["/images/Linen Kurta.png"],
        occasion: "Casual",
        description:
          "Comfortable linen kurta perfect for casual wear and everyday occasions. Breathable fabric with modern styling.",
        features: [
          "Breathable Linen",
          "Casual Style",
          "Comfortable Fit",
          "Easy Care",
          "Everyday Wear",
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Beige", "Light Blue"],
        inStock: true,
        rating: 4.5,
        reviewCount: 203,
        brand: "Pehenava Casual",
        material: "Pure Linen",
        care: "Machine Wash",
      },
    ],
    kids: [
      {
        id: 10,
        name: "Boys Sherwani Set",
        price: "₹5,000",
        originalPrice: "₹6,000",
        imageUrl: "/images/Boys Sherwani Set.png",
        images: ["/images/Boys Sherwani Set.png"],
        occasion: "Wedding",
        description:
          "Adorable boys sherwani set with traditional design and comfortable fit. Perfect for weddings and special occasions.",
        features: [
          "Traditional Design",
          "Comfortable Fit",
          "Premium Fabric",
          "Kids Collection",
          "Special Occasion",
        ],
        sizes: ["2-3 Years", "4-5 Years", "6-7 Years", "8-9 Years"],
        colors: ["Cream", "White", "Gold"],
        inStock: true,
        rating: 4.7,
        reviewCount: 45,
        brand: "Pehenava Kids",
        material: "Cotton Blend",
        care: "Machine Wash",
      },
      {
        id: 11,
        name: "Girls Lehenga Choli",
        price: "₹6,500",
        originalPrice: "₹7,500",
        imageUrl: "/images/Girls Lehenga Choli.png",
        images: ["/images/Girls Lehenga Choli.png"],
        occasion: "Festive",
        description:
          "Beautiful girls lehenga choli with vibrant colors and traditional patterns. Perfect for festivals and celebrations.",
        features: [
          "Vibrant Colors",
          "Traditional Patterns",
          "Comfortable Fit",
          "Kids Collection",
          "Festive Style",
        ],
        sizes: ["2-3 Years", "4-5 Years", "6-7 Years", "8-9 Years"],
        colors: ["Pink", "Red", "Purple"],
        inStock: true,
        rating: 4.8,
        reviewCount: 67,
        brand: "Pehenava Kids",
        material: "Cotton & Net",
        care: "Hand Wash",
      },
      {
        id: 12,
        name: "Birthday Princess Gown",
        price: "₹4,500",
        originalPrice: "₹5,500",
        imageUrl: "/images/Birthday Princess Gown.png",
        images: ["/images/Birthday Princess Gown.png"],
        occasion: "Birthday",
        description:
          "Magical birthday princess gown with sparkles and beautiful design. Make your little princess feel special on her big day.",
        features: [
          "Sparkly Design",
          "Princess Style",
          "Comfortable Fit",
          "Birthday Collection",
          "Magical Look",
        ],
        sizes: ["2-3 Years", "4-5 Years", "6-7 Years", "8-9 Years"],
        colors: ["Pink", "Purple", "Blue"],
        inStock: true,
        rating: 4.9,
        reviewCount: 89,
        brand: "Pehenava Kids",
        material: "Tulle & Satin",
        care: "Hand Wash",
      },
      {
        id: 13,
        name: "Casual Kurta Pajama",
        price: "₹2,000",
        originalPrice: "₹2,500",
        imageUrl: "/images/Casual Kurta Pajama.png",
        images: ["/images/Casual Kurta Pajama.png"],
        occasion: "Casual",
        description:
          "Comfortable casual kurta pajama set for kids. Perfect for everyday wear and casual occasions.",
        features: [
          "Comfortable Fit",
          "Casual Style",
          "Easy Care",
          "Kids Collection",
          "Everyday Wear",
        ],
        sizes: ["2-3 Years", "4-5 Years", "6-7 Years", "8-9 Years"],
        colors: ["White", "Blue", "Green"],
        inStock: true,
        rating: 4.4,
        reviewCount: 123,
        brand: "Pehenava Kids",
        material: "Cotton",
        care: "Machine Wash",
      },
    ],
  };

  // Find the product
  const product = Object.values(products)
    .flat()
    .find((p) => p.id === parseInt(productId));

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: "Priya Sharma",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Absolutely stunning! The quality is exceptional and the fit is perfect. Highly recommended!",
      verified: true,
    },
    {
      id: 2,
      user: "Rajesh Kumar",
      rating: 4,
      date: "2024-01-10",
      comment:
        "Great product, fast delivery. The material is of good quality and the design is beautiful.",
      verified: true,
    },
    {
      id: 3,
      user: "Anita Singh",
      rating: 5,
      date: "2024-01-08",
      comment:
        "Love it! Perfect for the occasion. The craftsmanship is amazing and the price is reasonable.",
      verified: false,
    },
  ];

  useEffect(() => {
    if (!product) {
      navigate("/marketplace");
    }
  }, [product, navigate]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        description: "Choose your size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Added to Cart! 🛒",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist! ❤️",
      description: isWishlisted
        ? `${product.name} has been removed from your wishlist.`
        : `${product.name} has been added to your wishlist.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this beautiful ${product.name} from Pehenava!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Product link has been copied to clipboard.",
      });
    }
  };

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <Button onClick={() => navigate("/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{product.name} | Pehenava</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="pt-24 min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => navigate("/marketplace")}
                className="hover:text-amber-600 transition-colors"
              >
                Marketplace
              </button>
              <span>/</span>
              <span className="text-gray-800">{product.name}</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        activeImageIndex === index
                          ? "border-amber-600"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{product.brand}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleShare}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleAddToWishlist}
                      className={`p-2 rounded-full transition-colors ${
                        isWishlisted
                          ? "bg-red-100 text-red-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.occasion}
                  </span>
                </div>

                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-amber-600">
                    {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {product.originalPrice}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                      {Math.round(
                        ((parseInt(product.originalPrice.replace(/[₹,]/g, "")) -
                          parseInt(product.price.replace(/[₹,]/g, ""))) /
                          parseInt(
                            product.originalPrice.replace(/[₹,]/g, "")
                          )) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Key Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedSize === size
                            ? "border-amber-600 bg-amber-50 text-amber-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          selectedColor === color
                            ? "border-amber-600 bg-amber-50 text-amber-700"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Quantity
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white py-3 text-lg"
                  disabled={!product.inStock}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </Button>

                <Button
                  onClick={handleAddToWishlist}
                  variant="outline"
                  className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 py-3"
                >
                  <Heart
                    className={`h-5 w-5 mr-2 ${
                      isWishlisted ? "fill-current" : ""
                    }`}
                  />
                  {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>

              {/* Product Info */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Free shipping on orders above ₹2,000</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2" />
                  <span>1 year warranty on manufacturing defects</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  <span>7 days return policy</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Material:</span>{" "}
                  {product.material}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Care Instructions:</span>{" "}
                  {product.care}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-playfair font-bold text-gray-800 mb-8">
              Customer Reviews
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Review Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-800 mb-2">
                      {product.rating}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.reviewCount} reviews
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <span className="text-sm text-gray-600 w-8">
                          {rating}
                        </span>
                        <Star className="h-4 w-4 text-amber-400 fill-current mr-2" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                          <div
                            className="bg-amber-400 h-2 rounded-full"
                            style={{ width: `${Math.random() * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {Math.floor(Math.random() * 50)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="lg:col-span-2 space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-2xl p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800">
                              {review.user}
                            </span>
                            {review.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <div className="flex items-center mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "text-amber-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
