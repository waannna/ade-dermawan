const db = require("../config/db");

// GET ALL LAWYERS
exports.getLawyers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        l.*,
        u.nama,
        u.email
      FROM lawyers l
      JOIN users u
      ON l.user_id = u.id
      ORDER BY l.rating DESC
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET LAWYER BY ID
exports.getLawyerById = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        l.*,
        u.nama,
        u.email
      FROM lawyers l
      JOIN users u
      ON l.user_id = u.id
      WHERE l.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lawyer tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CREATE LAWYER
exports.createLawyer = async (req, res) => {
  try {
    const {
      user_id,
      spesialisasi,
      pengalaman,
      deskripsi,
      tarif_konsultasi,
      foto_profil,
      firma_hukum,
    } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "User wajib dipilih",
      });
    }

    if (!spesialisasi?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Spesialisasi wajib diisi",
      });
    }

    if (!tarif_konsultasi || Number(tarif_konsultasi) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Tarif konsultasi tidak valid",
      });
    }

    const userCheck = await db.query(
      "SELECT id FROM users WHERE id = $1",
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    const lawyerCheck = await db.query(
      "SELECT id FROM lawyers WHERE user_id = $1",
      [user_id]
    );

    if (lawyerCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User sudah terdaftar sebagai lawyer",
      });
    }

    const result = await db.query(
      `
      INSERT INTO lawyers (
        user_id,
        spesialisasi,
        pengalaman,
        deskripsi,
        tarif_konsultasi,
        foto_profil,
        firma_hukum
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *
      `,
      [
        user_id,
        spesialisasi,
        pengalaman || 0,
        deskripsi || null,
        tarif_konsultasi,
        foto_profil || null,
        firma_hukum || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Lawyer berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE LAWYER
exports.updateLawyer = async (req, res) => {
  try {
    const {
      spesialisasi,
      pengalaman,
      deskripsi,
      tarif_konsultasi,
      foto_profil,
      firma_hukum,
      status_aktif,
    } = req.body;

    const result = await db.query(
      `
      UPDATE lawyers
      SET
        spesialisasi = $1,
        pengalaman = $2,
        deskripsi = $3,
        tarif_konsultasi = $4,
        foto_profil = $5,
        firma_hukum = $6,
        status_aktif = $7
      WHERE id = $8
      RETURNING *
      `,
      [
        spesialisasi,
        pengalaman,
        deskripsi,
        tarif_konsultasi,
        foto_profil,
        firma_hukum,
        status_aktif,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lawyer tidak ditemukan",
      });
    }

    res.json({
      success: true,
      message: "Profil lawyer berhasil diperbarui",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE LAWYER
exports.deleteLawyer = async (req, res) => {
  try {
    const lawyer = await db.query(
      "SELECT id FROM lawyers WHERE id = $1",
      [req.params.id]
    );

    if (lawyer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lawyer tidak ditemukan",
      });
    }

    await db.query(
      "DELETE FROM lawyers WHERE id = $1",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Lawyer berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// GET LAWYER SCHEDULE
// =========================
exports.getLawyerSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.query(
      `SELECT day_of_week, start_time, end_time 
       FROM lawyer_schedules 
       WHERE lawyer_id = $1 
       ORDER BY day_of_week, start_time`,
      [id]
    );
    
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const scheduleText = result.rows.map(s => {
      return `${dayNames[s.day_of_week]}: ${s.start_time.substring(0,5)} - ${s.end_time.substring(0,5)}`;
    }).join(', ');
    
    return res.json({
      success: true,
      data: {
        schedules: result.rows,
        schedule_text: scheduleText || 'Belum diatur'
      }
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
// UPDATE LAWYER SCHEDULE (TAMBAHAN)
// =========================
exports.updateLawyerSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { schedules } = req.body;

    const lawyer = await db.query("SELECT id FROM lawyers WHERE id = $1", [id]);
    if (lawyer.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lawyer tidak ditemukan"
      });
    }

    await db.query("DELETE FROM lawyer_schedules WHERE lawyer_id = $1", [id]);

    if (schedules && schedules.length > 0) {
      for (const schedule of schedules) {
        await db.query(
          `INSERT INTO lawyer_schedules (lawyer_id, day_of_week, start_time, end_time)
           VALUES ($1, $2, $3, $4)`,
          [id, schedule.day_of_week, schedule.start_time, schedule.end_time]
        );
      }
    }

    return res.json({
      success: true,
      message: "Jadwal lawyer berhasil diperbarui"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};