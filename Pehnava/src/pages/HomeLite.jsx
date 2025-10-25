import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading";
import ProductCard from "@/components/ProductCard";

const HomeLite = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [compareItems, setCompareItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlistItems");
    const savedCompare = localStorage.getItem("compareItems");
    const savedCart = localStorage.getItem("cartItems");
    if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
    if (savedCompare) setCompareItems(JSON.parse(savedCompare));
    if (savedCart) setCartItems(JSON.parse(savedCart));

    (async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        // Fallback minimal products
        setProducts([]);
        toast({ title: "Using fallback data", description: "Could not load products from API", variant: "warning" });
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handleAddToCart = async (item) => {
    const existing = cartItems.find(
      (c) => c.productId === item.productId && c.size === (item.size||"") && c.color === (item.color||"")
    );
    let updated;
    if (existing) {
      updated = cartItems.map((c) =>
        c.productId === item.productId && c.size === (item.size||"") && c.color === (item.color||"")
          ? { ...c, quantity: (c.quantity || 1) + (item.quantity || 1) }
          : c
      );
    } else {
      const newItem = {
        id: `${item.productId}-${item.size||"default"}-${item.color||"default"}`,
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
      updated = [...cartItems, newItem];
    }
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    toast({ title: "Added to Cart", description: item.name });
  };

  const handleAddToWishlist = async (productId) => {
    const p = products.find((x) => x.productId === productId);
    if (!p) return;
    if (wishlistItems.some((w) => w.productId === productId)) return;
    const newItem = {
      id: productId,
      productId,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice,
      image: p.images?.[0] || p.thumbnail,
      brand: p.brand,
      inStock: p.inStock,
      addedAt: new Date().toISOString(),
    };
    const updated = [...wishlistItems, newItem];
    setWishlistItems(updated);
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
    toast({ title: "Added to Wishlist", description: p.name });
  };

  const handleRemoveFromWishlist = async (productId) => {
    const updated = wishlistItems.filter((w) => w.productId !== productId);
    setWishlistItems(updated);
    localStorage.setItem("wishlistItems", JSON.stringify(updated));
  };

  const handleAddToCompare = async (productId) => {
    if (compareItems.length >= 4) {
      toast({ title: "Compare limit reached", variant: "destructive" });
      return;
    }
    const p = products.find((x) => x.productId === productId);
    if (!p) return;
    if (compareItems.some((c) => c.productId === productId)) return;
    const updated = [...compareItems, { productId }];
    setCompareItems(updated);
    localStorage.setItem("compareItems", JSON.stringify(updated));
  };

  const handleRemoveFromCompare = async (productId) => {
    const updated = compareItems.filter((c) => c.productId !== productId);
    setCompareItems(updated);
    localStorage.setItem("compareItems", JSON.stringify(updated));
  };

  return (
    <>
      <Helmet>
        <title>Pehenava - Premium Ethnic Wear Marketplace</title>
        <meta name="description" content="Discover exquisite ethnic wear with VR/AR trials, local marketplace, and premium designs." />
      </Helmet>

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                Discover Your
                <span className="block bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Perfect Ethnic Look</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Experience ethnic wear shopping with marketplace discovery and premium designs.
              </p>
              <div className="mt-6 flex gap-3">
                <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
                  <Link to="/marketplace">Explore Marketplace</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/vr-trials">Try VR Experience</Link>
                </Button>
              </div>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
              <img src="/images/Bridal Lehenga Set.png" alt="Hero" className="rounded-2xl shadow-lg" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-600">Handpicked pieces that blend tradition and style.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((p) => (
                <ProductCard
                  key={p.productId}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleAddToWishlist}
                  onRemoveFromWishlist={handleRemoveFromWishlist}
                  onAddToCompare={handleAddToCompare}
                  onRemoveFromCompare={handleRemoveFromCompare}
                  isInWishlist={wishlistItems.some((w) => w.productId === p.productId)}
                  isInCompare={compareItems.some((c) => c.productId === p.productId)}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
              <Link to="/marketplace">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeLite;
