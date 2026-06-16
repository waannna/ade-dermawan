const db = require("../config/db");

// =========================
// GET ALL REVIEWS
// =========================
exports.getReviews = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        r.*,
        u.nama AS client_name
      FROM reviews r
      JOIN users u ON r.client_id = u.id
      ORDER BY r.created_at DESC
    `);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

// =========================
// GET REVIEWS BY LAWYER
// =========================
exports.getReviewsByLawyer = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    
    const result = await db.query(
      `
      SELECT
        r.*,
        u.nama AS client_name
      FROM reviews r
      JOIN users u ON r.client_id = u.id
      WHERE r.lawyer_id = $1
      ORDER BY r.created_at DESC
      `,
      [lawyerId]
    );

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

// =========================
// CREATE REVIEW (SETELAH KONSULTASI SELESAI)
// =========================
exports.createReview = async (req, res) => {
  try {
    const { consultation_id, rating, komentar } = req.body;
    const client_id = req.user.id;

    // VALIDASI CONSULTATION
    if (!consultation_id) {
      return res.status(400).json({
        success: false,
        message: "Konsultasi wajib dipilih",
      });
    }

    // Cek konsultasi milik client dan status completed
    const consultation = await db.query(
      `
      SELECT c.*, l.id as lawyer_id 
      FROM consultations c
      JOIN lawyers l ON c.lawyer_id = l.id
      WHERE c.id = $1 AND c.client_id = $2
      `,
      [consultation_id, client_id]
    );

    if (consultation.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Konsultasi tidak ditemukan",
      });
    }

    if (consultation.rows[0].status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: "Konsultasi belum selesai. Silakan selesaikan konsultasi terlebih dahulu.",
      });
    }

    const lawyer_id = consultation.rows[0].lawyer_id;

    // VALIDASI RATING
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating harus antara 1 sampai 5",
      });
    }

    // VALIDASI KOMENTAR
    if (!komentar?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Komentar wajib diisi",
      });
    }

    // CEK REVIEW GANDA
    const existingReview = await db.query(
      `SELECT id FROM reviews WHERE consultation_id = $1`,
      [consultation_id]
    );

    if (existingReview.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Review sudah pernah dibuat",
      });
    }

    // INSERT REVIEW
    const result = await db.query(
      `
      INSERT INTO reviews (consultation_id, client_id, lawyer_id, rating, komentar)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [consultation_id, client_id, lawyer_id, rating, komentar]
    );

    // UPDATE RATING RATA-RATA LAWYER
    await updateLawyerRating(lawyer_id);

    return res.status(201).json({
      success: true,
      message: "Terima kasih! Review Anda telah disimpan.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};

// =========================
// UPDATE RATING LAWYER (Helper)
// =========================
const updateLawyerRating = async (lawyer_id) => {
  const result = await db.query(
    `
    SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
    FROM reviews
    WHERE lawyer_id = $1
    `,
    [lawyer_id]
  );
  
  const avgRating = parseFloat(result.rows[0].avg_rating) || 0;
  const roundedRating = Math.round(avgRating * 10) / 10;
  
  await db.query(
    `UPDATE lawyers SET rating = $1 WHERE id = $2`,
    [roundedRating, lawyer_id]
  );
};

// =========================
// CHECK IF USER CAN REVIEW
// =========================
exports.canReview = async (req, res) => {
  try {
    const { consultation_id } = req.params;
    const client_id = req.user.id;

    const result = await db.query(
      `
      SELECT c.*, 
        EXISTS(SELECT 1 FROM reviews WHERE consultation_id = c.id) as already_reviewed
      FROM consultations c
      WHERE c.id = $1 AND c.client_id = $2 AND c.status = 'completed'
      `,
      [consultation_id, client_id]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: true,
        canReview: false,
        message: "Konsultasi belum selesai atau tidak ditemukan"
      });
    }

    const alreadyReviewed = result.rows[0].already_reviewed;

    return res.json({
      success: true,
      canReview: !alreadyReviewed,
      alreadyReviewed: alreadyReviewed,
      consultation: result.rows[0]
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server"
    });
  }
};