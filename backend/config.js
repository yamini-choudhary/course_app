import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export default {
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
};

// import dotenv from "dotenv";
// import path from "path"; // Import the path module

// // Get the directory name of the current module file
// // This ensures that the path is relative to config.js itself
// const __dirname = path.dirname(new URL(import.meta.url).pathname);

// // Configure dotenv to look for .env in the parent directory (courseapp/ root)
// dotenv.config({ path: path.resolve(__dirname, "../.env") });

// const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
// const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// export default {
//   JWT_USER_PASSWORD,
//   JWT_ADMIN_PASSWORD,
//   STRIPE_SECRET_KEY,
// };
