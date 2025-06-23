import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Edit3,
  Trash2,
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  Users,
  AlertTriangle,
  X,
} from "lucide-react"; 
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // State for the custom delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);
  const [courseToDeleteTitle, setCourseToDeleteTitle] = useState("");

  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const token = admin.token;

  // This block will redirect before rendering anything if no token is found.
  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  // Fetch courses
  useEffect(() => {
    if (!token) return;

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/courses`,
          {
            withCredentials: true,
          }
        );
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("Error in fetchCourses:", error);
        toast.error("Failed to fetch courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  // Function to open the custom delete modal
  const openDeleteModal = (courseId, courseTitle) => {
    setCourseToDeleteId(courseId);
    setCourseToDeleteTitle(courseTitle);
    setShowDeleteModal(true);
  };

  // Function to close the custom delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCourseToDeleteId(null);
    setCourseToDeleteTitle("");
  };

  // Delete course function (called after modal confirmation)
  const confirmDelete = async () => {
    if (!courseToDeleteId) return;

    closeDeleteModal(); 

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${courseToDeleteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter(
        (course) => course._id !== courseToDeleteId
      );
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course:", error);
      toast.error(error.response?.data?.errors || "Error in deleting course");
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-orange-500 rounded-full animate-spin"></div>
          <p className="text-lg text-white">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Course Management
            </h1>
            <p className="text-slate-300">Manage your course collection</p>
          </div>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center px-6 py-3 mt-4 space-x-2 text-white transition-all duration-300 shadow-lg md:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="p-6 mb-8 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 text-white border rounded-lg bg-white/10 border-white/20 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center px-6 py-3 space-x-2 text-white transition-all duration-300 border rounded-lg bg-white/10 border-white/20 hover:bg-white/20">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
          <div className="p-6 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
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
          <div className="p-6 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Average Price</p>
                <p className="text-3xl font-bold text-white">
                  ₹
                  {courses.length > 0
                    ? Math.round(
                        courses.reduce((sum, course) => sum + course.price, 0) /
                          courses.length
                      )
                    : 0}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="p-6 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-slate-300">Published</p>
                <p className="text-3xl font-bold text-white">
                  {courses.length}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="mb-2 text-2xl font-semibold text-white">
              No courses found
            </h3>
            <p className="mb-6 text-slate-300">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Create your first course to get started"}
            </p>
            <Link
              to="/admin/create-course"
              className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl hover:from-orange-600 hover:to-orange-700"
            >
              <span>Create Course</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="overflow-hidden transition-all duration-300 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20 hover:bg-white/20 group"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      course?.image?.url ||
                      "https://images.pexels.com/photos/5905901/pexels-photo-5905901.jpeg"
                    }
                    alt={course.title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-full top-4 right-4">
                    10% Off
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-semibold text-white line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="mb-4 text-sm text-slate-300 line-clamp-3">
                    {course.description.length > 120
                      ? `${course.description.slice(0, 120)}...`
                      : course.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-white">
                        ₹{course.price}
                      </span>
                      <span className="line-through text-slate-400">₹300</span>
                    </div>
                    <div className="px-2 py-1 text-xs font-semibold text-green-400 rounded-full bg-green-500/20">
                      BESTSELLER
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-3">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className="flex items-center justify-center flex-1 px-4 py-3 space-x-2 text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => openDeleteModal(course._id, course.title)} // Call openDeleteModal
                      className="flex items-center justify-center flex-1 px-4 py-3 space-x-2 text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- */}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-8 border shadow-xl border-white/20 bg-white/10 rounded-2xl animate-fade-in-up">
            <button
              onClick={closeDeleteModal}
              className="absolute p-2 text-white transition-all duration-300 rounded-full top-4 right-4 hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center justify-center mb-6">
              <AlertTriangle className="w-16 h-16 mb-4 text-red-500" />
              <h2 className="text-3xl font-bold text-white">
                Confirm Deletion
              </h2>
            </div>
            <p className="mb-8 text-lg text-center text-slate-300">
              Are you sure you want to delete the course "
              <span className="font-semibold text-orange-400">
                {courseToDeleteTitle}
              </span>
              "? This action cannot be undone.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-3 text-white transition-all duration-300 border shadow-lg rounded-xl bg-white/10 border-white/20 hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OurCourses;
