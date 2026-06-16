const db = require("../config/db");

// =========================
// GET ALL DOCUMENTS
// =========================
exports.getDocuments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        d.*,
        c.judul_kasus
      FROM documents d
      JOIN consultations c
      ON d.consultation_id = c.id
      ORDER BY d.uploaded_at DESC
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
// GET DOCUMENT BY ID
// =========================
exports.getDocumentById = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM documents
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Dokumen tidak ditemukan",
      });
    }

    return res.json({
      success: true,
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
// CREATE DOCUMENT
// =========================
exports.createDocument = async (req, res) => {
  try {
    const {
      consultation_id,
      file_name,
      file_url,
    } = req.body;

    // VALIDASI CONSULTATION
    if (!consultation_id) {
      return res.status(400).json({
        success: false,
        message: "Konsultasi wajib dipilih",
      });
    }

    const consultation =
      await db.query(
        `
        SELECT id
        FROM consultations
        WHERE id = $1
        `,
        [consultation_id]
      );

    if (
      consultation.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Konsultasi tidak ditemukan",
      });
    }

    // VALIDASI FILE NAME
    if (!file_name?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Nama file wajib diisi",
      });
    }

    // VALIDASI FILE URL
    if (!file_url?.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "File URL wajib diisi",
      });
    }

    const result = await db.query(
      `
      INSERT INTO documents
      (
        consultation_id,
        file_name,
        file_url
      )
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [
        consultation_id,
        file_name,
        file_url,
      ]
    );

    return res.status(201).json({
      success: true,
      message:
        "Dokumen berhasil diupload",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan server",
    });
  }
};

// =========================
// DELETE DOCUMENT
// =========================
exports.deleteDocument = async (req, res) => {
  try {
    const document =
      await db.query(
        `
        SELECT id
        FROM documents
        WHERE id = $1
        `,
        [req.params.id]
      );

    if (
      document.rows.length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "Dokumen tidak ditemukan",
      });
    }

    await db.query(
      `
      DELETE FROM documents
      WHERE id = $1
      `,
      [req.params.id]
    );

    return res.json({
      success: true,
      message:
        "Dokumen berhasil dihapus",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message:
        "Terjadi kesalahan server",
    });
  }
};