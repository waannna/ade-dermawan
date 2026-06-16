const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ======================
// GET ALL USERS
// ADMIN ONLY
// ======================
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getUsers
);

// ======================
// GET USER BY ID
// ADMIN ONLY
// ======================
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getUserById
);

// ======================
// UPDATE USER
// ADMIN ONLY
// ======================
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.updateUser
);

// ======================
// DELETE USER
// ADMIN ONLY
// ======================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deleteUser
);

module.exports = router;