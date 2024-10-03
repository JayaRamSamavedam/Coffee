import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const AdminDashBoard = () => {
  const location = useLocation();

  // Determine which button is active based on the current path
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div>
      {/* Navbar Placeholder */}
     <header>Welcome to admin dashboard</header>

      {/* Button Group Below the Navbar */}
      <div className="flex justify-center mt-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          {/* Users Button */}
          <Link to="products">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                isActive("users")
                  ? "text-blue-700 bg-gray-200"
                  : "text-gray-900 bg-white"
              } border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
            >
              Products
            </button>
          </Link>

         

          {/* Brands Button */}
          <Link to="brands">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                isActive("brands")
                  ? "text-blue-700 bg-gray-200"
                  : "text-gray-900 bg-white"
              } border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
            >
              Brands
            </button>
          </Link>

          {/* Orders Button */}
          <Link to="orders">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                isActive("orders")
                  ? "text-blue-700 bg-gray-200"
                  : "text-gray-900 bg-white"
              } border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
            >
              Orders
            </button>
          </Link>

          {/* Logs Button */}
          <Link to="logs">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium ${
                isActive("logs")
                  ? "text-blue-700 bg-gray-200"
                  : "text-gray-900 bg-white"
              } border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white`}
            >
              Logs
            </button>
          </Link>
        </div>
      </div>

      {/* This will render the nested routes' components */}
      <div className="mt-8">
        <Outlet />
      </div>
    </div>
  );
};
