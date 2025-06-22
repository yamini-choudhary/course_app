import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4001/api/v1/user/login",
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successful: ", response.data);
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Login failed!!!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-6">
        <Link to="/" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text">
            CourseHaven
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/signup"
            className="px-4 py-2 text-sm text-white transition-all duration-300 bg-transparent border rounded-full border-white/20 hover:bg-white/10"
          >
            Sign Up
          </Link>
          <Link
            to="/courses"
            className="px-4 py-2 text-sm text-white transition-all duration-300 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
          >
            Browse Courses
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div className="p-8 border shadow-2xl bg-slate-800/50 backdrop-blur-xl border-slate-700/50 rounded-2xl">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-400">Sign in to access your courses</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 pl-10 pr-4 text-white placeholder-gray-400 transition-all duration-300 border bg-slate-700/50 border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-300"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-10 pr-12 text-white placeholder-gray-400 transition-all duration-300 border bg-slate-700/50 border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transition-colors duration-300 transform -translate-y-1/2 right-3 top-1/2 hover:text-white"
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
              <div className="p-3 border bg-red-500/10 border-red-500/20 rounded-xl">
                <p className="text-sm text-center text-red-400">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-500 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 mr-2 border-2 rounded-full border-white/20 border-t-white animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-orange-400 transition-colors duration-300 hover:text-orange-300"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
