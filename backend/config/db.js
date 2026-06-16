const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

// Test koneksi saat server dijalankan
(async () => {
  try {
    const client = await pool.connect();

    console.log(
      "✅ Counsela berhasil terhubung ke Supabase PostgreSQL"
    );

    client.release();
  } catch (error) {
    console.error(
      "❌ Gagal terhubung ke Supabase:",
      error.message
    );
  }
})();

module.exports = {
  query: (text, params) =>
    pool.query(text, params),

  pool,
};