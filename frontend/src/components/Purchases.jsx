import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  BookOpen,
  Download,
  Home,
  Settings,
  LogIn,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ShoppingBag,
  User,
  Star,
  Clock,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  console.log("purchases: ", purchases);

  // Token handling
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  if (!token) {
    navigate("/login");
  }

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setPurchase(response.data.courseData);
        setLoading(false);
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
        setLoading(false);
      }
    };
    fetchPurchases();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/user/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Mobile menu button */}
      <button
        className="fixed z-20 p-3 text-white transition-all duration-300 border shadow-lg rounded-xl bg-white/10 backdrop-blur-sm border-white/20 md:hidden top-4 left-4 hover:bg-white/20"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white/10 backdrop-blur-sm border-r border-white/20 shadow-xl w-80 p-6 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        {/* Logo */}
        <div className="flex items-center mt-10 mb-10 md:mt-0">
          <div className="flex items-center justify-center w-12 h-12 mr-3 bg-orange-500 rounded-full">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">CourseHaven</span>
        </div>

        {/* User Profile Section */}
        <div className="p-6 mb-8 border bg-white/10 rounded-2xl border-white/20">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {isLoggedIn ? "Welcome Back!" : "Guest User"}
              </h3>
              <p className="text-sm text-slate-300">
                {isLoggedIn ? "Student" : "Please login to continue"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="flex items-center p-4 text-white transition-all duration-300 border border-transparent rounded-xl hover:bg-white/20 hover:border-white/20"
              >
                <Home className="w-5 h-5 mr-3" />
                <span className="font-medium">Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                className="flex items-center p-4 text-white transition-all duration-300 border border-transparent rounded-xl hover:bg-white/20 hover:border-white/20"
              >
                <BookOpen className="w-5 h-5 mr-3" />
                <span className="font-medium">Courses</span>
              </Link>
            </li>
            <li>
              <div className="flex items-center p-4 text-white shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <Download className="w-5 h-5 mr-3" />
                <span className="font-medium">My Purchases</span>
              </div>
            </li>
            <li>
              <button className="flex items-center w-full p-4 text-white transition-all duration-300 border border-transparent rounded-xl hover:bg-white/20 hover:border-white/20">
                <Settings className="w-5 h-5 mr-3" />
                <span className="font-medium">Settings</span>
              </button>
            </li>
            <li className="pt-4 border-t border-white/20">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full p-4 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center p-4 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700"
                >
                  <LogIn className="w-5 h-5 mr-3" />
                  <span className="font-medium">Login</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 md:p-8 md:ml-0">
        {/* Header */}
        <header className="mb-8 ml-12 md:ml-0">
          <div className="flex items-center mb-4">
            <ShoppingBag className="w-8 h-8 mr-4 text-orange-500" />
            <h1 className="text-4xl font-bold text-white">My Purchases</h1>
          </div>
          <p className="text-lg text-slate-300">
            Access all your purchased courses and continue learning
          </p>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Total Purchases</p>
                <p className="text-3xl font-bold text-white">
                  {purchases.length}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Hours of Content</p>
                <p className="text-3xl font-bold text-white">
                  {purchases.length * 2.5}h
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Total Spent</p>
                <p className="text-3xl font-bold text-white">
                  ₹
                  {purchases.reduce((sum, purchase) => sum + purchase.price, 0)}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-6 mb-8 border bg-red-500/20 border-red-400/30 rounded-2xl backdrop-blur-sm">
            <p className="font-medium text-center text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 mb-4 border-4 border-orange-200 rounded-full border-t-orange-500 animate-spin"></div>
              <p className="text-lg text-slate-300">
                Loading your purchases...
              </p>
            </div>
          </div>
        ) : purchases.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="overflow-hidden transition-all duration-300 border shadow-lg bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20 group hover:shadow-xl"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    src={
                      purchase.image?.url ||
                      "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg"
                    }
                    alt={purchase.title}
                  />
                  <div className="absolute px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full top-4 right-4">
                    Owned
                  </div>
                  <div className="absolute flex items-center space-x-2 bottom-4 left-4">
                    <div className="flex items-center px-2 py-1 space-x-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">2h 30m</span>
                    </div>
                    <div className="flex items-center px-2 py-1 space-x-1 rounded-full bg-black/50 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-white">4.8</span>
                    </div>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-white line-clamp-2">
                    {purchase.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate-300 line-clamp-3">
                    {purchase.description.length > 100
                      ? `${purchase.description.slice(0, 100)}...`
                      : purchase.description}
                  </p>

                  {/* Purchase Info */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="px-3 py-1 text-sm font-semibold text-green-400 rounded-full bg-green-500/20">
                      ✓ Purchased
                    </div>
                    <span className="text-lg font-bold text-orange-400">
                      ₹{purchase.price}
                    </span>
                  </div>

                  {/* Continue Learning Button */}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="max-w-md p-12 mx-auto border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-white/10">
                <ShoppingBag className="w-12 h-12 text-slate-400" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                No Purchases Yet
              </h2>
              <p className="mb-8 text-slate-300">
                Start your learning journey by purchasing your first course!
              </p>
              <Link
                to="/courses"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 inline-block transform hover:scale-[1.02] shadow-lg"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Purchases;
