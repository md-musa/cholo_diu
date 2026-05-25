import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";

function Login() {
  const { login, userData, authLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already logged in - using authLoading to prevent flash
  useEffect(() => {
    if (!authLoading && userData) {
      navigate("/schedules");
    }
  }, [userData, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login({ email, password });
    } catch (err) {
      // login function handles toast errors, but we can set local error if needed
      console.error("Login component error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Show a loading skeleton/spinner while checking session
  if (authLoading || userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
          <p className="text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

        {/* Left Side - Visual/Branding */}
        <div className="w-full md:w-1/2 bg-blue-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,79.6,-46.3C87.4,-33.5,90.1,-18,88.5,-3.3C86.9,11.3,81,24.9,71.9,35.8C62.8,46.7,50.4,54.8,37.8,61.9C25.2,69,12.4,75.1,-0.7,76.3C-13.8,77.5,-28.9,73.8,-41.2,66.1C-53.5,58.4,-63,46.7,-69.7,33.5C-76.4,20.3,-80.4,5.6,-78.9,-8.6C-77.4,-22.8,-70.5,-36.5,-60.1,-46.6C-49.7,-56.7,-35.8,-63.1,-21.8,-66.9C-7.8,-70.7,6.3,-71.8,20.5,-73.2" transform="translate(100 100)" />
            </svg>
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Cholo Admin</h1>
            <p className="text-blue-100 text-lg">Manage schedules, routes, and buses with ease and precision.</p>
          </div>

          <div className="relative z-10">
            <p className="text-sm text-blue-300">© 2026 Cholo Transport</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Email Address</span>
              </label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={email}
                  placeholder="name@company.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">Password</span>
              </label>
              <div className="relative group">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
                  <FaLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert alert-error shadow-sm text-sm py-2">
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className={`btn btn-primary w-full shadow-lg hover:shadow-xl transition-all duration-300 ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {!loading && <FaSignInAlt className="mr-2" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
