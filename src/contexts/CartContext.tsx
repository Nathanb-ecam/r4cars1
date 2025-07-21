'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  description: string;
  // price: number;
  originalPrice: number;
  discountedPrice: number;
  imageUrl: string;
  quantity: number;
  sku:string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('cartItems');
    console.log('Loading cart items from localStorage:', savedItems);
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        console.log('Parsed cart items:', parsedItems);
        setItems(parsedItems);
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    console.log('Saving cart items to localStorage:', items);
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    console.log('Adding item to cart:', item);
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id);
      if (existingItem) {
        const newItems = currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
        console.log('Updated existing item in cart:', newItems);
        return newItems;
      }
      const newItems = [...currentItems, { ...item, quantity: 1 }];
      console.log('Added new item to cart:', newItems);
      return newItems;
    });
  };

  const removeFromCart = (id: string) => {
    console.log('Removing item from cart:', id);
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    console.log('Updating item quantity:', { id, quantity });
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    console.log('Clearing cart');
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
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