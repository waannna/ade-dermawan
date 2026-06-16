import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import api from "../utils/axios"

const Icons = {
  Star: () => (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  StarOutline: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
}

const ReviewModal = ({ consultation, onClose, onSuccess }) => {
  const navigate = useNavigate()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [komentar, setKomentar] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { toast.error("Silakan pilih rating terlebih dahulu"); return }
    if (!komentar.trim()) { toast.error("Silakan isi komentar"); return }
    setLoading(true)
    try {
      await api.post("/reviews", { consultation_id: consultation.id, rating, komentar })
      toast.success("Terima kasih! Review Anda telah disimpan")
      onSuccess()
      onClose()
      setTimeout(() => navigate("/lawyers"), 1500)
    } catch (error) { 
      toast.error(error.response?.data?.message || "Gagal menyimpan review") 
    } finally { 
      setLoading(false) 
    }
  }

  const ratingMessages = {
    1: "Sangat Buruk",
    2: "Buruk",
    3: "Cukup",
    4: "Baik",
    5: "Sangat Baik"
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="text-3xl">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Beri Penilaian</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
            <Icons.Close />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Konsultasi: <span className="font-medium">{consultation?.judul_kasus}</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Rating Stars */}
          <div className="mb-6 text-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Seberapa puas Anda dengan layanan lawyer?
            </label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  {(hoverRating || rating) >= star ? (
                    <Icons.Star className="text-yellow-400" />
                  ) : (
                    <Icons.StarOutline className="text-gray-300 dark:text-gray-600" />
                  )}
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm font-medium mt-2 text-blue-600 dark:text-blue-400">
                {ratingMessages[rating]}
              </p>
            )}
          </div>
          
          {/* Komentar */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Komentar Anda
            </label>
            <textarea
              value={komentar}
              onChange={(e) => setKomentar(e.target.value)}
              rows="4"
              placeholder="Ceritakan pengalaman Anda selama konsultasi..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 rounded-xl transition disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              {loading ? <Icons.Loading /> : "Kirim Review"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2.5 rounded-xl transition font-medium"
            >
              Nanti Saja
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal