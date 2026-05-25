import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiAlertTriangle } from "react-icons/fi";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-500 mb-6 mx-auto">
                    <FiAlertTriangle className="text-5xl" />
                </div>
                <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    The page you are looking for doesn't exist or has been moved.
                    Please check the URL or go back to the dashboard.
                </p>
                <Link
                    to="/"
                    className="btn btn-primary px-8 gap-2 rounded-full hover:scale-105 transition-transform"
                >
                    <FiHome />
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
