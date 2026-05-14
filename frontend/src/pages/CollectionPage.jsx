import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import { useSearchParams, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import FilterSideBar from "../components/Products/FilterSideBar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";

import { fetchProductsByFilters } from "../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();

  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  const sidebarRef = useRef(null);

  const [sideBarOpen, setSideBarOpen] = useState(false);

  // convert URL params into string
  const queryString = searchParams.toString();

  // FETCH PRODUCTS WHEN URL FILTERS CHANGE
  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams]);
    console.log("searchParams", [...searchParams]);
    console.log("queryParams", queryParams);
    console.log("collection", collection);

    dispatch(
      fetchProductsByFilters({
        collection,
        ...queryParams,
      })
    );
  }, [dispatch, collection, queryString]);

  // TOGGLE SIDEBAR
  const toggleSideBar = () => {
    setSideBarOpen((prev) => !prev);
  };

  // CLOSE SIDEBAR WHEN CLICK OUTSIDE
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSideBarOpen(false);
    }
  };

  // ADD + REMOVE EVENT LISTENER
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* MOBILE FILTER BUTTON */}
      <button
        onClick={toggleSideBar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>

      {/* FILTER SIDEBAR */}
      <div
        ref={sidebarRef}
        className={`
          ${sideBarOpen ? "translate-x-0" : "-translate-x-full"}
          
          fixed inset-y-0 left-0
          w-64
          bg-white
          z-50
          transition-transform
          duration-300
          overflow-y-auto
          
          lg:static
          lg:translate-x-0
        `}
      >
        <FilterSideBar />
      </div>

      {/* PRODUCTS SECTION */}
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* SORT OPTIONS */}
        <SortOptions />

        {/* PRODUCT GRID */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
