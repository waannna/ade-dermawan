const db = require("../config/db");
const supabase = require("../config/supabase");

// =========================
// CEK KETERSEDIAAN JADWAL (Helper Function)
// =========================
const checkAvailability = async (lawyer_id, tanggal_konsultasi, jam_konsultasi, excludeId = null) => {
  let query = `
    SELECT id FROM consultations 
    WHERE lawyer_id = $1 
    AND tanggal_konsultasi = $2 
    AND jam_konsultasi = $3
    AND status NOT IN ('cancelled', 'completed')
  `;
  let params = [lawyer_id, tanggal_konsultasi, jam_konsultasi];
  
  if (excludeId) {
    query += ` AND id != $4`;
    params.push(excludeId);
  }
  
  const result = await db.query(query, params);
  return result.rows.length === 0;
};

// =========================
// CREATE CONSULTATION
// =========================
exports.createConsultation = async (req, res) => {
  try {
    const {
      lawyer_id,
      tanggal_konsultasi,
      jam_konsultasi,
      judul_kasus,
      deskripsi_kasus,
    } = req.body;

    const client_id = req.user.id;

    if (!lawyer_id) {
      return res.status(400).json({ success: false, message: "Lawyer wajib dipilih" });
    }

    const lawyer = await db.query("SELECT id FROM lawyers WHERE id = $1", [lawyer_id]);
    if (lawyer.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Lawyer tidak ditemukan" });
    }

    if (!tanggal_konsultasi) {
      return res.status(400).json({ success: false, message: "Tanggal konsultasi wajib diisi" });
    }

    const selectedDate = new Date(tanggal_konsultasi);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({ success: false, message: "Tanggal konsultasi tidak boleh di masa lalu" });
    }

    if (!jam_konsultasi) {
      return res.status(400).json({ success: false, message: "Jam konsultasi wajib diisi" });
    }

    if (!judul_kasus?.trim()) {
      return res.status(400).json({ success: false, message: "Judul kasus wajib diisi" });
    }

    if (!deskripsi_kasus?.trim()) {
      return res.status(400).json({ success: false, message: "Deskripsi kasus wajib diisi" });
    }

    const isAvailable = await checkAvailability(lawyer_id, tanggal_konsultasi, jam_konsultasi);
    
    if (!isAvailable) {
      return res.status(409).json({
        success: false,
        message: `Maaf, jadwal pada tanggal ${tanggal_konsultasi} jam ${jam_konsultasi} sudah dibooking.`,
      });
    }

    const result = await db.query(
      `INSERT INTO consultations
      (client_id, lawyer_id, tanggal_konsultasi, jam_konsultasi, judul_kasus, deskripsi_kasus)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [client_id, lawyer_id, tanggal_konsultasi, jam_konsultasi, judul_kasus, deskripsi_kasus]
    );

    return res.status(201).json({
      success: true,
      message: "Konsultasi berhasil dibuat",
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// GET ALL CONSULTATIONS (dengan filter hidden)
// =========================
exports.getConsultations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userType = `${userRole}_${userId}`;
    
    let query = `
      SELECT
        c.*,
        client.nama AS client_name,
        lawyer_user.nama AS lawyer_name,
        l.tarif_konsultasi
      FROM consultations c
      JOIN users client ON c.client_id = client.id
      JOIN lawyers l ON c.lawyer_id = l.id
      JOIN users lawyer_user ON l.user_id = lawyer_user.id
      WHERE NOT (c.hidden_for @> ARRAY[$1]::text[])
    `;
    
    let params = [userType];
    
    if (userRole === 'client') {
      query += ` AND c.client_id = $2`;
      params.push(userId);
    } else if (userRole === 'lawyer') {
      query += ` AND l.user_id = $2`;
      params.push(userId);
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await db.query(query, params);
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// GET CLIENT CONSULTATIONS
// =========================
exports.getClientConsultations = async (req, res) => {
  try {
    const clientId = req.user.id;
    const userType = `client_${clientId}`;
    
    const result = await db.query(
      `SELECT c.*, lawyer_user.nama AS lawyer_name, l.tarif_konsultasi
       FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       JOIN users lawyer_user ON l.user_id = lawyer_user.id
       WHERE c.client_id = $1 AND NOT (c.hidden_for @> ARRAY[$2]::text[])
       ORDER BY c.created_at DESC`,
      [clientId, userType]
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// GET CONSULTATION BY ID
// =========================
exports.getConsultationById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
        c.*,
        client.nama AS client_name,
        lawyer_user.nama AS lawyer_name,
        l.tarif_konsultasi
       FROM consultations c
       JOIN users client ON c.client_id = client.id
       JOIN lawyers l ON c.lawyer_id = l.id
       JOIN users lawyer_user ON l.user_id = lawyer_user.id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }

    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// GET BOOKED SLOTS
// =========================
exports.getBookedSlots = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const { tanggal } = req.query;

    if (!lawyerId || !tanggal) {
      return res.status(400).json({ success: false, message: "Lawyer ID dan tanggal wajib diisi" });
    }

    const date = new Date(tanggal);
    const dayOfWeek = date.getDay();
    
    const workingHours = await db.query(
      `SELECT start_time, end_time 
       FROM lawyer_schedules 
       WHERE lawyer_id = $1 AND day_of_week = $2`,
      [lawyerId, dayOfWeek]
    );
    
    let availableTimeSlots = [];
    if (workingHours.rows.length > 0) {
      const { start_time, end_time } = workingHours.rows[0];
      const startHour = parseInt(start_time.split(':')[0]);
      const endHour = parseInt(end_time.split(':')[0]);
      
      for (let hour = startHour; hour < endHour; hour++) {
        availableTimeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
    }
    
    const bookedSlots = await db.query(
      `SELECT jam_konsultasi 
       FROM consultations 
       WHERE lawyer_id = $1 
       AND tanggal_konsultasi = $2
       AND status NOT IN ('cancelled', 'completed')`,
      [lawyerId, tanggal]
    );
    
    const bookedTimes = bookedSlots.rows.map(slot => slot.jam_konsultasi);
    const availableSlots = availableTimeSlots.filter(slot => !bookedTimes.includes(slot));

    return res.json({
      success: true,
      data: {
        working_hours: workingHours.rows[0] || null,
        available_slots: availableSlots,
        booked_slots: bookedTimes,
        all_time_slots: availableTimeSlots
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// UPDATE STATUS (GENERAL)
// =========================
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["pending", "approved", "completed", "cancelled", "accepted", "ongoing", "waiting_pelunasan"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Status tidak valid" });
    }

    const result = await db.query(
      `UPDATE consultations SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }

    return res.json({ success: true, message: "Status berhasil diperbarui", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// UPDATE MEETING LINK
// =========================
exports.updateMeetingLink = async (req, res) => {
  try {
    const { meeting_link } = req.body;

    if (!meeting_link?.trim()) {
      return res.status(400).json({ success: false, message: "Meeting link wajib diisi" });
    }

    const result = await db.query(
      `UPDATE consultations SET meeting_link = $1 WHERE id = $2 RETURNING *`,
      [meeting_link, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }

    return res.json({ success: true, message: "Meeting link berhasil ditambahkan", data: result.rows[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// HELPER: HITUNG ADMIN FEE (3%)
// =========================
const calculateAdminFee = (amount) => {
  return Math.floor(amount * 3 / 100);
};

// =========================
// HELPER: TAMBAH KE ADMIN WALLET
// =========================
const addToAdminWallet = async (consultation_id, amount, type, transactionId) => {
  const adminFee = calculateAdminFee(amount);
  const netAmount = amount - adminFee;
  
  await db.query(
    `INSERT INTO admin_wallet (transaction_id, consultation_id, amount, fee_amount, net_amount, type, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'completed')`,
    [transactionId, consultation_id, amount, adminFee, netAmount, type]
  );
  
  await db.query(
    `UPDATE admin_balance SET total_fees = total_fees + $1, total_transactions = total_transactions + 1, updated_at = NOW()`,
    [adminFee]
  );
};

// =========================
// 1. LAWYER TERIMA ORDERAN
// =========================
exports.acceptConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyer_id = req.user.id;
    
    const check = await db.query(
      `SELECT c.* FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.id = $1 AND l.user_id = $2`,
      [id, lawyer_id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    
    await db.query(`UPDATE consultations SET status = 'accepted' WHERE id = $1`, [id]);
    
    res.json({ success: true, message: "Orderan diterima, silakan client bayar DP" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 2. CLIENT UPLOAD BUKTI DP
// =========================
exports.uploadDpProof = async (req, res) => {
  try {
    console.log("=== UPLOAD DP PROOF ===");
    
    const { consultation_id } = req.body;
    const file = req.file;
    const client_id = req.user.id;
    
    if (!file) {
      return res.status(400).json({ success: false, message: "File bukti DP wajib diupload" });
    }

    const consultation = await db.query(
      `SELECT c.*, l.tarif_konsultasi 
       FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.id = $1 AND c.client_id = $2`,
      [consultation_id, client_id]
    );
    
    if (consultation.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    
    const tarifKonsultasi = consultation.rows[0].tarif_konsultasi;
    const dpAmount = Math.floor(tarifKonsultasi / 2);

    const fileExt = file.originalname.split('.').pop();
    const fileName = `dp_${consultation_id}_${Date.now()}.${fileExt}`;
    const filePath = `dp/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return res.status(500).json({ success: false, message: "Gagal upload file: " + uploadError.message });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);

    await db.query(
      `UPDATE consultations 
       SET dp_proof = $1, dp_payment_status = 'waiting_verification', dp_amount = $2
       WHERE id = $3 AND client_id = $4`,
      [publicUrl, dpAmount, consultation_id, client_id]
    );
    
    res.json({
      success: true,
      message: `Bukti DP (50% = Rp ${dpAmount.toLocaleString("id-ID")}) terkirim, menunggu verifikasi admin`
    });
  } catch (error) {
    console.error("Error in uploadDpProof:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 3. ADMIN VERIFIKASI DP
// =========================
exports.verifyDp = async (req, res) => {
  try {
    const { id } = req.params;
    
    const consultation = await db.query(
      `SELECT c.dp_amount, l.tarif_konsultasi 
       FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.id = $1`,
      [id]
    );
    
    if (consultation.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    
    const dpAmount = consultation.rows[0].dp_amount || Math.floor(consultation.rows[0].tarif_konsultasi / 2);
    const adminFee = calculateAdminFee(dpAmount);
    const transactionId = `DP-${Date.now()}-${id}`;
    
    await db.query(
      `UPDATE consultations 
       SET dp_payment_status = 'paid', 
           dp_paid_at = NOW(), 
           admin_fee_dp = $1, 
           lawyer_net_dp = $2
       WHERE id = $3`,
      [adminFee, dpAmount - adminFee, id]
    );
    
    await addToAdminWallet(id, dpAmount, 'dp', transactionId);
    
    res.json({
      success: true,
      message: `DP berhasil diverifikasi! Fee 3% (Rp ${adminFee.toLocaleString("id-ID")}) telah masuk ke dompet admin.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 4. LAWYER TAMBAH MEETING LINK
// =========================
exports.addMeetingLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { meeting_link } = req.body;
    const lawyer_id = req.user.id;
    
    if (!meeting_link?.trim()) {
      return res.status(400).json({ success: false, message: "Meeting link wajib diisi" });
    }
    
    const check = await db.query(
      `SELECT dp_payment_status FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.id = $1 AND l.user_id = $2`,
      [id, lawyer_id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    
    if (check.rows[0].dp_payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: "Client belum membayar DP. Silakan tunggu verifikasi admin." });
    }
    
    await db.query(`UPDATE consultations SET meeting_link = $1, status = 'ongoing' WHERE id = $2`, [meeting_link, id]);
    
    res.json({ success: true, message: "Meeting link berhasil ditambahkan. Konsultasi bisa dimulai." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 5. LAWYER SELESAIKAN KASUS
// =========================
exports.completeConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyer_id = req.user.id;
    
    const check = await db.query(
      `SELECT c.id FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.id = $1 AND l.user_id = $2`,
      [id, lawyer_id]
    );
    
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    
    await db.query(`UPDATE consultations SET status = 'waiting_pelunasan' WHERE id = $1`, [id]);
    
    res.json({ success: true, message: "Konsultasi selesai. Client dapat melakukan pelunasan." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 6. CLIENT UPLOAD BUKTI PELUNASAN
// =========================
exports.uploadFinalPaymentProof = async (req, res) => {
  try {
    console.log("=== UPLOAD FINAL PAYMENT PROOF ===");
    
    const { consultation_id } = req.body;
    const file = req.file;
    const client_id = req.user.id;
    
    if (!file) {
      return res.status(400).json({ success: false, message: "File bukti pelunasan wajib diupload" });
    }

    const consultation = await db.query(
      `SELECT c.*, l.tarif_konsultasi, c.dp_amount
       FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.id = $1 AND c.client_id = $2`,
      [consultation_id, client_id]
    );
    
    if (consultation.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    
    const tarifKonsultasi = consultation.rows[0].tarif_konsultasi;
    const dpAmount = consultation.rows[0].dp_amount || Math.floor(tarifKonsultasi / 2);
    const finalAmount = tarifKonsultasi - dpAmount;

    const fileExt = file.originalname.split('.').pop();
    const fileName = `final_${consultation_id}_${Date.now()}.${fileExt}`;
    const filePath = `final/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return res.status(500).json({ success: false, message: "Gagal upload file: " + uploadError.message });
    }

    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);
    
    await db.query(
      `UPDATE consultations 
       SET final_payment_proof = $1, final_payment_status = 'waiting_verification'
       WHERE id = $2 AND client_id = $3`,
      [publicUrl, consultation_id, client_id]
    );
    
    res.json({
      success: true,
      message: `Bukti pelunasan (Rp ${finalAmount.toLocaleString("id-ID")}) terkirim, menunggu verifikasi admin`
    });
  } catch (error) {
    console.error("Error in uploadFinalPaymentProof:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// 7. ADMIN VERIFIKASI PELUNASAN
// =========================
exports.verifyFinalPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const consultation = await db.query(
      `SELECT c.id, c.dp_amount, c.admin_fee_dp, l.tarif_konsultasi
       FROM consultations c
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.id = $1`,
      [id]
    );
    
    if (consultation.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Konsultasi tidak ditemukan" });
    }
    
    const totalTarif = consultation.rows[0].tarif_konsultasi;
    const dpAmount = consultation.rows[0].dp_amount || Math.floor(totalTarif / 2);
    const finalAmount = totalTarif - dpAmount;
    const adminFee = calculateAdminFee(finalAmount);
    const transactionId = `PELUNASAN-${Date.now()}-${id}`;
    
    await db.query(
      `UPDATE consultations 
       SET final_payment_status = 'paid', 
           final_paid_at = NOW(), 
           admin_fee_final = $1, 
           lawyer_net_final = $2, 
           status = 'completed'
       WHERE id = $3`,
      [adminFee, finalAmount - adminFee, id]
    );
    
    await addToAdminWallet(id, finalAmount, 'pelunasan', transactionId);
    
    const adminFeeDp = consultation.rows[0].admin_fee_dp || 0;
    const totalAdminFee = adminFeeDp + adminFee;
    
    res.json({
      success: true,
      message: `Pelunasan berhasil diverifikasi! Total admin fee: Rp ${totalAdminFee.toLocaleString("id-ID")}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// HIDE CONSULTATION (Soft Delete)
// =========================
exports.hideConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userType = `${userRole}_${userId}`;
    
    let isAuthorized = false;
    
    if (userRole === 'client') {
      const check = await db.query(
        "SELECT id FROM consultations WHERE id = $1 AND client_id = $2",
        [id, userId]
      );
      isAuthorized = check.rows.length > 0;
    } else if (userRole === 'lawyer') {
      const check = await db.query(
        `SELECT c.id FROM consultations c
         JOIN lawyers l ON c.lawyer_id = l.id
         WHERE c.id = $1 AND l.user_id = $2`,
        [id, userId]
      );
      isAuthorized = check.rows.length > 0;
    } else if (userRole === 'admin') {
      isAuthorized = true;
    }
    
    if (!isAuthorized) {
      return res.status(403).json({ 
        success: false, 
        message: "Anda tidak memiliki akses untuk menghapus riwayat ini" 
      });
    }
    
    await db.query(
      `UPDATE consultations 
       SET hidden_for = CASE 
         WHEN COALESCE(hidden_for, ARRAY[]::text[]) @> ARRAY[$1]::text[] THEN hidden_for
         ELSE array_append(COALESCE(hidden_for, ARRAY[]::text[]), $1)
       END
       WHERE id = $2`,
      [userType, id]
    );
    
    res.json({ 
      success: true, 
      message: "Riwayat konsultasi telah dihapus dari tampilan Anda" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.unarchiveConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;
    const userType = `${userRole}_${userId}`;
    
    let isAuthorized = false;
    
    if (userRole === 'client') {
      const check = await db.query(
        "SELECT id FROM consultations WHERE id = $1 AND client_id = $2",
        [id, userId]
      );
      isAuthorized = check.rows.length > 0;
    } else if (userRole === 'lawyer') {
      const check = await db.query(
        `SELECT c.id FROM consultations c
         JOIN lawyers l ON c.lawyer_id = l.id
         WHERE c.id = $1 AND l.user_id = $2`,
        [id, userId]
      );
      isAuthorized = check.rows.length > 0;
    } else if (userRole === 'admin') {
      isAuthorized = true;
    }
    
    if (!isAuthorized) {
      return res.status(403).json({ 
        success: false, 
        message: "Anda tidak memiliki akses untuk memulihkan riwayat ini" 
      });
    }
    
    await db.query(
      `UPDATE consultations 
       SET hidden_for = array_remove(COALESCE(hidden_for, ARRAY[]::text[]), $1)
       WHERE id = $2`,
      [userType, id]
    );
    
    res.json({ 
      success: true, 
      message: "Riwayat konsultasi telah dipulihkan ke daftar utama" 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArchivedConsultations = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const userType = `${userRole}_${userId}`;
    
    let query = `
      SELECT
        c.*,
        client.nama AS client_name,
        lawyer_user.nama AS lawyer_name,
        l.tarif_konsultasi
      FROM consultations c
      JOIN users client ON c.client_id = client.id
      JOIN lawyers l ON c.lawyer_id = l.id
      JOIN users lawyer_user ON l.user_id = lawyer_user.id
      WHERE (COALESCE(c.hidden_for, ARRAY[]::text[]) @> ARRAY[$1]::text[])
    `;
    
    let params = [userType];
    
    if (userRole === 'client') {
      query += ` AND c.client_id = $2`;
      params.push(userId);
    } else if (userRole === 'lawyer') {
      query += ` AND l.user_id = $2`;
      params.push(userId);
    }
    
    query += ` ORDER BY c.created_at DESC`;
    
    const result = await db.query(query, params);
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
};

// =========================
// GET WAITING DP (Admin)
// =========================
exports.getWaitingDp = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        c.id,
        c.judul_kasus,
        c.dp_proof,
        c.dp_amount,
        c.dp_payment_status,
        u.nama as client_name,
        l.firma_hukum as lawyer_name
       FROM consultations c
       JOIN users u ON c.client_id = u.id
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.dp_payment_status = 'waiting_verification'
       ORDER BY c.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GET WAITING PELUNASAN (Admin)
// =========================
exports.getWaitingPelunasan = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT 
        c.id,
        c.judul_kasus,
        c.final_payment_proof,
        c.final_payment_status,
        u.nama as client_name,
        l.firma_hukum as lawyer_name
       FROM consultations c
       JOIN users u ON c.client_id = u.id
       JOIN lawyers l ON c.lawyer_id = l.id
       WHERE c.final_payment_status = 'waiting_verification'
       ORDER BY c.created_at DESC`
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GET ADMIN WALLET
// =========================
exports.getAdminWallet = async (req, res) => {
  try {
    const balance = await db.query(`SELECT * FROM admin_balance`);
    const transactions = await db.query(
      `SELECT aw.*, c.judul_kasus, u.nama as client_name 
       FROM admin_wallet aw
       JOIN consultations c ON aw.consultation_id = c.id
       JOIN users u ON c.client_id = u.id
       ORDER BY aw.created_at DESC
       LIMIT 20`
    );
    
    res.json({
      success: true,
      data: {
        balance: balance.rows[0] || { total_fees: 0, total_transactions: 0 },
        transactions: transactions.rows
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =========================
// GET BOOKED SLOTS
// =========================
exports.getBookedSlots = async (req, res) => {
  try {
    const { lawyer_id, date } = req.query;
    if (!lawyer_id || !date) {
      return res.json({ success: true, data: [] });
    }
    const result = await db.query(
      `SELECT jam_konsultasi FROM consultations 
       WHERE lawyer_id = $1 
       AND tanggal_konsultasi = $2 
       AND status NOT IN ('cancelled')`,
      [lawyer_id, date]
    );
    const booked = result.rows.map((r) => r.jam_konsultasi);
    return res.json({ success: true, data: booked });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};