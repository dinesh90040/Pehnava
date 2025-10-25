import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  User,
  Package,
  Heart,
  MapPin,
  Bell,
  Settings,
  Edit,
  Camera,
  LogOut,
  Plus,
  Eye,
  Download,
  Star,
  ShoppingBag,
  CreditCard,
  Gift,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
    reviews: 0,
  });

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockUser = {
        userId: "user-001",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+91-9876543210",
        avatar: null,
        dateOfBirth: "1990-01-01",
        gender: "male",
        emailVerified: true,
        phoneVerified: true,
        preferences: {
          newsletter: true,
          notifications: true,
          theme: "light",
          language: "en",
        },
        createdAt: "2024-01-01T00:00:00Z",
        lastLoginAt: new Date().toISOString(),
      };
      setUser(mockUser);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        title: "Error",
        description: "Failed to load user data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // TODO: Replace with actual API calls
      const mockStats = {
        totalOrders: 12,
        totalSpent: 125000,
        wishlistItems: 8,
        reviews: 5,
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    { id: "orders", label: "Orders", icon: <Package className="h-4 w-4" /> },
    { id: "wishlist", label: "Wishlist", icon: <Heart className="h-4 w-4" /> },
    { id: "reviews", label: "Reviews", icon: <Star className="h-4 w-4" /> },
    {
      id: "addresses",
      label: "Addresses",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-4 w-4" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalOrders}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Wishlist Items
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.wishlistItems}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Reviews Written
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.reviews}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" onClick={() => setActiveTab("orders")}>
              View All
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "ORD-001",
                status: "delivered",
                total: 15000,
                date: "2024-01-15",
              },
              {
                id: "ORD-002",
                status: "shipped",
                total: 25000,
                date: "2024-01-10",
              },
              {
                id: "ORD-003",
                status: "processing",
                total: 8000,
                date: "2024-01-08",
              },
            ].map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/orders/${order.id}`)}
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      order.status === "delivered" ? "success" : "warning"
                    }
                  >
                    {order.status}
                  </Badge>
                  <p className="font-medium">₹{order.total.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => navigate("/marketplace")}
            >
              <ShoppingBag className="h-6 w-6" />
              <span>Shop Now</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab("wishlist")}
            >
              <Heart className="h-6 w-6" />
              <span>Wishlist</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab("addresses")}
            >
              <MapPin className="h-6 w-6" />
              <span>Addresses</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2"
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
        <Button onClick={() => navigate("/marketplace")}>
          <Plus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>

      <div className="space-y-4">
        {[
          {
            id: "ORD-001",
            status: "delivered",
            total: 15000,
            date: "2024-01-15",
            items: 2,
            trackingNumber: "TRK123456789",
          },
          {
            id: "ORD-002",
            status: "shipped",
            total: 25000,
            date: "2024-01-10",
            items: 1,
            trackingNumber: "TRK123456790",
          },
          {
            id: "ORD-003",
            status: "processing",
            total: 8000,
            date: "2024-01-08",
            items: 3,
            trackingNumber: null,
          },
        ].map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-600">
                      {order.items} item{order.items > 1 ? "s" : ""} •{" "}
                      {order.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        order.status === "delivered" ? "success" : "warning"
                      }
                    >
                      {order.status}
                    </Badge>
                    <p className="font-medium text-lg">
                      ₹{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.trackingNumber && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/track/${order.id}`)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <Button onClick={() => navigate("/marketplace")}>
          <Plus className="h-4 w-4 mr-2" />
          Browse Products
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            id: "1",
            name: "Royal Silk Saree",
            price: 15000,
            image: "/images/Royal Silk Saree.png",
            addedDate: "2024-01-10",
          },
          {
            id: "2",
            name: "Bridal Lehenga Set",
            price: 25000,
            image: "/images/Bridal Lehenga Set.png",
            addedDate: "2024-01-08",
          },
        ].map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                <p className="text-lg font-bold text-gray-900 mb-2">
                  ₹{item.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Added on {item.addedDate}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-pink-600" />
                )}
              </div>
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {user?.name}
              </h3>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500">
                Member since {new Date(user?.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input value={user?.name || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input value={user?.email || ""} type="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <Input value={user?.phone || ""} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <Input value={user?.dateOfBirth || ""} type="date" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">
                Receive updates about your orders and promotions
              </p>
            </div>
            <input
              type="checkbox"
              checked={user?.preferences?.notifications || false}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Newsletter</h4>
              <p className="text-sm text-gray-600">
                Get the latest fashion trends and offers
              </p>
            </div>
            <input
              type="checkbox"
              checked={user?.preferences?.newsletter || false}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Logout</h4>
              <p className="text-sm text-gray-600">Sign out of your account</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "orders":
        return renderOrders();
      case "wishlist":
        return renderWishlist();
      case "settings":
        return renderSettings();
      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600">This section is coming soon!</p>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>My Account - Pehenava</title>
        <meta
          name="description"
          content="Manage your account, orders, and preferences"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-pink-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user?.name}
                      </h3>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === tab.id
                            ? "bg-pink-50 text-pink-600 border-r-2 border-pink-600"
                            : "text-gray-700"
                        }`}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
