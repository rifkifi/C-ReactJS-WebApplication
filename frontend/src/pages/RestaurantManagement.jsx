import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import RestaurantForm from "../components/RestaurantForm";
import MenuCard from "../components/MenuCard";
import CreateMenuModal from "../components/CreateMenuModal";
import LoadingOverlay from "../components/LoadingOverlay";
import toast, { Toaster } from "react-hot-toast";

function RestaurantManagement() {
  const { isAuthenticated, userId, accessToken } = useAuth();
  const [restaurantData, setRestaurantData] = useState(null);
  const [menu, setMenu] = useState(null);
  const [allMenu, setAllMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editMenuDetail, setEditMenuDetail] = useState(null);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  const getRestaurantData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/restaurants/owner/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to load restaurants");
      }
      setRestaurantData(response.data.data);
      await getMenusData(response.data.data.id);
      setIsEditing(false);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.status === 404 ? "You don't have any restaurant yet" : null) ||
        (err.request ? "Network error. Please retry." : null) ||
        err.message ||
        "Something went wrong";
      toast.error(msg, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const getMenusData = async (restaurantId) => {
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
      toast.error(msg, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleOnClose = () => {
    setIsMenuModalOpen(false);
    setEditMenuDetail(null);
  };

  const handleEditMenu = (item) => {
    setEditMenuDetail(item);
    setIsMenuModalOpen(true);
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    getRestaurantData();
  }, [isAuthenticated, isMenuModalOpen, userId]);

  const handleSuccess = () => {
    getRestaurantData();
    setIsEditing(false);
  };

  if (loading) {
    return <LoadingOverlay show={loading} text="Loading data ..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center text-xl text-red-600">
        Please log in to manage your restaurant.
      </div>
    );
  }

  return (
    <div className="py-10 mx-auto mt-10">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Restaurant Management
      </h1>

      {restaurantData ? (
        <>
          {isEditing ? (
            <RestaurantForm
              initialData={restaurantData}
              onSuccess={handleSuccess}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <div className="space-y-6">
              <div className="p-6 border border-orange-600 rounded-xl shadow-lg bg-white">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {restaurantData.name}
                </h2>
                <p className="text-lg text-orange-600 mb-4">
                  {restaurantData.type.name}
                </p>
                <img
                  src={restaurantData.imageUrl}
                  alt={restaurantData.name}
                  className="w-full h-80 object-cover rounded-lg shadow-xl mb-4"
                />
                <p className="text-lg text-gray-600 mb-4">
                  {restaurantData.description}
                </p>
                <p className="text-lg text-gray-600 mb-4">
                  📍{restaurantData.address}
                </p>
                <p className="text-md text-gray-600 mb-4">
                  {restaurantData.openingHours}
                </p>

                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">ID:</span>{" "}
                    {restaurantData.id}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Status:</span>{" "}
                    {restaurantData.isActive ? "Live" : "Deactivated"}
                  </p>
                </div>
                <div className="flex justify-end space-x-3 mt-5">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full w-10 bg-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-orange-700 transition"
                  >
                    Edit Restaurant Details
                  </button>
                </div>
              </div>
              <div className="block p-6 border border-orange-600 rounded-xl shadow-lg bg-white">
                <div className="flex justify-between border-b-2 border-orange-600 mb-8 pb-3">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Menus
                  </h3>
                  <button
                    onClick={() => setIsMenuModalOpen(true)}
                    className="bg-orange-600 text-white text-sm font-medium py-1.5 px-3 rounded-md hover:bg-orange-700 transition"
                  >
                    Add new menu
                  </button>
                </div>
                <div className="mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {menu &&
                      menu.map((item) => (
                        <MenuCard
                          key={item.id}
                          item={item}
                          edit={true}
                          onEdit={(item) => handleEditMenu(item)}
                        />
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
          <p className="text-xl text-gray-600 mb-6">
            It looks like you haven't created your restaurant profile yet.
          </p>

          {isEditing ? (
            <RestaurantForm
              onSuccess={handleSuccess}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 transition transform hover:scale-[1.01]"
            >
              Add Your Restaurant Now
            </button>
          )}
        </div>
      )}
      <CreateMenuModal
        isOpen={isMenuModalOpen}
        onClose={() => handleOnClose()}
        restaurantId={restaurantData?.id}
        menuDetail={editMenuDetail}
      />
    </div>
  );
}

export default RestaurantManagement;
