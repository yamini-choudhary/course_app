import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  GraduationCap,
  PlayCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BACKEND_URL } from "../utils/utils";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch courses
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
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // logout
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

  // react-slick settings
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Loop the carousel
    speed: 500, // Transition speed in milliseconds
    slidesToShow: 4, // Number of slides to show at once
    slidesToScroll: 1, // Number of slides to scroll at once
    autoplay: true, // Enable auto-play
    autoplaySpeed: 3000, // Time between slides in milliseconds (3 seconds)
    cssEase: "linear", // Type of easing for the transition
    responsive: [
      // Responsive settings for different screen sizes
      {
        breakpoint: 1024, // Tailwind's lg breakpoint
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768, // Tailwind's md breakpoint
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 640, // Tailwind's sm breakpoint
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto text-white">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text">
              CourseHaven
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-6 py-2 font-medium text-orange-400 transition-all duration-300 bg-transparent border-2 border-orange-400 rounded-full hover:bg-orange-400 hover:text-white"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="px-6 py-2 font-medium text-white transition-all duration-300 bg-transparent border-2 rounded-full border-white/20 hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="px-6 py-2 font-medium text-white transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero section */}
        <section className="px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Welcome to{" "}
              <span className="text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text">
                CourseHaven
              </span>
            </h1>
            <p className="max-w-2xl mx-auto mb-12 text-xl leading-relaxed text-gray-300">
              Sharpen your skills with expertly crafted courses designed to
              accelerate your learning journey
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                to={"/courses"}
                className="flex items-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105"
              >
                <GraduationCap className="w-5 h-5" />
                Explore Courses
              </Link>
              <Link
                to={"https://www.youtube.com/learncodingofficial"}
                className="flex items-center gap-2 px-8 py-4 font-semibold transition-all duration-300 transform bg-white rounded-full shadow-lg text-slate-900 hover:bg-gray-100 hover:scale-105"
              >
                <PlayCircle className="w-5 h-5" />
                Watch Videos
              </Link>
            </div>
          </div>
        </section>

        {/* Courses section */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-12 text-3xl font-bold text-center">
              Featured Courses
            </h2>
            <Slider {...settings}>
              {" "}
              {/* Apply react-slick settings here */}
              {courses.slice(0, 8).map((course) => (
                <div key={course._id} className="p-2">
                  {" "}
                  {/* Added padding for spacing within slides */}
                  <div className="group">
                    <div className="overflow-hidden transition-all duration-300 transform border bg-slate-800/50 backdrop-blur-sm rounded-2xl hover:bg-slate-800/70 hover:scale-105 border-slate-700/50">
                      <div className="overflow-hidden aspect-video">
                        <img
                          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                          src={course.image.url}
                          alt={course.title}
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="mb-3 text-xl font-bold text-white line-clamp-2">
                          {course.title}
                        </h3>
                        <Link
                          to={`/buy/${course._id}`}
                          className="block w-full px-6 py-3 font-medium text-center text-white transition-all duration-300 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-4 py-12 mt-20 border-t border-slate-700/50">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center mb-4 space-x-3 md:justify-start">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-600">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text">
                    CourseHaven
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="mb-4 text-gray-400">
                    Follow us on social media
                  </p>
                  <div className="flex justify-center space-x-4 md:justify-start">
                    <a
                      href="#"
                      className="text-gray-400 transition-colors duration-300 hover:text-blue-400"
                    >
                      <Facebook className="w-6 h-6" />
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 transition-colors duration-300 hover:text-pink-400"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a
                      href="#"
                      className="text-gray-400 transition-colors duration-300 hover:text-blue-400"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h4 className="mb-4 text-lg font-semibold text-white">
                  Connect
                </h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="transition-colors duration-300 cursor-pointer hover:text-white">
                    YouTube - Learn Coding
                  </li>
                  <li className="transition-colors duration-300 cursor-pointer hover:text-white">
                    Telegram - Learn Coding
                  </li>
                  <li className="transition-colors duration-300 cursor-pointer hover:text-white">
                    GitHub - Learn Coding
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <h4 className="mb-4 text-lg font-semibold text-white">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li className="transition-colors duration-300 cursor-pointer hover:text-white">
                    Terms & Conditions
                  </li>
                  <li className="transition-colors duration-300 cursor-pointer hover:text-white">
                    Privacy Policy
                  </li>
                  <li className="transition-colors duration-300 cursor-pointer hover:text-white">
                    Refund & Cancellation
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-8 mt-8 text-center border-t border-slate-700/50">
              <p className="text-gray-400">
                © 2024 CourseHaven. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
