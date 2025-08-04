import { Product } from '@/models/Product';
import { create } from 'zustand';

interface ProductStore {  
  products: Product[];
  total: number;
  isLoading: boolean;
  error: string | null;
    
  clearProducts: () => void;
  // fetchProducts: () => Promise<void>;
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  getProductById: (productId: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({  
  products: [],
  total: 0,
  isLoading: false,
  error: null,


  clearProducts: () => set({ products: [] }),

  // fetchProducts: async () => {
  //   set({ isLoading: true, error: null });
  //   try {
  //     const response = await fetch('/api/products');
  //     if (!response.ok) throw new Error('Failed to fetch products');
  //     const data = await response.json();
  //     set({ products: data, isLoading: false });
  //   } catch (err) {
  //     set({ 
  //       error: err instanceof Error ? err.message : 'An error occurred',
  //       isLoading: false 
  //     });
  //   }
  // },

  fetchProducts: async (page = 1, limit = 6) => {
  set({ isLoading: true, error: null });
  try {
    const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error('Erreur lors du chargement des produits');
    const data = await res.json();
    console.log("Fetched DEVUGGG products:", data.products);
    set({ products: data.products, total: data.total, isLoading: false });
  } catch (err: any) {
    set({ error: err.message, isLoading: false });
  }
},


  getProductById: (productId: string) => {
    return get().products.find((product) => product._id === productId);
  },
})); 