'use client';

import { useState } from 'react';
import OrdersTable from '@/components/admin/OrdersTable';
import DoctorsTable from '@/components/admin/DoctorsTable';
import StockTable from '@/components/admin/StockTable';
import ProductsTable from '@/components/admin/ProductsTable';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders');

  const tabs = [
    { id: 'orders', label: 'Orders' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'stock', label: 'Stock' },
    { id: 'products', label: 'Products' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-8">
        {activeTab === 'orders' && <OrdersTable />}
        {activeTab === 'doctors' && <DoctorsTable />}
        {activeTab === 'stock' && <StockTable />}
        {activeTab === 'products' && <ProductsTable />}
      </div>
    </div>
  );
} 