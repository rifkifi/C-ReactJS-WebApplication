// src/CartPopup.jsx

import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../provider/CartProvider";
import { FaShoppingCart, FaTimes, FaMinus, FaPlus } from "react-icons/fa";

function CartPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, cartCount, addToCart, removeFromCart } = useCart();

  const handleClose = () => setIsOpen(false);
  const handleOpen = () => setIsOpen(true);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <button
        onClick={handleOpen}
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-700 transition duration-300 z-50 transform hover:scale-105"
        aria-label="Open Cart"
      >
        <FaShoppingCart className="h-6 w-6" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {cartCount}
          </span>
        )}
      </button>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[100] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white">
            <h3 className="text-2xl font-bold text-gray-800">
              Your Order ({cartCount} {cartCount === 1 ? "Item" : "Items"})
            </h3>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-600 transition"
              aria-label="Close Cart"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-center pt-10">
                Your cart is empty. Start adding some food!
              </p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Remove item"
                      >
                        <FaMinus className="text-white w-3" />
                      </button>
                      <span className="text-lg font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        aria-label="Add item"
                      >
                        <FaPlus className="text-white w-3" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-lg flex-shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="p-5 border-t bg-gray-50">
            <div className="flex justify-between text-xl font-bold mb-4">
              <span>Subtotal:</span>
              <span>${calculateTotal()}</span>
            </div>
            <button
              className="w-full bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-orange-700 transition duration-300 disabled:bg-gray-400"
              disabled={cartItems.length === 0}
              onClick={() => {
                toast.success("Successfully checkout!", { duration: 4000 });
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          onClick={handleClose}
          className="fixed inset-0 bg-black/70 z-[60]"
        ></div>
      )}
    </>
  );
}

export default CartPopup;
