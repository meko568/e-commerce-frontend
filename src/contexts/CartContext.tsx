import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CartItem {
  id: number;
  name: string;
  price: string;
  current_price: string;
  has_sale: boolean;
  stock: number;
  main_image: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initialize cart from localStorage immediately
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          return parsedCart;
        } catch (error) {
          localStorage.removeItem('cart');
        }
      }
    }
    return [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: any, quantity: number = 1) => {
    if (!product || !product.id) {
      toast.error('Invalid product data');
      return;
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Cannot add more than ${product.stock} items of ${product.name}`);
          return prevCart;
        }
        
        const updatedCart = prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
        
        toast.success(`Updated ${product.name} quantity in cart`);
        return updatedCart;
      } else {
        // Add new item
        if (quantity > product.stock) {
          toast.error(`Cannot add more than ${product.stock} items of ${product.name}`);
          return prevCart;
        }
        
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          current_price: product.current_price,
          has_sale: product.has_sale,
          stock: product.stock,
          main_image: product.main_image,
          quantity
        };
        
        toast.success(`${product.name} added to cart`);
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.id === productId);
      if (item) {
        toast.success(`${item.name} removed from cart`);
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const item = prevCart.find(item => item.id === productId);
      if (item) {
        if (quantity > item.stock) {
          toast.error(`Cannot add more than ${item.stock} items of ${item.name}`);
          return prevCart;
        }
        return prevCart.map(cartItem =>
          cartItem.id === productId
            ? { ...cartItem, quantity }
            : cartItem
        );
      }
      return prevCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.current_price) * item.quantity);
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId: number) => {
    return cart.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
