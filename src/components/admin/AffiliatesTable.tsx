import { useEffect, useState } from 'react';
import { UserModel } from '@/models/User';
import { env } from '@/config/env';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  ref_codes: Array<string>;
  tags: Array<string>;
  coupons: Array<string>;
  createdAt: string;
}

export default function AffiliatesTable() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [affiliateToDelete, setAffiliateToDelete] = useState<Affiliate | null>(null);
  const [newAffiliates, setNewAffiliates] = useState({
    name: '',
    email: '',
    tag:'',
    ref_code: '',    
    status:'approved'
  });

  useEffect(() => {
    fetchAffiliates();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const response = await fetch(`/api/admin/affiliates`);
      if (!response.ok) throw new Error('Failed to fetch affiliates');
      const data = await response.json();
      console.log("FETCHED AFFILIATES")
      console.log(data)
      // setAffiliates(data);
      setAffiliates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAffiliates = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAffiliates),
      });

      if (!response.ok) throw new Error('Failed to create doctor');
      
      await fetchAffiliates();
      setIsModalOpen(false);
      setNewAffiliates({ name: '', email: '',tag:'',ref_code:'', status:'approved'});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteAffiliate = async (affiliate_id: string) => {
    const affiliate = affiliates.find(a => a.id === affiliate_id);
    if (!affiliate) return;
    
    setAffiliateToDelete(affiliate);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!affiliateToDelete) return;

    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },        
      });

      if (!response.ok) throw new Error('Failed to delete affiliate');
      
      await fetchAffiliates();
      setIsDeleteModalOpen(false);
      setAffiliateToDelete(null);
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
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Affiliate
        </button>
      </div>

      {/* Create Affiliate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add New Affiliate</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateAffiliates} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  value={newAffiliates.name}
                  onChange={(e) => setNewAffiliates({ ...newAffiliates, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={newAffiliates.email}
                  onChange={(e) => setNewAffiliates({ ...newAffiliates, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Tag</label>
                <input
                  type="text"
                  id="tag"
                  value={newAffiliates.tag}
                  onChange={(e) => setNewAffiliates({ ...newAffiliates, tag: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="ref_code" className="block text-sm font-medium text-gray-700">Referral code</label>
                <input
                  type="text"
                  id="ref_code"
                  value={newAffiliates.ref_code}
                  onChange={(e) => setNewAffiliates({ ...newAffiliates, ref_code: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
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
                  className="px-4 py-2 text-sm font-medium text-white bg-lime-500 border border-transparent rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
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
          setAffiliateToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Affiliate"
        itemName={`the affiliate "${affiliateToDelete?.name}"`}
      />

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Id
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ref Codes
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registered
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
              </th>

            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {affiliates.map((affiliate) => (
              <tr key={affiliate.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {affiliate.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {affiliate.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {JSON.stringify(affiliate.ref_codes)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {JSON.stringify(affiliate.tags)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(affiliate.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleDeleteAffiliate(affiliate.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete affiliate"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {affiliates.map((affiliate) => (
          <div key={affiliate.id} className="bg-white shadow rounded-lg p-4">
            <div className="space-y-2">
              <div className='flex justify-between items-center'>
                <div>
                  <span className="text-xs font-medium text-gray-500">Id</span>
                  <p className="text-sm text-gray-900">{affiliate.id}</p>
                </div>
                <button
                      onClick={() => handleDeleteAffiliate(affiliate.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete order"
                    >
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                </button>   
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Name</span>
                <p className="text-sm text-gray-900">{affiliate.name}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Email</span>
                <p className="text-sm text-gray-900">{affiliate.email}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Ref_codes</span>
                <p className="text-sm text-gray-900">{JSON.stringify(affiliate.ref_codes)}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Tags</span>
                <p className="text-sm text-gray-900">{JSON.stringify(affiliate.tags)}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500">Registered</span>
                <p className="text-sm text-gray-900">{new Date(affiliate.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 