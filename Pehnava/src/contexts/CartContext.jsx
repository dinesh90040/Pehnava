import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext({ addToCart: () => {}, items: [] });

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems((prev) => [...prev, { ...product, _addedAt: Date.now() }]);
  };

  const value = useMemo(() => ({ items, addToCart }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
