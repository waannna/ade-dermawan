const express = require("express");
const router = express.Router();

const documentController = require(
  "../controllers/documentController"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);

// ======================
// GET ALL DOCUMENTS
// ======================
router.get(
  "/",
  authMiddleware,
  documentController.getDocuments
);

// ======================
// GET DOCUMENT BY ID
// ======================
router.get(
  "/:id",
  authMiddleware,
  documentController.getDocumentById
);

// ======================
// CREATE DOCUMENT
// ======================
router.post(
  "/",
  authMiddleware,
  documentController.createDocument
);

// ======================
// DELETE DOCUMENT
// ======================
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  documentController.deleteDocument
);

module.exports = router;