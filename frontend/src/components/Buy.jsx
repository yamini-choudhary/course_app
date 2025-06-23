import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CreditCard,
  ShoppingBag,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Star,
  Clock,
  Shield,
} from "lucide-react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { BACKEND_URL } from "../utils/utils";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = user?.token;

  const stripe = useStripe();
  const elements = useElements();

  if (!token) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchBuyCourseData = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data);
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
          navigate("/purchases");
        } else {
          setError(error?.response?.data?.errors);
        }
      }
    };
    fetchBuyCourseData();
  }, [courseId]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("CardElement not found");
      setLoading(false);
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.log("Stripe PaymentMethod Error: ", error);
      setLoading(false);
      setCardError(error.message);
    } else {
      console.log("[PaymentMethod Created]", paymentMethod);
    }

    if (!clientSecret) {
      console.log("No client secret found");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      });

    if (confirmError) {
      setCardError(confirmError.message);
    } else if (paymentIntent.status === "succeeded") {
      console.log("Payment succeeded: ", paymentIntent);
      setCardError("Your payment id: " + paymentIntent.id);
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };
      console.log("Payment info: ", paymentInfo);

      try {
        await axios.post("http://localhost:4001/api/v1/order", paymentInfo, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        toast.success("Payment Successful");
        navigate("/purchases");
      } catch (error) {
        console.log(error);
        toast.error("Error in making payment");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b bg-white/10 backdrop-blur-sm border-white/20">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link
              to="/courses"
              className="flex items-center px-4 py-2 transition-colors duration-300 border text-slate-300 hover:text-white bg-white/10 rounded-xl border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Courses</span>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-full">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">CourseHaven</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-12 mx-auto max-w-7xl lg:px-8">
        {error ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 text-center border bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="mb-4 text-2xl font-bold text-white">
                Purchase Error
              </h2>
              <p className="mb-8 text-slate-300">{error}</p>
              <Link
                to="/purchases"
                className="inline-block w-full px-6 py-4 font-semibold text-white transition-all duration-300 shadow-lg rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                View My Purchases
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Course Details */}
            <div className="p-8 border bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
              <div className="flex items-center mb-8">
                <ShoppingBag className="mr-3 text-orange-500 w-7 h-7" />
                <h1 className="text-3xl font-bold text-white">Order Summary</h1>
              </div>

              {course.image && (
                <div className="mb-8 overflow-hidden rounded-2xl">
                  <div className="relative">
                    <img
                      src={course.image.url}
                      alt={course.title}
                      className="object-cover w-full h-64"
                    />
                    <div className="absolute px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded-full top-4 right-4">
                      20% Off
                    </div>
                    <div className="absolute flex items-center space-x-2 bottom-4 left-4">
                      <div className="flex items-center px-3 py-1 space-x-1 rounded-full bg-black/50 backdrop-blur-sm">
                        <Clock className="w-4 h-4 text-white" />
                        <span className="text-sm text-white">2h 30m</span>
                      </div>
                      <div className="flex items-center px-3 py-1 space-x-1 rounded-full bg-black/50 backdrop-blur-sm">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="mb-4 text-xl font-semibold text-white">
                    Course Details
                  </h3>
                  <h2 className="mb-4 text-2xl font-bold text-orange-400">
                    {course.title}
                  </h2>
                  <p className="leading-relaxed text-slate-300">
                    {course.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg text-slate-300">Course Price</span>
                    <div className="flex items-center space-x-2">
                      <span className="line-through text-slate-400">₹5999</span>
                      <span className="text-2xl font-bold text-white">
                        ₹{course.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xl font-bold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-orange-400">₹{course.price}</span>
                  </div>
                  <div className="p-4 mt-4 border bg-green-500/20 rounded-xl border-green-500/30">
                    <p className="text-sm font-medium text-green-400">
                      🎉 You save ₹{5999 - course.price} with this special
                      offer!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-8 border bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl">
              <div className="flex items-center mb-8">
                <CreditCard className="mr-3 text-orange-500 w-7 h-7" />
                <h2 className="text-3xl font-bold text-white">
                  Payment Details
                </h2>
              </div>

              <form onSubmit={handlePurchase} className="space-y-8">
                <div>
                  <label className="block mb-4 text-lg font-medium text-white">
                    Credit/Debit Card Information
                  </label>
                  <div className="p-6 border bg-white/10 border-white/20 rounded-2xl backdrop-blur-sm">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "18px",
                            color: "#ffffff",
                            fontFamily: '"Inter", sans-serif',
                            "::placeholder": {
                              color: "#94a3b8",
                            },
                          },
                          invalid: {
                            color: "#ef4444",
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                {cardError && (
                  <div className="p-4 border border-red-400/30 rounded-xl bg-red-500/20">
                    <p className="font-medium text-red-400">{cardError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!stripe || loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-5 px-6 rounded-2xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 mr-3 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Complete Purchase - ₹${course.price}`
                  )}
                </button>

                <div className="p-6 border rounded-2xl bg-white/10 border-white/20">
                  <div className="flex items-center justify-center space-x-2 text-slate-300">
                    <Shield className="w-5 h-5 text-green-400" />
                    <p className="font-medium text-center">
                      Your payment information is secure and encrypted
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Buy;
