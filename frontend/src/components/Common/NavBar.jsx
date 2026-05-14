import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
    console.log(drawerOpen);
  };

  const openNavToggle = () => {
    setNavOpen(!navOpen);
  };
  return (
    <>
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* left-logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Ziarra
          </Link>
        </div>
        {/* center-menu */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-800 hover:text-black text-sm uppercase font-medium"
          >
            men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-800 hover:text-black text-sm uppercase font-medium"
          >
            women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-800 hover:text-black text-sm uppercase font-medium"
          >
            Top Wear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-800 hover:text-black text-sm uppercase font-medium"
          >
            Bottom Wear
          </Link>
        </div>
        {/* right-icons */}
        <div className="flex items-center space-x-4 ">
          <Link
            to="/admin"
            className="block bg-black px-2 rounded text-sm text-white"
          >
            Admin
          </Link>

          <Link to="/profile">
            {/* profile page */}
            <HiOutlineUser className="h-6 w-6 text-gray-700 hover:text-black" />
          </Link>

          {/* cart icon */}
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gary-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1  bg-red-700 rounded-full text-xs px-2 py-0.5 text-white items-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* search icon */}
          <div>
            <SearchBar />
          </div>
          {/*hamburger menu */}
          <button className="md:hidden" onClick={openNavToggle}>
            <HiBars3BottomRight className="h-6 w-6 text-gary-700" />
          </button>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />
      {/*  mobile navigation  */}
      <div
        className={`fixed top-0 left-0 h-full w-3/4 sm:w1/2 md:w-1/3 bg-white z-50 shadow-lg transform trasition-transform duration-300 ${
          navOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={openNavToggle}>
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        <div className="p-10">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all"
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link to="#" className="block text-gray-600 hover:text-black">
              Women
            </Link>
            <Link to="#" className="block text-gray-600 hover:text-black">
              Kids
            </Link>
            <Link to="#" className="block text-gray-600 hover:text-black">
              Jewellery
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;
