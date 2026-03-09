import React, { useState, useEffect, useRef } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSideBar from "../components/Products/FilterSideBar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
const CollectionPage = () => {
  const [products, setProducts] = useState([]);
  const sidebarRef = useRef(null);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setSideBarOpen(!sideBarOpen);
  };

  const handleClickOutside = (e) => {
    //  close sidebar if clicked outside
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setSideBarOpen(false);
    }
  };

  useEffect(() => {
    //   add eventlistener for click outside
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
    // clean event listenr

    //document.addEventListener.remove("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      const fetchProducts = [
        {
          _id: 1,
          name: "Prodcut 1",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=5",
            },
          ],
        },
        {
          _id: 2,
          name: "Prodcut 2",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=6",
            },
          ],
        },
        {
          _id: 3,
          name: "Prodcut 3",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=7",
            },
          ],
        },
        {
          _id: 4,
          name: "Prodcut 4",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=8",
            },
          ],
        },
        {
          _id: 1,
          name: "Prodcut 1",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=5",
            },
          ],
        },
        {
          _id: 2,
          name: "Prodcut 2",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=6",
            },
          ],
        },
        {
          _id: 3,
          name: "Prodcut 3",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=7",
            },
          ],
        },
        {
          _id: 4,
          name: "Prodcut 4",
          price: 100,
          images: [
            {
              url: "https://picsum.photos/500/500?random=8",
            },
          ],
        },
      ];
      setProducts(fetchProducts);
    }, 1000);
  }, []);
  return (
    <div className="flex flex-col lg:flex-row">
      {/* mobile filter button */}
      <button
        onClick={toggleSideBar}
        className="lg:hidden border p-2 flex justify-center items-center"
      >
        <FaFilter className="mr-2" />
      </button>
      {/* filter side bar */}
      <div
        ref={sidebarRef}
        className={`${
          sideBarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 w-64  bg-white z-50 transition-transform duration-300 overflow-y-auto  lg:static lg:translate-x-0`}
      >
        <FilterSideBar />
      </div>
      <div className="flex-grow p-4">
        <h2 className="text-2xl uppercase mb-4">All collection</h2>
        {/* sort options
         */}
        <SortOptions />
        <ProductGrid products={products} />
      </div>
      {/* product grid */}
    </div>
  );
};

export default CollectionPage;
