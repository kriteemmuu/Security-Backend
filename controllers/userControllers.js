const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  // 2. Destructure the incomming data
  const { firstName, lastName, email, password, phone } = req.body;

  // 3. Validate the data (if empty, stop the process and send res)
  if (!firstName || !lastName || !email || !password || !phone) {
    // res.send("Please enter all fields!")
    return res.json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    // 5. Check if the user is already registered
    const existingUser = await User.findOne({ email: email });

    // 5.1 if user found: Send response
    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already Exists!",
      });
    }

    // Hashing/Encryption of the password
    const randomSalt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, randomSalt);

    // 5.2 if user is new:
    const newUser = new User({
      // Database Fields : Client's Value
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      password: hashedPassword,
    });

    // Save to database
    await newUser.save();

    // send the response
    res.json({
      success: true,
      message: "User Created Successfully!",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// Login function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist!",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match!",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "User logged in successfully!",
      token: token,
      userData: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

//get User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched!",
      user,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const updateUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully!",
      user,
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
};

// exporting
module.exports = {
  createUser,
  loginUser,
  getUser,
  updateUser,
  changePassword,
};
