import React from "react";
import { useCart } from "../provider/CartProvider";

function MenuCard({ item, edit, onEdit }) {
  const { addToCart } = useCart();
  return (
    <div
      key={item.id}
      className="block items-center bg-white p-4 rounded-xl shadow-md transition duration-200 hover:shadow-lg border border-gray-100"
    >
      <img
        className="h-48 w-full object-cover mb-2 rounded-md"
        src={item.imageUrl}
        alt={item.name}
      />
      <div className="flex-grow mb-4">
        <h4 className="text-xl font-semibold text-gray-900 mb-1">
          {item.name}
        </h4>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>

      <div className="flex justify-between items-center space-x-4">
        <span className="text-lg font-bold text-orange-600">
          ${item.price.toFixed(2)}
        </span>

        {edit ? (
          <button
            onClick={() => onEdit(item)}
            className="bg-orange-600 text-white text-sm font-medium py-1.5 px-3 rounded-md hover:bg-orange-700 transition"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={() => addToCart(item)}
            className="bg-orange-600 text-white text-sm font-medium py-1.5 px-3 rounded-md hover:bg-orange-700 transition"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}

export default MenuCard;
