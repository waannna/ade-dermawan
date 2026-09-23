<template>
  <div class="max-w-4xl mx-auto space-y-6 text-zinc-950">
    <!-- {Header} -->
    <div class="pb-4 border-b border-zinc-200">
      <RouterLink
        to="/consultations"
        class="text-xs font-medium text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Kembali ke Konsultasi</span>
      </RouterLink>
      <div class="text-xs font-semibold text-zinc-500 tracking-wide mt-2">
        Konsultasi Baru
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-1">
        Jadwalkan Konsultasi
      </h1>
      <p class="text-xs text-zinc-500 mt-1">
        Isi rincian masalah hukum dan pilih jadwal konsultasi dengan advokat pilihan Anda.
      </p>
    </div>

    <!-- {Progress} -->
    <div class="grid grid-cols-3 gap-2 py-2 text-xs">
      <div class="p-2.5 rounded-2xl bg-black text-white flex items-center gap-2">
        <span class="w-5 h-5 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-[10px]">1</span>
        <span class="truncate font-semibold text-xs">Informasi Kasus</span>
      </div>
      <div
        class="p-2.5 rounded-2xl flex items-center gap-2 border transition-colors"
        :class="formData.tanggal_konsultasi && formData.jam_konsultasi
          ? 'bg-black text-white border-black'
          : 'bg-white text-zinc-600 border-zinc-200'"
      >
        <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-900 font-bold flex items-center justify-center text-[10px]">2</span>
        <span class="truncate font-semibold text-xs">Jadwal Sesi</span>
      </div>
      <div
        class="p-2.5 rounded-2xl flex items-center gap-2 border transition-colors"
        :class="isFormComplete
          ? 'bg-black text-white border-black'
          : 'bg-white text-zinc-600 border-zinc-200'"
      >
        <span class="w-5 h-5 rounded-full bg-zinc-100 text-zinc-900 font-bold flex items-center justify-center text-[10px]">3</span>
        <span class="truncate font-semibold text-xs">Skema DP 50%</span>
      </div>
    </div>

    <!-- {Container} -->
    <div class="grid lg:grid-cols-12 gap-8 items-start">
      <!-- {Form} -->
      <form
        @submit.prevent="handleSubmit"
        class="lg:col-span-7 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5"
      >
        <!-- {Lawyer} -->
        <div>
          <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
            Pilih Advokat
          </label>
          <select
            v-model="formData.lawyer_id"
            class="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black shadow-2xs"
            required
          >
            <option value="">-- Pilih Advokat Terdaftar --</option>
            <option v-for="l in lawyers" :key="l.id" :value="l.id">
              {{ l.firma_hukum }} • {{ l.spesialisasi }} (Rp {{ Number(l.tarif_konsultasi).toLocaleString('id-ID') }})
            </option>
          </select>
        </div>

        <!-- {Title} -->
        <div>
          <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
            Judul Kasus / Perkara
          </label>
          <input
            v-model="formData.judul_kasus"
            type="text"
            placeholder="Contoh: Sengketa Perjanjian Kerjasama Bisnis"
            class="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black shadow-2xs"
            required
          />
        </div>

        <!-- {Description} -->
        <div>
          <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
            Deskripsi Singkat Kasus
          </label>
          <textarea
            v-model="formData.deskripsi_kasus"
            rows="4"
            placeholder="Jelaskan secara garis besar masalah hukum yang dihadapi dan tujuan konsultasi..."
            class="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black resize-none shadow-2xs"
            required
          ></textarea>
        </div>

        <!-- {Schedule} -->
        <div class="space-y-3 pt-1 border-t border-zinc-100">
          <div>
            <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
              Tanggal Konsultasi
            </label>
            <input
              v-model="formData.tanggal_konsultasi"
              type="date"
              :min="minDate"
              class="w-full text-xs sm:text-sm px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black shadow-2xs"
              required
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
              Pilih Jam Sesi (Durasi 60 Menit)
              <span v-if="checking" class="font-normal text-zinc-400 text-xs ml-1">
                (Memeriksa ketersediaan...)
              </span>
            </label>

            <div
              v-if="!formData.tanggal_konsultasi || !formData.lawyer_id"
              class="p-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-500"
            >
              Pilih advokat dan tanggal terlebih dahulu untuk melihat jam buka.
            </div>

            <div
              v-else-if="availableSlots.length === 0"
              class="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium"
            >
              Tidak ada jam buka pada tanggal yang dipilih.
            </div>

            <div v-else class="grid grid-cols-3 gap-2">
              <button
                v-for="time in availableSlots"
                :key="time"
                type="button"
                @click="formData.jam_konsultasi = time"
                class="py-2.5 rounded-2xl text-xs font-mono font-semibold border transition-all cursor-pointer"
                :class="formData.jam_konsultasi === time
                  ? 'bg-black text-white border-black shadow-2xs'
                  : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'"
              >
                {{ time }} WIB
              </button>
            </div>
          </div>
        </div>

        <!-- {Submit} -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="loading || !formData.jam_konsultasi"
            class="inline-flex items-center justify-center gap-2 w-full py-3.5 text-xs sm:text-sm font-semibold bg-black hover:bg-zinc-800 text-white rounded-full shadow-sm transition-all disabled:opacity-40 cursor-pointer"
          >
            <span>{{ loading ? 'Memproses...' : 'Konfirmasi Jadwal Konsultasi' }}</span>
            <ArrowRight v-if="!loading" class="w-4 h-4" />
          </button>
        </div>
      </form>

      <!-- {Summary Card} -->
      <div class="lg:col-span-5 space-y-4">
        <div class="bg-white border border-zinc-200 rounded-3xl p-6 shadow-sm space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
            <h3 class="text-xs font-semibold text-zinc-900 tracking-tight">
              Rincian Biaya
            </h3>
            <span class="text-[11px] text-zinc-700 font-medium bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
              Transparan
            </span>
          </div>

          <!-- {Selected Lawyer} -->
          <div v-if="selectedLawyerObj" class="p-3 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-1">
            <span class="text-[11px] text-zinc-500 font-medium">Advokat Terpilih</span>
            <p class="font-bold text-sm text-zinc-900">{{ selectedLawyerObj.firma_hukum }}</p>
            <p class="text-[11px] text-zinc-500">{{ selectedLawyerObj.spesialisasi }}</p>
          </div>

          <!-- {Calculation} -->
          <div class="space-y-2.5 pt-1">
            <div class="flex justify-between text-zinc-600">
              <span>Tarif Konsultasi</span>
              <span class="font-mono font-semibold text-zinc-900">
                Rp {{ selectedFee.toLocaleString('id-ID') }}
              </span>
            </div>

            <div class="flex justify-between text-zinc-600">
              <span>Biaya Layanan Platform</span>
              <span class="font-medium text-emerald-700">Rp 0 (Gratis)</span>
            </div>

            <div class="border-t border-zinc-200 pt-2 flex justify-between font-bold text-zinc-900">
              <span>Total Biaya</span>
              <span class="font-mono font-bold text-sm">
                Rp {{ selectedFee.toLocaleString('id-ID') }}
              </span>
            </div>
          </div>

          <!-- {Escrow Breakdown} -->
          <div class="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2">
            <div class="text-[11px] font-semibold text-zinc-800 tracking-tight">
              Pembayaran Bertahap (DP 50%)
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-zinc-600">1. Pembayaran Awal (DP 50%)</span>
              <span class="font-mono font-bold text-zinc-900">Rp {{ selectedDp.toLocaleString('id-ID') }}</span>
            </div>
            <p class="text-[11px] text-zinc-500 leading-normal">
              *Dibayarkan setelah advokat menyetujui jadwal untuk mendapatkan tautan konsultasi.
            </p>
            <div class="flex justify-between items-center text-xs pt-1 border-t border-zinc-200">
              <span class="text-zinc-600">2. Pelunasan (50%)</span>
              <span class="font-mono font-bold text-zinc-900">Rp {{ selectedFinal.toLocaleString('id-ID') }}</span>
            </div>
            <p class="text-[11px] text-zinc-500 leading-normal">
              *Dibayarkan setelah sesi konsultasi selesai.
            </p>
          </div>

          <!-- {Security} -->
          <div class="text-[11px] text-zinc-500 leading-relaxed pt-1 flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-zinc-700 shrink-0" />
            <span>Pembayaran aman dengan sistem penampung Counsela hingga sesi selesai.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-vue-next'
