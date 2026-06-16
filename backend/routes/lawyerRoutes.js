const express = require("express");
const router = express.Router();

const lawyerController = require("../controllers/lawyerController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// PUBLIC (bisa diakses semua orang)
router.get("/", lawyerController.getLawyers);
router.get("/:id", lawyerController.getLawyerById);

// GET LAWYER WORKING HOURS (bisa diakses semua orang yang login)
router.get("/:id/schedule", authMiddleware, lawyerController.getLawyerSchedule);

// ADMIN ONLY
router.post("/", authMiddleware, roleMiddleware("admin"), lawyerController.createLawyer);
router.put("/:id", authMiddleware, roleMiddleware("admin"), lawyerController.updateLawyer);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), lawyerController.deleteLawyer);

// UPDATE LAWYER SCHEDULE (ADMIN ONLY) - TAMBAHAN
router.put("/:id/schedule", authMiddleware, roleMiddleware("admin"), lawyerController.updateLawyerSchedule);

module.exports = router;