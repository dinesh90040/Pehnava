import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Grid,
  Filter,
  SortAsc,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { LoadingCard } from "./ui/loading";

const ProductGrid = ({
  products = [],
  isLoading = false,
  onAddToCart,
  onAddToWishlist,
  onRemoveFromWishlist,
  onAddToCompare,
  onRemoveFromCompare,
  wishlistItems = [],
  compareItems = [],
  showFilters = true,
  showSort = true,
  showSearch = true,
  className = "",
}) => {
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    categories: [],
    brands: [],
    ratings: [],
    availability: "all",
    discount: false,
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Sort options
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" },
    { value: "newest", label: "Newest First" },
    { value: "popularity", label: "Most Popular" },
    { value: "discount", label: "Best Discount" },
  ];

  // Filter products based on search, sort, and filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Rating filter
    if (filters.ratings.length > 0) {
      filtered = filtered.filter((product) =>
        filters.ratings.some((rating) => product.rating >= rating)
      );
    }

    // Availability filter
    if (filters.availability === "in-stock") {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Discount filter
    if (filters.discount) {
      filtered = filtered.filter(
        (product) =>
          product.originalPrice && product.originalPrice > product.price
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "popularity":
          return (b.viewCount || 0) - (a.viewCount || 0);
        case "discount":
          const aDiscount = a.originalPrice
            ? ((a.originalPrice - a.price) / a.originalPrice) * 100
            : 0;
          const bDiscount = b.originalPrice
            ? ((b.originalPrice - b.price) / b.originalPrice) * 100
            : 0;
          return bDiscount - aDiscount;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      categories: [],
      brands: [],
      ratings: [],
      availability: "all",
      discount: false,
    });
    setSearchQuery("");
  };

  const getUniqueValues = (key) => {
    return [
      ...new Set(products.map((product) => product[key]).filter(Boolean)),
    ];
  };

  const categories = getUniqueValues("category");
  const brands = getUniqueValues("brand");

  if (isLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Loading Header */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Sort */}
          {showSort && (
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Filter Toggle */}
          {showFilters && (
            <Button
              variant="outline"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className="lg:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </p>
        {(filters.categories.length > 0 ||
          filters.brands.length > 0 ||
          filters.ratings.length > 0 ||
          filters.discount ||
          searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </Button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        {showFilters && (
          <div
            className={`${
              showFilterPanel ? "block" : "hidden"
            } lg:block w-64 flex-shrink-0`}
          >
            <Card>
              <CardContent className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilterPanel(false)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        handleFilterChange("priceRange", [
                          filters.priceRange[0],
                          parseInt(e.target.value),
                        ])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{filters.priceRange[0].toLocaleString()}</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...filters.categories, category]
                              : filters.categories.filter(
                                  (c) => c !== category
                                );
                            handleFilterChange("categories", newCategories);
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h4 className="font-medium mb-2">Brands</h4>
                  <div className="space-y-1">
                    {brands.map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand)}
                          onChange={(e) => {
                            const newBrands = e.target.checked
                              ? [...filters.brands, brand]
                              : filters.brands.filter((b) => b !== brand);
                            handleFilterChange("brands", newBrands);
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ratings */}
                <div>
                  <h4 className="font-medium mb-2">Customer Rating</h4>
                  <div className="space-y-1">
                    {[4, 3, 2, 1].map((rating) => (
                      <label key={rating} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.ratings.includes(rating)}
                          onChange={(e) => {
                            const newRatings = e.target.checked
                              ? [...filters.ratings, rating]
                              : filters.ratings.filter((r) => r !== rating);
                            handleFilterChange("ratings", newRatings);
                          }}
                          className="mr-2"
                        />
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < rating ? "text-yellow-400" : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          ))}
                          <span className="ml-1 text-sm">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="font-medium mb-2">Availability</h4>
                  <div className="space-y-1">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value="all"
                        checked={filters.availability === "all"}
                        onChange={(e) =>
                          handleFilterChange("availability", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">All Products</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value="in-stock"
                        checked={filters.availability === "in-stock"}
                        onChange={(e) =>
                          handleFilterChange("availability", e.target.value)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">In Stock Only</span>
                    </label>
                  </div>
                </div>

                {/* Discount */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.discount}
                      onChange={(e) =>
                        handleFilterChange("discount", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">On Sale</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Grid/List */}
        <div className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.productId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={onAddToCart}
                    onAddToWishlist={onAddToWishlist}
                    onRemoveFromWishlist={onRemoveFromWishlist}
                    onAddToCompare={onAddToCompare}
                    onRemoveFromCompare={onRemoveFromCompare}
                    isInWishlist={wishlistItems.includes(product.productId)}
                    isInCompare={compareItems.includes(product.productId)}
                    className={viewMode === "list" ? "flex" : ""}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
