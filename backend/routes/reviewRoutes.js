const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL REVIEWS (public)
router.get("/", reviewController.getReviews);

// GET REVIEWS BY LAWYER (public)
router.get("/lawyer/:lawyerId", reviewController.getReviewsByLawyer);

// CHECK IF CAN REVIEW
router.get("/can-review/:consultation_id", authMiddleware, reviewController.canReview);

// CREATE REVIEW (hanya client yang sudah login)
router.post("/", authMiddleware, reviewController.createReview);

module.exports = router;