import consultationService from '../service/consultationService'
import lawyerService from '../service/lawyerService'
import api from '../utils/axios'
import { toast } from '../composables/useToast'

const router = useRouter()
const route = useRoute()

const lawyers = ref([])
const loading = ref(false)
const checking = ref(false)
const availableSlots = ref([])

const formData = ref({
  lawyer_id: route.query.lawyer || '',
  judul_kasus: '',
  deskripsi_kasus: '',
  tanggal_konsultasi: '',
  jam_konsultasi: '',
})

const defaultSlots = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00', '20:00',
]

const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

const selectedLawyerObj = computed(() => {
  return lawyers.value.find((l) => String(l.id) === String(formData.value.lawyer_id)) || null
})

const selectedFee = computed(() => {
  return Number(selectedLawyerObj.value?.tarif_konsultasi || 0)
})

const selectedDp = computed(() => Math.floor(selectedFee.value / 2))
const selectedFinal = computed(() => selectedFee.value - selectedDp.value)

const isFormComplete = computed(() => {
  return (
    formData.value.lawyer_id &&
    formData.value.judul_kasus &&
    formData.value.tanggal_konsultasi &&
    formData.value.jam_konsultasi
  )
})

const checkSlots = async () => {
  if (!formData.value.lawyer_id || !formData.value.tanggal_konsultasi) {
    availableSlots.value = []
    return
  }

  checking.value = true
  try {
    const res = await api.get(
      `/consultations/slots?lawyer_id=${formData.value.lawyer_id}&date=${formData.value.tanggal_konsultasi}`
    )
    const booked = Array.isArray(res.data.data) ? res.data.data : []
    availableSlots.value = defaultSlots.filter((slot) => !booked.includes(slot))
  } catch (err) {
    availableSlots.value = defaultSlots
  } finally {
    checking.value = false
  }
}

