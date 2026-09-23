<template>
  <div class="max-w-5xl mx-auto space-y-8 text-zinc-950">
    <!-- {Back} -->
    <div>
      <RouterLink
        to="/lawyers"
        class="text-xs font-medium text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Kembali ke Daftar Advokat</span>
      </RouterLink>
    </div>

    <!-- {Loading} -->
    <div v-if="loading" class="p-16 text-center text-xs text-zinc-400 font-sans">
      Memuat profil advokat...
    </div>

    <!-- {Error} -->
    <div
      v-else-if="error || !lawyer"
      class="p-16 text-center space-y-3 bg-white border border-zinc-200 rounded-3xl"
    >
      <p class="text-lg font-bold text-zinc-900">{{ error || 'Advokat tidak ditemukan.' }}</p>
      <RouterLink to="/lawyers" class="text-xs font-semibold text-black hover:underline">
        Kembali ke Daftar Advokat
      </RouterLink>
    </div>

    <template v-else>
      <!-- {Profile Header} -->
      <div class="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <!-- {Profile Meta} -->
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3 text-xs text-zinc-500">
          <div class="flex items-center gap-2 text-zinc-700 font-medium">
            <span>No. Advokat <span class="font-mono text-zinc-900 font-semibold">#ADV-{{ String(lawyer.id).padStart(4, '0') }}</span></span>
          </div>
          <span class="text-emerald-700 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 text-[11px]">
            Lisensi Terverifikasi
          </span>
        </div>

        <!-- {Bio} -->
        <div class="flex flex-col sm:flex-row gap-6 items-start">
          <img
            :src="lawyer.foto_profil || defaultAvatar"
            :alt="lawyer.firma_hukum"
            @error="(e) => e.target.src = defaultAvatar"
            class="w-28 h-28 rounded-2xl object-cover border border-zinc-200 shadow-sm bg-zinc-100 shrink-0"
          />

          <div class="space-y-2 flex-1">
            <div class="flex flex-wrap items-center gap-3">
              <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                {{ lawyer.firma_hukum }}
              </h1>
              <span class="inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200">
                <Star class="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
                <span>{{ Number(lawyer.rating || 5).toFixed(1) }}</span>
              </span>
            </div>

            <p class="text-sm font-medium text-zinc-600">
              Spesialisasi: <span class="text-zinc-950 font-semibold">{{ lawyer.spesialisasi }}</span>
            </p>

            <div class="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-500">
              <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700">
                {{ lawyer.pengalaman || 0 }} tahun praktik
              </span>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-medium text-[11px]"
                :class="lawyer.status_aktif ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="lawyer.status_aktif ? 'bg-emerald-500' : 'bg-zinc-400'"></span>
                <span>{{ lawyer.status_aktif ? 'Tersedia minggu ini' : 'Jadwal penuh' }}</span>
              </span>
              <span class="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700">
                Kerahasiaan Terjamin
              </span>
            </div>
          </div>
        </div>

        <!-- {Metrics} -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs">
          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">Tarif Konsultasi</span>
            <span class="font-bold text-zinc-950 text-base mt-0.5 block">
              Rp {{ formattedFee }}
            </span>
          </div>

          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">DP 50%</span>
            <span class="font-mono font-semibold text-zinc-900 text-base mt-0.5 block">
              Rp {{ formattedDp }}
            </span>
          </div>

          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">Durasi Pertemuan</span>
            <span class="font-bold text-zinc-950 text-base mt-0.5 block">
              60 Menit
            </span>
          </div>

          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">Total Ulasan</span>
            <span class="font-bold text-zinc-950 text-base mt-0.5 block">
              {{ reviews.length }} Klien
            </span>
          </div>
        </div>
      </div>

      <!-- {Tabs} -->
      <div class="flex items-center gap-2 border-b border-zinc-200 text-xs">
        <button
          v-for="tab in profileTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2.5 font-semibold transition-all border-b-2 -mb-px flex items-center gap-1.5"
          :class="activeTab === tab.id
            ? 'border-black text-black font-bold'
            : 'border-transparent text-zinc-400 hover:text-black'"
        >
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- {Tab Profile} -->
      <div v-if="activeTab === 'profil'" class="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div class="space-y-3">
          <h3 class="text-xs font-semibold text-zinc-900 tracking-tight">
            Profil & Pengalaman
          </h3>
          <p class="text-xs sm:text-sm leading-relaxed text-zinc-700 whitespace-pre-line">
            {{ lawyer.deskripsi || 'Advokat profesional yang berpengalaman dalam menangani berbagai persoalan hukum dengan menjaga kerahasiaan dan kepatuhan hukum.' }}
          </p>
        </div>

        <div class="grid sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 text-xs">
          <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span class="text-[11px] font-medium text-zinc-500">Afiliasi Kantor Hukum</span>
            <p class="font-bold text-zinc-900">{{ lawyer.firma_hukum || 'Kantor Hukum Terverifikasi' }}</p>
            <p class="text-[11px] text-zinc-500">Pengalaman Praktik: {{ lawyer.pengalaman || 0 }} Tahun</p>
          </div>

          <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span class="text-[11px] font-medium text-zinc-500">Status Praktik</span>
            <p class="font-bold text-zinc-900">{{ lawyer.status_aktif ? 'Aktif Menerima Konsultasi' : 'Sedang Tidak Tersedia' }}</p>
            <p class="text-[11px] text-zinc-500">Bidang: {{ lawyer.spesialisasi }}</p>
          </div>
        </div>
      </div>

      <!-- {Tab Services} -->
      <div v-else-if="activeTab === 'layanan'" class="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <h3 class="text-xs font-semibold text-zinc-900 tracking-tight mb-2">
          Layanan & Biaya
        </h3>

        <div class="space-y-3 text-xs">
          <div class="p-4 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
            <div>
              <p class="font-bold text-sm text-zinc-900">Konsultasi Online (Video Call)</p>
              <p class="text-[11px] text-zinc-500">Sesi 60 menit, pembahasan kasus, rekomendasi solusi</p>
            </div>
            <div class="text-right">
              <span class="font-bold text-zinc-950 text-sm">Rp {{ formattedFee }}</span>
              <span class="font-mono text-[10px] text-zinc-500 block">DP: Rp {{ formattedDp }}</span>
            </div>
          </div>

          <div class="p-4 rounded-2xl border border-zinc-200 bg-white flex items-center justify-between">
            <div>
              <p class="font-bold text-sm text-zinc-900">Pendapat Hukum (Legal Opinion)</p>
              <p class="text-[11px] text-zinc-500">Kajian hukum tertulis berdasarkan peraturan perundang-undangan</p>
            </div>
            <div class="text-right">
              <span class="font-bold text-zinc-950 text-sm">Rp {{ (feeNumber * 2).toLocaleString('id-ID') }}</span>
              <span class="font-mono text-[10px] text-zinc-400 block">2-3 Hari Kerja</span>
            </div>
          </div>

          <div class="p-4 rounded-2xl border border-zinc-200 bg-white flex items-center justify-between">
            <div>
              <p class="font-bold text-sm text-zinc-900">Surat Somasi / Teguran Hukum</p>
              <p class="text-[11px] text-zinc-500">Surat teguran resmi yang ditandatangani advokat</p>
            </div>
            <div class="text-right">
              <span class="font-bold text-zinc-950 text-sm">Rp {{ (feeNumber * 1.5).toLocaleString('id-ID') }}</span>
              <span class="font-mono text-[10px] text-zinc-400 block">1-2 Hari Kerja</span>
            </div>
          </div>
        </div>
      </div>

      <!-- {Tab Schedule} -->
      <div v-else-if="activeTab === 'jadwal'" class="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h3 class="text-xs font-semibold text-zinc-900 tracking-tight">
            Pilih Jadwal Konsultasi
          </h3>
          <p class="text-xs text-zinc-500 mt-0.5">
            Sesi berlangsung online melalui Google Meet atau Zoom.
          </p>
        </div>

        <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-zinc-900 tracking-tight">
              Hari & Jam Praktik
            </span>
            <span class="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-medium">
              Data Terdaftar
            </span>
          </div>

          <div v-if="lawyerSchedules.length === 0" class="text-xs text-zinc-500">
            Jadwal operasional umum: Senin - Jumat (09:00 - 17:00 WIB).
          </div>

          <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div
              v-for="s in lawyerSchedules"
              :key="s.day_of_week"
              class="p-2.5 bg-white rounded-xl border border-zinc-200 text-xs flex items-center justify-between"
            >
              <span class="font-medium text-zinc-900">{{ dayNames[s.day_of_week] }}</span>
              <span class="font-mono text-[11px] text-zinc-600">{{ s.start_time.substring(0, 5) }} - {{ s.end_time.substring(0, 5) }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[11px] text-zinc-500 font-medium block">Pilihan Sesi Konsultasi Tersedia</label>
          <div class="grid sm:grid-cols-3 gap-3 text-xs">
            <button
              v-for="slot in activeOperationalSlots"
              :key="slot.time"
              @click="selectedSlot = slot.time"
              class="p-4 rounded-2xl border text-left transition-all"
              :class="selectedSlot === slot.time
                ? 'bg-black text-white font-semibold border-black shadow-sm'
                : 'bg-zinc-50 border-zinc-200 text-zinc-800 hover:bg-zinc-100'"
            >
              <div class="flex items-center justify-between text-[11px]">
                <span :class="selectedSlot === slot.time ? 'text-zinc-300' : 'text-zinc-500'">{{ slot.label }}</span>
                <span v-if="slot.available" class="text-emerald-500 font-medium">Tersedia</span>
              </div>
              <p class="font-bold text-sm mt-1">{{ slot.time }} WIB</p>
              <p class="text-[11px] opacity-80 mt-0.5">Durasi 60 Menit</p>
            </button>
          </div>
        </div>

        <div class="pt-3 border-t border-zinc-100 flex items-center justify-between">
          <span class="text-xs text-zinc-500">
            Jadwal Dipilih: <strong class="text-zinc-950 font-mono">{{ selectedSlot }} WIB</strong>
          </span>
          <RouterLink
            :to="`/consultation/new?lawyer=${lawyer.id}&slot=${encodeURIComponent(selectedSlot)}`"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-full font-semibold text-xs shadow-sm transition-all"
          >
            <span>Lanjutkan Konsultasi</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>
      </div>

      <!-- {Tab Reviews} -->
      <div v-else-if="activeTab === 'ulasan'" class="space-y-4">
        <div class="flex justify-between items-center px-1">
          <h3 class="font-bold text-lg text-zinc-950 tracking-tight">
            Ulasan Klien
          </h3>
          <span class="font-mono text-xs text-zinc-500">{{ reviews.length }} ulasan</span>
        </div>

        <div
          v-if="reviews.length === 0"
          class="p-10 text-center bg-white border border-zinc-200 rounded-3xl text-xs text-zinc-500 space-y-1"
        >
          <p class="font-semibold text-zinc-800">Belum ada ulasan</p>
          <p>Ulasan akan tampil setelah sesi konsultasi selesai.</p>
        </div>

        <div v-else class="space-y-3">
          <ReviewCard
            v-for="r in reviews"
            :key="r.id"
            :client="r.client_name || 'Klien Terverifikasi'"
            :rating="r.rating"
            :comment="r.komentar"
            :date="r.created_at?.split('T')[0]"
          />
        </div>
      </div>

      <!-- {Booking Strip} -->
      <div class="p-4 bg-zinc-950 text-white rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-zinc-800">
        <div class="text-center sm:text-left">
          <p class="text-xs text-zinc-400">Biaya Konsultasi per Sesi</p>
          <div class="flex items-baseline gap-2">
            <span class="font-bold text-xl text-white">Rp {{ formattedFee }}</span>
            <span class="text-xs font-mono text-zinc-400">(DP 50%: Rp {{ formattedDp }})</span>
          </div>
        </div>

        <RouterLink
          :to="`/consultation/new?lawyer=${lawyer.id}`"
          class="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-3 bg-white hover:bg-zinc-200 text-black rounded-full font-semibold text-xs transition-all shadow-md text-center"
        >
          <span>Konsultasi dengan Advokat Ini</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, Star } from '@lucide/vue'
