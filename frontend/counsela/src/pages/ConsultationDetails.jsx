import { useEffect, useState } from "react"
import { useParams, Link, useSearchParams } from "react-router-dom"
import api from "../utils/axios"
import { toast } from "react-hot-toast"
import ReviewModal from "../components/ReviewModal"

const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Lawyer: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Money: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Description: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Video: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
}

const ConsultationDetail = () => {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [consultation, setConsultation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showDpModal, setShowDpModal] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [dpFile, setDpFile] = useState(null)
  const [finalFile, setFinalFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const shouldOpenReview = searchParams.get("review") === "true"

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/consultations/${id}`)
        const data = response.data.data || response.data
        setConsultation(data)
      } catch (err) { 
        console.error(err)
        toast.error("Gagal memuat data") 
      } finally { 
        setLoading(false) 
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (shouldOpenReview && consultation?.status === "completed") {
      setShowReviewModal(true)
    }
  }, [shouldOpenReview, consultation])

  const handleUploadDp = async () => {
    if (!dpFile) {
      toast.error("Pilih file bukti transfer DP")
      return
    }
    setSubmitting(true)
    const formData = new FormData()
    formData.append("dp_proof", dpFile)
    formData.append("consultation_id", consultation.id)
    try {
      await api.post("/consultations/upload-dp", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      toast.success("Bukti DP terkirim, menunggu verifikasi admin")
      setShowDpModal(false)
      setDpFile(null)
      window.location.reload()
    } catch (error) {
      toast.error("Gagal mengirim bukti DP")
    } finally {
      setSubmitting(false)
    }
  }

  const handleUploadFinal = async () => {
    if (!finalFile) {
      toast.error("Pilih file bukti pelunasan")
      return
    }
    setSubmitting(true)
    const formData = new FormData()
    formData.append("final_payment_proof", finalFile)
    formData.append("consultation_id", consultation.id)
    try {
      await api.post("/consultations/upload-final-payment", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      toast.success("Bukti pelunasan terkirim, menunggu verifikasi admin")
      setShowFinalModal(false)
      setFinalFile(null)
      window.location.reload()
    } catch (error) {
      toast.error("Gagal mengirim bukti pelunasan")
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date) => {
    if (!date) return "-"
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatCurrency = (amount) => {
    return `Rp ${(amount || 0).toLocaleString("id-ID")}`
  }

  const getStatusDisplay = () => {
    const c = consultation
    if (!c) return { text: "", color: "", icon: null }
    if (c.status === "pending") return { text: "Menunggu Diterima Lawyer", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: "⏳" }
    if (c.status === "accepted" && c.dp_payment_status !== "paid") return { text: "Menunggu Pembayaran DP", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: "💰" }
    if (c.dp_payment_status === "waiting_verification") return { text: "Verifikasi DP", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: "⏳" }
    if (c.dp_payment_status === "paid" && c.status === "accepted") return { text: "DP Lunas, Menunggu Meeting Link", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: "✅" }
    if (c.status === "ongoing") return { text: "Konsultasi Berjalan", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: "💬" }
    if (c.status === "waiting_pelunasan") return { text: "Menunggu Pelunasan", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", icon: "💳" }
    if (c.final_payment_status === "waiting_verification") return { text: "Verifikasi Pelunasan", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: "⏳" }
    if (c.status === "completed") return { text: "Selesai", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: "✅" }
    if (c.status === "cancelled") return { text: "Dibatalkan", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: "❌" }
    return { text: c.status, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: "📋" }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Memuat detail konsultasi...</span>
      </div>
    )
  }

  if (!consultation) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-4xl">
          😞
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Konsultasi tidak ditemukan</h2>
        <Link to="/consultations" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition">
          Kembali
        </Link>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay()
  const dpAmount = Math.floor((consultation.tarif_konsultasi || 0) / 2)
  const sisaAmount = (consultation.tarif_konsultasi || 0) - dpAmount

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white mb-6">
        <Link to="/consultations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition group">
          <Icons.ArrowLeft /> Kembali
        </Link>
        <h1 className="text-2xl font-bold">Detail Konsultasi</h1>
        <p className="text-blue-100 mt-1">Informasi lengkap tentang konsultasi hukum Anda</p>
      </div>

      {/* Card Detail */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {/* Header Status */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{statusDisplay.icon}</span>
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm ${statusDisplay.color}`}>{statusDisplay.text}</span>
              </div>
            </div>
          </div>
          {consultation.meeting_link && (
            <a href={consultation.meeting_link} target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition">
              <Icons.Video /> Join Meeting
            </a>
          )}
        </div>

        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{consultation.judul_kasus}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Icons.User /> Client
              </div>
              <p className="font-semibold text-gray-800 dark:text-white mt-1">{consultation.client_name || "Client"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Icons.Lawyer /> Lawyer
              </div>
              <p className="font-semibold text-gray-800 dark:text-white mt-1">{consultation.lawyer_name || "Lawyer"}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Icons.Calendar /> Tanggal
              </div>
              <p className="font-semibold text-gray-800 dark:text-white mt-1">{formatDate(consultation.tanggal_konsultasi)}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
                <Icons.Clock /> Jam
              </div>
              <p className="font-semibold text-gray-800 dark:text-white mt-1">{consultation.jam_konsultasi}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-xl">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
              <Icons.Description /> Deskripsi Kasus
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{consultation.deskripsi_kasus || "Tidak ada deskripsi"}</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <Icons.Money /> Rincian Pembayaran
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Tarif</span>
                <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(consultation.tarif_konsultasi)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">DP (50%)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(dpAmount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Sisa Pelunasan (50%)</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{formatCurrency(sisaAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {consultation.status === "accepted" && consultation.dp_payment_status !== "paid" && consultation.dp_payment_status !== "waiting_verification" && (
            <button onClick={() => setShowDpModal(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
              <Icons.Money /> Bayar DP (50%)
            </button>
          )}

          {consultation.dp_payment_status === "waiting_verification" && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center flex items-center justify-center gap-2">
              <Icons.Loading /> <span className="text-yellow-600 dark:text-yellow-400">Bukti DP sedang diverifikasi admin</span>
            </div>
          )}

          {consultation.dp_payment_status === "paid" && consultation.status === "accepted" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <p className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                <Icons.CheckCircle /> DP sudah lunas. Menunggu lawyer memberikan meeting link.
              </p>
            </div>
          )}

          {consultation.status === "waiting_pelunasan" && consultation.final_payment_status !== "paid" && consultation.final_payment_status !== "waiting_verification" && (
            <button onClick={() => setShowFinalModal(true)} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2">
              <Icons.Money /> Bayar Pelunasan (50%)
            </button>
          )}

          {consultation.final_payment_status === "waiting_verification" && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-center">
              <p className="text-yellow-600 dark:text-yellow-400 flex items-center justify-center gap-2">
                <Icons.Loading /> Bukti pelunasan sedang diverifikasi admin
              </p>
            </div>
          )}

          {consultation.status === "completed" && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
              <p className="text-green-600 dark:text-green-400 flex items-center justify-center gap-2">
                <Icons.CheckCircle /> Konsultasi selesai! Terima kasih telah menggunakan Counsela.
              </p>
            </div>
          )}

          {consultation.status === "cancelled" && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
              <p className="text-red-600 dark:text-red-400">❌ Konsultasi dibatalkan</p>
            </div>
          )}

          <div className="text-xs text-gray-400 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4">
            <p>ID Konsultasi: {consultation.id}</p>
            <p>Dibuat: {new Date(consultation.created_at).toLocaleString('id-ID')}</p>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <Link to="/consultations" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition group">
            <Icons.ArrowLeft /> Kembali ke Daftar Konsultasi
          </Link>
        </div>
      </div>

      {/* Modal Upload DP - DIPERBAIKI */}
      {showDpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Bayar DP (50%)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Transfer ke rekening:</p>
              <p className="font-bold text-gray-800 dark:text-white">BCA - 1234567890</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">a.n. PT Counsela Indonesia</p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Total Tarif</span>
                <span className="font-bold text-gray-800 dark:text-white">{formatCurrency(consultation.tarif_konsultasi)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">DP (50%)</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(dpAmount)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-300">Sisa Pelunasan (50%)</span>
                <span className="font-bold text-gray-500 dark:text-gray-400">{formatCurrency(sisaAmount)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Bukti Transfer DP</label>
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={(e) => setDpFile(e.target.files[0])} 
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Format: JPG, PNG, PDF (max 2MB)</p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleUploadDp} disabled={submitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <Icons.Loading /> : <Icons.Upload />} {submitting ? "Mengirim..." : "Kirim Bukti"}
              </button>
              <button onClick={() => setShowDpModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload Pelunasan - DIPERBAIKI */}
      {showFinalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Bayar Pelunasan (50%)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Transfer ke rekening:</p>
              <p className="font-bold text-gray-800 dark:text-white">BCA - 1234567890</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">a.n. PT Counsela Indonesia</p>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-300">Sisa yang harus dibayar</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(sisaAmount)}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload Bukti Pelunasan</label>
              <input 
                type="file" 
                accept="image/*,application/pdf"
                onChange={(e) => setFinalFile(e.target.files[0])} 
                className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-50 file:text-green-700 dark:file:bg-green-900/30 dark:file:text-green-400 hover:file:bg-green-100 dark:hover:file:bg-green-900/50"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Format: JPG, PNG, PDF (max 2MB)</p>
            </div>

            <div className="flex gap-3">
              <button onClick={handleUploadFinal} disabled={submitting} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50">
                {submitting ? <Icons.Loading /> : <Icons.Upload />} {submitting ? "Mengirim..." : "Kirim Bukti"}
              </button>
              <button onClick={() => setShowFinalModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Review */}
      {showReviewModal && (
        <ReviewModal 
          consultation={consultation} 
          onClose={() => setShowReviewModal(false)} 
          onSuccess={() => window.location.reload()} 
        />
      )}
    </div>
  )
}

export default ConsultationDetail