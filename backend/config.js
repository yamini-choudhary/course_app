import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY =
  "sk_test_51RbMv2CNG7aGT0lVSpZueH6g1BrTKsfDaGfouhKbQroNS9oyYEMUJx0vQ4Wr8NeV3Tl36TmMfqbu0k29jnSjQfUg00sQr0cDqo";

export default {
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
};
