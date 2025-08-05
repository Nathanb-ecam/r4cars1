import { useEffect, useState } from 'react';
import { Product, ProductModel } from '@/models/Product';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ToggleSwitch from '../ui/ToggleSwitch';


type TableProduct = {
    _id: string;
    name: string;
    fullName: string;
    description: string;
    transmission: string;
    kms: string;
    year: string;
    benzineType: string;
    hp: string;
    doors: string;
    motorisation: string;
    price: string;
    imageUrl: string;
    visibleOnWebsite: boolean;
}

export default function ProductsTable() {

  const emptyTableProduct: TableProduct = {
    _id: '',
    name: '',
    fullName: '',
    description: '',
    transmission: '',
    kms: '',
    year: '',
    benzineType: '',
    hp: '',
    doors: '',
    motorisation: '',
    price: '',
    imageUrl: '',
    visibleOnWebsite: false,
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<TableProduct>(emptyTableProduct);
  const [newProduct, setNewProduct] = useState<TableProduct>(emptyTableProduct);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const {products, total} = await response.json();
      setProducts(products);      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,          
          price: newProduct.price          
        }),
      });

      if (!response.ok) throw new Error('Failed to create product');
      
      await fetchProducts();
      setIsModalOpen(false);
      setNewProduct(emptyTableProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

    const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/admin/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingProduct,          
        }),
      });

      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();
      setProducts((prev) => prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)));
      // await fetchProducts();
      setIsEditModalOpen(false);
      setEditingProduct(emptyTableProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (!product) return;
    
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await fetch(`/api/admin/products/${productToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
      // await fetchProducts();
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const openEditModal = (product: Product) => {    
    const p = {
      ...product,
      price: product.price.toString(),      
    }
    const {sections, createdAt, updatedAt , ...prod } = p
    setEditingProduct(prod as TableProduct);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Create Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-900">Create New Product</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                  <ToggleSwitch label="visibleOnWebsite" title={"On website"} initiallyChecked={newProduct.visibleOnWebsite} onToggle={()=>setNewProduct({ ...newProduct, visibleOnWebsite: !newProduct.visibleOnWebsite })} />                  
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">fullName</label>
                <input
                  type="text"
                  id="fullName"
                  value={newProduct.fullName}
                  onChange={(e) => setNewProduct({ ...newProduct, fullName: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="text"
                  id="price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.01"
                  required
                />
              </div>
   

              <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">Transmission</label>
                <input
                  type="text"
                  id="transmission"
                  value={newProduct.transmission}
                  onChange={(e) => setNewProduct({ ...newProduct, transmission: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                  
                  required
                />
              </div>

              <div>
                <label htmlFor="kms" className="block text-sm font-medium text-gray-700">KMS</label>
                <input
                  type="number"
                  id="kms"
                  value={newProduct.kms}
                  onChange={(e) => setNewProduct({ ...newProduct, kms: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Année</label>
                <input
                  type="number"
                  id="year"
                  value={newProduct.year}
                  onChange={(e) => setNewProduct({ ...newProduct, year: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="benzineType" className="block text-sm font-medium text-gray-700">benzineType</label>
                <input
                  type="number"
                  id="benzineType"
                  value={newProduct.benzineType}
                  onChange={(e) => setNewProduct({ ...newProduct, benzineType: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="hp" className="block text-sm font-medium text-gray-700">hp</label>
                <input
                  type="text"
                  id="hp"
                  value={newProduct.hp}
                  onChange={(e) => setNewProduct({ ...newProduct, hp: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="doors" className="block text-sm font-medium text-gray-700">doors</label>
                <input
                  type="number"
                  id="doors"
                  value={newProduct.doors}
                  onChange={(e) => setNewProduct({ ...newProduct, doors: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label htmlFor="motorisation" className="block text-sm font-medium text-gray-700">motorisation</label>
                <input
                  type="text"
                  id="motorisation"
                  value={newProduct.motorisation}
                  onChange={(e) => setNewProduct({ ...newProduct, motorisation: e.target.value })}
                  className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  step="0.01"
                  required
                />
              </div>

              <div>
                  <div className='my-2 flex justify-between items-center'>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                    
                   <input
                     type="string"
                     id="image"
                     value={newProduct.imageUrl}
                     onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                     className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                     required
                   />
                  </div>
                
                
             
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-900">Edit Product</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className='flex gap-4'>
                <ToggleSwitch label="visibleOnSite" title="On website" initiallyChecked={editingProduct.visibleOnWebsite} onToggle={()=>setEditingProduct({ ...editingProduct, visibleOnWebsite: !editingProduct.visibleOnWebsite })} />                
              </div>
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-fullName" className="block text-sm font-medium text-gray-700">fullName</label>
                <input
                  type="text"
                  id="edit-fullName"
                  value={editingProduct.fullName}
                  onChange={(e) => setEditingProduct({ ...editingProduct, fullName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">Original Price</label>
                <input
                  type="text"
                  id="edit-price"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                  
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-transmission" className="block text-sm font-medium text-gray-700">Transmission</label>
                <input
                  type="text"
                  id="edit-transmission"
                  value={editingProduct.transmission}
                  onChange={(e) => setEditingProduct({ ...editingProduct, transmission: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                  
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-kms" className="block text-sm font-medium text-gray-700">kms</label>
                <input
                  type="text"
                  id="edit-kms"
                  value={editingProduct.kms}
                  onChange={(e) => setEditingProduct({ ...editingProduct, kms: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                  
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-year" className="block text-sm font-medium text-gray-700">Année</label>
                <input
                  type="text"
                  id="edit-year"
                  value={editingProduct.year}
                  onChange={(e) => setEditingProduct({ ...editingProduct, year: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                 
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-benzineType" className="block text-sm font-medium text-gray-700">Type de Benzine</label>
                <input
                  type="text"
                  id="edit-benzineType"
                  value={editingProduct.benzineType}
                  onChange={(e) => setEditingProduct({ ...editingProduct, benzineType: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                  
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-hp" className="block text-sm font-medium text-gray-700">Puissance</label>
                <input
                  type="text"
                  id="edit-hp"
                  value={editingProduct.hp}
                  onChange={(e) => setEditingProduct({ ...editingProduct, hp: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required                
                />
              </div>

              <div>
                <label htmlFor="edit-doors" className="block text-sm font-medium text-gray-700">Nombre de Portes</label>
                <input
                  type="text"
                  id="edit-doors"
                  value={editingProduct.doors}
                  onChange={(e) => setEditingProduct({ ...editingProduct, doors: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                  
                  required
                />
              </div>

              <div>
                <label htmlFor="edit-motorisation" className="block text-sm font-medium text-gray-700">Motorisation</label>
                <input
                  type="text"
                  id="edit-motorisation"
                  value={editingProduct.motorisation}
                  onChange={(e) => setEditingProduct({ ...editingProduct, motorisation: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"                  
                  required
                />
              </div>





              <div>                
                  <div className=''>
                      <label htmlFor="edit-image" className="block text-sm font-medium text-gray-700">Image URL</label>                      
                      <input
                        type="string"
                        id="edit-image"
                        value={editingProduct.imageUrl}
                        onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        // required
                      />
                  </div>
                
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 border border-transparent rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product"
        itemName={`the product "${productToDelete?.name}"`}
      />

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                KMS
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(products) && products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {product.fullName}
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  <div className="max-w-xs truncate">
                    {product.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {/* €{product.originalPrice.toFixed(2)} */}
                  €{product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  €{product.kms}
                  {/* €{product.discountedPrice.toFixed(2)} */}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {Array.isArray(products) && products.map((product) => (
          <div key={product._id} className="bg-white shadow rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-medium text-gray-500">Product</span>
                  <p className="text-sm text-slate-900">{product.name}</p>
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">fullName</span>
                <p className="text-sm text-slate-900">{product.fullName}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Description</span>
                <p className="text-sm text-slate-900">{product.description}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Price</span>                
                <p className="text-sm text-slate-900">€{product.price}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">KMS</span>
                <p className="text-sm text-slate-900">€{product.kms}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Added</span>
                <p className="text-sm text-slate-900">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>  
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 