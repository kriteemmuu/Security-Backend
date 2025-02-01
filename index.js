// Import required packages
// const xssClean = require("xss-clean");
const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const colors = require("colors");
const morgan = require("morgan");
const axios = require("axios");
const fs = require("fs").promises; 
const https = require("https");
const path = require("path");
const activityLogger = require("./middleware/acitivityLogger");
// const helmet = require("helmet");

// Load environment variables
dotenv.config();

// Connect to the database
connectDatabase();
// //cloudinary config
// cloudinary.v2.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.100.50:3000',   
];

 const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS')); 
      }
    },
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type,Authorization', 
    credentials: true,
  };

// Create an express app
const app = express();
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"], 
//         scriptSrc: ["'self'", "https://trusted.cdn.com"], 
//         styleSrc: ["'self'", "https://fonts.googleapis.com"], 
//         imgSrc: ["'self'", "data:", "https://trusted.images.com"],
//         connectSrc: ["'self'", "https://api.trusted.com"], 
//         frameAncestors: ["'none'"], 
//         objectSrc: ["'none'"], 
//         upgradeInsecureRequests: [], 
//       },
//     },
//   })
// );

// Configure CORS policy
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(fileUpload());
app.use(activityLogger);

// Define the port
const PORT = process.env.PORT || 3001;

// Test endpoint
app.get("/", (req, res) => res.send("<h1>Server is Working...</h1>"));

// Khalti integration: Optimized using axios
app.post("/khalti-pay", async (req, res) => {
  try {
    const { data } = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      req.body,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data || "Khalti payment initiation failed.",
    });
  }
});

// Khalti payment status lookup
app.get("/payment-success", async (req, res) => {
  try {
    const { data } = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx: req.query.pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(
      data.status === "Completed" ? 200 : data.status === "Pending" ? 202 : 400
    ).json({
      success: data.status === "Completed",
      status: data.status,
      message:
        data.status === "Completed"
          ? "Payment successful."
          : data.status === "Pending"
          ? "Payment is pending."
          : "Payment failed.",
    });
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data || "Failed to fetch payment status.",
    });
  }
});

// API routes
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/product", require("./routes/productRoutes"));
app.use("/api/review", require("./routes/reviewRoutes"));
app.use("/api/order", require("./routes/orderRoutes"));

// // Create HTTPS server with async SSL certificate loading
// (async () => {
//   try {
//     const options = {
//       key: await fs.readFile(path.join(__dirname, "server.key")),
//       cert: await fs.readFile(path.join(__dirname, "server.crt")),
//       requestCert: false,
//       rejectUnauthorized: false,
//     };

//     https.createServer(options, app).listen(PORT, () => {
//       console.log(
//         `✅ Server is Running at: https://localhost:${PORT}`.cyan.bold
//       );
//     });
//   } catch (error) {
//     console.error("❌ Failed to load SSL certificates:", error);
//   }
// })();

//server PORT
app.listen(PORT, () => {
  console.log(`Server is Running at: http://localhost:${PORT}`.cyan.bold);
});
// app.use(xssClean());
// Export app for testing
module.exports = app;
