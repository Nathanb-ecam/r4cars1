import { Product } from '@/models/Product';
import { create } from 'zustand';

interface ProductStore {  
  products: Product[];
  isLoading: boolean;
  error: string | null;
    
  clearProducts: () => void;
  fetchProducts: () => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({  
  products: [],
  isLoading: false,
  error: null,


  clearProducts: () => set({ products: [] }),

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      set({ products: data, isLoading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'An error occurred',
        isLoading: false 
      });
    }
  },

  getProductById: (productId: string) => {
    return get().products.find((product) => product._id === productId);
  },
})); 