import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import useAuth from "../hooks/useAuth"
import useLawyers from "../hooks/useLawyers"
import LawyerCard from "../components/LawyerCard"

const Icons = {
  ArrowRight: () => (
    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  StarOutline: () => (
    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  Shield: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
}

const Home = () => {
  const { isAuthenticated } = useAuth()
  const { lawyers, loading, fetchLawyers } = useLawyers()
  const featuredLawyers = lawyers.slice(0, 3)
  const [activeFaq, setActiveFaq] = useState(null)

  useEffect(() => {
    fetchLawyers()
  }, [])

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  const services = [
    { icon: "⚖️", title: "Konsultasi Hukum", desc: "Konsultasi langsung dengan lawyer berpengalaman" },
    { icon: "📝", title: "Dokumen Legal", desc: "Bantuan pembuatan dan review dokumen hukum" },
    { icon: "🏛️", title: "Mediasi", desc: "Bantuan mediasi untuk sengketa bisnis" },
  ]

  const testimonials = [
    { name: "Budi Santoso", role: "Pengusaha", text: "Pelayanan sangat cepat dan profesional. Masalah hukum saya terselesaikan dengan baik.", rating: 5 },
    { name: "Siti Nurhaliza", role: "Ibu Rumah Tangga", text: "Terima kasih Counsela, saya jadi tidak bingung lagi dengan masalah perceraian saya.", rating: 5 },
    { name: "Andi Wijaya", role: "Startup Founder", text: "Konsultasi dengan lawyer sangat membantu bisnis saya. Recommended!", rating: 5 },
  ]

  const faqs = [
    { q: "Bagaimana cara booking konsultasi?", a: "Anda bisa booking konsultasi dengan memilih lawyer, tanggal, dan jam yang tersedia di halaman Booking Konsultasi." },
    { q: "Apakah konsultasi bisa dilakukan secara online?", a: "Ya, konsultasi dilakukan secara online melalui Zoom/Google Meet." },
    { q: "Bagaimana jika jadwal yang saya pilih sudah dibooking?", a: "Sistem akan menampilkan jam yang tersedia secara real-time." },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white">Platform Hukum No.1 di Indonesia</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Konsultasi Hukum
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                  Cepat & Terpercaya
                </span>
              </h1>
              
              <p className="mt-6 text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl mx-auto">
                Dapatkan solusi hukum terbaik dari lawyer profesional berpengalaman. 
                Konsultasi kapan saja, di mana saja dengan mudah dan cepat.
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4 justify-center">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/register"
                      className="group px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                    >
                      Mulai Sekarang
                      <Icons.ArrowRight />
                    </Link>
                    <Link
                      to="/login"
                      className="px-6 sm:px-8 py-3 border-2 border-white/30 hover:bg-white/10 rounded-full font-semibold transition-all duration-300 text-white"
                    >
                      Masuk
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/client-dashboard"
                    className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    Dashboard Saya
                  </Link>
                )}
              </div>
              
              <div className="mt-16 flex flex-wrap gap-8 justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-blue-200">Klien Puas</div>
                </div>
                <div className="w-px h-12 bg-white/30 hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">98%</div>
                  <div className="text-sm text-blue-200">Kepuasan</div>
                </div>
                <div className="w-px h-12 bg-white/30 hidden sm:block" />
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">24/7</div>
                  <div className="text-sm text-blue-200">Layanan</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative h-12 md:h-16 w-full">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28 70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08 36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="white" className="fill-white dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* Layanan Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Layanan Kami</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Solusi lengkap untuk kebutuhan hukum Anda</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{service.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistik Section - DIPERBAIKI */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-3">
                <Icons.Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">{lawyers.length || 50}+</div>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Lawyer Profesional</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">500+</div>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Konsultasi Selesai</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-3">
                <Icons.Star className="w-6 h-6 text-amber-500 dark:text-amber-400" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">98%</div>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Kepuasan Client</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-3">
                <Icons.Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Jam Layanan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Lawyer Unggulan Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Lawyer Unggulan</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Pilihan terbaik untuk konsultasi Anda</p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : featuredLawyers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLawyers.map((lawyer, idx) => (
                <motion.div
                  key={lawyer.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <LawyerCard lawyer={lawyer} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">Belum ada lawyer terdaftar</div>
          )}

          <div className="text-center mt-12">
            <Link to="/lawyers" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-xl group">
              Lihat Semua Lawyer
              <Icons.ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Apa Kata Mereka?</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-3">Testimoni dari client yang puas</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testi, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    i < testi.rating ? (
                      <Icons.Star key={i} />
                    ) : (
                      <Icons.StarOutline key={i} />
                    )
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{testi.text}"</p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-semibold text-gray-800 dark:text-white">{testi.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{testi.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Pertanyaan Umum</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Yang sering ditanyakan oleh client</p>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <span className="font-semibold text-gray-800 dark:text-white">{faq.q}</span>
                      <svg className={`w-5 h-5 text-gray-500 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {activeFaq === idx && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Icons.Shield />
              </div>
              <h3 className="text-2xl font-bold mb-3">Siap Menyelesaikan Masalah Hukum Anda?</h3>
              <p className="text-blue-100 mb-6">Daftar sekarang dan dapatkan konsultasi dengan lawyer terbaik</p>
              {!isAuthenticated ? (
                <Link to="/register" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
                  Daftar Gratis
                </Link>
              ) : (
                <Link to="/consultation/new" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105">
                  Booking Sekarang
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home