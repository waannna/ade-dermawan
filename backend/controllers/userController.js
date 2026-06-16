const db = require("../config/db");

// ======================
// GET ALL USERS
// ======================
exports.getUsers = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        id,
        nama,
        email,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
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

// ======================
// GET USER BY ID
// ======================
exports.getUserById = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        id,
        nama,
        email,
        role,
        created_at
      FROM users
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
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

// ======================
// UPDATE USER
// ======================
exports.updateUser = async (req, res) => {
  try {
    const { nama, email, role } = req.body;
    const userId = req.params.id;

    // Cek user ada
    const existingUser = await db.query(
      "SELECT id FROM users WHERE id = $1",
      [userId]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    // Build query dinamis - HANYA update field yang dikirim
    let updates = [];
    let params = [];
    let paramIndex = 1;

    if (nama !== undefined && nama !== null) {
      updates.push(`nama = $${paramIndex}`);
      params.push(nama);
      paramIndex++;
    }

    if (email !== undefined && email !== null) {
      updates.push(`email = $${paramIndex}`);
      params.push(email);
      paramIndex++;
    }

    if (role !== undefined && role !== null) {
      const allowedRoles = ["client", "lawyer", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Role tidak valid",
        });
      }
      updates.push(`role = $${paramIndex}`);
      params.push(role);
      paramIndex++;
    }

    // Jika tidak ada yang diupdate
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data yang diupdate",
      });
    }

    const query = `
      UPDATE users 
      SET ${updates.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING id, nama, email, role, created_at
    `;
    params.push(userId);

    const result = await db.query(query, params);

    return res.json({
      success: true,
      message: "User berhasil diperbarui",
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

// ======================
// DELETE USER
// ======================
exports.deleteUser = async (req, res) => {
  try {
    const existingUser = await db.query(
      `
      SELECT id
      FROM users
      WHERE id = $1
      `,
      [req.params.id]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan",
      });
    }

    await db.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [req.params.id]
    );

    return res.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};