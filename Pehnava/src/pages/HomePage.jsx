import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ArrowRight,
  Sparkles,
  Eye,
  MapPin,
  Camera,
  Star,
  Users,
  Video,
  Store,
  Crown,
  Gem,
  Heart,
  ShoppingCart,
  TrendingUp,
  Award,
  Shield,
  Truck,
  RotateCcw,
  Search,
  Filter,
  Grid,
  List,
  ChevronRight,
  Play,
  Zap,
  Target,
  Globe,
  Smartphone,
  Bell,
  Menu,
  X,
  ChevronDown,
  Clock,
  CheckCircle,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "@/components/ProductCard";
import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import Cart from "@/components/Cart";
import Wishlist from "@/components/Wishlist";
import CompareModal from "@/components/CompareModal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading";

const HomePage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingSearches] = useState([
    "Sarees",
    "Lehengas",
    "Sherwanis",
    "Kurtas",
    "Anarkali Suits",
  ]);
  const [recentSearches] = useState([
    "Bridal Collection",
    "Festive Wear",
    "Men's Ethnic",
  ]);

  useEffect(() => {
    loadProducts();
    loadCartItems();
    loadWishlistItems();
    loadCompareItems();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/products");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      // Set some fallback products if API fails
      setProducts([
        {
          productId: "saree-001",
          name: "Royal Silk Saree",
          price: 15000,
          originalPrice: 18000,
          category: "Sarees",
          subcategory: "Silk Sarees",
          brand: "Fabindia",
          description:
            "Elegant royal silk saree with intricate zari work and traditional motifs. Perfect for weddings and special occasions.",
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
        },
        {
          productId: "lehenga-001",
          name: "Bridal Lehenga Set",
          price: 25000,
          originalPrice: 30000,
          category: "Lehengas",
          subcategory: "Bridal Lehengas",
          brand: "Sabyasachi",
          description:
            "Stunning bridal lehenga with matching dupatta and blouse. Intricate embroidery and premium fabric.",
          shortDescription: "Bridal lehenga with embroidery",
          images: [
            "/images/Bridal Lehenga Set.png",
            "/images/lehengas/bridal-1.jpg",
            "/images/lehengas/bridal-2.jpg",
          ],
          thumbnail: "/images/Bridal Lehenga Set.png",
          colors: ["Red", "Pink", "Gold", "Maroon"],
          sizes: ["S", "M", "L", "XL"],
          materials: ["Silk", "Zari", "Sequins"],
          careInstructions: "Dry clean only",
          inStock: true,
          stockQuantity: 15,
          weight: 1200,
          dimensions: { length: 100, width: 50, height: 3 },
          tags: ["bridal", "lehenga", "wedding", "embroidery", "premium"],
          rating: 4.9,
          reviewCount: 89,
          viewCount: 2100,
          isFeatured: true,
          isNew: false,
          isBestSeller: true,
          isOnSale: true,
          shopId: "2",
          marketId: "1",
          sellerId: "seller-002",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date(),
        },
        {
          productId: "sherwani-001",
          name: "Embroidered Sherwani",
          price: 12000,
          originalPrice: 15000,
          category: "Men's Wear",
          subcategory: "Sherwanis",
          brand: "Manyavar",
          description:
            "Traditional embroidered sherwani for special occasions. Premium fabric with intricate work.",
          shortDescription: "Embroidered sherwani for men",
          images: [
            "/images/Embroidered Sherwani.png",
            "/images/sherwanis/men-1.jpg",
            "/images/sherwanis/men-2.jpg",
          ],
          thumbnail: "/images/Embroidered Sherwani.png",
          colors: ["Cream", "White", "Gold", "Maroon"],
          sizes: ["S", "M", "L", "XL", "XXL"],
          materials: ["Silk", "Cotton", "Zari Work"],
          careInstructions: "Dry clean only",
          inStock: true,
          stockQuantity: 30,
          weight: 600,
          dimensions: { length: 120, width: 40, height: 2 },
          tags: ["sherwani", "men", "wedding", "formal", "traditional"],
          rating: 4.7,
          reviewCount: 67,
          viewCount: 890,
          isFeatured: false,
          isNew: true,
          isBestSeller: false,
          isOnSale: true,
          shopId: "3",
          marketId: "1",
          sellerId: "seller-003",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date(),
        },
        {
          productId: "kurta-001",
          name: "Casual Kurta Pajama",
          price: 2500,
          originalPrice: 3000,
          category: "Men's Wear",
          subcategory: "Kurtas",
          brand: "Fabindia",
          description:
            "Comfortable casual kurta pajama for daily wear. Made from premium cotton fabric.",
          shortDescription: "Casual kurta pajama set",
          images: [
            "/images/Casual Kurta Pajama.png",
            "/images/kurtas/casual-1.jpg",
            "/images/kurtas/casual-2.jpg",
          ],
          thumbnail: "/images/Casual Kurta Pajama.png",
          colors: ["White", "Blue", "Beige", "Grey"],
          sizes: ["S", "M", "L", "XL"],
          materials: ["Cotton", "Linen"],
          careInstructions: "Machine wash",
          inStock: true,
          stockQuantity: 50,
          weight: 400,
          dimensions: { length: 100, width: 35, height: 1 },
          tags: ["kurta", "casual", "cotton", "daily wear", "comfortable"],
          rating: 4.5,
          reviewCount: 123,
          viewCount: 650,
          isFeatured: false,
          isNew: false,
          isBestSeller: false,
          isOnSale: true,
          shopId: "1",
          marketId: "1",
          sellerId: "seller-001",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
          publishedAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCartItems = () => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const loadWishlistItems = () => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  };

  const loadCompareItems = () => {
    const savedCompare = localStorage.getItem("compareItems");
    if (savedCompare) {
      setCompareItems(JSON.parse(savedCompare));
    }
  };

  // Handler functions
  const handleAddToCart = async (item) => {
    try {
      const existingItem = cartItems.find(
        (cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItem) {
        const updatedCart = cartItems.map((cartItem) =>
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
            ? {
                ...cartItem,
                quantity: cartItem.quantity + (item.quantity || 1),
              }
            : cartItem
        );
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      } else {
        const newItem = {
          id: `${item.productId}-${item.size || "default"}-${
            item.color || "default"
          }`,
          productId: item.productId,
          name: item.name,
          price: item.price,
          originalPrice: item.originalPrice,
          image: item.images?.[0] || item.thumbnail,
          brand: item.brand,
          quantity: item.quantity || 1,
          size: item.size || "",
          color: item.color || "",
          inStock: item.inStock,
        };
        const updatedCart = [...cartItems, newItem];
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      }

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
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const product = products.find((p) => p.productId === productId);
      if (!product) return;

      const existingItem = wishlistItems.find(
        (item) => item.productId === productId
      );
      if (existingItem) return;

      const newItem = {
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

      const updatedWishlist = [...wishlistItems, newItem];
      setWishlistItems(updatedWishlist);
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

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

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const updatedWishlist = wishlistItems.filter(
        (item) => item.productId !== productId
      );
      setWishlistItems(updatedWishlist);
      localStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));

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

  const handleAddToCompare = async (productId) => {
    try {
      if (compareItems.length >= 4) {
        toast({
          title: "Compare Limit Reached",
          description: "You can compare up to 4 products at a time",
          variant: "destructive",
        });
        return;
      }

      const product = products.find((p) => p.productId === productId);
      if (!product) return;

      const existingItem = compareItems.find(
        (item) => item.productId === productId
      );
      if (existingItem) return;

      const newItem = {
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

      const updatedCompare = [...compareItems, newItem];
      setCompareItems(updatedCompare);
      localStorage.setItem("compareItems", JSON.stringify(updatedCompare));

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

  const handleRemoveFromCompare = async (productId) => {
    try {
      const updatedCompare = compareItems.filter(
        (item) => item.productId !== productId
      );
      setCompareItems(updatedCompare);
      localStorage.setItem("compareItems", JSON.stringify(updatedCompare));

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

  const handleClearCompare = async () => {
    try {
      setCompareItems([]);
      localStorage.removeItem("compareItems");
      toast({
        title: "Compare Cleared",
        description: "All items have been removed from comparison",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear comparison",
        variant: "destructive",
      });
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Navigate to marketplace with search query
    window.location.href = `/marketplace?search=${encodeURIComponent(query)}`;
  };

  const handleFeatureClick = (feature) => {
    toast({
      title: `🚧 ${feature} Coming Soon!`,
      description:
        "This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const collections = [
    {
      name: "Bridal Collection",
      description: "Exquisite bridal wear for your special day",
      image: "/images/Bridal Lehenga Set.png",
      count: "50+ Designs",
    },
    {
      name: "Festive Wear",
      description: "Traditional outfits for festivals and celebrations",
      image: "/images/Festive Anarkali Suit.png",
      count: "100+ Styles",
    },
    {
      name: "Men's Ethnic",
      description: "Elegant sherwanis and kurtas for men",
      image: "/images/Embroidered Sherwani.png",
      count: "75+ Options",
    },
    {
      name: "Kids Collection",
      description: "Adorable ethnic wear for little ones",
      image: "/images/Girls Lehenga Choli.png",
      count: "60+ Designs",
    },
  ];

  const features = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "VR/AR Trials",
      description: "Try before you buy with virtual reality",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Local Markets",
      description: "Discover nearby ethnic wear markets",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Personal Stylist",
      description: "Get expert styling advice",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Virtual Fitting",
      description: "See how you look in different outfits",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Pehenava - Premium Ethnic Wear Marketplace</title>
        <meta
          name="description"
          content="Discover exquisite ethnic wear with VR/AR trials, local marketplace, and premium designs made to perfection at Pehenava."
        />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Discover Your
                    <span className="block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                      Perfect Ethnic Look
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Experience the future of ethnic wear shopping with VR/AR
                    trials, local marketplace discovery, and AI-powered personal
                    styling.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl">
                  <SearchBar
                    onSearch={handleSearch}
                    onFilterClick={() => handleFeatureClick("Advanced Filters")}
                    placeholder="Search for sarees, lehengas, sherwanis and more..."
                    showFilters={true}
                    showVoiceSearch={true}
                    showImageSearch={true}
                    recentSearches={recentSearches}
                    trendingSearches={trendingSearches}
                    suggestions={[]}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link to="/marketplace">
                      Explore Marketplace
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg font-semibold"
                    onClick={() => handleFeatureClick("VR Trials")}
                  >
                    Try VR Experience
                    <Eye className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center space-x-8 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-500 mr-1" />
                    <span>10,000+ Happy Customers</span>
                  </div>
                  <div className="flex items-center">
                    <Store className="h-4 w-4 text-green-500 mr-1" />
                    <span>150+ Local Markets</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <img
                        src="/images/Royal Silk Saree.png"
                        alt="Royal Silk Saree"
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900">
                        Royal Silk Saree
                      </h3>
                      <p className="text-sm text-gray-600">₹15,000</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <img
                        src="/images/Embroidered Sherwani.png"
                        alt="Embroidered Sherwani"
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900">
                        Embroidered Sherwani
                      </h3>
                      <p className="text-sm text-gray-600">₹12,000</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <img
                        src="/images/Bridal Lehenga Set.png"
                        alt="Bridal Lehenga Set"
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900">
                        Bridal Lehenga Set
                      </h3>
                      <p className="text-sm text-gray-600">₹25,000</p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <img
                        src="/images/Casual Kurta Pajama.png"
                        alt="Casual Kurta Pajama"
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <h3 className="font-semibold text-gray-900">
                        Casual Kurta Pajama
                      </h3>
                      <p className="text-sm text-gray-600">₹2,500</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Revolutionary Shopping Experience
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience ethnic wear shopping like never before with
                cutting-edge technology and personalized service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center group cursor-pointer"
                  onClick={() => handleFeatureClick(feature.title)}
                >
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Explore Our Collections
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover curated collections of the finest ethnic wear from
                traditional artisans and modern designers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {collections.map((collection, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
                  onClick={() => handleFeatureClick(collection.name)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {collection.count}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600">{collection.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Handpicked ethnic wear pieces that combine traditional
                craftsmanship with contemporary style.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      onAddToWishlist={handleAddToWishlist}
                      onRemoveFromWishlist={handleRemoveFromWishlist}
                      onAddToCompare={handleAddToCompare}
                      onRemoveFromCompare={handleRemoveFromCompare}
                      isInWishlist={wishlistItems.some(
                        (item) => item.productId === product.productId
                      )}
                      isInCompare={compareItems.some(
                        (item) => item.productId === product.productId
                      )}
                      showQuickView={true}
                      showCompare={true}
                      showWishlist={true}
                      showCart={true}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Button
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
                asChild
              >
                <Link to="/marketplace">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl lg:text-5xl font-bold text-white">
                  Ready to Transform Your Style?
                </h2>
                <p className="text-xl text-pink-100 max-w-3xl mx-auto">
                  Join thousands of satisfied customers who have discovered
                  their perfect ethnic look with Pehenava.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold"
                  asChild
                >
                  <Link to="/marketplace">
                    Start Shopping
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-pink-600 px-8 py-4 text-lg font-semibold"
                  onClick={() => handleFeatureClick("VR Trials")}
                >
                  Try VR Experience
                  <Eye className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          {/* Cart Button */}
          <Button
            onClick={() => setIsCartOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white relative"
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                {cartItems.length}
              </Badge>
            )}
          </Button>

          {/* Wishlist Button */}
          <Button
            onClick={() => setIsWishlistOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white relative"
          >
            <Heart className="h-6 w-6" />
            {wishlistItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                {wishlistItems.length}
              </Badge>
            )}
          </Button>

          {/* Compare Button */}
          <Button
            onClick={() => setIsCompareOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white relative"
          >
            <RotateCcw className="h-6 w-6" />
            {compareItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-xs">
                {compareItems.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* Modals */}
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={(itemId, quantity) => {
            const updatedCart = cartItems.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            );
            setCartItems(updatedCart);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
          }}
          onRemoveItem={(itemId) => {
            const updatedCart = cartItems.filter((item) => item.id !== itemId);
            setCartItems(updatedCart);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
          }}
          onMoveToWishlist={(item) => {
            handleAddToWishlist(item.productId);
          }}
          onClearCart={() => {
            setCartItems([]);
            localStorage.removeItem("cartItems");
          }}
          onCheckout={() => {
            window.location.href = "/checkout";
          }}
        />

        <Wishlist
          isOpen={isWishlistOpen}
          onClose={() => setIsWishlistOpen(false)}
          wishlistItems={wishlistItems}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onAddToCart={handleAddToCart}
          onMoveToCart={handleAddToCart}
          onClearWishlist={() => {
            setWishlistItems([]);
            localStorage.removeItem("wishlistItems");
          }}
        />

        <CompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          compareItems={compareItems}
          onRemoveFromCompare={handleRemoveFromCompare}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          onClearCompare={handleClearCompare}
        />
      </div>
    </>
  );
};

export default HomePage;
