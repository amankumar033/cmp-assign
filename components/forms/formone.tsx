// app/page.tsx or wherever your FormOne is
"use client";

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { MdKeyboardArrowDown } from "react-icons/md";
import Variants, { VariantOption, VariantCombination } from "@/components/variants";
import { toast } from "react-toastify";

type FormValues = {
  title: string;
  category: string;
  subCategory: string;
  description: string;
  images: File[];
  mrp: number;
  offer: string;
  sellingPrice: number;
  variants: string;
};

interface FormOneProps {
  onSubmit?: (data: FormValues, variantOptions: VariantOption[], variantCombinations: VariantCombination[], imageFiles: File[]) => void;
  formElementRef?: React.RefObject<HTMLFormElement | null>;
}

interface FormOneRef {
  reset: () => void;
  getValues: () => FormValues;
}

const FormOne = forwardRef<FormOneRef, FormOneProps>(({ onSubmit, formElementRef }, ref) => {
  const { register, handleSubmit, setValue, watch, reset, getValues, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      offer: "0% Off"
    }
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<VariantCombination[]>([]);
  
  // Dependent subcategories based on category
  const categorySubcategories: Record<string, string[]> = {
    football: ["Football", "Football Boots", "Football Jerseys", "Football Accessories"],
    cricket: ["Cricket Bats", "Cricket Balls", "Cricket Pads", "Cricket Gloves"],
    badminton: ["Badminton Rackets", "Shuttlecocks", "Badminton Shoes", "Badminton Accessories"]
  };

  const mrp = watch("mrp");
  const offer = watch("offer");
  const sellingPrice = watch("sellingPrice");
  const selectedCategory = watch("category");

  // Reset subcategory when category changes
  useEffect(() => {
    if (selectedCategory) {
      setValue("subCategory", "");
    }
  }, [selectedCategory, setValue]);

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    reset: () => {
      reset();
      setImageFiles([]);
      setVariantOptions([]);
      setVariantCombinations([]);
    },
    getValues: () => getValues()
  }));

  // Auto calculate selling price whenever mrp or offer changes
  useEffect(() => {
    if (mrp && offer) {
      const off = Number(offer.replace("% Off", ""));
      const calculatedPrice = mrp - (mrp * off) / 100;
      setValue("sellingPrice", Number(calculatedPrice.toFixed(2)));
    }
  }, [mrp, offer, setValue]);

  // Manual selling price → adjust offer%
  const onManualPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    const manualPrice = parseFloat(e.target.value);
    if (mrp && manualPrice && !isNaN(manualPrice)) {
      const discountPercent = ((mrp - manualPrice) / mrp) * 100;
      if (discountPercent >= 0 && discountPercent <= 100) {
        const roundedDiscount = Math.round(discountPercent);
        setValue("offer", `${roundedDiscount}% Off`);
      } else {
        setValue("offer", "0% Off");
      }
    }
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      
      // Validate file types (jpg, png, webp only)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
      
      if (invalidFiles.length > 0) {
        toast.error(`Invalid file type. Only JPG, PNG, and WEBP images are allowed.`);
        return;
      }
      
      // Validate file size (max 5MB per file)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      const oversizedFiles = files.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        toast.error(`File size exceeds 5MB limit. Please upload smaller images.`);
        return;
      }
      
      if (files.length + imageFiles.length > 10) {
        toast.error("Maximum 10 images allowed");
        return;
      }
      
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);
      setValue("images", newFiles);
    }
  };

  // Remove image handler
  const removeImage = (index: number) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setValue("images", newFiles);
  };

  // Handle click on the entire image upload area
  const handleImageAreaClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get border class based on field value
  const getBorderClass = (fieldValue: any) => {
    if (fieldValue) {
      return "border-gray-200";
    }
    return "border-gray-100";
  };

  // Get background class based on field value
  const getBgClass = (fieldValue: any) => {
    if (fieldValue) {
      return "bg-white";
    }
    return "bg-white";
  };

  // Get text color class based on field value
  const getTextClass = (fieldValue: any) => {
    if (fieldValue) {
      return "text-black";
    }
    return "text-gray-400";
  };

  const handleFormSubmit = (data: FormValues) => {
    // Validate images
    if (imageFiles.length === 0) {
      // Scroll to image section
      const imageSection = document.querySelector('[data-image-section]');
      if (imageSection) {
        imageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (onSubmit) {
      onSubmit(data, variantOptions, variantCombinations, imageFiles);
    }
  };

  const handleFormError = (errors: any) => {
    // Scroll to first error
    const firstError = document.querySelector('.border-red-500');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Check if images are missing
    if (imageFiles.length === 0) {
      const imageSection = document.querySelector('[data-image-section]');
      if (imageSection) {
        imageSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <form
      ref={formElementRef}
      onSubmit={handleSubmit(handleFormSubmit, handleFormError)}
      className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6"
      id="form-one"
    >
      <div className="border border-gray-300 rounded-lg">
        {/* Title */}
        <div className="px-4 py-2">
          <label className="font-medium text-gray-600">
            Title<span className="text-red-700 text-[18px]">*</span>
          </label>
          <input
            type="text"
            {...register("title", { 
              required: "Title is required",
              maxLength: { value: 150, message: "Title must be less than 150 characters" }
            })}
            placeholder="Add product title"
            maxLength={150}
            className={`w-full mt-1 ${getBorderClass(watch("title"))} rounded-lg px-3 py-2 focus:outline-none  border ${errors.title ? "border-red-500" : "border-gray-300"} focus:border-gray-400 ${getBgClass(watch("title"))} ${getTextClass(watch("title"))}`}
            aria-label="Product title"
            aria-required="true"
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-red-500 text-sm mt-1" role="alert">{errors.title.message as string}</p>
          )}
        </div>

        {/* Category + Subcategory */}
        <div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <div className="relative">
              <label className="font-medium text-gray-600">
                Category<span className="text-red-700 text-[18px]">*</span>
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                defaultValue=""
                className={`w-full mt-1 ${getBorderClass(watch("category"))} border ${errors.category ? "border-red-500" : "border-gray-100"} rounded-lg appearance-none px-3 py-2 focus:outline-none focus:border-gray-300 cursor-pointer ${getBgClass(watch("category"))} ${getTextClass(watch("category"))}`}
                aria-label="Category"
                aria-required="true"
                aria-invalid={errors.category ? "true" : "false"}
              >
                <option value="" disabled className="bg-white text-gray-400">
                  Select category
                </option>
                <option value="football" className="bg-white text-black hover:bg-gray-200">
                  Football
                </option>
                <option value="cricket" className="bg-white text-black hover:bg-gray-200">
                  Cricket
                </option>
                <option value="badminton" className="bg-white text-black hover:bg-gray-200">
                  Badminton
                </option>
              </select>
              <MdKeyboardArrowDown className="absolute right-2 top-[65%] -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message as string}</p>
            )}
          </div>

          {/* Subcategory */}
          <div>
            <div className="relative">
              <label className="font-medium text-gray-600">
                Sub-Category<span className="text-red-700 text-[18px]">*</span>
              </label>
              <select
                {...register("subCategory", { required: "Sub-category is required" })}
                defaultValue=""
                className={`w-full mt-1 border ${errors.subCategory ? "border-red-500" : "border-gray-300"} ${getBorderClass(watch("subCategory"))} rounded-lg appearance-none px-3 py-2 focus:outline-none focus:border-gray-300 cursor-pointer ${getBgClass(watch("subCategory"))} ${getTextClass(watch("subCategory"))}`}
                disabled={!selectedCategory}
                aria-label="Sub-category"
                aria-required="true"
                aria-invalid={errors.subCategory ? "true" : "false"}
              >
                <option value="" disabled className="bg-white text-gray-400">
                  {selectedCategory ? "Select sub-category" : "Select category first"}
                </option>
                {selectedCategory && categorySubcategories[selectedCategory]?.map((subCat: string) => (
                  <option key={subCat} value={subCat.toLowerCase().replace(/\s+/g, '-')} className="bg-white text-black hover:bg-gray-200">
                    {subCat}
                  </option>
                ))}
              </select>
              <MdKeyboardArrowDown
                size={20}
                className="absolute right-2 top-[45%] translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
            {errors.subCategory && (
              <p className="text-red-500 text-sm mt-1">{errors.subCategory.message as string}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="px-4 py-2">
          <label className="font-medium text-gray-600">
            Description<span className="text-red-700">*</span>
          </label>
          <textarea
            {...register("description", { required: "Description is required" })}
            placeholder="Enter product description"
            className={`w-full mt-1 h-32 border ${errors.description ? "border-red-500" : "border-gray-300"} ${getBorderClass(watch("description"))} rounded-lg px-3 py-2 focus:outline-none focus:border-gray-300 resize-none ${getBgClass(watch("description"))} ${getTextClass(watch("description"))}`}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message as string}</p>
          )}
        </div>

        {/* Product Images */}
        <div className="px-4 py-4 relative" data-image-section>
          <label className="font-medium text-gray-600">
            Product Images<span className="text-red-700 ">*</span>
          </label>

          {/* Counter */}
          <div className="absolute top-3 right-4 bg-gray-300 text-black text-sm px-2 py-1 rounded-full">
            {imageFiles.length}/10
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Upload Area */}
          <div
            onClick={handleImageAreaClick}
            className={`mt-2 border ${imageFiles.length === 0 ? "border-gray-300" : "border-gray-300"} rounded-lg cursor-pointer hover:border-gray-200 transition-colors`}
          >
            {imageFiles.length === 0 ? (
              <div className="flex items-center justify-center flex-col p-8 bg-white text-center">
                <img src="icons/files.png" alt="" className="w-5 h-5"/>
                <p className="text-red-600 mb-1 text-sm font-medium">
                  Add Media
                </p>
                <p className="text-gray-400 text-xs">
                  upload images and video of any product.
                </p>
                
              </div>
            ) : (
              <div className="p-4">
                <div className="grid grid-cols-6 grid-rows-2 gap-2 h-[270px]">
                  {/* First Image */}
                  <div className="col-span-2 row-span-2 relative">
                    <div className="w-full h-full overflow-hidden rounded-lg border border-gray-100">
                      <img
                        src={URL.createObjectURL(imageFiles[0])}
                        className="w-full h-full object-cover"
                        alt="Product main"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(0);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                    >
                      ×
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      1
                    </div>
                  </div>

                  {/* Remaining images */}
                  {Array.from({ length: 4 }).map((_, index) => {
                    const imgIndex = index + 1;
                    if (imgIndex < imageFiles.length) {
                      return (
                        <div key={imgIndex} className="relative">
                          <div className="w-full h-full overflow-hidden rounded-lg border border-gray-100">
                            <img
                              src={URL.createObjectURL(imageFiles[imgIndex])}
                              className="w-full h-full object-cover"
                              alt={`Product ${imgIndex + 1}`}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(imgIndex);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {imgIndex + 1}
                          </div>
                        </div>
                      );
                    } else if (imgIndex === imageFiles.length && imageFiles.length < 10) {
                      return (
                        <div
                          key="add-more"
                          className="relative"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <label className="cursor-pointer block w-full h-full">
                            <div className="w-full h-full border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50">
                              <div className="text-2xl text-gray-400">+</div>
                              <div className="text-xs text-gray-500 mt-1">
                                Add more
                              </div>
                            </div>
                            <input
                              type="file"
                              multiple
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                      );
                    } else {
                      return <div key={index}></div>;
                    }
                  })}
                </div>

                {/* Additional images beyond 5 */}
                {imageFiles.length > 5 && (
                  <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex flex-wrap gap-2">
                      {imageFiles.slice(5).map((img, idx) => {
                        const imgIndex = idx + 5;
                        return (
                          <div key={imgIndex} className="relative w-20 h-20">
                            <div className="w-full h-full overflow-hidden rounded-lg border border-gray-100">
                              <img
                                src={URL.createObjectURL(img)}
                                className="w-full h-full object-cover"
                                alt={`Product ${imgIndex + 1}`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(imgIndex)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs hover:bg-red-600 z-10"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
                              {imgIndex + 1}
                            </div>
                          </div>
                        );
                      })}
                      {imageFiles.length < 10 && (
                        <label className="cursor-pointer">
                          <div className="w-20 h-20 border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50">
                            <div className="text-xl text-gray-400">+</div>
                            <div className="text-[10px] text-gray-500 mt-1">
                              Add
                            </div>
                          </div>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="border border-gray-300 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MRP */}
        <div>
          <label className="font-medium text-gray-600">MRP</label>
          <input
            type="number"
            {...register("mrp")}
            placeholder="₹ 0"
            className={`w-full mt-1 border border-gray-300 ${getBorderClass(mrp)} rounded-lg px-3 py-2 focus:outline-none focus:border-gray-300 ${getBgClass(mrp)} ${getTextClass(mrp)}`}
          />
        </div>

        {/* Offer */}
        <div className="relative">
          <label className="font-medium text-gray-600">Offer</label>
          <select
            {...register("offer")}
            className={`w-full mt-1 border border-gray-300 ${getBorderClass(offer)} rounded-lg px-3 py-2 focus:outline-none appearance-none focus:border-gray-300 ${getBgClass(offer)} ${getTextClass(offer)}`}
          >
            <option value="0% Off" className="bg-white text-black hover:bg-gray-200">
              0% Off
            </option>
            <option value="10% Off" className="bg-white text-black hover:bg-gray-200">
              10% Off
            </option>
            <option value="12% Off" className="bg-white text-black hover:bg-gray-200">
              12% Off
            </option>
            <option value="50% Off" className="bg-white text-black hover:bg-gray-200">
              50% Off
            </option>
          </select>
          <MdKeyboardArrowDown className="absolute right-2 top-[65%] -translate-y-1/2 text-gray-500 pointer-events-none" />
        </div>

        {/* Selling Price */}
        <div>
          <label className="font-medium text-gray-600">Selling Price</label>
          <input
            type="text"
            {...register("sellingPrice")}
            onChange={(e) => {
              onManualPrice(e);
            }}
            placeholder="₹ 0"
            aria-label="Selling price"
            className={`w-full mt-1 border border-gray-300 ${getBorderClass(sellingPrice)} rounded-lg px-3 py-2 focus:outline-none focus:border-gray-300 ${getBgClass(sellingPrice)} ${getTextClass(sellingPrice)}`}
          />
        </div>
      </div>

      {/* Variants Component */}
      <Variants 
        onOptionsChange={setVariantOptions}
        onCombinationsChange={setVariantCombinations}
      />
    </form>
  );
});

FormOne.displayName = "FormOne";

export default FormOne;