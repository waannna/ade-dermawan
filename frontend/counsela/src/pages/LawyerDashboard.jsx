import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import useConsultations from "../hooks/useConsultations"
import api from "../utils/axios"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

const Icons = {
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Money: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Chat: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  ExternalLink: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-12 h-12 mx-auto text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

const LawyerDashboard = () => {
  const { user } = useAuth()
  const { consultations, fetchConsultations } = useConsultations()
  const [showMeetingModal, setShowMeetingModal] = useState(null)
  const [meetingLink, setMeetingLink] = useState("")
  const [loadingAction, setLoadingAction] = useState(false)
  const [confirmData, setConfirmData] = useState({ isOpen: false, id: null, action: null, title: "", message: "" })

  const myConsultations = consultations.filter(c => 
    c.lawyer_id === user?.id || c.lawyer_name === user?.nama
  )
  
  const pendingOrders = myConsultations.filter(c => c.status === "pending")
  const acceptedOrders = myConsultations.filter(c => c.status === "accepted" && c.dp_payment_status !== "paid")
  const dpPaidOrders = myConsultations.filter(c => c.status === "accepted" && c.dp_payment_status === "paid")
  const ongoingOrders = myConsultations.filter(c => c.status === "ongoing")
  const waitingPelunasanOrders = myConsultations.filter(c => c.status === "waiting_pelunasan")
  const completedOrders = myConsultations.filter(c => c.status === "completed")

  useEffect(() => { 
    fetchConsultations() 
  }, [])

  const showConfirm = (id, action, title, message) => {
    setConfirmData({ isOpen: true, id, action, title, message })
  }

  const handleConfirm = async () => {
    const { id, action } = confirmData
    setLoadingAction(true)
    try {
      if (action === 'accept') {
        await api.patch(`/consultations/${id}/accept`)
        toast.success("Orderan diterima!")
      } else if (action === 'reject') {
        await api.patch(`/consultations/${id}/status`, { status: "cancelled" })
        toast.success("Orderan ditolak")
      } else if (action === 'complete') {
        await api.patch(`/consultations/${id}/complete-case`)
        toast.success("Kasus selesai! Client dapat melakukan pelunasan.")
      } else if (action === 'hide') {
        await api.patch(`/consultations/${id}/hide`)
        toast.success("Riwayat dihapus dari tampilan Anda")
      }
      await fetchConsultations()
    } catch (err) {
      toast.error("Gagal melakukan aksi")
    } finally {
      setLoadingAction(false)
      setConfirmData({ isOpen: false, id: null, action: null, title: "", message: "" })
    }
  }

  const handleAddMeetingLink = async (id) => {
    if (!meetingLink.trim()) {
      toast.error("Meeting link wajib diisi")
      return
    }
    setLoadingAction(true)
    try {
      await api.patch(`/consultations/${id}/add-meeting-link`, { meeting_link: meetingLink })
      toast.success("Meeting link berhasil ditambahkan! Konsultasi bisa dimulai.")
      await fetchConsultations()
      setShowMeetingModal(null)
      setMeetingLink("")
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menambahkan meeting link")
    } finally {
      setLoadingAction(false)
    }
  }

  const getStatusBadge = (consultation) => {
    if (consultation.status === "pending") {
      return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Menunggu Diterima</span>
    }
    if (consultation.status === "accepted" && consultation.dp_payment_status !== "paid") {
      return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Menunggu DP</span>
    }
    if (consultation.dp_payment_status === "waiting_verification") {
      return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Verifikasi DP</span>
    }
    if (consultation.status === "accepted" && consultation.dp_payment_status === "paid") {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">DP Lunas, Siap Meeting</span>
    }
    if (consultation.status === "ongoing") {
      return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Konsultasi Berjalan</span>
    }
    if (consultation.status === "waiting_pelunasan") {
      return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Menunggu Pelunasan</span>
    }
    if (consultation.status === "completed") {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Selesai</span>
    }
    if (consultation.status === "cancelled") {
      return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Dibatalkan</span>
    }
    return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">{consultation.status}</span>
  }

  const stats = [
    { label: "Orderan Baru", value: pendingOrders.length, color: "yellow" },
    { label: "Menunggu DP", value: acceptedOrders.length, color: "blue" },
    { label: "DP Lunas", value: dpPaidOrders.length, color: "green" },
    { label: "Konsultasi", value: ongoingOrders.length, color: "purple" },
    { label: "Menunggu Lunas", value: waitingPelunasanOrders.length, color: "orange" },
    { label: "Selesai", value: completedOrders.length, color: "emerald" },
  ]

  const statColors = {
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  }

  const capitalizeName = (name) => {
    if (!name) return ""
    return name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold">Halo, {capitalizeName(user?.nama)}</h1>
        <p className="text-blue-100 mt-1">Kelola orderan konsultasi dari client</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">📋 {pendingOrders.length} Orderan Baru</span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">💰 {dpPaidOrders.length} DP Lunas</span>
          <span className="bg-white/20 rounded-full px-3 py-1 text-sm">💬 {ongoingOrders.length} Konsultasi</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${statColors[stat.color]} rounded-xl p-3 text-center shadow-md`}>
            <p className="text-xl font-bold">{stat.value}</p>
            <p className="text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">📋 Daftar Konsultasi</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="p-3 text-left font-semibold">Client</th>
                <th className="p-3 text-left font-semibold">Kasus</th>
                <th className="p-3 text-left font-semibold">Tanggal</th>
                <th className="p-3 text-left font-semibold">Jam</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">Meeting</th>
                <th className="p-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {myConsultations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Belum ada konsultasi
                  </td>
                </tr>
              ) : (
                myConsultations.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-3 text-gray-800 dark:text-gray-200 font-medium">{c.client_name || "-"}</td>
                    <td className="p-3 text-gray-800 dark:text-gray-200 font-semibold">{c.judul_kasus}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{c.tanggal_konsultasi?.split('T')[0]}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300">{c.jam_konsultasi}</td>
                    <td className="p-3">{getStatusBadge(c)}</td>
                    <td className="p-3">
                      {c.meeting_link ? (
                        <a href={c.meeting_link} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline inline-flex items-center gap-1">
                          Join <Icons.ExternalLink />
                        </a>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {c.status === "pending" && (
                          <>
                            <button 
                              onClick={() => showConfirm(c.id, 'accept', 'Terima Orderan', `Apakah Anda yakin ingin menerima orderan "${c.judul_kasus}"?`)} 
                              disabled={loadingAction} 
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs transition"
                            >
                              Terima
                            </button>
                            <button 
                              onClick={() => showConfirm(c.id, 'reject', 'Tolak Orderan', `Apakah Anda yakin ingin menolak orderan "${c.judul_kasus}"?`)} 
                              disabled={loadingAction} 
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                        
                        {c.status === "accepted" && c.dp_payment_status === "paid" && !c.meeting_link && (
                          <button 
                            onClick={() => setShowMeetingModal(c)} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs transition"
                          >
                            Tambah Meeting
                          </button>
                        )}
                        
                        {c.status === "ongoing" && (
                          <button 
                            onClick={() => showConfirm(c.id, 'complete', 'Selesaikan Kasus', `Apakah Anda yakin kasus "${c.judul_kasus}" sudah selesai?`)} 
                            disabled={loadingAction} 
                            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded-lg text-xs transition"
                          >
                            Selesaikan
                          </button>
                        )}
                        
                        {(c.status === "completed" || c.status === "cancelled" || c.status === "waiting_pelunasan") && (
                          <button 
                            onClick={() => showConfirm(c.id, 'hide', 'Hapus Riwayat', `Apakah Anda yakin ingin menghapus riwayat konsultasi "${c.judul_kasus}" dari tampilan Anda?`)} 
                            disabled={loadingAction} 
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition"
                          >
                            Hapus
                          </button>
                        )}
                        
                        {c.status === "waiting_pelunasan" && (
                          <span className="text-yellow-600 dark:text-yellow-400 text-xs">⏳ Menunggu Pelunasan</span>
                        )}
                        
                        {c.status === "completed" && (
                          <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                            <Icons.CheckCircle /> Selesai
                          </span>
                        )}
                        
                        {c.status === "cancelled" && (
                          <span className="text-red-600 dark:text-red-400 text-xs">✗ Dibatalkan</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Meeting Link */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Tambah Meeting Link</h3>
            <p className="mb-1 font-medium text-gray-800 dark:text-white">{showMeetingModal.judul_kasus}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Client: {showMeetingModal.client_name}</p>
            <input 
              type="text" 
              value={meetingLink} 
              onChange={(e) => setMeetingLink(e.target.value)} 
              placeholder="https://meet.google.com/xxx" 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4" 
              autoFocus 
            />
            <div className="flex gap-3">
              <button 
                onClick={() => handleAddMeetingLink(showMeetingModal.id)} 
                disabled={loadingAction}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl transition"
              >
                {loadingAction ? <Icons.Loading /> : "Simpan"}
              </button>
              <button 
                onClick={() => setShowMeetingModal(null)} 
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-xl transition hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi */}
      <AnimatePresence>
        {confirmData.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setConfirmData({ isOpen: false, id: null, action: null, title: "", message: "" })}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center">
                <Icons.AlertTriangle />
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-4">{confirmData.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{confirmData.message}</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleConfirm}
                  disabled={loadingAction}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-medium transition"
                >
                  {loadingAction ? "Memproses..." : "Ya, Lanjutkan"}
                </button>
                <button
                  onClick={() => setConfirmData({ isOpen: false, id: null, action: null, title: "", message: "" })}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2.5 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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

export default LawyerDashboard