import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MenuCard from "../components/MenuCard";
import LoadingOverlay from "../components/LoadingOverlay";
import toast, { Toaster } from "react-hot-toast";

function Restaurant() {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuCategory, setMenuCategory] = useState([
    {
      label: "All Menus",
      value: "0",
    },
  ]);
  const [menu, setMenu] = useState(null);
  const [allMenu, setAllMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(menuCategory[0].value);

  const getRestaurantData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/restaurants/${restaurantId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load restaurants");
      }
      setRestaurant(response.data.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.request ? "Network error. Please retry." : null) ||
        err.message ||
        "Something went wrong";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getMenusData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/menus/restaurant/${restaurantId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load Menus");
      }
      setMenu(response.data.data);
      setAllMenu(response.data.data);
    } catch (err) {
      const msg =
        err.response?.data?.message || 
        (err.request ? "Network error. Please retry." : null) ||
        err.message ||
        "Something went wrong";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getMenuCategory = async () => {
    try {
      const response = await axios.get(`/api/menucategories`);
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load menu categories"
        );
      }
      response.data.data.map((item) => {
        setMenuCategory((menuCategory) => [
          ...menuCategory,
          {
            label: item.name,
            value: item.id,
          },
        ]);
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || 
        (err.request ? "Network error. Please retry." : null) ||
        err.message ||
        "Something went wrong";
      throw new Error(msg);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
    if (filter !== "0") {
      const menuFiltered = allMenu.filter((item) => item.categoryId === filter);
      setMenu(menuFiltered);
    } else {
      setMenu(allMenu);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          getRestaurantData(),
          getMenusData(),
          getMenuCategory(),
        ]);
      } catch (e) {
        toast.error(e.message, { duration: 4000 });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [restaurantId]);

  if (loading) {
    return <LoadingOverlay show={loading} text="Loading..." />;
  }

  if (error || !restaurant) {
    return (
      <div className="py-20 text-center text-xl text-red-600">
        {error || `Restaurant with ID ${restaurantId} not found.`}
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="mb-8">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-80 object-cover rounded-lg shadow-xl"
        />
      </div>
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          {restaurant.name}
        </h1>
        <p className="text-xl text-gray-600 mb-4">{restaurant.description}</p>
        <div className="flex justify-center space-x-6 text-md text-gray-700">
          <span className="font-medium">📍 {restaurant.address}</span>
          <span className="font-medium text-yellow-600">
            ⭐ {restaurant.rating} / 5.0
          </span>
        </div>
      </div>
      <div className="flex justify-between max-w-7xl mx-auto sm:px-6 lg:px-8 border-b-2 border-orange-600 mb-8 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">
          Find our delicious menu
        </h2>
        <div className="flex items-center space-x-3">
          <label
            htmlFor="menu-filter"
            className="text-gray-600 text-sm font-medium hidden sm:block"
          >
            Filter:
          </label>
          <select
            id="menu-filter"
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:border-orange-500 focus:ring-orange-500 transition cursor-pointer"
          >
            {menuCategory.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {menu &&
            menu.map((item) => (
              <MenuCard key={item.id} item={item} edit={false} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Restaurant;
