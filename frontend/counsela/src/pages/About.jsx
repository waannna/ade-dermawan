import { motion } from "framer-motion"
import { Link } from "react-router-dom"

const Icons = {
  Vision: () => (
    <svg className="w-12 h-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Mission: () => (
    <svg className="w-12 h-12 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
}

const About = () => {
  const team = [
    { name: "Ade Dermawan", role: "Founder & CEO", desc: "Pendiri Counsela dengan pengalaman 10+ tahun di bidang hukum dan teknologi.", avatar: "AD" },
    { name: "Dr. Ahmad Firmansyah", role: "Head of Legal", desc: "Praktisi hukum berpengalaman dengan spesialisasi hukum perdata dan bisnis.", avatar: "AF" },
    { name: "Citra Dewi", role: "Tech Lead", desc: "Pakar teknologi dengan fokus pada keamanan data dan pengalaman pengguna.", avatar: "CD" },
  ]

  const values = [
    { icon: "⚡", title: "Cepat & Efisien", desc: "Proses booking yang mudah dan cepat" },
    { icon: "🔒", title: "Kerahasiaan Terjaga", desc: "Data dan privasi Anda aman" },
    { icon: "⭐", title: "Kualitas Terjamin", desc: "Hanya lawyer terbaik yang bergabung" },
    { icon: "💎", title: "Transparan", desc: "Tarif jelas tanpa biaya tersembunyi" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="text-sm">✨ Tentang Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Tentang <span className="text-yellow-400">Counsela</span>
            </h1>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Kami adalah platform konsultasi hukum online yang menghubungkan
              masyarakat dengan lawyer profesional terpercaya.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <div className="flex justify-center md:justify-start mb-4">
                <Icons.Vision />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Visi</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Menjadi platform konsultasi hukum online terdepan di Indonesia 
                yang memberikan akses mudah dan cepat bagi seluruh lapisan masyarakat 
                untuk mendapatkan keadilan.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <div className="flex justify-center md:justify-start mb-4">
                <Icons.Mission />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Misi</h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Menyediakan akses hukum yang mudah dan terjangkau</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Menghubungkan client dengan lawyer terbaik</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Memanfaatkan teknologi untuk efisiensi layanan hukum</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Menjaga kerahasiaan dan kepercayaan client</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Nilai-nilai */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 rounded-full px-4 py-1 mb-4">
              <span className="text-sm text-purple-600 dark:text-purple-400">💎 Nilai Kami</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Nilai yang Kami Anut</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Prinsip yang menjadi dasar layanan kami</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">{value.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistik */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Client Puas</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">50+</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Lawyer Profesional</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">98%</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Kepuasan Client</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">24/7</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Layanan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tim */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 rounded-full px-4 py-1 mb-4">
              <span className="text-sm text-blue-600 dark:text-blue-400">👥 Tim Kami</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Di Balik Counsela</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Orang-orang yang berdedikasi memberikan yang terbaik</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm mt-1">{member.role}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-3 text-sm">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-700 to-indigo-800">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl font-bold">Siap Konsultasi dengan Lawyer Terbaik?</h2>
          <p className="mt-3 text-blue-100">“Mulai sekarang, raih bantuan hukum profesional untuk kebutuhan Anda”</p>
        </div>
      </section>
    </div>
  )
}

export default About