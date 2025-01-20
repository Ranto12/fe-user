import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Fungsi untuk menambahkan item ke cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.find((i) => i.id === item.id);
      if (itemExists) {
        // Jika item sudah ada di keranjang, tambahkan jumlahnya
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Jika item baru, tambahkan ke keranjang
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
