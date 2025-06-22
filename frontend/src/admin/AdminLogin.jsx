import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/admin/login",
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("AdminLogin successful: ", response.data);
      toast.success(response.data.message);
      localStorage.setItem("admin", JSON.stringify(response.data));
      navigate("/admin/dashboard");
    } catch (error) {
      console.log("Error in admin login:", error);
      if (error.response) {
        setErrorMessage(error.response.data.errors || "AdminLogin failed!!!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b bg-white/10 backdrop-blur-sm border-white/20">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CourseHaven</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/signup"
                className="px-6 py-2 transition-all duration-300 border rounded-full text-slate-300 border-white/20 hover:bg-white/10 hover:text-white"
              >
                Admin Signup
              </Link>
              <Link
                to="/courses"
                className="px-6 py-2 text-white transition-all duration-300 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-6">
        <div className="w-full max-w-md">
          {/* Admin Badge */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center px-4 py-2 space-x-2 border rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-400/30 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-purple-400" />
              <span className="font-medium text-purple-300">Admin Access</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">Admin Login</h1>
            <p className="text-slate-300">Access your admin dashboard</p>
          </div>

          {/* Login Form */}
          <div className="p-8 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 pl-10 pr-4 text-white transition-all duration-300 border bg-white/10 border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="admin@coursehaven.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-white">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 pl-10 pr-12 text-white transition-all duration-300 border bg-white/10 border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute transition-colors duration-300 transform -translate-y-1/2 right-3 top-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-4 border bg-red-500/20 border-red-400/30 rounded-xl backdrop-blur-sm">
                  <p className="text-sm font-medium text-center text-red-400">
                    {errorMessage}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <div className="mt-6 space-y-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-slate-300">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Secure admin authentication</span>
              </div>

              <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-slate-300">
                  Don't have admin access?{" "}
                  <Link
                    to="/admin/signup"
                    className="font-medium text-orange-400 transition-colors duration-300 hover:text-orange-300"
                  >
                    Request Admin Account
                  </Link>
                </p>
              </div>

              <Link
                to="/"
                className="inline-block text-sm transition-colors duration-300 text-slate-300 hover:text-white"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
