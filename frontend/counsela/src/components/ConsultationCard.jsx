import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from "react-hot-toast"
import api from "../utils/axios"
import useAuth from "../hooks/useAuth"
import { useState } from "react"

const Icons = {
  Calendar: () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Video: () => (
    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
}

const ConsultationCard = ({ id, judul_kasus, tanggal_konsultasi, jam_konsultasi, status, meeting_link, onHide }) => {
  const { user } = useAuth()
  const [deleting, setDeleting] = useState(false)

  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "approved": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "cancelled": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "ongoing": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "waiting_pelunasan": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusText = () => {
    switch (status?.toLowerCase()) {
      case "approved": return "Disetujui"
      case "completed": return "Selesai"
      case "pending": return "Menunggu"
      case "cancelled": return "Dibatalkan"
      case "ongoing": return "Berjalan"
      case "waiting_pelunasan": return "Menunggu Pelunasan"
      default: return status || "Unknown"
    }
  }

  const formatDate = (date) => {
    if (!date) return "-"
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isCompleted = status?.toLowerCase() === "completed"
  const hasMeetingLink = meeting_link && meeting_link.trim() !== ""

  const handleHide = async () => {
    if (!confirm(`Hapus riwayat "${judul_kasus}" dari tampilan Anda?`)) return
    
    setDeleting(true)
    try {
      await api.patch(`/consultations/${id}/hide`)
      toast.success("Riwayat dihapus dari tampilan Anda")
      if (onHide) onHide()
    } catch (error) {
      toast.error("Gagal menghapus riwayat")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 dark:border-gray-700 group"
    >
      <button
        onClick={handleHide}
        disabled={deleting}
        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md z-10"
        title="Hapus dari tampilan saya"
      >
        {deleting ? <Icons.Loading /> : <Icons.Trash />}
      </button>

      <div className="flex justify-between items-start gap-2 flex-wrap pr-8">
        <h2 className="text-base font-bold text-gray-800 dark:text-white line-clamp-2">
          {judul_kasus || "Judul tidak tersedia"}
        </h2>
        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
        <p className="flex items-center"><Icons.Calendar /> {formatDate(tanggal_konsultasi)}</p>
        <p className="flex items-center"><Icons.Clock /> {jam_konsultasi || "-"}</p>
        {hasMeetingLink && (
          <p className="flex items-center text-green-600 dark:text-green-400">
            <Icons.Video /> Meeting Link Tersedia
          </p>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        {isCompleted ? (
          <Link
            to={`/consultations/${id}?review=true`}
            className="flex-1 text-center bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white py-2.5 rounded-xl transition-all duration-200 font-medium text-sm flex items-center justify-center gap-1 group"
          >
            <Icons.Star /> Beri Rating <Icons.ArrowRight />
          </Link>
        ) : (
          <Link
            to={`/consultations/${id}`}
            className="flex-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-1 group"
          >
            Lihat Detail <Icons.ArrowRight />
          </Link>
        )}

        {hasMeetingLink && !isCompleted && (
          <a
            href={meeting_link}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-1"
          >
            Join Meeting <Icons.ArrowRight />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default ConsultationCard