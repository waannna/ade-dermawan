const db = require("../config/db");

exports.dashboard = async (req, res) => {
  try {
    const users = await db.query(
      "SELECT COUNT(*) FROM users"
    );

    const lawyers = await db.query(
      "SELECT COUNT(*) FROM lawyers"
    );

    const consultations = await db.query(
      "SELECT COUNT(*) FROM consultations"
    );

    const reviews = await db.query(
      "SELECT COUNT(*) FROM reviews"
    );

    const documents = await db.query(
      "SELECT COUNT(*) FROM documents"
    );

    const pending = await db.query(
      "SELECT COUNT(*) FROM consultations WHERE status = 'pending'"
    );

    const approved = await db.query(
      "SELECT COUNT(*) FROM consultations WHERE status = 'approved'"
    );

    const completed = await db.query(
      "SELECT COUNT(*) FROM consultations WHERE status = 'completed'"
    );

    const cancelled = await db.query(
      "SELECT COUNT(*) FROM consultations WHERE status = 'cancelled'"
    );

    return res.json({
      success: true,

      data: {
        total_users: Number(
          users.rows[0].count
        ),

        total_lawyers: Number(
          lawyers.rows[0].count
        ),

        total_consultations: Number(
          consultations.rows[0].count
        ),

        total_reviews: Number(
          reviews.rows[0].count
        ),

        total_documents: Number(
          documents.rows[0].count
        ),

        consultations_by_status: {
          pending: Number(
            pending.rows[0].count
          ),

          approved: Number(
            approved.rows[0].count
          ),

          completed: Number(
            completed.rows[0].count
          ),

          cancelled: Number(
            cancelled.rows[0].count
          ),
        },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};