watch([() => formData.value.lawyer_id, () => formData.value.tanggal_konsultasi], () => {
  formData.value.jam_konsultasi = ''
  checkSlots()
})

onMounted(async () => {
  try {
    const data = await lawyerService.getAllLawyers()
    lawyers.value = Array.isArray(data) ? data : []
    if (route.query.lawyer) {
      formData.value.lawyer_id = route.query.lawyer
    }
    if (route.query.slot) {
      const s = String(route.query.slot)
      formData.value.jam_konsultasi = s.includes('-') ? s.split('-')[0].trim() : s
    }
  } catch (err) {
    toast.error('Gagal memuat daftar advokat')
  }
})

const handleSubmit = async () => {
  if (!formData.value.lawyer_id) {
    toast.error('Silakan pilih advokat terlebih dahulu')
    return
  }
  if (!formData.value.jam_konsultasi) {
    toast.error('Silakan pilih jam sesi konsultasi')
    return
  }

  loading.value = true
  try {
    const res = await consultationService.createConsultation({
      lawyer_id: formData.value.lawyer_id,
      judul_kasus: formData.value.judul_kasus,
      deskripsi_kasus: formData.value.deskripsi_kasus,
      tanggal_konsultasi: formData.value.tanggal_konsultasi,
      jam_konsultasi: formData.value.jam_konsultasi,
    })
    toast.success('Pendaftaran perkara berhasil. Menunggu konfirmasi advokat.')
    const createdId = res.data?.id || res.id
    if (createdId) {
      router.push(`/consultations/${createdId}`)
    } else {
      router.push('/consultations')
    }
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal mengajukan konsultasi')
  } finally {
    loading.value = false
  }
}
</script>
