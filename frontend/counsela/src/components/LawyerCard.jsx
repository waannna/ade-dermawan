import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import api from "../utils/axios"
import useAuth from "../hooks/useAuth"

const Icons = {
  Star: () => (
    <svg className="w-3.5 h-3.5 inline" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Money: () => (
    <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Verified: () => (
    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Login: () => (
    <svg className="w-3.5 h-3.5 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
    </svg>
  ),
}

const LawyerCard = ({ lawyer }) => {
  const { isAuthenticated } = useAuth()
  const [scheduleText, setScheduleText] = useState("")
  const [loadingSchedule, setLoadingSchedule] = useState(true)

  useEffect(() => {
    // Hanya fetch schedule jika user sudah login
    if (!isAuthenticated || !lawyer?.id) {
      setLoadingSchedule(false)
      return
    }
    
    const fetchSchedule = async () => {
      try {
        const response = await api.get(`/lawyers/${lawyer.id}/schedule`)
        if (response.data.success) {
          const text = response.data.data.schedule_text
          setScheduleText(text.length > 60 ? text.substring(0, 60) + "..." : text)
        }
      } catch (error) {
        console.error("Gagal load jadwal:", error)
      } finally {
        setLoadingSchedule(false)
      }
    }
    fetchSchedule()
  }, [lawyer?.id, isAuthenticated])

  if (!lawyer) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* Badge Rating */}
      <div className="absolute top-3 right-3 z-10 bg-yellow-400 dark:bg-yellow-500 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
        <Icons.Star />
        <span>{lawyer.rating || "0"}</span>
      </div>

      {/* Verified Badge */}
      {lawyer.status_aktif && (
        <div className="absolute top-3 left-3 z-10 bg-green-500 px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
          <Icons.Verified />
          <span className="text-white">Aktif</span>
        </div>
      )}

      {/* Foto */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800">
        <img
          src={lawyer.foto_profil || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500"}
          alt={lawyer.firma_hukum || "Lawyer"}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Konten */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white truncate">
          {lawyer.firma_hukum || "Firma Hukum"}
        </h3>
        <p className="text-blue-600 dark:text-blue-400 mt-1 font-medium text-sm">
          {lawyer.spesialisasi || "Spesialisasi"}
        </p>
        
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400 flex items-center">
            <Icons.Calendar /> {lawyer.pengalaman || 0} tahun
          </span>
          <span className="text-gray-500 dark:text-gray-400 flex items-center">
            <Icons.Money /> Rp {Number(lawyer.tarif_konsultasi || 0).toLocaleString("id-ID")}
          </span>
        </div>

        {/* Jam Kerja - Hanya tampil jika user sudah login */}
        {isAuthenticated ? (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-1">
              <Icons.Clock />
              <span className="flex-1">{loadingSchedule ? "Memuat..." : (scheduleText || "Jam kerja belum diatur")}</span>
            </p>
          </div>
        ) : (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
            <Link to="/login" className="text-xs text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 hover:underline">
              <Icons.Login /> Login untuk lihat jadwal
            </Link>
          </div>
        )}

        {/* Tombol Lihat Detail */}
        <Link
          to={`/lawyers/${lawyer.id}`}
          className="mt-4 flex items-center justify-center gap-1 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl transition-all duration-300 shadow-md group-hover:shadow-lg text-sm font-medium"
        >
          Lihat Detail
          <Icons.ArrowRight />
        </Link>
      </div>
    </motion.div>
  )
}

export default LawyerCard