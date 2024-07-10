// Imporing the packages (express)
const express = require("express");
const connectDatabase = require("./database/database");
const dotenv = require("dotenv");
const cors = require("cors");
const acceptFormData = require("express-fileupload");
const colors = require("colors");
const morgan = require("morgan");

// dotenv Configuration
dotenv.config();
// Connecting to database
connectDatabase();
// Creating an express app
const app = express();

// Configure Cors Policy

const corsOptions = {
  origin: true, // Replace with your client-side origin
  credentials: true, // Enable sending cookies with CORS
  optionSuccessStatus: 201
};

// Express Json Config
app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
app.use(morgan("dev"));

app.use(express.static("./public"))


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
app.use("/api/user", require("./routes/userRoutes"));

app.use("/api/product", require("./routes/productRoutes"));



// http://localhost:3001/api/user/create

// Starting the server
app.listen(PORT, () => {
  console.log(
    `Server is Running on port: http://localhost:${PORT}`.cyan.underline.bold
  );
})
module.exports=app;

