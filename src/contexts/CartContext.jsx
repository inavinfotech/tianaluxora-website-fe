import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("tiana_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error("Failed to parse cart from localStorage", e);
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("tiana_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item.id === product.id && item.variant_id === product.variant_id,
      );
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id && item.variant_id === product.variant_id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        { ...product, quantity: 1, addedAt: new Date().toISOString() },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, variantId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => item.id !== productId || item.variant_id !== variantId,
      ),
    );
  };

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.variant_id === variantId
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const priceStr = String(item.price).replace(/[^0-9.]/g, "");
    const price = parseFloat(priceStr) || 0;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
