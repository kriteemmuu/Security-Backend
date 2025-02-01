const router = require("express").Router();
const userController = require("../controllers/userControllers");
const { auth, authAdmin } = require("../middleware/auth");

// Creating user registration route
router.post("/create", userController.createUser);
router.post("/verify-account",userController.verifyAccount)
router.post("/resend-otp",userController.resendOTP)

// login routes
router.get("/me", auth, userController.getUser);
router.put("/update", auth, userController.updateUser);
router.put("/change-password", auth, userController.changePassword);
router.get("/all-adminUsers", auth, authAdmin, userController.AllUsers);
router.get(
  "/single-user/:id",
  auth,
  authAdmin,  
  userController.singleUserByAdmin
);

router.post("/login", userController.loginCredentials);


module.exports = router;
