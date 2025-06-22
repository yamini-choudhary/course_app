import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe(
  "pk_test_51RbMv2CNG7aGT0lVErta7ocfiYNfTqgxNLFcspIqjTzQlEqmVjlxJRfV1Dz9Kdn0iq4PMSkXCcDFPCiC5UM72WlO008C2GA5BO"
);

createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
