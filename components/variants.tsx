"use client";

import React, { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { RxDragHandleDots2 } from "react-icons/rx";

export type VariantOption = { name: string; values: string[] };
export type VariantCombination = {
  variantName: string;
  mrp: number;
  offerPercent: number;
  sellingPrice: number;
  weight: number;
  inventory: number;
};

interface VariantsProps {
  onOptionsChange?: (opts: VariantOption[]) => void;
  onCombinationsChange?: (combos: VariantCombination[]) => void;
}

export default function Variants({ onOptionsChange, onCombinationsChange }: VariantsProps) {
  const [showVariantsPanel, setShowVariantsPanel] = useState(false);
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([]);
  const [selectedOptionName, setSelectedOptionName] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [variantCombinations, setVariantCombinations] = useState<VariantCombination[]>([]);
  const [bulkEdit, setBulkEdit] = useState(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const presetSizes = ["3", "4", "5", "6", "7", "8", "9", "10"];
  const presetColors = ["Red", "White", "Blue", "Black"];
  const optionChoices = ["Size UK", "Size US", "Color"];

  /* -------------------------------------------------------------------
      EFFECTS
  ------------------------------------------------------------------- */
  useEffect(() => {
    if (variantOptions.length > 0) {
      generateCombinations();
    } else {
      setVariantCombinations([]);
    }

    onOptionsChange?.(variantOptions);
  }, [variantOptions]);

  useEffect(() => {
    onCombinationsChange?.(variantCombinations);
  }, [variantCombinations]);

  /* -------------------------------------------------------------------
      HELPERS
  ------------------------------------------------------------------- */
  const calculateSellingPrice = (mrp: number, offerPercent: number) => {
    return Math.round((mrp - (mrp * offerPercent) / 100) * 100) / 100;
  };

  const generateCombinations = () => {
    if (variantOptions.length === 0) return;

    const combinations: string[] = [];

    const generate = (index: number, current: string[]) => {
      if (index === variantOptions.length) {
        combinations.push(current.join(" + "));
        return;
      }

      const option = variantOptions[index];
      for (const value of option.values) {
        generate(index + 1, [...current, `${option.name} ${value}`]);
      }
    };

    generate(0, []);

    const combos = combinations.map(name => ({
      variantName: name,
      mrp: 2160,
      offerPercent: 0,
      sellingPrice: 2160,
      weight: 0,
      inventory: 100,
    }));

    setVariantCombinations(combos);
  };



  const toggleValue = (value: string) => {
    setSelectedValues(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const addOption = () => {
    if (!selectedOptionName || selectedValues.length === 0) return;

    setVariantOptions(prev => {
      const exists = prev.find(o => o.name === selectedOptionName);

      if (exists) {
        return prev.map(o =>
          o.name === selectedOptionName
            ? { ...o, values: [...new Set([...o.values, ...selectedValues])] }
            : o
        );
      }

      return [...prev, { name: selectedOptionName, values: selectedValues }];
    });

    setSelectedOptionName("");
    setSelectedValues([]);
  };

  const removeOption = (index: number) => {
    setVariantOptions(prev => prev.filter((_, i) => i !== index));
  };

  const updateCombination = (
    index: number,
    field: keyof VariantCombination,
    value: string | number
  ) => {
    setVariantCombinations(prev => {
      const updated = [...prev];
      const item = { ...updated[index] };

      const numValue = typeof value === "string" ? Number(value) : value;

      switch (field) {
        case "mrp":
          item.mrp = numValue;
          break;
        case "offerPercent":
          item.offerPercent = numValue;
          break;
        case "weight":
          item.weight = numValue;
          break;
        case "inventory":
          item.inventory = numValue;
          break;
        case "sellingPrice":
          item.sellingPrice = numValue;
          break;
        case "variantName":
          if (typeof value === "string") item.variantName = value;
          break;
      }

      if (field === "mrp" || field === "offerPercent") {
        item.sellingPrice = calculateSellingPrice(item.mrp, item.offerPercent);
      }

      updated[index] = item;
      return updated;
    });
  };

  const availableOptions = optionChoices.filter(
    opt => !variantOptions.some(v => v.name === opt)
  );

  const shouldShowBoxes =
    selectedOptionName !== "" ||
    (variantOptions.length > 0 && variantCombinations.length > 0);

  // Helper function to format variant name with line breaks
  const formatVariantName = (name: string) => {
    return name.split(" + ").map((part, index, array) => (
      <React.Fragment key={index}>
        {part}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="w-full max-w-4xl pt-4 border bg-white border-gray-300 rounded-lg">
      <div>
        <label className=" ml-4 font-semibold text-gray-600">
          Variants
        </label>

        {!showVariantsPanel ? (
         <div className="px-4"> <button
            onClick={() => setShowVariantsPanel(true)}
            className={`w-full   bg-gray-100 mb-4  px-4 py-3 mt-2 rounded-lg text-left hover:bg-gray-100 transition-colors`}
          >
            <div className="flex justify-between items-center ">
              <span className="text-sm font-medium text-gray-700 flex gap-2 items-center">
                <CiCirclePlus size={20} /> Add options, colors, size etc.
              </span>
            </div>
          </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 mb-4">

            {/* Option Name Header */}
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm ml-6 font-semibold  text-gray-600">
                Option Name
              </h3>
            </div>

            {/* Option Selector */}
            <div className="mb-4 flex gap-2">
              <RxDragHandleDots2 size={20} className="text-red-700 mt-2" />
              <select
                value={selectedOptionName}
                onChange={(e) => {
                  setSelectedOptionName(e.target.value);
                  setSelectedValues([]);

                  const found = variantOptions.find(o => o.name === e.target.value);
                  setSelectedValues(found?.values || []);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm outline-none focus:border-gray-400 bg-gray-100 pr-20"
              >
                <option value="">Select an option type</option>

                {availableOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}

                {variantOptions.map(opt => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* SELECTED OPTION NAME ABOVE BOXES */}
            {selectedOptionName && (
              <p className="text-sm font-semibold text-gray-600 ml-6 mb-3">
                {selectedOptionName}
              </p>
            )}

            {/* SHOW BOXES WHEN SHOULD */}
            {shouldShowBoxes && (
              <div className="mb-6">
                {["Size UK", "Size US"].includes(selectedOptionName) && (
                  <div className="flex">
                    <RxDragHandleDots2 size={20} className="text-red-700 mt-2" />
                    <div className="grid grid-cols-8 gap-2 mb-4 ml-2">
                      {presetSizes.map(size => (
                        <button
                          key={size}
                          onClick={() => toggleValue(size)}
                          className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                            selectedValues.includes(size)
                              ? "bg-blue-200 text-blue-600 border-blue-100"
                              : "bg-gray-100 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedOptionName === "Color" && (
                  <div className="flex gap-2 mb-4 ml-6">
                    {presetColors.map(color => (
                      <button
                        key={color}
                        onClick={() => toggleValue(color)}
                        className={`px-4 py-2 bg-white border rounded-md text-sm transition ${
                          selectedValues.includes(color)
                            ? "bg-blue-200 text-blue-600 border-blue-100"
                            : "bg-gray-100 border-gray-300"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                )}

                {/* ADD BUTTON */}
                {selectedOptionName && (
                  <div className="flex gap-2 ml-6">
                    <button
                      onClick={addOption}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* VARIANT TABLE */}
            {variantOptions.length > 0 && variantCombinations.length > 0 && (
              <div className="border-b border-gray-200 overflow-x-auto">
                <table className="w-full text-sm min-w-full">
                  <thead className="bg-gray-100 text-gray-400">
                    <tr>
                      <th className="text-left p-3 min-w-[100px]">Variant</th>
                      <th className="text-left p-3">MRP</th>
                      <th className="text-left p-3">Off</th>
                      <th className="text-left p-3">Selling Price</th>
                      {bulkEdit && (
                        <th className="text-left p-3">Weight</th>
                      )}
                      <th className="text-right p-3">
                        <button
                          onClick={() => setBulkEdit(!bulkEdit)}
                          className={`px-3 py-1 rounded text-sm text-white ${
                            bulkEdit ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {bulkEdit ? "Done" : "Bulk Edit"}
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {variantCombinations.map((combo, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 align-top min-w-[100px]">
                          <div className="text-xs break-words leading-tight whitespace-normal">
                            {formatVariantName(combo.variantName)}
                          </div>
                        </td>

                        <td className="p-3 align-top">
                          {bulkEdit || editingRow === index ? (
                            <div className="flex flex-col gap-2">
                              <input
                                type="number"
                                value={combo.mrp}
                                onChange={(e) =>
                                  updateCombination(index, "mrp", e.target.value)
                                }
                                className="w-24 border rounded px-2 py-1 text-sm"
                                placeholder="MRP"
                              />
                              {!bulkEdit && (
                                <input
                                  type="number"
                                  value={combo.offerPercent}
                                  onChange={(e) =>
                                    updateCombination(
                                      index,
                                      "offerPercent",
                                      e.target.value
                                    )
                                  }
                                  className="w-20 border rounded px-2 py-1 text-sm"
                                  placeholder="Off %"
                                />
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-medium">
                                ₹{combo.mrp}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Off Column - Only show when NOT in edit mode */}
                        {!bulkEdit && editingRow !== index && (
                          <td className="p-3 align-top">
                            <div className="text-sm">
                              {combo.offerPercent > 0 ? `${combo.offerPercent}%` : "-"}
                            </div>
                          </td>
                        )}

                        {/* Off input in edit mode - shown in MRP column when editing */}
                        {(bulkEdit || editingRow === index) && (
                          <td className="p-3 align-top">
                            {bulkEdit && (
                              <input
                                type="number"
                                value={combo.offerPercent}
                                onChange={(e) =>
                                  updateCombination(
                                    index,
                                    "offerPercent",
                                    e.target.value
                                  )
                                }
                                className="w-20 border rounded px-2 py-1 text-sm"
                                placeholder="%"
                                min="0"
                                max="100"
                              />
                            )}
                          </td>
                        )}

                        <td className="p-3 align-top">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-blue-600">
                              ₹{calculateSellingPrice(combo.mrp, combo.offerPercent)}
                            </span>
                            {combo.offerPercent > 0 && (
                              <span className="text-xs text-green-600">
                                Save ₹{(combo.mrp - calculateSellingPrice(combo.mrp, combo.offerPercent)).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Weight Column - Only show during bulk edit */}
                        {bulkEdit && (
                          <td className="p-3 align-top">
                            <input
                              type="number"
                              value={combo.weight}
                              onChange={(e) =>
                                updateCombination(index, "weight", e.target.value)
                              }
                              className="w-20 border rounded px-2 py-1 text-sm"
                              step="0.1"
                              min="0"
                              placeholder="kg"
                            />
                          </td>
                        )}

                        <td className="p-3 align-top text-right">
                          {!bulkEdit && (
                            <button
                              onClick={() =>
                                setEditingRow(
                                  editingRow === index ? null : index
                                )
                              }
                              className="text-gray-600 hover:text-blue-600"
                              title={editingRow === index ? "Save" : "Edit"}
                            >
                              <MdModeEdit size={18} />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowVariantsPanel(false)}
                className="text-[12px] bg-gray-100 px-3 border border-gray-200 py-1 rounded-xl mr-2 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowVariantsPanel(false)}
                className="text-[12px] text-white px-3 border border-gray-200 py-1 rounded-xl bg-gradient-to-r from-[#B70921] to-[#032C77] hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}