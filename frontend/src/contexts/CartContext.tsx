import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface CartItem {
  product: Product;
  quantity: number;
  price?: number;
  unitPrice?: number;
  total?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, price?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subTotal: number;
  discount: number;
  total: number;
  isLoadingCart: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  // Initial load from local storage
  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem('nutd_cart');
      if (saved) {
        try {
          const parsedItems = JSON.parse(saved);
          setItems(parsedItems);
          calculateLocalTotals(parsedItems);
        } catch (e) {
          console.error('Failed to parse cart data', e);
        }
      }
      setIsLoadingCart(false);
    }
  }, [user]);

  // Sync with backend when user changes
  useEffect(() => {
    if (user) {
      syncCartWithBackend();
    }
  }, [user]);

  const calculateLocalTotals = (currentItems: CartItem[]) => {
    let sub = 0;
    currentItems.forEach(item => {
      sub += (item.price || item.product.retailPrice) * item.quantity;
    });
    setSubTotal(sub);
    setDiscount(0);
    setTotal(sub);
  };

  const syncCartWithBackend = async () => {
    setIsLoadingCart(true);
    try {
      const saved = localStorage.getItem('nutd_cart');
      let localItems = [];
      if (saved) {
        localItems = JSON.parse(saved).map((i: any) => ({
          productId: i.product.id,
          quantity: i.quantity
        }));
      }

      // Sync and get cart
      const res = await api.post('/cart/sync', { localItems });
      if (res.data.success) {
        const { items: serverItems, subTotal: st, discount: d, total: t } = res.data.data;
        setItems(serverItems);
        setSubTotal(st);
        setDiscount(d);
        setTotal(t);
        // Clear local storage after successful sync
        if (localItems.length > 0) {
          localStorage.removeItem('nutd_cart');
        }
      }
    } catch (error) {
      console.error('Failed to sync cart:', error);
    } finally {
      setIsLoadingCart(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      if (res.data.success) {
        const { items: serverItems, subTotal: st, discount: d, total: t } = res.data.data;
        setItems(serverItems);
        setSubTotal(st);
        setDiscount(d);
        setTotal(t);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (product: Product, quantity = 1, price?: number) => {
    if (user) {
      try {
        await api.post('/cart', { productId: product.id, quantity });
        await fetchCart();
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    } else {
      setItems(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        let newItems;
        if (existing) {
          newItems = prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...prev, { product, quantity, price }];
        }
        localStorage.setItem('nutd_cart', JSON.stringify(newItems));
        calculateLocalTotals(newItems);
        return newItems;
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (user) {
      try {
        await api.delete(`/cart/${productId}`);
        await fetchCart();
      } catch (error) {
        console.error('Failed to remove from cart:', error);
      }
    } else {
      setItems(prev => {
        const newItems = prev.filter(item => item.product.id !== productId);
        localStorage.setItem('nutd_cart', JSON.stringify(newItems));
        calculateLocalTotals(newItems);
        return newItems;
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }

    if (user) {
      try {
        await api.put(`/cart/${productId}`, { quantity });
        await fetchCart();
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    } else {
      setItems(prev => {
        const newItems = prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        localStorage.setItem('nutd_cart', JSON.stringify(newItems));
        calculateLocalTotals(newItems);
        return newItems;
      });
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await api.delete('/cart');
        await fetchCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      setItems([]);
      setSubTotal(0);
      setDiscount(0);
      setTotal(0);
      localStorage.removeItem('nutd_cart');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subTotal, discount, total, isLoadingCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
