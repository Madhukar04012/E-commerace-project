import React, { useState, useEffect } from "react";
import { useSearch } from "../context/SearchContext";
import { Slider } from "@mui/material";

export default function ProductFilters() {
  const { filters, applyFilters, error } = useSearch();
  const [localFilters, setLocalFilters] = useState(filters);
  const [categories, setCategories] = useState([]);

  // Update local filters when context filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Get unique categories from products
  useEffect(() => {
    try {
      const { filteredProducts } = useSearch();
      const uniqueCategories = [...new Set(filteredProducts.map(p => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error getting categories:", err);
    }
  }, []);

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

  const applyFilterChanges = () => {
    try {
      applyFilters(localFilters);
    } catch (err) {
      console.error("Error applying filters:", err);
    }
  };

  const handlePriceChange = (event, newValue) => {
    applyFilters({
      ...filters,
      priceRange: newValue,
    });
  };

  const handleRatingChange = (rating) => {
    applyFilters({
      ...filters,
      rating: rating,
    });
  };

  const handleBrandChange = (brand) => {
    applyFilters({
      ...filters,
      brand: brand,
    });
  };

  const handleStockChange = (e) => {
    applyFilters({
      ...filters,
      inStock: e.target.checked,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

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