import lawyerService from '../service/lawyerService'
import api from '../utils/axios'
import ReviewCard from '../components/ReviewCard.vue'

const route = useRoute()
const id = route.params.id

const lawyer = ref(null)
const reviews = ref([])
const lawyerSchedules = ref([])
const scheduleText = ref('')
const loading = ref(true)
const error = ref(null)

const activeTab = ref('profil')
const selectedSlot = ref('09:00 - 10:00')

const profileTabs = [
  { id: 'profil', label: 'Profil & Rekam Jejak' },
  { id: 'layanan', label: 'Katalog Layanan & Tarif' },
  { id: 'jadwal', label: 'Jadwal Sesi Daring' },
  { id: 'ulasan', label: 'Ulasan Klien' },
]

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const activeOperationalSlots = computed(() => {
  if (!lawyerSchedules.value || lawyerSchedules.value.length === 0) {
    return [
      { time: '09:00 - 10:00', label: 'Pagi (Sesi 1)', available: true },
      { time: '10:30 - 11:30', label: 'Pagi (Sesi 2)', available: true },
      { time: '13:30 - 14:30', label: 'Siang', available: true },
      { time: '15:00 - 16:00', label: 'Sore', available: true },
    ]
  }

  const earliestStart = lawyerSchedules.value.reduce((min, s) => {
    const h = parseInt(s.start_time.split(':')[0], 10)
    return h < min ? h : min
  }, 9)

  const latestEnd = lawyerSchedules.value.reduce((max, s) => {
    const h = parseInt(s.end_time.split(':')[0], 10)
    return h > max ? h : max
  }, 17)

  const slots = []
  if (earliestStart <= 9 && latestEnd >= 10) slots.push({ time: '09:00 - 10:00', label: 'Pagi (Sesi 1)', available: true })
  if (earliestStart <= 10 && latestEnd >= 12) slots.push({ time: '10:30 - 11:30', label: 'Pagi (Sesi 2)', available: true })
  if (earliestStart <= 13 && latestEnd >= 15) slots.push({ time: '13:30 - 14:30', label: 'Siang', available: true })
  if (earliestStart <= 15 && latestEnd >= 17) slots.push({ time: '15:00 - 16:00', label: 'Sore', available: true })
  if (latestEnd >= 19) slots.push({ time: '19:00 - 20:00', label: 'Malam', available: true })

  return slots.length > 0 ? slots : [
    { time: '09:00 - 10:00', label: 'Pagi (Sesi 1)', available: true },
    { time: '10:30 - 11:30', label: 'Pagi (Sesi 2)', available: true },
    { time: '13:30 - 14:30', label: 'Siang', available: true },
    { time: '15:00 - 16:00', label: 'Sore', available: true },
  ]
})

const defaultAvatar =
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'

onMounted(async () => {
  try {
    loading.value = true
    const [lawyerData, reviewsRes, scheduleRes] = await Promise.all([
      lawyerService.getLawyerById(id),
      api.get(`/reviews/lawyer/${id}`).catch(() => ({ data: { data: [] } })),
      api.get(`/lawyers/${id}/schedule`).catch(() => ({ data: { data: { schedules: [], schedule_text: '' } } })),
    ])
    lawyer.value = lawyerData
    reviews.value = reviewsRes.data.data || []
    lawyerSchedules.value = scheduleRes.data.data?.schedules || []
    scheduleText.value = scheduleRes.data.data?.schedule_text || ''
    if (activeOperationalSlots.value.length > 0) {
      selectedSlot.value = activeOperationalSlots.value[0].time
    }
  } catch (err) {
    error.value = 'Profil advokat tidak ditemukan atau terjadi kendala sistem.'
  } finally {
    loading.value = false
  }
})

const feeNumber = computed(() => Number(lawyer.value?.tarif_konsultasi || 0))
const formattedFee = computed(() => feeNumber.value.toLocaleString('id-ID'))
const formattedDp = computed(() => Math.floor(feeNumber.value / 2).toLocaleString('id-ID'))
</script>
