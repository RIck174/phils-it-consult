import { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItem] = useState([]);

  const addToCart = (item) => {
    setCartItem((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i,
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItem((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const removeFromCart = (id) => {
    setCartItem((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItem([]);
  };

  return (
    <CartContext.Provider
      value={{
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
