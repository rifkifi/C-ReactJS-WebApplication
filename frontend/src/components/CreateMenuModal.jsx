import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../provider/AuthProvider";
import LoadingOverlay from "./LoadingOverlay";

function CreateMenuModal({ isOpen, onClose, restaurantId, menuDetail }) {
  const [name, setName] = useState(menuDetail?.name || "");
  const [description, setDescription] = useState(menuDetail?.description || "");
  const [price, setPrice] = useState(menuDetail?.price || "");
  const [category, setCategory] = useState(null);
  const [imageUrl, setImageUrl] = useState(menuDetail?.imageUrl || "");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isActive, setIsActive] = useState(menuDetail?.isActive || true);
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuth();

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const reqData = {
      name,
      description,
      price,
      categoryId: category.value,
      imageUrl,
      restaurantId,
    };
    try {
      if (menuDetail) {
        await axios.put(`/api/menus/${menuDetail.id}`, reqData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success("Successfully update a new menu!", { duration: 4000 });
      } else {
        await axios.post("/api/menus/create", reqData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success("Successfully create a new menu!", { duration: 4000 });
      }
    } catch (error) {
      toast.error(error, { duration: 4000 });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const getMenuCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/menucategories");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to load menu categories"
        );
      }
      setCategoryOptions(
        response.data.data.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
      if (menuDetail) {
        const currentCategory = response.data.data.find(
          (item) => item.id === menuDetail.categoryId
        );
        setCategory({
          label: currentCategory.name,
          value: currentCategory.id,
        });
      }
    } catch (error) {
      toast.error(error.message, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (selectedOption) => {
    setCategory(selectedOption);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/menus/${menuDetail.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      handleClose();
    } catch (error) {
      toast.error(error, { duration: 4000 });
    }
  };
  useEffect(() => {
    if (isOpen) {
      getMenuCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/70 z-[60]" onClick={handleClose} />
      <LoadingOverlay show={loading} text="Saving..." />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-full overflow-y-auto transform transition-all duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 p-4 border-b bg-white flex justify-between items-center z-10">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuDetail ? "Edit Menu" : "Create New Menu"}
            </h2>
            <button
              onClick={handleClose}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Close modal"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <label className="mb-2 cursor-pointer">
              <span className=" text-orange text-sm font-medium ">
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
            <div className="mt-4">
              <label
                htmlFor="menuName"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="menuName"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label
                htmlFor="menuDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="menuDescription"
                maxLength={500}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows="2"
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                id="price"
                type="text"
                value={price}
                maxLength={10}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows="2"
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-left text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <Select
                className="text-left"
                id="category"
                name="category"
                value={category}
                onChange={handleSelectChange}
                options={categoryOptions}
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
                htmlFor="imageurl"
                className="block text-sm font-medium text-gray-700"
              >
                Image Url
              </label>
              <textarea
                id="imageurl"
                maxLength={500}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows="2"
              />
            </div>
            <div className="flex justify-between items-center pt-4">
              <div className="block">
                {menuDetail && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="border border-gray-300 rounded-md text-white hover:bg-gray-100 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="py-2 px-4 border border-gray-300 rounded-md text-white hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-md text-white font-medium bg-green-600 hover:bg-green-700 transition"
                >
                  Save Menu
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default CreateMenuModal;
