"use client";

import { useRef, useState } from "react";
import FormOne from "@/components/forms/formone";
import FormTwo from "@/components/forms/formtwo";
import { MdOutlineMenu } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import type { VariantOption, VariantCombination } from "@/components/variants";
import { useSidebar } from "@/contexts/sidebar-context";
import { toast } from "react-toastify";

export default function Home() {
  const formOneRef = useRef<{ reset: () => void; getValues: () => any }>(null);
  const formTwoRef = useRef<{ reset: () => void; getValues: () => any }>(null);
  const formElementRef = useRef<HTMLFormElement>(null);
  const { toggle: toggleSidebar, isOpen: isSidebarOpen } = useSidebar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    formOneRef.current?.reset();
    formTwoRef.current?.reset();
  };

  const handleFormOneSubmit = async (
    data: any,
    variantOptions: VariantOption[],
    variantCombinations: VariantCombination[],
    imageFiles: File[]
  ) => {
    setIsSubmitting(true);
    
    try {
      // Validate images
      if (imageFiles.length === 0) {
        toast.error("Please upload at least one product image");
        setIsSubmitting(false);
        return;
      }

      const formTwoValues = formTwoRef.current?.getValues();
      
      // Convert images to blobs
      const imageBlobs = await Promise.all(
        imageFiles.map(file => 
          file.arrayBuffer().then(buffer => ({
            name: file.name,
            type: file.type,
            size: file.size,
            blob: new Blob([buffer], { type: file.type })
          }))
        )
      );

      const allFormData = {
        formOne: data,
        formTwo: formTwoValues,
        variantOptions,
        variantCombinations,
        images: imageBlobs,
      };

      console.log("All Form Data:", allFormData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Product added successfully!");
      
      // Auto-reset forms after successful submission
      formOneRef.current?.reset();
      formTwoRef.current?.reset();
    } catch (error) {
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex justify-between bg-white items-center px-4 md:px-18 py-3 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {/* Hamburger/Close icon - visible on mobile, hidden on desktop */}
          <button
            onClick={toggleSidebar}
            className="md:hidden"
          >
            {isSidebarOpen ? (
              <IoClose className="text-2xl" />
            ) : (
              <MdOutlineMenu className="text-2xl" />
            )}
          </button>
          <h1 className="font-bold text-sm md:text-lg">Add New Product</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="text-xs md:text-sm bg-gray-100 px-2 py-1 md:px-4 md:py-2 border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Trigger form submission
              if (formElementRef.current && !isSubmitting) {
                formElementRef.current.requestSubmit();
              }
            }}
            disabled={isSubmitting}
            className="text-xs md:text-sm text-white px-2 py-1 md:px-4 md:py-2 border border-gray-200 rounded-lg bg-gradient-to-r from-[#B70921] to-[#032C77] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 md:gap-2"
          >
            {isSubmitting && (
              <svg className="animate-spin h-3 w-3 md:h-4 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? "Submitting..." : "Done"}
          </button>
        </div>
      </div>
      
      {/* Forms Section */}
      <div className="flex flex-col md:flex-row w-full bg-white h-full px-4 md:px-10">
        <div className="w-full md:w-[60%] md:pr-6 order-1 md:order-1">
          <FormOne ref={formOneRef} onSubmit={handleFormOneSubmit} formElementRef={formElementRef} />
        </div>
        <div className="w-full md:w-[40%] md:pl-6 order-2 md:order-2">
          <FormTwo ref={formTwoRef} />
        </div>
      </div>
    </div>
  );
}