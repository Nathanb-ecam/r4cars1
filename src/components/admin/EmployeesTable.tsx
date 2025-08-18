"use client";

import { useState, useEffect } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EmployeeForm from "./EmployeeForm";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { useEmployeeStore } from "@/store/employeeStore";

export default function EmployeesTable() {
    const {
    employees,
    fetchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    loading,
    error,
  } = useEmployeeStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<any | null>(null);

  // ✅ Fetch employees on load
  useEffect(() => {
    fetchEmployees();
  }, []);



  async function handleCreateEmployee(newEmployee: any) {
    await addEmployee(newEmployee);    
    setIsModalOpen(false);
    
  }

  async function handleEditEmployee(updatedEmployee: any) {
    await updateEmployee(updatedEmployee);        
    setIsEditModalOpen(false);
    setEditingEmployee(null);    
  }

  async function confirmDelete() {
    await deleteEmployee(employeeToDelete._id);
    // await fetchEmployees();
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
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
      {/* ➕ Add button */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Employee
        </button>
      </div>

      {/* 📋 Table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visible</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{emp.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{emp.role}</td>
                <td className="px-6 py-4 text-sm text-slate-900 truncate max-w-xs">{emp.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {emp.visibleOnWebsite ? "✅" : "❌"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {new Date(emp.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingEmployee(emp);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setEmployeeToDelete(emp);
                        setIsDeleteModalOpen(true);
                      }}
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

      {/* 📱 Mobile cards */}
      <div className="md:hidden space-y-4">
        {employees.map((emp) => (
          <div key={emp._id} className="bg-white shadow rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-slate-900">{emp.fullName}</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingEmployee(emp);
                    setIsEditModalOpen(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    setEmployeeToDelete(emp);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{emp.role}</p>
            <p className="text-sm text-gray-600">{emp.description}</p>
          </div>
        ))}
      </div>

      {/* ➕ Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Employee</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                ✕
              </button>
            </div>
            <EmployeeForm
              initialEmployee={{ fullName: "", role: "", description: "", imageUrl: "", visibleOnWebsite: false }}
              onSubmit={handleCreateEmployee}
              onCancel={() => setIsModalOpen(false)}
              mode="create"
            />
          </div>
        </div>
      )}

      {/* ✏️ Edit Modal */}
      {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Employee</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                ✕
              </button>
            </div>
            <EmployeeForm
              initialEmployee={editingEmployee}
              onSubmit={handleEditEmployee}
              onCancel={() => setIsEditModalOpen(false)}
              mode="edit"
            />
          </div>
        </div>
      )}

      {/* 🗑️ Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Employee"
        itemName={`the employee "${employeeToDelete?.fullName}"`}
      />
    </div>
  );
}
