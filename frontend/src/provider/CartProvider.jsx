import React, { createContext, useContext, useState, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex > -1) {
        return prevItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity }];
      }
    });

    toast.success(`${item.name} added to cart!`, { duration: 4000 });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === itemId);

      if (!existingItem) {
        return prevItems;
      }

      if (existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter((item) => item.id !== itemId);
      }
    });
  };
  const contextValue = useMemo(
    () => ({
      cartItems,
      cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
      addToCart,
      removeFromCart,
    }),
    [cartItems]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
