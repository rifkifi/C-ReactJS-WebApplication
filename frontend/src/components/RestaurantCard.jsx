import React from "react";
import { useNavigate } from "react-router-dom";

function RestaurantCard({ restaurant }) {
    const navigate = useNavigate();
    const handleCardClick = (id) => {
        navigate(`/restaurant/${id}`);
    };
  return (
    <div
      key={restaurant.id}
      onClick={() => handleCardClick(restaurant.id)}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]"
    >
      <img
        className="h-48 w-full object-cover"
        src={restaurant.imageUrl}
        alt={restaurant.name}
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 truncate mb-1">
          {restaurant.name}
        </h2>
        <p className="text-sm text-orange-500 font-medium mb-1">
          {restaurant.type.name}
        </p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-500">{restaurant.address}</p>
          <p className="text-sm text-gray-500">{restaurant.openingHours}</p>
        </div>
        <div className="flex items-center justify-between">
          {restaurant.rating && (
            <div className="flex items-center text-gray-700">
              <span className="text-yellow-500 mr-1">⭐</span>
              <span className="font-bold">{restaurant.rating}</span>
              <span className="text-sm text-gray-500 ml-1">/ 5.0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RestaurantCard;
