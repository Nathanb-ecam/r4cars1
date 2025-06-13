import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/Product';

// interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
//   stock: number;
// }

export default function ProductGrid() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des produits');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-48">
            <Image
              // src={product.image}
              src={product.imageSelfHosted ? (product?.imageUrl ? `images/${product?.imageUrl}`: "/images/g5-no-bg.png" ) : (product.imageUrl) || '/images/g5-no-bg.png'}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {product.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-indigo-600">
                {product.originalPrice.toFixed(2)} €
              </span>
              <span className="text-sm text-gray-500">
                Stock: {product.stock}
              </span>
            </div>
            <button
              onClick={() => router.push(`/visitor/product/${product._id}`)}
              className="mt-4 w-full bg-lime-500 text-white py-2 px-4 rounded-md hover:bg-lime-600 transition-colors duration-300"
            >
              Voir le produit
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 