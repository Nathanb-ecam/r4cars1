import { Product } from '@/models/Product';
import { useEffect, useState } from 'react';
import { Affiliate } from './AffiliatesTable';
import { GoAffProOrder, GoAffProLineItem, ExtendSchemaGoAffPro, ExtendedOrderGoAffPro } from '@/models/GoAffPro';

export default function OrdersTable() {
  const [orders, setOrders] = useState<GoAffProOrder[]>([]);
  const [affiliates, setAffilitates] = useState<Affiliate[]>([]);
  const [products, setProducts] = useState<Product[]>([]);  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    affiliate_id: 0,
    customer_email: '',
    shipping_address: '',
    line_items: [{ product_id: '', quantity: 1 }] as { product_id: string; quantity: number }[],
    status: 'pending',
    coupon: ''
  });

  const defaultCoupons = ['EASY10OFF']

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchAffiliates();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchAffiliates = async () => {
    try {
      const response = await fetch('/api/admin/affiliates');
      if (!response.ok) throw new Error('Failed to fetch doctors');
      const data = await response.json();
      setAffilitates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      line_items: [...newOrder.line_items, { product_id: '', quantity: 1 }]
    });
  };

  const handleRemoveProduct = (index: number) => {
    setNewOrder({
      ...newOrder,
      line_items: newOrder.line_items.filter((_, i) => i !== index)
    });
  };

  const handleProductChange = (index: number, field: 'product_id' | 'quantity', value: string | number) => {
    const updatedLineItems = [...newOrder.line_items];
    updatedLineItems[index] = { 
      ...updatedLineItems[index], 
      [field]: field === 'quantity' ? Number(value) : value 
    };
    setNewOrder({ ...newOrder, line_items: updatedLineItems });
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      const {discount, tax, shipping} = {discount:100,tax: 0, shipping: 7}
      const orderId = "1002";
      const orderNumber =  "#1002"; // TODO : must be fetched 

      // Calculate total and prepare line items
      const line_items: GoAffProLineItem[] = newOrder.line_items.map(item => {
        const product = products.find(p => p._id === item.product_id);
        if (!product) throw new Error('Product not found');
        
        return {
          name: product.name,
          sku: product.sku,
          price: product.discountedPrice,
          quantity: item.quantity,
          product_id: product._id,
          tax: 0, // tax charged on this product. USE this only if the product price has VAT included in the price
          discount: 0,     

        };
      });

      // const total = line_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const subtotal = line_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal // TODO : compute the taxes and shipping costs to obtain 'total'
      
      const extendedGoAffProOrder: ExtendedOrderGoAffPro = {
        id: orderId,
        number:orderNumber, // ex: #1001. human readable order number displayed to the admins
        total: total, // the order total (the final amount that the customer paid)
        subtotal: subtotal, // order subtotal (order total minus shipping and taxes)
        discount: discount, // the discount received by the customer
        tax: tax, // the tax charged on the order
        shipping: shipping,  // the shipping charged on the order
        currency:'EUR', // ex: USD. ISO-4217 three letter currency code of the order
        date: new Date().toISOString(), // ex: 2021-04-27T17:06:55.450Z
        customer: { // customer details
            first_name:'John',
            last_name:'Doe',
            email:'johndoe@gmail.com',
            // phone?:string, // optional
            // is_new_customer?:boolean //optional
        },
        coupons: ['EASY10OFF'], // ex: ['EASY10OFF']. an array of discount codes applied to the order
        line_items:[ // array of products sold in this order
            {
                name:'Médicament A', // ex: Product A. name of the product
                quantity:2, //total quantities sold
                price: 80,
                sku:'PD-111-1', // ex: PD-110-1. product SKU
                product_id: 'mongo-product-id', //ex: 21413232. Internal product ID (used if you are using REST JSON FILE)
                tax: 0, // tax charged on this product. USE this only if the product price has VAT included in the price
                discount: 0, // total discount received by the customer on this product. In this case, the customer got $25 discount per item.
            }
        ],
       status:'approved', // ex: approved
       forceSDK:true , //ex: true.  use this parameter to process this order as a CUSTOM ORDER (bypasses platform order enrichment 
      //commission: 45, // (not recommended) specify the commission to be given for this order
      //  delay: number
      } 

      

      // const orderData : ExtendSchemaGoAffPro = {
      //   order:extendedGoAffProOrder,        
      //   affiliate_id: newOrder.affiliate_id,
      //   customer_email: newOrder.customer_email,
      //   shipping_address: newOrder.shipping_address,
      //   coupons:[newOrder.coupon],
      //   line_items,
      //   total: total,
      //   subtotal: total,
      //   status: 'approved' 
      // };

      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(orderData),
        body: JSON.stringify(extendedGoAffProOrder),
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      await fetchOrders();
      setIsModalOpen(false);
      setNewOrder({
        affiliate_id: 0,
        customer_email: '',
        shipping_address: '',
        line_items: [{ product_id: '', quantity: 1 }],
        status: 'pending',
        coupon: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
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
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Order
        </button>
      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Order</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label htmlFor="affiliate_id" className="block text-sm font-medium text-gray-700">Doctor</label>
                <select
                  id="affiliate_id"
                  value={newOrder.affiliate_id}
                  onChange={(e) => setNewOrder({ ...newOrder, affiliate_id: parseInt(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a doctor</option>
                  {affiliates.map((affiliate) => (
                    <option key={affiliate.id} value={affiliate.id}>
                      {affiliate.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="coupon" className="block text-sm font-medium text-gray-700">Coupon</label>
                <select
                  id="coupon"
                  value={newOrder.coupon}
                  onChange={(e) => setNewOrder({ ...newOrder, coupon: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select a coupon</option>
                  {defaultCoupons.map((coupon) => (
                      <option key={coupon} value={coupon}>
                        {coupon}
                      </option>
                    ))}
                </select>
              </div>
             


              <div>
                <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700">Customer Email</label>
                <input
                  type="email"
                  id="customer_email"
                  value={newOrder.customer_email}
                  onChange={(e) => setNewOrder({ ...newOrder, customer_email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="shipping_address" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea
                  id="shipping_address"
                  value={newOrder.shipping_address}
                  onChange={(e) => setNewOrder({ ...newOrder, shipping_address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Products</label>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    + Add Product
                  </button>
                </div>
                {newOrder.line_items.map((item, index) => (
                  <div key={index} className="flex gap-4 mb-2">
                    <div className="flex-1">
                      <select
                        value={item.product_id}
                        onChange={(e) => handleProductChange(index, 'product_id', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                      >
                        <option value="">Select a product</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} - ${p.discountedPrice.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        min="1"
                        required
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-600 hover:text-red-500"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
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
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">              
                Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                affiliate_id
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.affiliate_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <ul>
                    {order.line_items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} (SKU: {item.sku}) x {item.quantity} @ ${item.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white shadow rounded-lg p-4">
            <div className="space-y-2">
              <div>
                <span className="text-xs font-medium text-gray-500">Order ID</span>
                <p className="text-sm text-gray-900">{order.id}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Doctor</span>
                <p className="text-sm text-gray-900">{order.affiliate_id}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Products</span>
                <div className="text-sm text-gray-900">
                  <ul>
                    {order.line_items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} (SKU: {item.sku}) x {item.quantity} @ ${item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Status</span>
                <div>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Total</span>
                <p className="text-sm text-gray-900">${order.total}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Date</span>
                <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 