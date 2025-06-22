import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Home,
  LogOut,
  GraduationCap,
  Users,
  TrendingUp,
  Star,
  LogIn,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check admin login status on component mount
  useEffect(() => {
    const adminToken = localStorage.getItem("admin");
    if (adminToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4001/api/v1/admin/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      setIsLoggedIn(false);
      navigate("/admin/login");
    } catch (error) {
      console.log("Error in logging out:", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const stats = [
    {
      label: "Total Courses",
      value: "24",
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Active Students",
      value: "1,234",
      icon: Users,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Course Rating",
      value: "4.8",
      icon: Star,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      label: "Revenue",
      value: "$12,450",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Sidebar */}
      <div className="p-6 border-r w-80 bg-white/10 backdrop-blur-sm border-white/20">
        {/* Logo */}
        <div className="flex items-center mb-10 space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">CourseHaven</h2>
            <p className="text-sm text-slate-300">Admin Panel</p>
          </div>
        </div>

        {/* Admin Profile */}
        <div className="p-6 mb-8 bg-white/10 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600">
              <span className="text-lg font-semibold text-white">A</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Admin User</h3>
              <p className="text-sm text-slate-300">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          <Link
            to="/admin/our-courses"
            className="flex items-center px-4 py-3 space-x-3 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700"
          >
            <GraduationCap className="w-5 h-5" />
            <span className="font-medium">Our Courses</span>
          </Link>

          <Link
            to="/admin/create-course"
            className="flex items-center px-4 py-3 space-x-3 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Create Course</span>
          </Link>

          <Link
            to="/"
            className="flex items-center px-4 py-3 space-x-3 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Home</span>
          </Link>

          {/* Conditional Login/Logout Button */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 space-x-3 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <Link
              to="/admin/login" // Link to admin login page
              className="flex items-center w-full px-4 py-3 space-x-3 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-medium">Login</span>
            </Link>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Welcome to Dashboard
          </h1>
          <p className="text-slate-300">
            Manage your courses and track your progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {stat.value}
                </span>
              </div>
              <p className="font-medium text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-8 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
          <h2 className="mb-6 text-2xl font-bold text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Link
              to="/admin/create-course"
              className="p-6 transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700 group"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 rounded-full bg-white/20 group-hover:bg-white/30">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Create New Course
                  </h3>
                  <p className="text-orange-100">
                    Add a new course to your collection
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/our-courses"
              className="p-6 transition-all duration-300 shadow-lg bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-600 hover:to-green-700 group"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 rounded-full bg-white/20 group-hover:bg-white/30">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Manage Courses
                  </h3>
                  <p className="text-green-100">
                    View and edit your existing courses
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
