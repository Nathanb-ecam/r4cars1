"use client";

import { useState } from "react";
import ToggleSwitch from "../ui/ToggleSwitch";

export default function EmployeeForm({ initialEmployee, onSubmit, onCancel, mode }: any) {
  const [formData, setFormData] = useState(initialEmployee);

  function handleChange(e: any) {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Image URL <span className="text-xs font-normal">(Optional)</span></label>
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full border rounded-md p-2"
        />
      </div>

      <div className="flex items-center">
        <ToggleSwitch
        label="visibleOnWebsite"
        title={"On website"}
        initiallyChecked={formData.visibleOnWebsite}
        onToggle={() =>
            setFormData({ ...formData, visibleOnWebsite: !formData.visibleOnWebsite })
        }
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md">
          {mode === "create" ? "Create" : "Update"}
        </button>
      </div>
    </form>
  );
}
