import { useEffect } from "react"
import { Link } from "react-router-dom"
import ConsultationCard from "../components/ConsultationCard"
import useConsultations from "../hooks/useConsultations"
import useAuth from "../hooks/useAuth"

const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
}

const Consultations = () => {
  const { user } = useAuth()
  const { consultations, loading, error, fetchConsultations } = useConsultations()

  useEffect(() => { fetchConsultations() }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Memuat data konsultasi...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-500">{error}</p>
        <button onClick={fetchConsultations} className="mt-4 text-blue-600 hover:underline">Coba lagi</button>
      </div>
    )
  }

  const pageTitle = user?.role === "lawyer" ? "Orderan Masuk" : "Konsultasi Saya"
  const pageDesc = user?.role === "lawyer" 
    ? "Kelola konsultasi yang masuk dari client" 
    : "Kelola seluruh konsultasi hukum Anda"

  return (
    <div>
      <div className="hero-gradient rounded-2xl md:rounded-3xl p-6 md:p-8 text-white mb-6 md:mb-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to={user?.role === "lawyer" ? "/lawyer-dashboard" : "/client-dashboard"}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-all duration-200 group"
          >
            <Icons.ArrowLeft /> Dashboard
          </Link>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold">{pageTitle}</h1>
          <p className="mt-2 text-blue-100 text-sm md:text-base">{pageDesc}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {consultations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 text-center shadow">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300">Belum Ada Konsultasi</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
              {user?.role === "lawyer" 
                ? "Belum ada client yang melakukan booking konsultasi" 
                : "Mulailah booking konsultasi dengan lawyer pilihan Anda"}
            </p>
            {user?.role === "client" && (
              <Link
                to="/consultation/new"
                className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-200 text-sm md:text-base"
              >
                + Booking Konsultasi
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {consultations.map((consultation) => (
                <ConsultationCard 
                  key={consultation.id} 
                  {...consultation} 
                  onHide={fetchConsultations}
                />
              ))}
            </div>
            <div className="mt-6 text-center text-xs text-gray-400">
              Menampilkan {consultations.length} riwayat konsultasi
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Consultations