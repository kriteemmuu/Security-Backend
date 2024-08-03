const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

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
    // Fetch user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if avatar file is uploaded
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        success: false,
        message: "Avatar image not found",
      });
    }

    // Define avatar image details
    const { avatar } = req.files;
    const imageName = `${Date.now()}-${avatar.name}`;
    const directoryPath = path.join(__dirname, "../public/profile");

    // Ensure directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define full image upload path
    const imageUploadPath = path.join(directoryPath, imageName);

    // Delete the old avatar if it exists
    if (user.avatar) {
      const oldImagePath = path.join(directoryPath, user.avatar);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Move the uploaded avatar to the designated path
    await avatar.mv(imageUploadPath);

    // Update user details
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.avatar = imageName;

    // Save updated user
    await user.save();

    return res.status(200).json({
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

module.exports = updateUser;

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

//find All Users(By Admin)
const AllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
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
  AllUsers,
};
