import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ONLY local slider state
  const [localPrice, setLocalPrice] = useState(
    Number(searchParams.get("maxPrice")) || 1000
  );

  // FILTERS DIRECTLY FROM URL
  const filters = {
    category: searchParams.get("category") || "",
    gender: searchParams.get("gender") || "",
    color: searchParams.get("color") || "",

    size: searchParams.get("size") ? searchParams.get("size").split(",") : [],

    material: searchParams.get("material")
      ? searchParams.get("material").split(",")
      : [],

    brand: searchParams.get("brand")
      ? searchParams.get("brand").split(",")
      : [],

    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 1000,
  };

  const categories = ["Top Wear", "Bottom Wear"];

  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
    "Beige",
    "Navy",
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton",
    "Wool",
    "Denim",
    "Polyester",
    "Linen",
    "Viscose",
    "Fleece",
  ];

  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Fashionista",
    "ChicStyle",
  ];

  const genders = ["Men", "Women"];

  // DEBOUNCE PRICE SLIDER
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      params.set("minPrice", 0);
      params.set("maxPrice", localPrice);

      setSearchParams(params);
    }, 400);

    return () => clearTimeout(timer);
  }, [localPrice]);

  // CHECKBOX + RADIO
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;

    const params = new URLSearchParams(searchParams);

    // CHECKBOX
    if (type === "checkbox") {
      let currentValues = params.get(name) ? params.get(name).split(",") : [];

      if (checked) {
        currentValues.push(value);
      } else {
        currentValues = currentValues.filter((item) => item !== value);
      }

      if (currentValues.length > 0) {
        params.set(name, currentValues.join(","));
      } else {
        params.delete(name);
      }
    }

    // RADIO
    else {
      params.set(name, value);
    }

    setSearchParams(params);
  };

  // COLOR BUTTON
  const handleColorChange = (color) => {
    const params = new URLSearchParams(searchParams);

    params.set("color", color);

    setSearchParams(params);
  };

  // PRICE SLIDER
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);

    setLocalPrice(value);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium mb-4">Filter</h3>

      {/* CATEGORY */}
      <div className="mb-6">
        <label className="block mb-2">Category</label>

        {categories.map((c) => (
          <div key={c}>
            <input
              type="radio"
              name="category"
              value={c}
              checked={filters.category === c}
              onChange={handleFilterChange}
            />

            <span className="ml-2">{c}</span>
          </div>
        ))}
      </div>

      {/* GENDER */}
      <div className="mb-6">
        <label className="block mb-2">Gender</label>

        {genders.map((g) => (
          <div key={g}>
            <input
              type="radio"
              name="gender"
              value={g}
              checked={filters.gender === g}
              onChange={handleFilterChange}
            />

            <span className="ml-2">{g}</span>
          </div>
        ))}
      </div>

      {/* COLORS */}
      <div className="mb-6">
        <label className="block mb-2">Color</label>

        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              type="button"
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border ${
                filters.color === color ? "ring-2 ring-blue-500" : ""
              }`}
              style={{
                backgroundColor: color.toLowerCase(),
              }}
            />
          ))}
        </div>
      </div>

      {/* SIZE */}
      <div className="mb-6">
        <label className="block mb-2">Size</label>

        {sizes.map((s) => (
          <div key={s}>
            <input
              type="checkbox"
              name="size"
              value={s}
              checked={filters.size.includes(s)}
              onChange={handleFilterChange}
            />

            <span className="ml-2">{s}</span>
          </div>
        ))}
      </div>

      {/* MATERIAL */}
      <div className="mb-6">
        <label className="block mb-2">Material</label>

        {materials.map((m) => (
          <div key={m}>
            <input
              type="checkbox"
              name="material"
              value={m}
              checked={filters.material.includes(m)}
              onChange={handleFilterChange}
            />

            <span className="ml-2">{m}</span>
          </div>
        ))}
      </div>

      {/* BRAND */}
      <div className="mb-6">
        <label className="block mb-2">Brand</label>

        {brands.map((b) => (
          <div key={b}>
            <input
              type="checkbox"
              name="brand"
              value={b}
              checked={filters.brand.includes(b)}
              onChange={handleFilterChange}
            />

            <span className="ml-2">{b}</span>
          </div>
        ))}
      </div>

      {/* PRICE */}
      <div className="mb-6">
        <label className="block mb-2">Price</label>

        <input
          type="range"
          min="0"
          max="1000"
          value={localPrice}
          onChange={handlePriceChange}
          className="w-full"
        />

        <div className="flex justify-between text-sm mt-2">
          <span>$0</span>
          <span>${localPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
