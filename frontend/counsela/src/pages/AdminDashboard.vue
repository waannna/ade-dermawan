<template>
  <div class="space-y-8 text-zinc-950">
    <!-- {Header} -->
    <div class="pb-6 border-b border-zinc-200">
      <div class="text-xs font-semibold text-zinc-500 tracking-wide">
        Panel Admin
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-zinc-950 mt-1">
        Dashboard Admin
      </h1>
      <p class="text-xs text-zinc-500 mt-1">
        Pantau ringkasan platform, verifikasi pembayaran DP dan pelunasan, serta atur jadwal advokat.
      </p>
    </div>

    <!-- {Metrics} -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <div
        v-for="(m, idx) in metricCards"
        :key="idx"
        class="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-2xs space-y-1.5 hover:border-zinc-300 transition-colors"
      >
        <p class="text-xs font-medium text-zinc-500">{{ m.label }}</p>
        <p class="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">{{ m.value }}</p>
      </div>
    </div>

    <!-- {Verification Queue} -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- {DP Verification} -->
      <div class="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-zinc-100">
          <div>
            <h2 class="text-base font-bold text-zinc-950 tracking-tight">
              Antrean Verifikasi DP ({{ waitingDp.length }})
            </h2>
            <p class="text-xs text-zinc-500">Pembayaran DP 50%</p>
          </div>
          <span class="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
            DP 50%
          </span>
        </div>

        <div v-if="waitingDp.length === 0" class="text-xs text-zinc-400 py-10 text-center font-sans">
          Tidak ada antrean verifikasi DP
        </div>

        <div v-else class="divide-y divide-zinc-100 text-xs">
          <div
            v-for="item in waitingDp"
            :key="item.id"
            class="py-3.5 flex justify-between items-center gap-3"
          >
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-zinc-950 truncate">{{ item.judul_kasus }}</p>
              <p class="text-zinc-500 text-[11px] mt-0.5">
                {{ item.client_name }} • <span class="font-mono font-semibold text-zinc-900">Rp {{ Number(item.dp_amount || 0).toLocaleString('id-ID') }}</span>
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                @click="openLightbox(item.dp_proof, 'Bukti Transfer DP - ' + item.client_name)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-full border border-zinc-200 transition-colors"
              >
                <Eye class="w-3 h-3" />
                <span>Pratinjau</span>
              </button>
              <button
                @click="handleVerify(item.id, 'dp')"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-black text-white rounded-full hover:bg-zinc-800 transition-colors shadow-2xs"
              >
                <Check class="w-3 h-3" />
                <span>Verifikasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- {Pelunasan Verification} -->
      <div class="bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div class="flex justify-between items-center pb-3 border-b border-zinc-100">
          <div>
            <h2 class="text-base font-bold text-zinc-950 tracking-tight">
              Antrean Verifikasi Pelunasan ({{ waitingPelunasan.length }})
            </h2>
            <p class="text-xs text-zinc-500">Pembayaran Pelunasan 50%</p>
          </div>
          <span class="text-[11px] text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 font-medium">
            Pelunasan 50%
          </span>
        </div>

        <div v-if="waitingPelunasan.length === 0" class="text-xs text-zinc-400 py-10 text-center font-sans">
          Tidak ada antrean verifikasi pelunasan
        </div>

        <div v-else class="divide-y divide-zinc-100 text-xs">
          <div
            v-for="item in waitingPelunasan"
            :key="item.id"
            class="py-3.5 flex justify-between items-center gap-3"
          >
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-zinc-950 truncate">{{ item.judul_kasus }}</p>
              <p class="text-zinc-500 text-[11px] mt-0.5">
                Klien: {{ item.client_name }}
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button
                @click="openLightbox(item.final_payment_proof, 'Bukti Pelunasan - ' + item.client_name)"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-full border border-zinc-200 transition-colors"
              >
                <Eye class="w-3 h-3" />
                <span>Pratinjau</span>
              </button>
              <button
                @click="handleVerify(item.id, 'final')"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-black text-white rounded-full hover:bg-zinc-800 transition-colors shadow-2xs"
              >
                <Check class="w-3 h-3" />
                <span>Verifikasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- {Lawyers Schedule} -->
    <div class="bg-white border border-zinc-200/90 rounded-3xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 class="text-base font-bold text-zinc-950 tracking-tight">
            Daftar Advokat & Jadwal Praktik
          </h2>
          <p class="text-xs text-zinc-500">Atur jam kerja dan ketersediaan advokat</p>
        </div>
        <span class="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          Total <strong class="text-zinc-900 font-semibold">{{ lawyers.length }}</strong> Advokat
        </span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-zinc-50 text-zinc-500 text-xs font-medium border-b border-zinc-200">
            <tr>
              <th class="px-6 py-3.5">Firma / Nama Advokat</th>
              <th class="px-6 py-3.5">Spesialisasi</th>
              <th class="px-6 py-3.5">Tarif Konsultasi</th>
              <th class="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 text-zinc-700">
            <tr
              v-for="l in lawyers"
              :key="l.id"
              class="hover:bg-zinc-50/70 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-zinc-950">{{ l.firma_hukum || '-' }}</td>
              <td class="px-6 py-4 font-medium text-zinc-700">{{ l.spesialisasi }}</td>
              <td class="px-6 py-4 font-mono font-semibold text-zinc-900">Rp {{ Number(l.tarif_konsultasi).toLocaleString('id-ID') }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="openScheduleModal(l)"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border border-zinc-300 hover:border-black hover:bg-black hover:text-white text-zinc-900 rounded-full transition-all"
                >
                  <Clock class="w-3 h-3" />
                  <span>Atur Jadwal</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- {Lightbox Modal} -->
    <div
      v-if="lightboxImg"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      @click.self="lightboxImg = null"
    >
      <div class="bg-white border border-zinc-200 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] flex flex-col space-y-4 shadow-2xl">
        <div class="flex justify-between items-center border-b border-zinc-100 pb-3">
          <h3 class="font-bold text-sm text-zinc-950 tracking-tight">{{ lightboxTitle }}</h3>
          <button
            @click="lightboxImg = null"
            class="w-7 h-7 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
        <div class="flex-1 overflow-auto flex items-center justify-center bg-zinc-50 rounded-2xl p-2 border border-zinc-200">
          <img :src="lightboxImg" :alt="lightboxTitle" class="max-h-[65vh] object-contain rounded-xl" />
        </div>
        <div class="flex justify-between items-center pt-1 text-xs">
          <a
            :href="lightboxImg"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-zinc-900 font-semibold hover:underline"
          >
            <span>Buka Tab Baru</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
          <button
            @click="lightboxImg = null"
            class="px-4 py-2 bg-black text-white rounded-full text-xs font-semibold hover:bg-zinc-800 transition-colors shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- {Schedule Modal} -->
    <div
      v-if="selectedLawyer"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
    >
      <div class="bg-white border border-zinc-200 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl text-sm">
        <div class="flex items-start justify-between">
          <div>
            <div class="text-xs font-semibold text-zinc-500 tracking-wide">
              Pengaturan Advokat
            </div>
            <h3 class="font-bold text-lg text-zinc-950 mt-1 tracking-tight">
              Jadwal Praktik
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">{{ selectedLawyer.firma_hukum }}</p>
          </div>
          <button
            @click="selectedLawyer = null"
            class="w-7 h-7 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- {Presets} -->
        <div class="flex items-center gap-2 pt-1">
          <span class="text-xs text-zinc-500 font-medium">Preset:</span>
          <button
            type="button"
            @click="applyPresetWeekday"
            class="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors"
          >
            Senin-Jumat (09:00 - 17:00)
          </button>
          <button
            type="button"
            @click="applyPresetAll"
            class="px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors"
          >
            Senin-Sabtu
          </button>
        </div>

        <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
          <div
            v-for="s in schedules"
            :key="s.day_of_week"
            class="flex items-center gap-2.5 text-xs p-2.5 bg-zinc-50 rounded-2xl border border-zinc-200/80"
          >
            <input
              type="checkbox"
              v-model="s.enabled"
              class="accent-black w-4 h-4 rounded cursor-pointer"
            />
            <span class="w-16 font-mono font-semibold text-zinc-800">{{ dayNames[s.day_of_week] }}</span>
            <input
              type="time"
              v-model="s.start_time"
              :disabled="!s.enabled"
              class="px-2 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-900 disabled:opacity-40 font-mono text-xs"
            />
            <span class="text-zinc-400 font-mono">-</span>
            <input
              type="time"
              v-model="s.end_time"
              :disabled="!s.enabled"
              class="px-2 py-1 rounded-lg border border-zinc-200 bg-white text-zinc-900 disabled:opacity-40 font-mono text-xs"
            />
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            @click="selectedLawyer = null"
            class="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
          >
            Batal
          </button>
          <button
            @click="saveSchedule"
            :disabled="savingSchedule"
            class="px-5 py-2 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-all disabled:opacity-50 shadow-sm"
          >
            {{ savingSchedule ? 'Menyimpan...' : 'Simpan Jadwal Praktik' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, Check, Eye, Clock, ExternalLink } from '@lucide/vue'
import api from '../utils/axios'
import { toast } from '../composables/useToast'

const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

const stats = ref({
  total_users: 0,
  total_lawyers: 0,
  total_consultations: 0,
  total_reviews: 0,
})
const lawyers = ref([])
const waitingDp = ref([])
const waitingPelunasan = ref([])
const adminWallet = ref({ balance: { total_fees: 0, total_transactions: 0 } })
const loading = ref(true)

const selectedLawyer = ref(null)
const schedules = ref([])
const savingSchedule = ref(false)

const lightboxImg = ref(null)
const lightboxTitle = ref('')

const openLightbox = (url, title) => {
  lightboxImg.value = url
  lightboxTitle.value = title
}

const loadData = async () => {
  try {
    loading.value = true
    const [s, l, dp, pl, w] = await Promise.all([
      api.get('/admin/dashboard'),
      api.get('/lawyers'),
      api.get('/consultations/admin/waiting-dp'),
      api.get('/consultations/admin/waiting-pelunasan'),
      api.get('/consultations/admin/wallet'),
    ])
    if (s.data.success) stats.value = s.data.data
    lawyers.value = l.data.data || []
    waitingDp.value = dp.data.data || []
    waitingPelunasan.value = pl.data.data || []
    if (w.data.success) adminWallet.value = w.data.data
  } catch (err) {
    toast.error('Gagal memuat data panel admin')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const metricCards = computed(() => [
  { label: 'Total Pengguna', value: stats.value.total_users },
  { label: 'Total Advokat', value: stats.value.total_lawyers },
  { label: 'Total Konsultasi', value: stats.value.total_consultations },
  { label: 'Total Ulasan', value: stats.value.total_reviews },
  {
    label: 'Pendapatan Platform',
    value: `Rp ${(adminWallet.value.balance?.total_fees || 0).toLocaleString('id-ID')}`,
  },
])

const handleVerify = async (id, type) => {
  try {
    if (type === 'dp') {
      await api.patch(`/consultations/${id}/verify-dp`)
    } else {
      await api.patch(`/consultations/${id}/verify-final-payment`)
    }
    toast.success('Pembayaran perkara berhasil diverifikasi')
    loadData()
  } catch {
    toast.error('Gagal memverifikasi pembayaran')
  }
}

const openScheduleModal = async (lawyer) => {
  selectedLawyer.value = lawyer
  try {
    const res = await api.get(`/lawyers/${lawyer.id}/schedule`)
    const existing = res.data.data?.schedules || []
    schedules.value = [1, 2, 3, 4, 5, 6].map((day) => {
      const found = existing.find((ex) => ex.day_of_week === day)
      return {
        day_of_week: day,
        start_time: found ? found.start_time.substring(0, 5) : '09:00',
        end_time: found ? found.end_time.substring(0, 5) : '17:00',
        enabled: Boolean(found),
      }
    })
  } catch {
    toast.error('Gagal memuat jadwal operasional pengacara')
  }
}

const applyPresetWeekday = () => {
  schedules.value.forEach((s) => {
    if (s.day_of_week >= 1 && s.day_of_week <= 5) {
      s.enabled = true
      s.start_time = '09:00'
      s.end_time = '17:00'
    } else {
      s.enabled = false
    }
  })
}

const applyPresetAll = () => {
  schedules.value.forEach((s) => {
    s.enabled = true
    s.start_time = '09:00'
    s.end_time = '17:00'
  })
}

const saveSchedule = async () => {
  savingSchedule.value = true
  const payload = schedules.value
    .filter((s) => s.enabled)
    .map((s) => ({
      day_of_week: s.day_of_week,
      start_time: s.start_time,
      end_time: s.end_time,
    }))

  try {
    await api.put(`/lawyers/${selectedLawyer.value.id}/schedule`, { schedules: payload })
    toast.success('Jadwal operasional pengacara berhasil diperbarui')
    selectedLawyer.value = null
  } catch {
    toast.error('Gagal menyimpan jadwal')
  } finally {
    savingSchedule.value = false
  }
}
</script>
