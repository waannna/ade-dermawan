import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import LawyerCard from "../components/LawyerCard"
import useLawyers from "../hooks/useLawyers"

const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 18l-6-6 6-6" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  ChevronLeft: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
}

const Lawyers = () => {
  const { lawyers, loading, fetchLawyers } = useLawyers()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    fetchLawyers()
  }, [])

  // Filter lawyers berdasarkan search
  const filteredLawyers = lawyers.filter(lawyer =>
    lawyer.firma_hukum?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.spesialisasi?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredLawyers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex)

  // Reset ke halaman 1 saat search berubah
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // TIDAK ADA window.scrollTo - ScrollToTop sudah handle scroll otomatis
    }
  }

  const goToPrevPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)

  // Generate page numbers untuk ditampilkan
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let endPage = Math.min(totalPages, startPage + maxVisible - 1)
    
    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 px-6 py-12 md:py-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-all duration-200 group"
          >
            <Icons.ArrowLeft />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold">Temukan Lawyer Terbaik</h1>
          <p className="mt-3 text-blue-100 max-w-2xl mx-auto">
            Hubungi pengacara profesional dan terpercaya untuk membantu kebutuhan hukum Anda
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari lawyer berdasarkan nama firma atau spesialisasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Icons.Search />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      </div>

      {/* Result Info */}
      {!loading && filteredLawyers.length > 0 && (
        <div className="mb-4 text-gray-500 dark:text-gray-400 text-sm">
          Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredLawyers.length)} dari {filteredLawyers.length} lawyer
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredLawyers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow"
        >
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Icons.Search />
          </div>
          <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300">Tidak Ada Lawyer Ditemukan</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {searchTerm ? `Tidak ada lawyer dengan kata "${searchTerm}"` : "Belum ada lawyer terdaftar"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 text-blue-600 hover:underline"
            >
              Hapus pencarian
            </button>
          )}
        </motion.div>
      )}

      {/* List Lawyer */}
      {!loading && filteredLawyers.length > 0 && (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentLawyers.map((lawyer, idx) => (
              <motion.div
                key={lawyer.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 6) * 0.05 }}
              >
                <LawyerCard lawyer={lawyer} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Icons.ChevronLeft />
              </button>
              
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => goToPage(page)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <Icons.ChevronRight />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Lawyers