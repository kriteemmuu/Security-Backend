const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true, 
    },
    phone: {
      type: String, 
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    avatar: {
      type: String,
      default: "", 
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Password Reset & OTP
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    otp: {
      type: String, 
      select: false,
    },
    otp_expiry: Date,
    resetPasswordOtp: {
      type: String,
      select: false,
    },
    resetPasswordOtpExpiry: Date,

    
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// **Hash Password Before Saving**
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// **Generate JWT Token**
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: "8h",
  });
};

// **Compare Passwords**
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// **Check if Account is Locked**
userSchema.methods.isAccountLocked = function () {
  return this.lockUntil && this.lockUntil > Date.now();
};

// **Increment Failed Login Attempts**
userSchema.methods.incrementFailedLoginAttempts = async function () {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); 
  }
  await this.save();
};

// **Reset Failed Login Attempts**
userSchema.methods.resetFailedLoginAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;
  await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
