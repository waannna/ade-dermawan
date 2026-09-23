<template>
  <div class="max-w-4xl mx-auto space-y-6 text-zinc-950">
    <!-- {Header} -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-zinc-200/90 print:hidden">
      <div>
        <RouterLink
          to="/consultations"
          class="text-xs font-medium text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Konsultasi</span>
        </RouterLink>
        <div class="text-xs font-semibold text-zinc-500 tracking-wide mt-1">
          Rincian Konsultasi
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-0.5 flex items-center gap-3">
          <span>Perkara #CNS-{{ String(id).padStart(4, '0') }}</span>
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="printDocket"
          class="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Cetak Berkas"
        >
          <Printer class="w-3.5 h-3.5 text-zinc-600" />
          <span>Cetak Berkas</span>
        </button>
        <span v-if="consultation" :class="statusBadgeClass">
          {{ consultation.status?.replace('_', ' ') }}
        </span>
      </div>
    </div>

    <!-- {Loading} -->
    <div v-if="loading" class="p-16 text-center text-xs text-zinc-400 font-sans">
      Memuat rincian berkas perkara...
    </div>

    <!-- {Not Found} -->
    <div
      v-else-if="!consultation"
      class="p-16 text-center space-y-3 bg-white border border-zinc-200 rounded-3xl"
    >
      <p class="text-lg font-bold text-zinc-900">Data Konsultasi Tidak Ditemukan</p>
      <RouterLink to="/consultations" class="text-xs font-semibold text-black hover:underline">
        Kembali ke Daftar Konsultasi
      </RouterLink>
    </div>

    <!-- {Content} -->
    <template v-else>
      <!-- {Tracker} -->
      <div class="p-4 bg-white border border-zinc-200 rounded-2xl shadow-2xs overflow-x-auto print:hidden">
        <div class="flex items-center justify-between min-w-[550px] text-xs">
          <div
            v-for="(step, idx) in progressSteps"
            :key="idx"
            class="flex items-center gap-2"
          >
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0"
              :class="step.active
                ? 'bg-black text-white'
                : 'bg-zinc-100 text-zinc-400 border border-zinc-200'"
            >
              <Check v-if="step.done" class="w-3.5 h-3.5 stroke-[2.5]" />
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <span
              class="text-[11px]"
              :class="step.active ? 'font-semibold text-zinc-950' : 'text-zinc-400'"
            >
              {{ step.label }}
            </span>
            <ChevronRight v-if="idx < progressSteps.length - 1" class="w-3.5 h-3.5 text-zinc-300 mx-1 shrink-0" />
          </div>
        </div>
      </div>

      <!-- {Details} -->
      <div class="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-7 print:border-none print:shadow-none print:p-0">
        <!-- {Print Header} -->
        <div class="hidden print:block border-b-2 border-black pb-4 mb-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold tracking-tight">COUNSELA LEGAL TECH</h1>
              <p class="text-xs text-zinc-500">Lembar Konsultasi Hukum</p>
            </div>
            <div class="text-right text-xs">
              <p class="font-mono">NO: CNS-{{ String(id).padStart(4, '0') }}</p>
            </div>
          </div>
        </div>

        <!-- {Metadata} -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">Klien</span>
            <span class="font-bold text-zinc-900 text-xs sm:text-sm mt-0.5 block truncate">
              {{ consultation.client_name || '-' }}
            </span>
          </div>
          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">Advokat</span>
            <span class="font-bold text-zinc-900 text-xs sm:text-sm mt-0.5 block truncate">
              {{ consultation.lawyer_name || '-' }}
            </span>
          </div>
          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">Jadwal Sesi</span>
            <span class="font-bold text-zinc-900 text-xs sm:text-sm mt-0.5 block font-mono">
              {{ consultation.tanggal_konsultasi?.split('T')[0] }}
            </span>
          </div>
          <div>
            <span class="text-zinc-500 block text-[11px] font-medium">Waktu</span>
            <span class="font-bold text-zinc-900 text-xs sm:text-sm mt-0.5 block font-mono">
              {{ consultation.jam_konsultasi }} WIB
            </span>
          </div>
        </div>

        <!-- {Subject} -->
        <div class="space-y-2">
          <div class="text-xs font-semibold text-zinc-500 tracking-wide">
            Pokok Masalah
          </div>
          <h2 class="text-xl sm:text-2xl font-bold text-zinc-950 leading-snug tracking-tight">
            {{ consultation.judul_kasus }}
          </h2>
          <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
            {{ consultation.deskripsi_kasus }}
          </div>
        </div>

        <!-- {Meeting Room} -->
        <div
          v-if="consultation.meeting_link"
          class="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-3 print:hidden"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 class="text-xs font-semibold text-emerald-950">
                Ruang Konsultasi Online
              </h3>
            </div>
            <span class="text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              Tautan Aktif
            </span>
          </div>

          <p class="text-xs text-emerald-900 leading-relaxed">
            Tautan konsultasi telah tersedia. Silakan bergabung tepat waktu sesuai jadwal yang disepakati.
          </p>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <a
              :href="consultation.meeting_link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-1.5 flex-1 text-center py-2.5 px-4 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-colors shadow-2xs"
            >
              <span>Masuk ke Ruang Konsultasi</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
            <button
              @click="copyMeetingLink"
              class="py-2.5 px-4 text-xs font-medium border border-emerald-300 bg-white hover:bg-emerald-50 text-emerald-900 rounded-full transition-colors cursor-pointer"
            >
              Salin URL
            </button>
          </div>
        </div>

        <!-- {Billing} -->
        <div class="p-5 rounded-3xl border border-zinc-200 bg-white space-y-4">
          <div class="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 class="text-xs font-semibold text-zinc-900">
                Rincian Pembayaran
              </h3>
              <p class="text-[11px] text-zinc-500">Pembayaran DP 50% dan Pelunasan 50%</p>
            </div>
            <span class="font-mono text-xs font-bold text-zinc-900">
              Total: Rp {{ totalTarif.toLocaleString('id-ID') }}
            </span>
          </div>

          <div class="space-y-3 text-xs">
            <!-- {DP Row} -->
            <div class="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span class="font-bold text-zinc-900 block">Tahap 1: Down Payment (50%)</span>
                <span class="text-[11px] text-zinc-500">Pembayaran awal untuk konfirmasi jadwal</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-mono font-bold text-zinc-900 text-sm">
                  Rp {{ dpAmount.toLocaleString('id-ID') }}
                </span>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                  :class="consultation.dp_payment_status === 'paid'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'"
                >
                  {{ consultation.dp_payment_status === 'paid' ? 'Lunas Terverifikasi' : 'Belum Dibayar' }}
                </span>
              </div>
            </div>

            <!-- {Pelunasan Row} -->
            <div class="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span class="font-bold text-zinc-900 block">Tahap 2: Pelunasan (50%)</span>
                <span class="text-[11px] text-zinc-500">Pelunasan setelah sesi konsultasi selesai</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-mono font-bold text-zinc-900 text-sm">
                  Rp {{ finalAmount.toLocaleString('id-ID') }}
                </span>
                <span
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-medium border"
                  :class="consultation.final_payment_status === 'paid'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-zinc-100 text-zinc-600 border-zinc-200'"
                >
                  {{ consultation.final_payment_status === 'paid' ? 'Lunas Terverifikasi' : 'Belum Dibayar' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- {Actions} -->
        <div class="space-y-3 pt-2 print:hidden">
          <button
            v-if="consultation.status === 'accepted' && consultation.dp_payment_status !== 'paid'"
            @click="paymentType = 'dp'"
            class="w-full py-3.5 text-xs sm:text-sm font-semibold bg-black hover:bg-zinc-800 text-white rounded-full shadow-sm transition-all cursor-pointer"
          >
            Unggah Bukti Pembayaran DP (Rp {{ dpAmount.toLocaleString('id-ID') }})
          </button>

          <button
            v-if="consultation.status === 'waiting_pelunasan' && consultation.final_payment_status !== 'paid'"
            @click="paymentType = 'final'"
            class="w-full py-3.5 text-xs sm:text-sm font-semibold bg-black hover:bg-zinc-800 text-white rounded-full shadow-sm transition-all cursor-pointer"
          >
            Unggah Bukti Pelunasan (Rp {{ finalAmount.toLocaleString('id-ID') }})
          </button>

          <button
            v-if="consultation.status === 'completed'"
            @click="showReviewModal = true"
            class="w-full py-3.5 text-xs sm:text-sm font-semibold border border-zinc-300 hover:bg-zinc-50 text-zinc-900 rounded-full transition-all cursor-pointer"
          >
            Beri Penilaian & Ulasan Advokat
          </button>
        </div>
      </div>

      <!-- {Payment Modal} -->
      <div
        v-if="paymentType"
        class="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-100"
      >
        <form
          @submit.prevent="handleUploadProof"
          class="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 w-full max-w-md space-y-4 shadow-xl text-sm"
        >
          <div>
            <div class="text-xs font-semibold text-zinc-500 tracking-wide">
              Pembayaran Konsultasi
            </div>
            <h3 class="font-bold text-lg text-zinc-950 mt-1">
              Unggah Bukti Transfer {{ paymentType === 'dp' ? 'DP 50%' : 'Pelunasan 50%' }}
            </h3>
            <p class="text-xs text-zinc-500 mt-1">
              Silakan transfer ke rekening resmi:
            </p>
            <div class="mt-2 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-0.5">
              <p class="text-zinc-500">Bank: <span class="text-zinc-900 font-bold">BCA (Bank Central Asia)</span></p>
              <p class="text-zinc-500">No. Rekening: <span class="text-zinc-900 font-mono font-bold">1234567890</span></p>
              <p class="text-zinc-500">Atas Nama: <span class="text-zinc-900 font-bold">PT Counsela Legal Tech</span></p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-zinc-800 mb-1.5">
              Pilih Berkas Bukti Transfer (Foto / PDF)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              @change="(e) => proofFile = e.target.files[0]"
              class="w-full text-xs text-zinc-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-zinc-100 file:text-zinc-900 hover:file:bg-zinc-200 cursor-pointer border border-zinc-200 rounded-2xl p-1.5"
              required
            />
            <p v-if="proofFile" class="text-[11px] text-emerald-700 mt-1">
              Berkas dipilih: {{ proofFile.name }} ({{ (proofFile.size / 1024).toFixed(1) }} KB)
            </p>
          </div>

          <div class="flex justify-end gap-2 pt-3 border-t border-zinc-100">
            <button
              type="button"
              @click="paymentType = null; proofFile = null"
              class="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="uploading || !proofFile"
              class="px-5 py-2 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-all disabled:opacity-40 shadow-sm cursor-pointer"
            >
              {{ uploading ? 'Mengunggah...' : 'Kirim Bukti Pembayaran' }}
            </button>
          </div>
        </form>
      </div>

      <!-- {Review Modal} -->
      <ReviewModal
        v-if="showReviewModal"
        :consultation="consultation"
        @close="showReviewModal = false"
        @success="fetchDetail"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, ArrowRight, Check, ChevronRight, Printer } from '@lucide/vue'
import api from '../utils/axios'
import { toast } from '../composables/useToast'
import ReviewModal from '../components/ReviewModal.vue'

const route = useRoute()
const id = route.params.id

const consultation = ref(null)
const loading = ref(true)
const paymentType = ref(null)
const proofFile = ref(null)
const uploading = ref(false)
const showReviewModal = ref(false)

const printDocket = () => {
  window.print()
}

const fetchDetail = async () => {
  try {
    loading.value = true
    const res = await api.get(`/consultations/${id}`)
    consultation.value = res.data.data || res.data
  } catch (err) {
    toast.error('Gagal memuat detail berkas perkara')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})

const totalTarif = computed(() => Number(consultation.value?.tarif_konsultasi || 0))
const dpAmount = computed(() => Math.floor(totalTarif.value / 2))
const finalAmount = computed(() => totalTarif.value - dpAmount.value)

const progressSteps = computed(() => {
  const s = consultation.value?.status?.toLowerCase() || 'pending'
  const isAccepted = s === 'accepted' || s === 'ongoing' || s === 'waiting_pelunasan' || s === 'completed'
  const isDpPaid = consultation.value?.dp_payment_status === 'paid'
  const isOngoing = s === 'ongoing' || s === 'waiting_pelunasan' || s === 'completed'
  const isWaitingPelunasan = s === 'waiting_pelunasan' || s === 'completed'
  const isDone = s === 'completed'

  return [
    { label: 'Diajukan', active: true, done: isAccepted },
    { label: 'Diterima Advokat', active: isAccepted, done: isDpPaid },
    { label: 'DP Terverifikasi', active: isDpPaid, done: isOngoing },
    { label: 'Konsultasi Rapat', active: isOngoing, done: isWaitingPelunasan },
    { label: 'Pelunasan 50%', active: isWaitingPelunasan, done: isDone },
    { label: 'Perkara Selesai', active: isDone, done: isDone },
  ]
})

const statusBadgeClass = computed(() => {
  const map = {
    pending: 'text-zinc-900 bg-zinc-100 border-zinc-200',
    accepted: 'text-zinc-950 bg-zinc-100 border-zinc-300',
    ongoing: 'text-blue-800 bg-blue-50 border-blue-200',
    waiting_pelunasan: 'text-amber-800 bg-amber-50 border-amber-200',
    completed: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    cancelled: 'text-zinc-400 bg-zinc-100 border-zinc-200',
  }
  const key = consultation.value?.status?.toLowerCase() || 'cancelled'
  return `inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase border ${map[key] || map.cancelled}`
})

const copyMeetingLink = () => {
  if (consultation.value?.meeting_link) {
    navigator.clipboard.writeText(consultation.value.meeting_link)
    toast.success('Tautan rapat berhasil disalin ke clipboard')
  }
}

const handleUploadProof = async () => {
  if (!proofFile.value) {
    toast.error('Pilih berkas bukti pembayaran terlebih dahulu')
    return
  }
  uploading.value = true
  const formData = new FormData()
  formData.append('consultation_id', consultation.value.id)

  try {
    if (paymentType.value === 'dp') {
      formData.append('dp_proof', proofFile.value)
      await api.post('/consultations/upload-dp', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      formData.append('final_payment_proof', proofFile.value)
      await api.post('/consultations/upload-final-payment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }
    toast.success('Bukti pembayaran berhasil diunggah. Menunggu verifikasi tim admin.')
    paymentType.value = null
    proofFile.value = null
    fetchDetail()
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal mengirim bukti pembayaran')
  } finally {
    uploading.value = false
  }
}
</script>
