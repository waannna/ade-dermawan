import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import api from "../utils/axios"
import { toast } from "react-hot-toast"

const Icons = {
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
  Money: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Message: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
}

const ClientDashboard = () => {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMyConsultations = async () => {
      try {
        setLoading(true)
        const response = await api.get("/consultations/client")
        const data = response.data.data || []
        setConsultations(data)
      } catch (error) {
        console.error("Gagal load konsultasi:", error)
        toast.error("Gagal memuat data konsultasi")
      } finally {
        setLoading(false)
      }
    }
    fetchMyConsultations()
  }, [])

  const pendingOrders = consultations.filter(c => c.status === "pending")
  const acceptedOrders = consultations.filter(c => c.status === "accepted")
  const dpWaitingOrders = consultations.filter(c => c.dp_payment_status === "waiting_verification")
  const ongoingOrders = consultations.filter(c => c.status === "ongoing")
  const waitingPelunasanOrders = consultations.filter(c => c.status === "waiting_pelunasan")
  const completedOrders = consultations.filter(c => c.status === "completed")

  const getStatusBadge = (consultation) => {
    if (consultation.status === "pending") {
      return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Menunggu Diterima</span>
    }
    if (consultation.status === "accepted" && consultation.dp_payment_status !== "paid") {
      return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">Menunggu DP</span>
    }
    if (consultation.dp_payment_status === "waiting_verification") {
      return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Verifikasi DP</span>
    }
    if (consultation.dp_payment_status === "paid" && consultation.status === "accepted") {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">DP Lunas</span>
    }
    if (consultation.status === "ongoing") {
      return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">Konsultasi Berjalan</span>
    }
    if (consultation.status === "waiting_pelunasan") {
      return <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">Menunggu Pelunasan</span>
    }
    if (consultation.status === "completed") {
      return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Selesai</span>
    }
    if (consultation.status === "cancelled") {
      return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">Dibatalkan</span>
    }
    return <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{consultation.status}</span>
  }

  const stats = [
    { label: "Menunggu", value: pendingOrders.length + acceptedOrders.length, icon: Icons.Clock, color: "yellow" },
    { label: "Verifikasi DP", value: dpWaitingOrders.length, icon: Icons.Money, color: "blue" },
    { label: "Konsultasi", value: ongoingOrders.length, icon: Icons.Message, color: "purple" },
    { label: "Selesai", value: completedOrders.length, icon: Icons.CheckCircle, color: "green" }, // ← "Selesai" bukan "Kelaar"
  ]

  const statColors = {
    yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    green: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  }

  return (
    <div>
      {/* Hero Client */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Selamat Datang, {user?.nama} 👋</h1>
            <p className="text-teal-100 mt-1">Kelola konsultasi hukum Anda di sini</p>
          </div>
          <Link 
            to="/consultation/new" 
            className="inline-flex items-center gap-2 bg-white text-teal-600 px-5 py-2 rounded-xl font-semibold hover:shadow-lg transition text-sm"
          >
            <Icons.Plus /> Booking Konsultasi
          </Link>
        </div>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition">
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${statColors[stat.color]}`}>
                <Icon />
              </div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Icons.Loading />
          <span className="ml-2 text-gray-500">Memuat data konsultasi...</span>
        </div>
      )}

      {/* Daftar Konsultasi */}
      {!loading && consultations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
          <div className="p-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">📋 Daftar Konsultasi</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {consultations.map((c) => (
              <div key={c.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-white">{c.judul_kasus}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icons.Calendar /> {c.tanggal_konsultasi?.split('T')[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icons.Clock /> {c.jam_konsultasi}
                      </span>
                      <span className="text-gray-400">Lawyer: {c.lawyer_name}</span>
                    </div>
                    {c.meeting_link && (
                      <a href={c.meeting_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-green-600 text-sm mt-2 hover:underline">
                        🔗 Join Meeting
                      </a>
                    )}
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    {getStatusBadge(c)}
                    <Link 
                      to={`/consultations/${c.id}`} 
                      className="text-blue-600 text-sm hover:underline inline-flex items-center gap-1"
                    >
                      Lihat Detail <Icons.ArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && consultations.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Icons.Message />
          </div>
          <p className="text-gray-500">Belum ada konsultasi</p>
          <Link to="/consultation/new" className="text-teal-600 mt-2 inline-block text-sm hover:underline">
            Booking sekarang →
          </Link>
        </div>
      )}
    </div>
  )
}

export default ClientDashboard