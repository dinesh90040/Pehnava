import React from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import { AuthProvider } from "@/components/AuthProvider";
import { CartProvider } from "@/contexts/CartContext";
import HomePage from "@/pages/HomePage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import CheckoutPage from "@/pages/CheckoutPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import MyAccountPage from "@/pages/MyAccountPage";
import AccountProfilePage from "@/pages/AccountProfilePage";
import OrdersPage from "@/pages/OrdersPage";
import VRTrialsPage from "@/pages/VRTrialsPage";
import ModelApplicationPage from "@/pages/ModelApplicationPage";
import JoinMarketplacePage from "@/pages/JoinMarketplacePage";
import PersonalStylistPage from "@/pages/PersonalStylistPage";
import MarketplaceLocator from "@/pages/MarketplaceLocator";
import ShopDetail from "@/pages/ShopDetail";
import OrderTrackingPage from "@/pages/OrderTrackingPage";
import ReviewPage from "@/pages/ReviewPage";
import UserDashboard from "@/pages/UserDashboard";
import ComparePage from "@/pages/ComparePage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <div className="min-h-screen lotus-pattern">
          <Helmet>
            <title>Pehenava - Premium Ethnic Wear Marketplace</title>
            <meta
              name="description"
              content="Discover exquisite ethnic wear with VR/AR trials, local marketplace, and premium designs made to perfection at Pehenava."
            />
          </Helmet>

          <Navbar />

          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route
                path="/product/:productId/reviews"
                element={<ReviewPage />}
              />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/account" element={<MyAccountPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/account/profile" element={<AccountProfilePage />} />
              <Route path="/account/orders" element={<OrdersPage />} />
              <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
              <Route path="/track/:orderId" element={<OrderTrackingPage />} />
              <Route path="/vr-trials" element={<VRTrialsPage />} />
              <Route path="/apply-model" element={<ModelApplicationPage />} />
              <Route path="/join-marketplace" element={<JoinMarketplacePage />} />
              <Route path="/personal-stylist" element={<PersonalStylistPage />} />
              <Route
                path="/marketplace-locator"
                element={<MarketplaceLocator />}
              />
              <Route path="/shop/:shopId" element={<ShopDetail />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;
