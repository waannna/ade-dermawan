const express = require("express");
const router = express.Router();
const multer = require("multer");

const consultationController = require("../controllers/consultationController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ======================
// SETUP MULTER (UPLOAD FILE KE MEMORY)
// ======================
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File harus berupa gambar (JPEG/PNG) atau PDF'), false);
    }
  }
});

// ======================
// CREATE CONSULTATION
// ======================
router.post("/", authMiddleware, consultationController.createConsultation);

// ======================
// GET ALL CONSULTATIONS (FILTER BY ROLE & HIDDEN)
// ======================
router.get("/", authMiddleware, consultationController.getConsultations);

// ======================
// GET CLIENT CONSULTATIONS
// ======================
router.get("/client", authMiddleware, roleMiddleware("client"), consultationController.getClientConsultations);

// ======================
// GET BOOKED SLOTS
// ======================
router.get("/lawyer/:lawyerId/schedule", authMiddleware, consultationController.getBookedSlots);

// ======================
// GET CONSULTATION BY ID
// ======================
router.get("/:id", authMiddleware, consultationController.getConsultationById);

// ======================
// HIDE CONSULTATION (Soft Delete)
// ======================
router.patch("/:id/hide", authMiddleware, consultationController.hideConsultation);

// ======================
// UPDATE STATUS (GENERAL)
// ======================
router.patch("/:id/status", authMiddleware, roleMiddleware("lawyer", "admin"), consultationController.updateStatus);

// ======================
// UPDATE MEETING LINK
// ======================
router.patch("/:id/meeting-link", authMiddleware, roleMiddleware("lawyer", "admin"), consultationController.updateMeetingLink);

// ======================
// ALUR PEMBAYARAN
// ======================
router.patch("/:id/accept", authMiddleware, roleMiddleware("lawyer"), consultationController.acceptConsultation);
router.post("/upload-dp", authMiddleware, upload.single("dp_proof"), consultationController.uploadDpProof);
router.patch("/:id/verify-dp", authMiddleware, roleMiddleware("admin"), consultationController.verifyDp);
router.patch("/:id/add-meeting-link", authMiddleware, roleMiddleware("lawyer"), consultationController.addMeetingLink);
router.patch("/:id/complete-case", authMiddleware, roleMiddleware("lawyer"), consultationController.completeConsultation);
router.post("/upload-final-payment", authMiddleware, upload.single("final_payment_proof"), consultationController.uploadFinalPaymentProof);
router.patch("/:id/verify-final-payment", authMiddleware, roleMiddleware("admin"), consultationController.verifyFinalPayment);

// ======================
// ADMIN WALLET & VERIFIKASI
// ======================
router.get("/admin/wallet", authMiddleware, roleMiddleware("admin"), consultationController.getAdminWallet);
router.get("/admin/waiting-dp", authMiddleware, roleMiddleware("admin"), consultationController.getWaitingDp);
router.get("/admin/waiting-pelunasan", authMiddleware, roleMiddleware("admin"), consultationController.getWaitingPelunasan);

module.exports = router;