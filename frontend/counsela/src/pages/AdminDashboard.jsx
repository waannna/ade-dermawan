import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import api from "../utils/axios"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

const Icons = {
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Lawyer: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Consultation: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Review: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Wallet: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
}

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total_users: 0,
    total_lawyers: 0,
    total_consultations: 0,
    total_reviews: 0,
  })
  const [loading, setLoading] = useState(true)
  const [lawyers, setLawyers] = useState([])
  const [users, setUsers] = useState([])
  const [waitingDp, setWaitingDp] = useState([])
  const [waitingPelunasan, setWaitingPelunasan] = useState([])
  const [adminWallet, setAdminWallet] = useState({ balance: { total_fees: 0, total_transactions: 0 }, transactions: [] })
  
  const [formData, setFormData] = useState({
    user_id: "", firma_hukum: "", spesialisasi: "", pengalaman: "", tarif_konsultasi: "", deskripsi: "", foto_profil: "",
  })
  const [submitting, setSubmitting] = useState(false)
  
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedLawyerId, setSelectedLawyerId] = useState(null)
  const [selectedLawyerName, setSelectedLawyerName] = useState("")
  const [schedules, setSchedules] = useState([])
  const [savingSchedule, setSavingSchedule] = useState(false)
  const [loadingSchedule, setLoadingSchedule] = useState(false)

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

  const fetchData = async () => {
    try {
      const [statsRes, lawyersRes, usersRes] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/lawyers"),
        api.get("/users")
      ])
      if (statsRes.data.success) setStats(statsRes.data.data)
      setLawyers(lawyersRes.data.data || [])
      setUsers(usersRes.data.data || [])
    } catch (err) {
      toast.error("Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  const fetchWaitingDp = async () => {
    try {
      const response = await api.get("/consultations/admin/waiting-dp")
      setWaitingDp(response.data.data || [])
    } catch (error) {
      console.error("Gagal load waiting DP:", error)
    }
  }

  const fetchWaitingPelunasan = async () => {
    try {
      const response = await api.get("/consultations/admin/waiting-pelunasan")
      setWaitingPelunasan(response.data.data || [])
    } catch (error) {
      console.error("Gagal load waiting pelunasan:", error)
    }
  }

  const fetchAdminWallet = async () => {
    try {
      const response = await api.get("/consultations/admin/wallet")
      if (response.data.success) setAdminWallet(response.data.data)
    } catch (error) {
      console.error("Gagal load admin wallet:", error)
    }
  }

  const fetchSchedule = async (lawyerId) => {
    setLoadingSchedule(true)
    try {
      const response = await api.get(`/lawyers/${lawyerId}/schedule`)
      if (response.data.success) {
        const existingSchedules = response.data.data.schedules || []
        const defaultSchedules = [
          { day_of_week: 1, start_time: "09:00", end_time: "17:00", enabled: false },
          { day_of_week: 2, start_time: "09:00", end_time: "17:00", enabled: false },
          { day_of_week: 3, start_time: "09:00", end_time: "17:00", enabled: false },
          { day_of_week: 4, start_time: "09:00", end_time: "17:00", enabled: false },
          { day_of_week: 5, start_time: "09:00", end_time: "17:00", enabled: false },
          { day_of_week: 6, start_time: "09:00", end_time: "17:00", enabled: false },
        ]
        
        const updatedSchedules = defaultSchedules.map(s => {
          const found = existingSchedules.find(ex => ex.day_of_week === s.day_of_week)
          if (found) {
            return { 
              ...s, 
              start_time: found.start_time.substring(0,5), 
              end_time: found.end_time.substring(0,5), 
              enabled: true 
            }
          }
          return s
        })
        setSchedules(updatedSchedules)
      }
    } catch (error) {
      console.error("Gagal load schedule:", error)
      toast.error("Gagal memuat jadwal")
    } finally {
      setLoadingSchedule(false)
    }
  }

  const openScheduleModal = async (lawyerId, lawyerName) => {
    setSelectedLawyerId(lawyerId)
    setSelectedLawyerName(lawyerName)
    setShowScheduleModal(true)
    await fetchSchedule(lawyerId)
  }

  const saveSchedule = async () => {
    const enabledSchedules = schedules.filter(s => s.enabled).map(s => ({
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time
    }))

    setSavingSchedule(true)
    try {
      await api.put(`/lawyers/${selectedLawyerId}/schedule`, { schedules: enabledSchedules })
      toast.success("Jadwal lawyer berhasil diperbarui!")
      setShowScheduleModal(false)
      fetchData()
    } catch (error) {
      toast.error("Gagal menyimpan jadwal")
    } finally {
      setSavingSchedule(false)
    }
  }

  const verifyDp = async (id) => {
    try {
      await api.patch(`/consultations/${id}/verify-dp`)
      toast.success("DP berhasil diverifikasi! Fee 3% telah masuk ke dompet admin.")
      fetchWaitingDp()
      fetchAdminWallet()
      fetchData()
    } catch (error) {
      toast.error("Gagal verifikasi DP")
    }
  }

  const verifyFinalPayment = async (id) => {
    try {
      await api.patch(`/consultations/${id}/verify-final-payment`)
      toast.success("Pelunasan berhasil diverifikasi! Fee 3% telah masuk ke dompet admin.")
      fetchWaitingPelunasan()
      fetchAdminWallet()
      fetchData()
    } catch (error) {
      toast.error("Gagal verifikasi pelunasan")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.user_id) return toast.error("Pilih user terlebih dahulu")
    setSubmitting(true)
    try {
      await api.put(`/users/${formData.user_id}`, { role: 'lawyer' })
      
      await api.post("/lawyers", {
        ...formData,
        user_id: parseInt(formData.user_id),
        pengalaman: parseInt(formData.pengalaman) || 0,
        tarif_konsultasi: parseInt(formData.tarif_konsultasi) || 0,
        status_aktif: true,
        rating: 0
      })
      toast.success("Lawyer berhasil ditambahkan!")
      setFormData({ user_id: "", firma_hukum: "", spesialisasi: "", pengalaman: "", tarif_konsultasi: "", deskripsi: "", foto_profil: "" })
      fetchData()
    } catch (err) {
      toast.error("Gagal menambahkan lawyer")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus lawyer ini?")) return
    try {
      await api.delete(`/lawyers/${id}`)
      toast.success("Lawyer berhasil dihapus")
      fetchData()
    } catch (err) {
      toast.error("Gagal menghapus lawyer")
    }
  }

  useEffect(() => {
    fetchData()
    fetchWaitingDp()
    fetchWaitingPelunasan()
    fetchAdminWallet()
  }, [])

  useEffect(() => {
    if (!showScheduleModal) {
      setSchedules([])
      setSelectedLawyerId(null)
      setSelectedLawyerName("")
    }
  }, [showScheduleModal])

  const statCards = [
    { label: "Total Users", value: stats.total_users, icon: Icons.Users, color: "blue" },
    { label: "Total Lawyers", value: stats.total_lawyers, icon: Icons.Lawyer, color: "green" },
    { label: "Total Konsultasi", value: stats.total_consultations, icon: Icons.Consultation, color: "yellow" },
    { label: "Total Reviews", value: stats.total_reviews, icon: Icons.Review, color: "purple" },
  ]

  const statColors = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Loading dashboard...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-purple-100 mt-1">Selamat datang, {user?.nama || "Admin"}! Kelola seluruh data aplikasi di sini.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statColors[stat.color]}`}>
                  <Icon />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Dompet Admin */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Icons.Wallet /> Dompet Admin
            </h2>
            <p className="text-3xl font-bold mt-2">
              Rp {adminWallet.balance?.total_fees?.toLocaleString("id-ID") || 0}
            </p>
            <p className="text-amber-100 mt-1 text-sm">
              Total {adminWallet.balance?.total_transactions || 0} transaksi
            </p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <Icons.Wallet />
          </div>
        </div>
        <p className="text-xs text-amber-200 mt-3">
          *Setiap transaksi DP & Pelunasan dipotong 3% untuk biaya admin
        </p>
      </div>

      {/* Verifikasi DP */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
          <span className="text-2xl">💰</span> Verifikasi DP (Down Payment)
        </h2>
        {waitingDp.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Tidak ada DP yang menunggu verifikasi</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-gray-600 dark:text-gray-300">
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Kasus</th>
                  <th className="p-3 text-left">Lawyer</th>
                  <th className="p-3 text-left">Jumlah DP</th>
                  <th className="p-3 text-left">Bukti</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {waitingDp.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{p.client_name}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{p.judul_kasus}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{p.lawyer_name}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">Rp {p.dp_amount?.toLocaleString("id-ID")}</td>
                    <td className="p-3">
                      <a href={p.dp_proof} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <Icons.Eye /> Lihat
                      </a>
                    </td>
                    <td className="p-3">
                      <button onClick={() => verifyDp(p.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition">
                        Verifikasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verifikasi Pelunasan */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
          <span className="text-2xl">💳</span> Verifikasi Pelunasan
        </h2>
        {waitingPelunasan.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">✅ Semua pelunasan sudah diverifikasi</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-gray-600 dark:text-gray-300">
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Kasus</th>
                  <th className="p-3 text-left">Lawyer</th>
                  <th className="p-3 text-left">Bukti</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {waitingPelunasan.map(p => (
                  <tr key={p.id}>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{p.client_name}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{p.judul_kasus}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{p.lawyer_name}</td>
                    <td className="p-3">
                      <a href={p.final_payment_proof} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        <Icons.Eye /> Lihat
                      </a>
                    </td>
                    <td className="p-3">
                      <button onClick={() => verifyFinalPayment(p.id)} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm transition">
                        Verifikasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Riwayat Transaksi Admin Wallet */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-white">
          <span className="text-2xl">📊</span> Riwayat Transaksi Admin
        </h2>
        {adminWallet.transactions?.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">Belum ada transaksi</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-gray-600 dark:text-gray-300">
                  <th className="p-3 text-left">Tanggal</th>
                  <th className="p-3 text-left">Kasus</th>
                  <th className="p-3 text-left">Client</th>
                  <th className="p-3 text-left">Jenis</th>
                  <th className="p-3 text-left">Jumlah</th>
                  <th className="p-3 text-left">Fee 3%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {adminWallet.transactions?.map(t => (
                  <tr key={t.id}>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{new Date(t.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{t.judul_kasus}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{t.client_name}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${t.type === "dp" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"}`}>
                        {t.type === "dp" ? "DP" : "Pelunasan"}
                      </span>
                    </td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">Rp {t.amount?.toLocaleString("id-ID")}</td>
                    <td className="p-3 text-red-600 dark:text-red-400 font-semibold">Rp {t.fee_amount?.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Tambah Lawyer */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6">
        <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-gray-800 dark:text-white">
          <Icons.Plus /> Tambah Lawyer Baru
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih User *</label>
              <select
                value={formData.user_id}
                onChange={(e) => setFormData({...formData, user_id: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">-- Pilih User --</option>
                {users.filter(u => u.role === 'client').map(u => (
                  <option key={u.id} value={u.id}>{u.nama} - {u.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Firma Hukum *</label>
              <input type="text" value={formData.firma_hukum} onChange={(e) => setFormData({...formData, firma_hukum: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Spesialisasi *</label>
              <input type="text" value={formData.spesialisasi} onChange={(e) => setFormData({...formData, spesialisasi: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pengalaman (Tahun)</label>
              <input type="number" value={formData.pengalaman} onChange={(e) => setFormData({...formData, pengalaman: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tarif Konsultasi (Rp) *</label>
              <input type="number" value={formData.tarif_konsultasi} onChange={(e) => setFormData({...formData, tarif_konsultasi: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deskripsi</label>
              <textarea rows="3" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Foto Profil</label>
              <input type="text" value={formData.foto_profil} onChange={(e) => setFormData({...formData, foto_profil: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <button type="submit" disabled={submitting} className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold transition flex items-center justify-center gap-2 shadow-md">
            <Icons.Plus /> {submitting ? "Menyimpan..." : "Tambah Lawyer"}
          </button>
        </form>
      </div>

      {/* Daftar Lawyer */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">📋 Daftar Lawyer</h2>
        </div>
        {lawyers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Belum ada lawyer</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-gray-600 dark:text-gray-300">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Firma Hukum</th>
                  <th className="p-3 text-left">Spesialisasi</th>
                  <th className="p-3 text-left">Tarif</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Jadwal</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {lawyers.map(l => (
                  <tr key={l.id}>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{l.id}</td>
                    <td className="p-3 font-medium text-gray-800 dark:text-gray-200">{l.firma_hukum || "-"}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">{l.spesialisasi}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200">Rp {Number(l.tarif_konsultasi).toLocaleString("id-ID")}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${l.status_aktif ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {l.status_aktif ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => openScheduleModal(l.id, l.firma_hukum || "Lawyer")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs transition flex items-center gap-1"
                      >
                        <Icons.Clock /> Atur Jadwal
                      </button>
                    </td>
                    <td className="p-3">
                      <button onClick={() => handleDelete(l.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm transition">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Atur Jadwal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowScheduleModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Atur Jadwal - {selectedLawyerName}
                </h3>
                <button 
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <Icons.Close />
                </button>
              </div>

              {loadingSchedule ? (
                <div className="flex justify-center items-center py-8">
                  <Icons.Loading />
                  <span className="ml-2 text-gray-500">Memuat jadwal...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Belum ada jadwal</p>
                  ) : (
                    schedules.map((s, idx) => (
                      <div key={s.day_of_week} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center gap-2 w-24">
                          <input
                            type="checkbox"
                            checked={s.enabled}
                            onChange={(e) => {
                              const newSchedules = [...schedules]
                              newSchedules[idx].enabled = e.target.checked
                              setSchedules(newSchedules)
                            }}
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {dayNames[s.day_of_week]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={s.start_time}
                            onChange={(e) => {
                              const newSchedules = [...schedules]
                              newSchedules[idx].start_time = e.target.value
                              setSchedules(newSchedules)
                            }}
                            disabled={!s.enabled}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          <span className="text-gray-500">-</span>
                          <input
                            type="time"
                            value={s.end_time}
                            onChange={(e) => {
                              const newSchedules = [...schedules]
                              newSchedules[idx].end_time = e.target.value
                              setSchedules(newSchedules)
                            }}
                            disabled={!s.enabled}
                            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={saveSchedule}
                  disabled={savingSchedule || loadingSchedule}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition disabled:opacity-50"
                >
                  {savingSchedule ? <Icons.Loading /> : "Simpan Jadwal"}
                </button>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminDashboard