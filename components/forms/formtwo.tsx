"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface ProductOrganizationFormData {
  brandManufacturer: string;
  warranty: string;
  sellerName: string;
  tags: string[];
  materialCareInstructions: string;
  productWeight: string;
  weightUnit: string;
  stockQuantity: string;
}

interface ProductOrganizationFormRef {
  reset: () => void;
  getValues: () => ProductOrganizationFormData;
}

const ProductOrganizationForm = forwardRef<ProductOrganizationFormRef>((props, ref) => {
  const defaultFormData: ProductOrganizationFormData = {
    brandManufacturer: "Adidas",
    warranty: "12 Months",
    sellerName: "Sagar Sports Club",
    tags: ["Shoes", "💹"],
    materialCareInstructions: "",
    productWeight: "0.700",
    weightUnit: "Kg",
    stockQuantity: "100",
  };

  const [formData, setFormData] = useState<ProductOrganizationFormData>(defaultFormData);

  const [newTag, setNewTag] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      setFormData(defaultFormData);
      setNewTag("");
    },
    getValues: () => formData
  }));

  const handleInputChange = (field: keyof ProductOrganizationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const materialCareOptions = [
    "Wash with similar colors",
    "Dry flat",
    "Do not bleach",
    "Iron on low heat",
    "Dry clean only",
    "Hand wash only",
  ];

  const warrantyOptions = [
    "3 Months",
    "6 Months",
    "12 Months",
    "18 Months",
    "24 Months",
    "No Warranty"
  ];

  const weightUnits = ["Kg", "Gram", "Pound", "Ounce"];

  return (
    <div className="w-full max-w-4xl bg-white rounded-lg mx-auto p-4 md:p-6">

     
        <div className=" pt-0 space-y-3">
            <div className="border border-gray-300 px-4 rounded-lg">
      {/* Header */}
      
      <div  >
        <h3 className="text-lg font-semibold text-gray-800 my-5">Product Organization</h3>
        
      </div>
          {/* Brand Manufacturer Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand Manufacturer
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.brandManufacturer}
                onChange={(e) => handleInputChange("brandManufacturer", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FiChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* Warranty Section - Single row */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Warranty
            </label>
            <div className="relative">
              <select
                value={formData.warranty}
                onChange={(e) => handleInputChange("warranty", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                {warrantyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <FiChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* Seller Name Section - Single row */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seller Name
            </label>
            <input
              type="text"
              value={formData.sellerName}
              onChange={(e) => handleInputChange("sellerName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags Section with border */}
          <div className=" rounded-md ">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tags
            </label>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 px-3 mt-3 bg-gray-100 border border-gray-200 rounded-full"
                >
                  <span className="text-sm text-gray-700">{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-gray-600 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          </div>

          {/* Material and Care Section with border */}
          <div className="border border-gray-300 rounded-lg">
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Material and Care
            </label>
            <div className="relative">
              <select
                value={formData.materialCareInstructions}
                onChange={(e) => handleInputChange("materialCareInstructions", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="">Select Instructions</option>
                {materialCareOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                <FiChevronDown size={18} />
              </div>
            </div>
          </div>

          {/* Product Weight Section with border and dropdown */}
          <div className="px-4 pb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.001"
                value={formData.productWeight}
                onChange={(e) => handleInputChange("productWeight", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="relative w-32">
                <select
                  value={formData.weightUnit}
                  onChange={(e) => handleInputChange("weightUnit", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  {weightUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FiChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Stock Quantity Section with border */}
          <div className="border border-gray-300 rounded-md p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={formData.stockQuantity}
              onChange={(e) => handleInputChange("stockQuantity", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
     
    </div>
  );
});

ProductOrganizationForm.displayName = "ProductOrganizationForm";

export default ProductOrganizationForm;