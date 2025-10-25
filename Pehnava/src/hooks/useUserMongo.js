import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5000/api";

export const useUserMongo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, we'll use a test user
    // In a real app, this would come from authentication
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);

      // For demo purposes, we'll use the test user we created
      // In a real app, this would be fetched based on authentication
      const testUser = {
        id: "test-user-1",
        email: "test@pehenava.com",
        name: "Test User",
        emailVerified: true,
        createdAt: new Date("2025-10-25T05:40:45.830Z"),
        updatedAt: new Date("2025-10-25T05:40:45.830Z"),
        profile: {
          firstName: "Test",
          lastName: "User",
          phone: "+91-9876543210",
          address: {
            street: "123 Test Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
            country: "India",
          },
          preferences: {
            size: "M",
            favoriteCategories: ["Sarees", "Lehengas", "Men's Wear"],
            notifications: {
              email: true,
              sms: false,
              push: true,
            },
          },
        },
      };

      setUser(testUser);
    } catch (err) {
      console.error("Error loading user:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // In a real app, this would make an API call to update the user
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);

      return updatedUser;
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserOrders = async () => {
    try {
      // Mock orders data for demo
      const orders = [
        {
          id: "ORD-001",
          orderNumber: "PEH-2025-001",
          status: "delivered",
          total: 45000,
          items: [
            {
              productId: 1,
              name: "Royal Silk Saree",
              quantity: 1,
              price: 15000,
            },
            {
              productId: 3,
              name: "Embroidered Sherwani",
              quantity: 2,
              price: 12000,
            },
          ],
          orderDate: new Date("2025-10-20T10:30:00Z"),
          deliveryDate: new Date("2025-10-22T14:00:00Z"),
          shippingAddress: {
            street: "123 Test Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
          },
        },
        {
          id: "ORD-002",
          orderNumber: "PEH-2025-002",
          status: "shipped",
          total: 25000,
          items: [
            {
              productId: 2,
              name: "Bridal Lehenga Set",
              quantity: 1,
              price: 25000,
            },
          ],
          orderDate: new Date("2025-10-23T09:15:00Z"),
          estimatedDelivery: new Date("2025-10-26T18:00:00Z"),
          shippingAddress: {
            street: "123 Test Street",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001",
          },
        },
      ];

      return orders;
    } catch (err) {
      console.error("Error fetching user orders:", err);
      setError(err.message);
      return [];
    }
  };

  const getUserCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart/test-user-1`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const cart = await response.json();
      return cart;
    } catch (err) {
      console.error("Error fetching user cart:", err);
      setError(err.message);
      return { userId: "test-user-1", items: [] };
    }
  };

  return {
    user,
    loading,
    error,
    updateUser,
    getUserOrders,
    getUserCart,
  };
};
