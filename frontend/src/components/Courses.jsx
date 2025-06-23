import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Home,
  BookOpen,
  Download,
  Settings,
  LogIn,
  LogOut,
  Search,
  Menu,
  X,
  GraduationCap,
  Star,
  Clock,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  console.log("courses: ", courses);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.courses);
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        setLoading(false);
      }
    };
    fetchCourses();
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
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <div className="flex items-center p-4 text-white shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <BookOpen className="w-5 h-5 mr-3" />
                <span className="font-medium">Courses</span>
              </div>
            </li>
            <li>
              <Link
                to="/purchases"
                className="flex items-center p-4 text-white transition-all duration-300 border border-transparent rounded-xl hover:bg-white/20 hover:border-white/20"
              >
                <Download className="w-5 h-5 mr-3" />
                <span className="font-medium">My Purchases</span>
              </Link>
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

      {/* Main content */}
      <main className="flex-1 p-6 ml-0 md:p-8 md:ml-0">
        {/* Header */}
        <header className="flex flex-col gap-6 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="ml-12 md:ml-0">
            <h1 className="mb-2 text-4xl font-bold text-white">
              Explore Courses
            </h1>
            <p className="text-lg text-slate-300">
              Discover amazing courses to boost your skills
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 text-slate-400 left-4 top-1/2" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 pl-12 pr-4 text-white transition-all duration-300 border w-80 bg-white/10 border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Total Courses</p>
                <p className="text-3xl font-bold text-white">
                  {courses.length}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Active Students</p>
                <p className="text-3xl font-bold text-white">2,847</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Average Rating</p>
                <p className="text-3xl font-bold text-white">4.8</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Course Count */}
        <div className="mb-6">
          <p className="text-lg text-slate-300">
            {loading
              ? "Loading..."
              : `${filteredCourses.length} course${
                  filteredCourses.length !== 1 ? "s" : ""
                } found`}
          </p>
        </div>

        {/* Courses Grid */}
        <div className="overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 mb-4 border-4 border-orange-200 rounded-full border-t-orange-500 animate-spin"></div>
                <p className="text-lg text-slate-300">Loading courses...</p>
              </div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-16 text-center">
              <div className="max-w-md p-12 mx-auto border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="mb-2 text-2xl font-semibold text-white">
                  No Courses Found
                </h3>
                <p className="text-slate-300">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "No courses available yet"}
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="overflow-hidden transition-all duration-300 border shadow-lg bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20 group hover:shadow-xl"
                >
                  {/* Course Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image.url}
                      alt={course.title}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-full top-4 right-4">
                      20% Off
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
                      {course.title}
                    </h3>
                    <p className="mb-4 text-sm text-slate-300 line-clamp-3">
                      {course.description.length > 100
                        ? `${course.description.slice(0, 100)}...`
                        : course.description}
                    </p>

                    {/* Price Section */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                          ₹{course.price}
                        </span>
                        <span className="text-sm line-through text-slate-400">
                          ₹5999
                        </span>
                      </div>
                      <div className="px-2 py-1 text-xs font-semibold text-green-400 rounded-full bg-green-500/20">
                        BESTSELLER
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <Link
                      to={`/buy/${course._id}`}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 text-center block transform hover:scale-[1.02] shadow-lg"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;
