import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../provider/AuthProvider";

function Header() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="fixed top-0 left-0 w-full bg-white z-10 shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-extrabold text-indigo-600">
          Dine
        </Link>
        <nav className="hidden md:flex space-x-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className=" hover:text-indigo-600 transition"
              >
                Profile
              </Link>
               <Link
                to="/profile/restaurant"
                className=" hover:text-indigo-600 transition"
              >
                My Restaurant
              </Link>
              <Link
                to="/login"
                onClick={logout}
                className=" hover:text-indigo-600 transition"
              >
                Logout
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
