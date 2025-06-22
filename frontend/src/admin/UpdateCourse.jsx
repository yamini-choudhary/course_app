import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  BookOpen,
  DollarSign,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

function UpdateCourse() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/api/v1/course/${id}`,
          { withCredentials: true }
        );

        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);
        setImagePreview(data.course.image.url);
        setLoading(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImagePreview(reader.result);
        setImage(file);
      };
    }
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();

    if (!title || !description || !price) {
      toast.error("Please fill all required fields");
      return;
    }

    setUpdating(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image) {
      formData.append("imageUrl", image);
    }

    const admin = JSON.parse(localStorage.getItem("admin") || "{}");
    const token = admin.token;

    if (!token) {
      toast.error("Please login to admin");
      setUpdating(false);
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4001/api/v1/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success(response.data.message || "Course updated successfully");
      navigate("/admin/our-courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Failed to update course");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-orange-500 rounded-full animate-spin"></div>
          <p className="text-lg text-white">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              Update Course
            </h1>
            <p className="text-slate-300">Modify your course details</p>
          </div>
          <Link
            to="/admin/our-courses"
            className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-all duration-300 border bg-white/10 border-white/20 rounded-xl hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </Link>
        </div>

        {/* Form */}
        <div className="p-8 border bg-white/10 backdrop-blur-sm rounded-2xl border-white/20">
          <form onSubmit={handleUpdateCourse} className="space-y-8">
            {/* Title */}
            <div>
              <label className="flex items-center mb-3 space-x-2 text-lg font-medium text-white">
                <BookOpen className="w-5 h-5" />
                <span>Course Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter an engaging course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-4 text-white transition-all duration-300 border bg-white/10 border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center mb-3 space-x-2 text-lg font-medium text-white">
                <FileText className="w-5 h-5" />
                <span>Course Description</span>
              </label>
              <textarea
                placeholder="Describe what students will learn in this course"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-4 text-white transition-all duration-300 border resize-none bg-white/10 border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center mb-3 space-x-2 text-lg font-medium text-white">
                <DollarSign className="w-5 h-5" />
                <span>Course Price (₹)</span>
              </label>
              <input
                type="number"
                placeholder="Set your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                className="w-full px-4 py-4 text-white transition-all duration-300 border bg-white/10 border-white/20 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center mb-3 space-x-2 text-lg font-medium text-white">
                <ImageIcon className="w-5 h-5" />
                <span>Course Thumbnail</span>
              </label>

              {/* Image Preview */}
              <div className="mb-4">
                <div className="relative w-full h-64 overflow-hidden border-2 border-dashed bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border-white/20">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Course preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <ImageIcon className="w-12 h-12 mb-2" />
                      <p className="text-lg font-medium">
                        Course Thumbnail Preview
                      </p>
                      <p className="text-sm">Upload an image to see preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* File Input */}
              <div className="relative">
                <input
                  type="file"
                  onChange={changePhotoHandler}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center px-6 py-4 text-white transition-all duration-300 border cursor-pointer bg-white/10 border-white/20 rounded-xl hover:bg-white/20">
                  <Upload className="w-5 h-5 mr-2" />
                  <span className="font-medium">Change Course Image</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-400">
                Leave empty to keep current image. Recommended size: 1280x720px.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={updating}
                className="w-full py-4 text-lg font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
                    <span>Updating Course...</span>
                  </div>
                ) : (
                  "Update Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCourse;
