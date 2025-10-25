import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  User,
  Package,
  Heart,
  Settings,
  LogOut,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Gift,
  Star,
  ShoppingBag,
  Calendar,
  ArrowRight,
  Edit,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useUserMongo } from "@/hooks/useUserMongo";

const MyAccountPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading, getUserOrders, getUserCart } = useUserMongo();

  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({ items: [] });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    addresses: 1,
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const [ordersData, cartData] = await Promise.all([
        getUserOrders(),
        getUserCart(),
      ]);

      setOrders(ordersData);
      setCart(cartData);

      // Calculate stats
      const totalSpent = ordersData.reduce(
        (sum, order) => sum + order.total,
        0
      );
      const totalOrders = ordersData.length;

      setStats({
        totalOrders,
        totalSpent,
        wishlistItems: 8, // Mock for now
        addresses: 1,
      });

      setUserData({
        name: user.name,
        email: user.email,
        phone: user.profile?.phone || "+91-9876543210",
        memberSince: new Date(user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        }),
        totalOrders,
        totalSpent,
        wishlistItems: 8,
        addresses: 1,
      });
    } catch (error) {
      console.error("Error loading user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    }
  };

  // Recent orders will be populated from the orders state

  const accountSections = [
    {
      title: "Profile Information",
      description: "Manage your personal details",
      icon: <User className="h-6 w-6" />,
      link: "/account/profile",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Order History",
      description: "View and track your orders",
      icon: <Package className="h-6 w-6" />,
      link: "/account/orders",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Wishlist",
      description: "Your saved items",
      icon: <Heart className="h-6 w-6" />,
      link: "/wishlist",
      color: "from-red-500 to-red-600",
    },
    {
      title: "Addresses",
      description: "Manage delivery addresses",
      icon: <MapPin className="h-6 w-6" />,
      link: "/account/addresses",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Payment Methods",
      description: "Manage your payment options",
      icon: <CreditCard className="h-6 w-6" />,
      link: "/account/payment-methods",
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Notifications",
      description: "Email and SMS preferences",
      icon: <Bell className="h-6 w-6" />,
      link: "/account/notifications",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      title: "Security",
      description: "Password and security settings",
      icon: <Shield className="h-6 w-6" />,
      link: "/account/security",
      color: "from-gray-500 to-gray-600",
    },
    {
      title: "Rewards",
      description: "Loyalty points and offers",
      icon: <Gift className="h-6 w-6" />,
      link: "/account/rewards",
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Account | Pehenava</title>
        <meta name="description" content="Manage your Pehenava account" />
      </Helmet>

      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
              My Account
            </h1>
            <p className="text-gray-600">
              Welcome back, {userData.name}! Manage your account and
              preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {userData.name}
                  </h2>
                  <p className="text-gray-600 mb-2">{userData.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {userData.memberSince}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="text-sm text-gray-700">
                        Total Orders
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {userData.totalOrders}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="text-sm text-gray-700">Total Spent</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      ₹{userData.totalSpent.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Heart className="h-5 w-5 text-gray-600 mr-3" />
                      <span className="text-sm text-gray-700">
                        Wishlist Items
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {userData.wishlistItems}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Recent Orders
                  </h3>
                  <Link
                    to="/account/orders"
                    className="text-amber-600 hover:text-amber-500 font-medium flex items-center"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>

                <div className="space-y-4">
                  {orders.slice(0, 3).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                        <img
                          src={
                            order.items?.[0]?.image ||
                            "/images/Royal Silk Saree.png"
                          }
                          alt="Order item"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-800">
                              Order #{order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.orderDate).toLocaleDateString()} •{" "}
                              {order.items?.length || 0} item
                              {(order.items?.length || 0) > 1 ? "s" : ""}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              ₹{order.total.toLocaleString()}
                            </p>
                            <span
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Account Sections */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Account Settings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accountSections.map((section, index) => (
                    <motion.div
                      key={section.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link
                        to={section.link}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-amber-300 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-start">
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-r ${section.color} text-white mr-4 group-hover:scale-110 transition-transform duration-200`}
                          >
                            {section.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 group-hover:text-amber-600 transition-colors">
                              {section.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {section.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Quick Actions
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => navigate("/marketplace")}
                    className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white py-3"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Shop Now
                  </Button>

                  <Button
                    onClick={() => navigate("/wishlist")}
                    variant="outline"
                    className="border-amber-600 text-amber-600 hover:bg-amber-50 py-3"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    View Wishlist
                  </Button>

                  <Button
                    onClick={() => navigate("/cart")}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    View Cart
                  </Button>

                  <Button
                    onClick={() => navigate("/account/profile")}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 py-3"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyAccountPage;
