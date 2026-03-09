import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const handleCheckOut = () => {
    toggleCartDrawer();
    navigate("/checkout");
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* close buttonb */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6" />
        </button>
      </div>
      {/* cart content withn scollable area */}
      <div className="flex-grow p-4 over-flow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {/* components for cart content */}
        <CartContents />
      </div>
      {/* checkout button */}
      <div className="p-4 bg-white sticky bottom-0">
        <button
          onClick={handleCheckOut}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartDrawer;
