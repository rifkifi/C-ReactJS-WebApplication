import React, { useState, useEffect } from "react";
import { useAuth } from "../provider/AuthProvider";
import axios from "axios";
import LoadingOverlay from "../components/LoadingOverlay";
import toast from "react-hot-toast";

function Profile() {
  const { isAuthenticated, accessToken } = useAuth();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  const getProfileData = async () => {
    try {
      const response = await axios.get("/api/users/data", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch profile data");
      }
      setUserId(response.data.data.id);
      setName(response.data.data.name);
      setUsername(response.data.data.username);
      setPhone(response.data.data.phoneNumber);
      setAddress(response.data.data.address);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg, { duration: 4000 });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdateMessage(null);

    const updatedProfile = {
      Username: username,
      Name: name,
      Address: address,
      PhoneNumber: phone,
    };

    try {
      await axios.put(`/api/users/${userId}`, updatedProfile, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      toast.success("Profile updated successfully!", { duration: 4000 });
      getProfileData();
      setIsEditing(false);
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center text-xl text-red-600">
        You must be logged in to view this page.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start pt-20 py-12">
      <LoadingOverlay show={loading} text="Loading ..." />
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-extrabold text-gray-900">My Profile</h1>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`font-medium py-2 px-4 rounded-lg transition duration-150 ${
              isEditing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-orange-600 text-white hover:bg-orange-700"
            }`}
          >
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>
        {updateMessage && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              updateMessage.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {updateMessage.text}
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              disabled={!isEditing || loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              disabled={!isEditing || loading}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              id="address"
              name="address"
              type="tel"
              disabled={!isEditing || loading}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              disabled={!isEditing || loading}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          {isEditing && (
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 disabled:bg-gray-400"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Authentication Status:{" "}
            <span className="font-semibold text-green-600">
              {isAuthenticated ? "Authenticated" : "Logged Out"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
