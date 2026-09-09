import React, { useState, useEffect } from "react";
import { useSearch } from "../hooks/useSearch";
import { Slider } from "@mui/material";

export default function ProductFilters() {
  const { filters, applyFilters, error, filteredProducts } = useSearch();
  const [localFilters, setLocalFilters] = useState(filters);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [ramOptions, setRamOptions] = useState([]);
  const [storageOptions, setStorageOptions] = useState([]);

  // Update local filters when context filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Get unique categories, brands, RAM, and storage options from products
  useEffect(() => {
    try {
      const uniqueCategories = [...new Set(filteredProducts.map(p => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
      
      const uniqueBrands = [...new Set(filteredProducts.map(p => p.brand))].filter(Boolean);
      setBrands(uniqueBrands);
      
      // Extract RAM options from specifications
      const ramSet = new Set();
      const storageSet = new Set();
      filteredProducts.forEach(product => {
        if (product.specifications?.ram) {
          const ram = product.specifications.ram;
          if (Array.isArray(ram)) {
            ram.forEach(r => ramSet.add(r));
          } else {
            ramSet.add(ram);
          }
        }
        if (product.specifications?.storage) {
          const storage = product.specifications.storage;
          if (Array.isArray(storage)) {
            storage.forEach(s => storageSet.add(s));
          } else {
            storageSet.add(storage);
          }
        }
        // Also check variants
        if (product.variants) {
          product.variants.forEach(variant => {
            if (variant.ram) ramSet.add(variant.ram);
            if (variant.storage) storageSet.add(variant.storage);
          });
        }
      });
      setRamOptions([...ramSet]);
      setStorageOptions([...storageSet]);
    } catch (err) {
      console.error("Error getting filter options:", err);
    }
  }, [filteredProducts]);

  const handlePriceRangeChange = (e, index) => {
    const newPriceRange = [...localFilters.priceRange];
    newPriceRange[index] = Number(e.target.value);
    setLocalFilters({ ...localFilters, priceRange: newPriceRange });
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleMultiSelectChange = (name, value) => {
    const currentValues = localFilters[name] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    setLocalFilters({
      ...localFilters,
      [name]: newValues,
    });
  };

  const applyFilterChanges = () => {
    try {
      applyFilters(localFilters);
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      priceRange: [0, 2000],
      rating: 0,
      category: "",
      brand: "",
      ram: [],
      storage: [],
      inStock: false,
    };
    setLocalFilters(defaultFilters);
    applyFilters(defaultFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          onClick={resetFilters}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset All
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Price Range</h3>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="0"
            max={localFilters.priceRange[1]}
            value={localFilters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(e, 0)}
            className="w-24 p-2 border rounded"
          />
          <span>to</span>
          <input
            type="number"
            min={localFilters.priceRange[0]}
            value={localFilters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(e, 1)}
            className="w-24 p-2 border rounded"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Minimum Rating</h3>
        <select
          name="rating"
          value={localFilters.rating}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="0">Any Rating</option>
          <option value="4">4 Stars & Up</option>
          <option value="3">3 Stars & Up</option>
          <option value="2">2 Stars & Up</option>
          <option value="1">1 Star & Up</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Category</h3>
        <select
          name="category"
          value={localFilters.category}
          onChange={handleFilterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Brand</h3>
          <select
            name="brand"
            value={localFilters.brand}
            onChange={handleFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* RAM Filter (for electronics) */}
      {ramOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">RAM</h3>
          <div className="space-y-2">
            {ramOptions.map((ram) => (
              <label key={ram} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(localFilters.ram || []).includes(ram)}
                  onChange={() => handleMultiSelectChange('ram', ram)}
                  className="mr-2"
                />
                <span className="text-sm">{ram}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Storage Filter (for electronics) */}
      {storageOptions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Storage</h3>
          <div className="space-y-2">
            {storageOptions.map((storage) => (
              <label key={storage} className="flex items-center">
                <input
                  type="checkbox"
                  checked={(localFilters.storage || []).includes(storage)}
                  onChange={() => handleMultiSelectChange('storage', storage)}
                  className="mr-2"
                />
                <span className="text-sm">{storage}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* In Stock Filter */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            name="inStock"
            checked={localFilters.inStock}
            onChange={handleFilterChange}
            className="mr-2"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={applyFilterChanges}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Apply Filters
      </button>
    </div>
  );
} 