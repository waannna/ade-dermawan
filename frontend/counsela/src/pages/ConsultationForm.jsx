import { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import consultationService from "../service/consultationService"
import lawyerService from "../service/lawyerService"
import api from "../utils/axios"
import { toast } from "react-hot-toast"

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
  Lawyer: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Title: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
  Description: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
}

const ConsultationForm = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [formData, setFormData] = useState({ 
    lawyer_id: searchParams.get("lawyer") || "", 
    judul_kasus: "", 
    deskripsi_kasus: "", 
    tanggal_konsultasi: "", 
    jam_konsultasi: "" 
  })
  const [lawyers, setLawyers] = useState([])
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [workingHours, setWorkingHours] = useState(null)
  const [scheduleText, setScheduleText] = useState("")

  useEffect(() => {
    const fetchLawyers = async () => {
      try { 
        const res = await lawyerService.getAllLawyers()
        setLawyers(res.data || res) 
      } catch (err) { 
        toast.error("Gagal memuat data lawyer") 
      }
    }
    fetchLawyers()
  }, [])

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!formData.lawyer_id) return
      try { 
        const res = await api.get(`/lawyers/${formData.lawyer_id}/schedule`)
        if (res.data.success) setScheduleText(res.data.data.schedule_text)
      } catch (err) { 
        console.error(err) 
      }
    }
    fetchSchedule()
  }, [formData.lawyer_id])

  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.lawyer_id || !formData.tanggal_konsultasi) { 
        setAvailableSlots([])
        setWorkingHours(null)
        return 
      }
      setChecking(true)
      try {
        const res = await api.get(`/consultations/lawyer/${formData.lawyer_id}/schedule`, { 
          params: { tanggal: formData.tanggal_konsultasi } 
        })
        const data = res.data.data
        setWorkingHours(data.working_hours)
        setAvailableSlots(data.available_slots || [])
        if (formData.jam_konsultasi && !data.available_slots?.includes(formData.jam_konsultasi)) { 
          setFormData(prev => ({ ...prev, jam_konsultasi: "" }))
          toast.error("Jam tidak tersedia") 
        }
      } catch (err) { 
        setAvailableSlots([])
        toast.error("Gagal cek jadwal") 
      } finally { 
        setChecking(false) 
      }
    }
    const timeout = setTimeout(fetchSlots, 500)
    return () => clearTimeout(timeout)
  }, [formData.lawyer_id, formData.tanggal_konsultasi])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.lawyer_id || !formData.judul_kasus || !formData.deskripsi_kasus || !formData.tanggal_konsultasi || !formData.jam_konsultasi) {
      toast.error("Semua field wajib diisi")
      return
    }
    setLoading(true)
    try { 
      await consultationService.createConsultation(formData)
      toast.success("Booking berhasil!")
      setTimeout(() => navigate("/consultations"), 1500)
    } catch (err) { 
      toast.error(err.response?.data?.message || "Gagal booking") 
    } finally { 
      setLoading(false) 
    }
  }

  const minDate = new Date().toISOString().split("T")[0]
  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const selectedDay = formData.tanggal_konsultasi ? dayNames[new Date(formData.tanggal_konsultasi).getDay()] : ""

  const selectedLawyer = lawyers.find(l => l.id == formData.lawyer_id)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 text-white mb-6">
        <Link to="/consultations" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition group">
          <Icons.ArrowLeft /> Kembali
        </Link>
        <h1 className="text-2xl font-bold">Booking Konsultasi</h1>
        <p className="text-blue-100 mt-1">Isi detail kasus Anda untuk menjadwalkan konsultasi hukum</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilih Lawyer */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <Icons.Lawyer /> Pilih Lawyer *
            </label>
            <select
              value={formData.lawyer_id}
              onChange={(e) => setFormData({...formData, lawyer_id: e.target.value, jam_konsultasi: ""})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            >
              <option value="">-- Pilih Lawyer --</option>
              {lawyers.map(l => (
                <option key={l.id} value={l.id}>
                  {l.firma_hukum || "Lawyer"} - {l.spesialisasi} (Rp {Number(l.tarif_konsultasi).toLocaleString("id-ID")})
                </option>
              ))}
            </select>
            {scheduleText && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Icons.Clock /> Jam Kerja: {scheduleText}
                </p>
              </div>
            )}
            {selectedLawyer && (
              <div className="mt-2 text-sm text-gray-500">
                Tarif: <span className="font-semibold text-blue-600">Rp {Number(selectedLawyer.tarif_konsultasi).toLocaleString("id-ID")}</span>
              </div>
            )}
          </div>

          {/* Judul Kasus */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <Icons.Title /> Judul Kasus *
            </label>
            <input
              type="text"
              value={formData.judul_kasus}
              onChange={(e) => setFormData({...formData, judul_kasus: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
              placeholder="Contoh: Sengketa Tanah, Perceraian, dll"
            />
          </div>

          {/* Deskripsi Kasus */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <Icons.Description /> Deskripsi Kasus *
            </label>
            <textarea
              rows="5"
              value={formData.deskripsi_kasus}
              onChange={(e) => setFormData({...formData, deskripsi_kasus: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"
              required
              placeholder="Jelaskan secara singkat kasus yang ingin dikonsultasikan..."
            />
          </div>

          {/* Tanggal Konsultasi */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <Icons.Calendar /> Tanggal Konsultasi *
            </label>
            <input
              type="date"
              value={formData.tanggal_konsultasi}
              onChange={(e) => setFormData({...formData, tanggal_konsultasi: e.target.value, jam_konsultasi: ""})}
              min={minDate}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
            {formData.tanggal_konsultasi && (
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Icons.Calendar /> {selectedDay}, {formData.tanggal_konsultasi}
              </p>
            )}
          </div>

          {/* Jam Konsultasi */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 flex items-center gap-2">
              <Icons.Clock /> Jam Konsultasi *
              {checking && <span className="text-sm text-gray-400">(Mengecek...)</span>}
            </label>
            
            {formData.tanggal_konsultasi && formData.lawyer_id && !checking && (
              workingHours === null ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl text-center flex items-center justify-center gap-2">
                  <Icons.Alert className="text-yellow-600" />
                  <p className="text-yellow-700 dark:text-yellow-400">Lawyer tidak melayani konsultasi pada hari {selectedDay}</p>
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl text-center flex items-center justify-center gap-2">
                  <Icons.Alert className="text-yellow-600" />
                  <p className="text-yellow-700 dark:text-yellow-400">Tidak ada jadwal tersedia untuk tanggal ini</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {availableSlots.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData({...formData, jam_konsultasi: time})}
                      className={`py-3 rounded-xl font-medium transition-all duration-200 ${
                        formData.jam_konsultasi === time 
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              )
            )}
            
            {(!formData.tanggal_konsultasi || !formData.lawyer_id) && (
              <p className="text-gray-400 text-sm mt-2 flex items-center gap-1">
                <Icons.Alert /> Silakan pilih lawyer dan tanggal terlebih dahulu
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.jam_konsultasi || (formData.tanggal_konsultasi && formData.lawyer_id && availableSlots.length === 0)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Icons.Loading /> : "Booking Sekarang"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ConsultationForm