import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import lawyerService from "../service/lawyerService"
import api from "../utils/axios"

const LawyerDetail = () => {
  const { id } = useParams()
  const [lawyer, setLawyer] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [avgRating, setAvgRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    const fetchLawyer = async () => {
      try { const data = await lawyerService.getLawyerById(id); setLawyer(data) }
      catch (err) { setError("Lawyer tidak ditemukan") }
      finally { setLoading(false) }
    }
    const fetchReviews = async () => {
      try { const res = await api.get(`/reviews/lawyer/${id}`); const data = res.data.data || []; setReviews(data)
        if (data.length) { const total = data.reduce((s,r)=> s + r.rating,0); setAvgRating(Math.round((total/data.length)*10)/10); setTotalReviews(data.length) }
      } catch (err) { console.error(err) }
    }
    fetchLawyer(); fetchReviews()
  }, [id])

  const formatDate = (date) => { if (!date) return "-"; const d = new Date(date); return d.toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric' }) }

  // SVG Icons
  const IconBack = () => (<svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" /></svg>)
  const IconStar = () => (<svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)
  const IconStarOutline = () => (<svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>)
  const IconCalendar = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>)
  const IconMoney = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>)
  const IconStatus = () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>)
  const IconArrowRight = () => (<svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>)

  if (loading) return <div className="flex justify-center items-center h-64"><div className="text-gray-500">Loading...</div></div>
  if (error) return <div className="text-center py-20"><div className="text-5xl mb-4">😞</div><h2 className="text-2xl font-bold text-gray-800 dark:text-white">{error}</h2><Link to="/lawyers" className="btn-primary mt-6 inline-block">Kembali</Link></div>

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-4"><Link to="/lawyers" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition group"><IconBack /> Kembali</Link></div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="h-56 md:h-72 overflow-hidden hero-gradient">
          <img src={lawyer?.foto_profil || "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800"} alt={lawyer?.firma_hukum} className="w-full h-full object-cover object-top" onError={(e)=> e.target.src = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800"} />
        </div>
        <div className="p-5 md:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div><h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">{lawyer?.firma_hukum || "Firma Hukum"}</h1><p className="text-blue-600 dark:text-blue-400 mt-1 text-lg font-medium">{lawyer?.spesialisasi}</p></div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl p-4 text-center min-w-[130px]">
              <div className="flex items-center justify-center gap-1"><span className="text-2xl md:text-3xl font-bold text-yellow-600 dark:text-yellow-400">{avgRating > 0 ? avgRating : (lawyer?.rating || 0)}</span><IconStar /></div>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">{totalReviews > 0 ? `${totalReviews} ulasan` : "Belum ada ulasan"}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4 mt-6 md:mt-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-center"><IconCalendar className="mx-auto mb-2 text-blue-600" /><p className="text-xs md:text-sm text-gray-500">Pengalaman</p><p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mt-1">{lawyer?.pengalaman || 0} Tahun</p></div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-center"><IconMoney className="mx-auto mb-2 text-green-600" /><p className="text-xs md:text-sm text-gray-500">Tarif</p><p className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mt-1">Rp {Number(lawyer?.tarif_konsultasi || 0).toLocaleString("id-ID")}</p></div>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-center"><IconStatus className="mx-auto mb-2 text-purple-600" /><p className="text-xs md:text-sm text-gray-500">Status</p><p className={`text-lg md:text-xl font-bold mt-1 ${lawyer?.status_aktif ? "text-green-600" : "text-red-600"}`}>{lawyer?.status_aktif ? "Aktif" : "Tidak Aktif"}</p></div>
          </div>
          <div className="mt-6 md:mt-8"><h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white mb-3">Tentang Lawyer</h2><p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">{lawyer?.deskripsi || "Belum ada deskripsi."}</p></div>
          <div className="mt-6 md:mt-8 flex flex-wrap gap-3 md:gap-4"><Link to="/lawyers" className="btn-secondary text-sm md:text-base">Kembali</Link>{lawyer?.status_aktif && <Link to={`/consultation/new?lawyer=${lawyer?.id}`} className="btn-primary text-sm md:text-base flex items-center gap-2 group">Booking </Link>}</div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 md:mt-10">
        <div className="flex items-center justify-between mb-4 md:mb-6"><h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white"><IconStar /> Ulasan Client</h2><span className="text-xs md:text-sm text-gray-500">{totalReviews} ulasan</span></div>
        {reviews.length === 0 ? <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow"><IconStarOutline className="w-16 h-16 mx-auto text-gray-400 mb-4" /><p className="text-gray-500">Belum ada ulasan</p></div> : <div className="space-y-3 md:space-y-4">{reviews.map((review, idx) => <motion.div key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-5 shadow hover:shadow-md transition border border-gray-100 dark:border-gray-700"><div className="flex flex-col md:flex-row justify-between gap-3"><div><div className="flex items-center gap-2 md:gap-3 flex-wrap"><p className="font-semibold text-sm md:text-base text-gray-800 dark:text-white">{review.client_name || "Client"}</p><div className="flex items-center gap-0.5">{ [1,2,3,4,5].map(star => <span key={star} className={`text-base md:text-lg ${star <= review.rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}>★</span>) }</div></div><p className="text-gray-600 dark:text-gray-400 mt-2 md:mt-3 text-sm md:text-base">{review.komentar}</p></div><p className="text-xs text-gray-400 whitespace-nowrap">{formatDate(review.created_at)}</p></div></motion.div>)}</div>}
      </motion.div>
    </div>
  )
}

export default LawyerDetail