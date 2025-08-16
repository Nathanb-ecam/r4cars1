"use client";
import { useState } from "react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Sections } from "@/models/Product";



interface ProductFormProps {
  initialProduct: any;
  onSubmit: (product: any) => void;
  onCancel: () => void;
  mode?: "create" | "edit";
}

export default function VehicleForm({ initialProduct, onSubmit, onCancel, mode = "create" }: ProductFormProps) {
  const [newProduct, setNewProduct] = useState(initialProduct);

  // ➕ Add a new section
  const handleAddSection = () => {
    setNewProduct({
      ...newProduct,
      sections: [
        ...(newProduct.sections || []),
        { title: "", desc: "", blocks: [""] },
      ],
    });
  };

  // 🗑 Remove a section
  const handleRemoveSection = (index: number) => {
    const updated = [...newProduct.sections];
    updated.splice(index, 1);
    setNewProduct({ ...newProduct, sections: updated });
  };

  // Update a section field
  const handleSectionChange = (index: number, field: keyof Sections, value: string) => {
    const updated = [...newProduct.sections];
    updated[index][field] = value;
    setNewProduct({ ...newProduct, sections: updated });
  };

  // Update a block
  const handleBlockChange = (sectionIndex: number, blockIndex: number, value: string) => {
    const updated = [...newProduct.sections];
    updated[sectionIndex].blocks[blockIndex] = value;
    setNewProduct({ ...newProduct, sections: updated });
  };

  // Add block inside a section
  const handleAddBlock = (sectionIndex: number) => {
    const updated = [...newProduct.sections];
    updated[sectionIndex].blocks.push("");
    setNewProduct({ ...newProduct, sections: updated });
  };

  // Remove block inside a section
  const handleRemoveBlock = (sectionIndex: number, blockIndex: number) => {
    const updated = [...newProduct.sections];
    updated[sectionIndex].blocks.splice(blockIndex, 1);
    setNewProduct({ ...newProduct, sections: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newProduct);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Toggle visible */}
      <ToggleSwitch
        label="visibleOnWebsite"
        title={"On website"}
        initiallyChecked={newProduct.visibleOnWebsite}
        onToggle={() =>
          setNewProduct({ ...newProduct, visibleOnWebsite: !newProduct.visibleOnWebsite })
        }
      />

      {/* Basic fields (name, description, etc.) */}
      {[
        { id: "name", label: "Name", type: "text" },
        { id: "fullName", label: "Full Name", type: "text" },
        { id: "description", label: "Description", type: "textarea" },
        { id: "price", label: "Price", type: "text" },
        { id: "transmission", label: "Transmission", type: "text" },
        { id: "kms", label: "KMS", type: "number" },
        { id: "year", label: "Year", type: "number" },
        { id: "benzineType", label: "Benzine Type", type: "text" },
        { id: "hp", label: "HP", type: "text" },
        { id: "doors", label: "Doors", type: "number" },
        { id: "motorisation", label: "Motorisation", type: "text" },
        { id: "imageUrl", label: "Image URL", type: "text" },
      ].map((field) => (
        <div key={field.id}>
          <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.id}
              value={newProduct[field.id]}
              onChange={(e) => setNewProduct({ ...newProduct, [field.id]: e.target.value })}
              className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
              required
            />
          ) : (
            <input
              type={field.type}
              id={field.id}
              value={newProduct[field.id]}
              onChange={(e) => setNewProduct({ ...newProduct, [field.id]: e.target.value })}
              className="py-2 px-3 mt-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          )}
        </div>
      ))}

      {/* Sections */}
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Sections</h3>
          <button
            type="button"
            onClick={handleAddSection}
            className="px-3 py-1 text-sm bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            + Add Section
          </button>
        </div>

        {newProduct.sections?.map((section: Sections, index: number) => (
          <div key={index} className="p-4 border rounded-lg mb-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Section {index + 1}</h4>
              <button
                type="button"
                onClick={() => handleRemoveSection(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="mt-2 space-y-2">
              <input
                type="text"
                placeholder="Title"
                value={section.title}
                onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-2 py-1"
              />
              {/* <textarea
                placeholder="Description"
                value={section.desc}
                onChange={(e) => handleSectionChange(index, "desc", e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm px-2 py-1"
              /> */}

              {/* Blocks */}
              <div className="space-y-1">
                {section.blocks.map((block, blockIndex) => (
                  <div key={blockIndex} className="flex gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Block text"
                      value={block}
                      onChange={(e) =>
                        handleBlockChange(index, blockIndex, e.target.value)
                      }
                      className="flex-1 rounded-md border-gray-300 shadow-sm px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(index, blockIndex)}
                      className="text-xs text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddBlock(index)}
                  className="mt-1 text-xs text-indigo-600"
                >
                  + Add Block
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600"
        >
          {mode === "create" ? "Create" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
