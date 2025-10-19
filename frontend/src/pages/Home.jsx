import React, { useEffect, useState } from "react";
import axios from "axios";
import RestaurantCard from "../components/RestaurantCard";
import LoadingOverlay from "../components/LoadingOverlay";
import toast, { Toaster } from "react-hot-toast";

function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getRestaurants = async () => {
    try {
      const response = await axios.get("/api/restaurants");
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load restaurants");
      }
      setRestaurants(response.data.data);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.request ? "Network error. Please retry." : null) ||
        err.message ||
        "Something went wrong";
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  return (
    <div className="pt-20 pb-10">
      <LoadingOverlay show={isLoading} text="Load Restaurants" />
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center sm:text-left">
        Explore Restaurants
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}

export default Home;
