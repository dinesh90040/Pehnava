import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  RefreshCw,
  Star,
  MessageCircle,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const OrdersPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [selectedFilter, setSelectedFilter] = useState("all");

  // Mock orders data
  const [orders] = useState([
    {
      id: "PEH001234",
      date: "2024-01-15",
      status: "delivered",
      total: 25000,
      items: [
        {
          id: 1,
          name: "Royal Silk Saree",
          price: 25000,
          quantity: 1,
          image: "/images/Royal Silk Saree.png",
          size: "Free Size",
          color: "Red",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91 98765 43210",
      },
      paymentMethod: "Credit Card",
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-20",
      actualDelivery: "2024-01-18",
    },
    {
      id: "PEH001235",
      date: "2024-01-10",
      status: "shipped",
      total: 30000,
      items: [
        {
          id: 6,
          name: "Embroidered Sherwani",
          price: 30000,
          quantity: 1,
          image: "/images/Embroidered Sherwani.png",
          size: "XL",
          color: "Gold",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91 98765 43210",
      },
      paymentMethod: "UPI",
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-01-25",
    },
    {
      id: "PEH001236",
      date: "2024-01-05",
      status: "processing",
      total: 15000,
      items: [
        {
          id: 3,
          name: "Festive Anarkali Suit",
          price: 15000,
          quantity: 1,
          image: "/images/Festive Anarkali Suit.png",
          size: "M",
          color: "Blue",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91 98765 43210",
      },
      paymentMethod: "Net Banking",
      estimatedDelivery: "2024-01-30",
    },
    {
      id: "PEH001237",
      date: "2023-12-20",
      status: "cancelled",
      total: 85000,
      items: [
        {
          id: 2,
          name: "Bridal Lehenga Set",
          price: 85000,
          quantity: 1,
          image: "/images/Bridal Lehenga Set.png",
          size: "L",
          color: "Red",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 MG Road",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: "+91 98765 43210",
      },
      paymentMethod: "Credit Card",
      cancellationReason: "Customer requested cancellation",
    },
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((order) => order.status === selectedFilter);

  const handleReorder = (order) => {
    toast({
      title: "Reorder",
      description: `Adding ${order.items.length} item(s) to your cart.`,
    });
    navigate("/cart");
  };

  const handleTrackOrder = (order) => {
    toast({
      title: "Track Order",
      description: `Tracking order ${order.id}...`,
    });
  };

  const handleDownloadInvoice = (order) => {
    toast({
      title: "Download Invoice",
      description: `Downloading invoice for order ${order.id}...`,
    });
  };

  const handleWriteReview = (order) => {
    toast({
      title: "Write Review",
      description: "Redirecting to review page...",
    });
  };

  const handleContactSupport = (order) => {
    toast({
      title: "Contact Support",
      description: "Opening support chat...",
    });
  };

  return (
    <>
      <Helmet>
        <title>Order History | Pehenava</title>
        <meta
          name="description"
          content="View your order history and track orders"
        />
      </Helmet>

      <div className="pt-24 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate("/account")}
              className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Account
            </button>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-gray-800">
                Order History
              </h1>
              <p className="text-gray-600">Track and manage your orders</p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All Orders", count: orders.length },
                {
                  key: "processing",
                  label: "Processing",
                  count: orders.filter((o) => o.status === "processing").length,
                },
                {
                  key: "shipped",
                  label: "Shipped",
                  count: orders.filter((o) => o.status === "shipped").length,
                },
                {
                  key: "delivered",
                  label: "Delivered",
                  count: orders.filter((o) => o.status === "delivered").length,
                },
                {
                  key: "cancelled",
                  label: "Cancelled",
                  count: orders.filter((o) => o.status === "cancelled").length,
                },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setSelectedFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedFilter === filter.key
                      ? "bg-amber-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No orders found
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedFilter === "all"
                    ? "You haven't placed any orders yet."
                    : `No orders with status "${getStatusText(
                        selectedFilter
                      )}" found.`}
                </p>
                <Button
                  onClick={() => navigate("/marketplace")}
                  className="bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order.id}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-lg font-bold text-gray-800">
                        ₹{order.total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 mb-1">
                            {item.name}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>Size: {item.size}</span>
                            <span>Color: {item.color}</span>
                            <span>Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Shipping Address */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-amber-600" />
                        Shipping Address
                      </h4>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium">
                          {order.shippingAddress.name}
                        </p>
                        <p>{order.shippingAddress.street}</p>
                        <p>
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.pincode}
                        </p>
                        <p className="flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {order.shippingAddress.phone}
                        </p>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Package className="h-4 w-4 mr-2 text-amber-600" />
                        Order Information
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="flex items-center">
                          <CreditCard className="h-3 w-3 mr-2" />
                          Payment: {order.paymentMethod}
                        </p>
                        {order.trackingNumber && (
                          <p className="flex items-center">
                            <Truck className="h-3 w-3 mr-2" />
                            Tracking: {order.trackingNumber}
                          </p>
                        )}
                        {order.estimatedDelivery && (
                          <p className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            {order.status === "delivered"
                              ? "Delivered on"
                              : "Expected delivery"}
                            :{" "}
                            {new Date(
                              order.estimatedDelivery
                            ).toLocaleDateString()}
                          </p>
                        )}
                        {order.actualDelivery && (
                          <p className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Delivered on:{" "}
                            {new Date(
                              order.actualDelivery
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => navigate(`/product/${order.items[0].id}`)}
                      variant="outline"
                      size="sm"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Product
                    </Button>

                    {order.status === "shipped" && (
                      <Button
                        onClick={() => handleTrackOrder(order)}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Truck className="h-4 w-4 mr-2" />
                        Track Order
                      </Button>
                    )}

                    {order.status === "delivered" && (
                      <>
                        <Button
                          onClick={() => handleWriteReview(order)}
                          variant="outline"
                          size="sm"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Write Review
                        </Button>
                        <Button
                          onClick={() => handleReorder(order)}
                          variant="outline"
                          size="sm"
                          className="border-amber-600 text-amber-600 hover:bg-amber-50"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reorder
                        </Button>
                      </>
                    )}

                    <Button
                      onClick={() => handleDownloadInvoice(order)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-600 hover:bg-gray-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Invoice
                    </Button>

                    <Button
                      onClick={() => handleContactSupport(order)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-600 hover:bg-gray-50"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Support
                    </Button>
                  </div>

                  {/* Cancellation Reason */}
                  {order.status === "cancelled" && order.cancellationReason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-medium text-red-800 mb-1">
                        Cancellation Reason:
                      </h5>
                      <p className="text-sm text-red-700">
                        {order.cancellationReason}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersPage;
