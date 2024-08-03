const router = require("express").Router();
const userController = require("../controllers/userControllers");
const { auth, authAdmin } = require("../middleware/auth");

// Creating user registration route
router.post("/create", userController.createUser);

// login routes
router.post("/login", userController.loginUser);
router.get("/me", auth, userController.getUser);
router.put("/update", auth, userController.updateUser);
router.put("/change-password", auth, userController.changePassword);
router.get("/all-adminUsers", auth, authAdmin, userController.AllUsers);

// controller (Export) - Routes (inport) - use - (index.js)

// exporting the router
module.exports = router;
