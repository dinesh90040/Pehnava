import React from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";
import HomePage from "@/pages/HomePage";
import MarketplacePage from "@/pages/MarketplacePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import CheckoutPage from "@/pages/CheckoutPage";
import VRTrialsPage from "@/pages/VRTrialsPage";
import ModelApplicationPage from "@/pages/ModelApplicationPage";
import JoinMarketplacePage from "@/pages/JoinMarketplacePage";
import PersonalStylistPage from "@/pages/PersonalStylistPage";
import MarketplaceLocator from "@/pages/MarketplaceLocator";
import ShopDetail from "@/pages/ShopDetail"; // Import the new component
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function App() {
  return (
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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/vr-trials" element={<VRTrialsPage />} />
          <Route path="/apply-model" element={<ModelApplicationPage />} />
          <Route path="/join-marketplace" element={<JoinMarketplacePage />} />
          <Route path="/personal-stylist" element={<PersonalStylistPage />} />
          <Route path="/marketplace-locator" element={<MarketplaceLocator />} />
          <Route path="/shop/:shopId" element={<ShopDetail />} />{" "}
          {/* Add the new route */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
