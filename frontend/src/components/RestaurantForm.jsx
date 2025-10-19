import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import LoadingOverlay from "./LoadingOverlay";

function RestaurantForm({ initialData = {}, onSuccess, onCancel }) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [openingHours, setOpeningHours] = useState(
    initialData.openingHours || ""
  );
  const [phone, setPhone] = useState(initialData.phone || "");
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || "");
  const [type, setType] = useState({
    label: initialData.type?.name ?? "",
    value: initialData.type?.id ?? "",
  });
  const [restaurantTypes, setRestaurantTypes] = useState([]);
  const [isActive, setIsActive] = useState(initialData.isActive || false);
  const [loading, setLoading] = useState(false);
  const isCreation = !initialData.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    var response;
    const reqData = {
      name,
      description,
      address,
      openingHours,
      phone,
      imageUrl,
      restaurantTypeId: type.value,
      isActive,
    };

    const accessToken = localStorage.getItem("access_token");
    try {
      if (isCreation) {
        response = await axios.post("/api/restaurants/create", reqData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to create restaurant"
          );
        }
        toast.success("Successfully create a new restaurant!", {
          duration: 4000,
        });
      } else {
        response = await axios.put(
          `/api/restaurants/${initialData.id}`,
          reqData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toast.success("Successfully update restaurant data!", {
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error(error, { duration: 4000 });
    } finally {
      setLoading(false);
      onSuccess();
    }
  };

  const getRestaurantTypes = async () => {
    try {
      const response = await axios.get("/api/restauranttypes");
      response.data.map((item) => {
        setRestaurantTypes((restaurantTypes) => [
          ...restaurantTypes,
          {
            label: item.name,
            value: item.id,
          },
        ]);
      });
    } catch (error) {
      toast.error(error.message, { duration: 4000 });
    }
  };

  const handleSelectChange = (selectedOption) => {
    setType(selectedOption);
  };

  useEffect(() => {
    getRestaurantTypes();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 w-2xl m-auto border border-orange-600 rounded-xl shadow-lg bg-white"
    >
      <LoadingOverlay show={loading} text="Signing in..." />
      <div className="flex justify-between border-b-2 border-orange-600 mb-8 pb-3">
        <h2 className="text-2xl font-bold text-gray-800">
          {isCreation ? "Create New Restaurant" : "Edit Details"}
        </h2>
        <div className="flex items-center space-x-3">
          <label className="inline-flex items-center me-5 cursor-pointer">
            <span className="ms-3 mr-4 text-orange text-sm font-medium ">
              {isActive ? "Active" : "Inactive"}
            </span>
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500 dark:peer-checked:bg-orange-500"></div>
          </label>
        </div>
      </div>
      <div>
        <label
          htmlFor="name"
          className="text-left block text-sm font-medium text-gray-700 "
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-left text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
      <div>
        <label
          htmlFor="type"
          className="block text-left text-sm font-medium text-gray-700 mb-1"
        >
          Restaurant Type
        </label>
        <Select
          className="text-left"
          id="type"
          name="type"
          value={type}
          onChange={handleSelectChange}
          options={restaurantTypes}
          isClearable={true}
          placeholder="Select an option"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? "#f97316" : "#d1d5db",
              boxShadow: state.isFocused
                ? "0 0 0 1px #f97316"
                : baseStyles.boxShadow,
              "&:hover": {
                borderColor: state.isFocused ? "#f97316" : "#d1d5db",
              },
              minHeight: "42px",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isFocused
                ? "#fed7aa"
                : state.isSelected
                ? "#f97316"
                : "white",
              color: state.isSelected ? "white" : "black",
              cursor: "pointer",
            }),
          }}
        />
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-left text-sm font-medium text-gray-700"
        >
          Address
        </label>
        <textarea
          id="address"
          value={address}
          maxLength={300}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
      <div>
        <label
          htmlFor="openinghours"
          className="block text-left text-sm font-medium text-gray-700"
        >
          Opening Hours
        </label>
        <input
          type="text"
          id="openinghours"
          maxLength={20}
          value={openingHours}
          onChange={(e) => setOpeningHours(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
      <div>
        <label
          htmlFor="imageurl"
          className="block text-left text-sm font-medium text-gray-700"
        >
          Image Url
        </label>
        <input
          type="text"
          id="imageurl"
          maxLength={500}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-left text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          maxLength={20}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          rows="3"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md text-white hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`py-2 px-4 rounded-md text-white font-medium transition ${
            isCreation
              ? "bg-green-600 hover:bg-green-700"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          {isCreation ? "Create Restaurant" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default RestaurantForm;
