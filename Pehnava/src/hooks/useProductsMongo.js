import { useState, useEffect } from "react";

const API_BASE_URL = "/api";

export const useProductsMongo = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.shopId) params.append("shopId", filters.shopId);
      if (filters.featured) params.append("featured", "true");

      const url = `${API_BASE_URL}/products${params.toString() ? `?${params}` : ""}`;
      let response = await fetch(url);

      if (!response.ok) {
        // Try a fallback to featured
        const fallbackRes = await fetch(`${API_BASE_URL}/products?featured=true`);
        if (!fallbackRes.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fallbackData = await fallbackRes.json();
        setProducts(fallbackData || []);
        return;
      }

      let data = await response.json();
      // If filtered result is empty, show some featured/new items
      if ((!Array.isArray(data) || data.length === 0) && (filters.gender || filters.category || filters.search)) {
        const fallbackRes = await fetch(`${API_BASE_URL}/products?featured=true`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setProducts(fallbackData || []);
          return;
        }
      }
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
      // Final fallback: get any products without filters
      try {
        const resAny = await fetch(`${API_BASE_URL}/products`);
        if (resAny.ok) {
          const anyData = await resAny.json();
          setProducts(anyData || []);
          return;
        }
      } catch {}
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/id/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching product:", err);
      setError(err.message);
      return null;
    }
  };

  const getProductBySlug = async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${slug}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching product by slug:", err);
      setError(err.message);
      return null;
    }
  };

  const searchProducts = async (searchTerm) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products?search=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (err) {
      console.error("Error searching products:", err);
      setError(err.message);
      return [];
    }
  };

  const getFeaturedProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products?featured=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (err) {
      console.error("Error fetching featured products:", err);
      setError(err.message);
      return [];
    }
  };

  const getRelatedProducts = async (productId, category, limit = 4) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/products?category=${encodeURIComponent(
          category
        )}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Filter out the current product
      return data.filter((product) => product.id !== productId).slice(0, limit);
    } catch (err) {
      console.error("Error fetching related products:", err);
      setError(err.message);
      return [];
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProduct,
    getProductBySlug,
    searchProducts,
    getFeaturedProducts,
    getRelatedProducts,
  };
};
