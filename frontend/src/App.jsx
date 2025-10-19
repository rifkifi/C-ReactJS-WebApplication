import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Header from "./components/Header.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Restaurant from "./pages/Restaurant.jsx";
import CartPopup from "./components/CartPopup.jsx";
import RestaurantManagement from "./pages/RestaurantManagement.jsx";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="bg-slate-50 text-slate-900 ">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="px-4 sm:px-6 lg:px-8 mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/profile/restaurant"
            element={<RestaurantManagement />}
          />
          <Route path="/restaurant/:restaurantId" element={<Restaurant />} />
        </Routes>
      </main>
      <CartPopup />
    </div>
  );
}
