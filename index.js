// Imporing the packages (express)
const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const acceptFormData = require("express-fileupload");
const colors = require("colors");
const morgan = require("morgan");
const reviewRoutes = require("./routes/reviewRoutes");
const request = require("request");
const axios = require("axios");

// dotenv Configuration
dotenv.config();
// Connecting to database
connectDatabase();
// Creating an express app
const app = express();

// Configure Cors Policy

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionsSuccessStatus: 201,
};

// Use the cors middleware with the specified options

// Express Json Config
app.use(express.json());
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
app.use(morgan("dev"));

app.use(express.static("./public"));

//config formdata
app.use(acceptFormData());

// Defining the port
const PORT = process.env.PORT || 3001;

// Making a test endpoint
// Endpoints : POST, GET, PUT, DELETE

//server is working or not
app.get("/", (req, res) => {
  res.send("<h1>Server is Working...</h1>");
});

//Khalti integration
app.post("/khalti-pay", (req, res) => {
  const payload = req.body;

  const options = {
    method: "POST",
    url: "https://a.khalti.com/api/v2/epayment/initiate/",
    headers: {
      Authorization: "Key live_secret_key_68791341fdd94846a146f0457ff7b455",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  request(options, (error, response, body) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (response.statusCode !== 200) {
      return res.status(response.statusCode).json({
        success: false,
        message: `Khalti payment initiation failed: ${body}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: JSON.parse(body),
    });
  });
});

app.get("/payment-success", async (req, res) => {
  const { pidx } = req.query;

  try {
    const lookupResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "Key live_secret_key_68791341fdd94846a146f0457ff7b455",
          "Content-Type": "application/json",
        },
      }
    );

    const paymentStatus = lookupResponse.data.status;

    if (paymentStatus === "Completed") {
      return res.status(200).json({ success: true, status: paymentStatus });
    } else if (paymentStatus === "Pending") {
      return res.status(202).json({
        success: false,
        status: paymentStatus,
        message: "Payment is pending. Please wait.",
      });
    } else if (paymentStatus === "Failed") {
      return res.status(400).json({
        success: false,
        status: paymentStatus,
        message: "Payment failed. Please try again.",
      });
    } else {
      return res.status(400).json({
        success: false,
        status: paymentStatus,
        message: `Unknown payment status: ${paymentStatus}`,
      });
    }
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: `Khalti payment lookup failed: ${JSON.stringify(
          error.response.data
        )}`,
      });
    } else if (error.request) {
      return res.status(500).json({
        success: false,
        message: "No response from Khalti server.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: `Error: ${error.message}`,
      });
    }
  }
});

app.use("/api/user", require("./routes/userRoutes"));

app.use("/api/product", require("./routes/productRoutes"));

app.use("/api/review", require("./routes/reviewRoutes"));
//orderRoute
app.use("/api/order", require("./routes/orderRoutes"));

// http://localhost:3001/api/user/create

// Starting the server
app.listen(PORT, () => {
  console.log(
    `Server is Running on port: http://localhost:${PORT}`.cyan.underline.bold
  );
});
module.exports = app;
