import { Employee } from "@/models/Employee";
import { create } from "zustand";


interface EmployeeStore {
  employees: Employee[];
  loading: boolean;
  error: string | null;

  getEmployees: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Employee) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  loading: false,
  error: null,

  // 🔹 Fetch all employees
  getEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      set({ employees: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },


  // 🔹 Fetch all employees ADMIN 
  fetchEmployees: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/admin/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      set({ employees: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  // 🔹 Add employee
  addEmployee: async (employee) =>  {
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });
      if (!res.ok) throw new Error("Failed to add employee");
      await get().fetchEmployees();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 🔹 Update employee
  updateEmployee: async (employee) => {
    if (!employee._id) return;
    try {
      const res = await fetch(`/api/admin/employees/${employee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      });
      if (!res.ok) throw new Error("Failed to update employee");
      await get().fetchEmployees();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 🔹 Delete employee
  deleteEmployee: async (id) => {
    try {
      const res = await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete employee");
      await get().fetchEmployees();
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
