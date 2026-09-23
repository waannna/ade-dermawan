<template>
  <div class="space-y-8 text-zinc-950">
    <!-- {Header} -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-200">
      <div>
        <div class="text-xs font-semibold text-zinc-500 tracking-wide">
          Portal Klien
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-zinc-950 mt-1">
          Dashboard Klien
        </h1>
        <p class="text-xs text-zinc-500 mt-1">
          Selamat datang, <span class="font-bold text-zinc-900">{{ user?.nama }}</span>. Pantau jadwal dan status konsultasi hukum Anda.
        </p>
      </div>

      <RouterLink
        to="/consultation/new"
        class="px-5 py-2.5 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full shadow-sm transition-all inline-flex items-center gap-2"
      >
        <Plus class="w-3.5 h-3.5" />
        <span>Jadwalkan Konsultasi Baru</span>
      </RouterLink>
    </div>

    <!-- {Active Consultation} -->
    <div
      v-if="activeConsultation"
      class="p-6 rounded-3xl border border-zinc-200 bg-zinc-50/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
    >
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-semibold text-zinc-800">
            Sesi Konsultasi Aktif
          </span>
        </div>
        <h3 class="font-bold text-base text-zinc-950 tracking-tight">
          {{ activeConsultation.judul_kasus }}
        </h3>
        <p class="text-xs text-zinc-600">
          Bersama {{ activeConsultation.lawyer_name }} • <span class="font-mono">{{ activeConsultation.tanggal_konsultasi?.split('T')[0] }} ({{ activeConsultation.jam_konsultasi }} WIB)</span>
        </p>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <a
          v-if="activeConsultation.meeting_link && activeConsultation.status === 'ongoing'"
          :href="activeConsultation.meeting_link"
          target="_blank"
          rel="noopener noreferrer"
          class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-colors shadow-2xs text-center"
        >
          <Video class="w-3.5 h-3.5" />
          <span>Masuk Ruang Rapat</span>
        </a>
        <RouterLink
          :to="`/consultations/${activeConsultation.id}`"
          class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-900 rounded-full transition-colors text-center"
        >
          <span>Lihat Detail</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </div>

    <!-- {Metrics} -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="(item, idx) in stats"
        :key="idx"
        class="p-5 bg-white border border-zinc-200/90 rounded-2xl shadow-2xs space-y-1.5 hover:border-zinc-300 transition-colors"
      >
        <span class="text-xs font-medium text-zinc-500 block">
          {{ item.label }}
        </span>
        <span class="text-3xl font-bold tracking-tight block" :class="item.color">
          {{ item.count }}
        </span>
      </div>
    </div>

    <!-- {Consultations} -->
    <div class="bg-white border border-zinc-200/90 rounded-3xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 class="text-base font-bold text-zinc-950 tracking-tight">
            Daftar Konsultasi
          </h2>
          <p class="text-xs text-zinc-500">Riwayat jadwal konsultasi hukum Anda</p>
        </div>
        <span class="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          Total <strong class="text-zinc-900 font-semibold">{{ consultations.length }}</strong> Kasus
        </span>
      </div>

      <div v-if="loading" class="p-12 text-center text-xs text-zinc-400 font-sans">
        Memuat data perkara...
      </div>

      <div
        v-else-if="consultations.length === 0"
        class="p-16 text-center text-xs text-zinc-500 space-y-3"
      >
        <p class="text-base font-bold text-zinc-900">Belum ada riwayat konsultasi</p>
        <p class="max-w-sm mx-auto">
          Mulai konsultasi dengan advokat terverifikasi untuk mendapatkan solusi hukum yang tepat.
        </p>
        <RouterLink to="/consultation/new" class="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-black text-white rounded-full hover:bg-zinc-800 transition-colors">
          <span>Buat Jadwal Pertama Anda</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-zinc-50 text-zinc-500 text-xs font-medium border-b border-zinc-200">
            <tr>
              <th class="px-6 py-3.5">No. Konsultasi</th>
              <th class="px-6 py-3.5">Pokok Kasus</th>
              <th class="px-6 py-3.5">Advokat</th>
              <th class="px-6 py-3.5">Waktu Sesi</th>
              <th class="px-6 py-3.5">Status</th>
              <th class="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 text-zinc-700">
            <tr
              v-for="item in consultations"
              :key="item.id"
              class="hover:bg-zinc-50/70 transition-colors"
            >
              <td class="px-6 py-4 font-mono text-xs text-zinc-500 font-medium whitespace-nowrap">
                #CNS-{{ String(item.id).padStart(4, '0') }}
              </td>
              <td class="px-6 py-4 font-semibold text-zinc-950 max-w-xs truncate">
                {{ item.judul_kasus }}
              </td>
              <td class="px-6 py-4 text-zinc-600 truncate max-w-[160px]">
                {{ item.lawyer_name || '-' }}
              </td>
              <td class="px-6 py-4 text-xs font-mono whitespace-nowrap">
                {{ item.tanggal_konsultasi?.split('T')[0] }} • {{ item.jam_konsultasi }} WIB
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(item.status)">
                  {{ item.status?.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 text-right whitespace-nowrap space-x-2">
                <a
                  v-if="item.meeting_link && item.status === 'ongoing'"
                  :href="item.meeting_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-colors shadow-2xs"
                >
                  <Video class="w-3 h-3" />
                  <span>Rapat</span>
                </a>
                <RouterLink
                  :to="`/consultations/${item.id}`"
                  class="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full transition-colors"
                >
                  <FileText class="w-3 h-3" />
                  <span>Detail</span>
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, ArrowRight, Video, FileText } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import api from '../utils/axios'
import { toast } from '../composables/useToast'

const { user } = useAuth()

const consultations = ref([])
const loading = ref(true)

const fetchConsultations = async () => {
  try {
    loading.value = true
    const res = await api.get('/consultations/client')
    consultations.value = res.data.data || []
  } catch {
    toast.error('Gagal memuat konsultasi')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConsultations()
})

const activeConsultation = computed(() => {
  return consultations.value.find(
    (c) => c.status === 'ongoing' || (c.status === 'accepted' && c.dp_payment_status === 'paid')
  )
})

const stats = computed(() => [
  {
    label: 'Menunggu Konfirmasi',
    count: consultations.value.filter((c) => c.status === 'pending' || c.status === 'accepted').length,
    color: 'text-amber-700',
  },
  {
    label: 'Konsultasi Berjalan',
    count: consultations.value.filter((c) => c.status === 'ongoing').length,
    color: 'text-blue-700',
  },
  {
    label: 'Menunggu Pelunasan',
    count: consultations.value.filter((c) => c.status === 'waiting_pelunasan').length,
    color: 'text-orange-700',
  },
  {
    label: 'Perkara Selesai',
    count: consultations.value.filter((c) => c.status === 'completed').length,
    color: 'text-emerald-700',
  },
])

const getStatusBadge = (status) => {
  const map = {
    pending: 'text-amber-800 bg-amber-50 border-amber-200',
    accepted: 'text-blue-800 bg-blue-50 border-blue-200',
    ongoing: 'text-indigo-800 bg-indigo-50 border-indigo-200',
    waiting_pelunasan: 'text-orange-800 bg-orange-50 border-orange-200',
    completed: 'text-emerald-800 bg-emerald-50 border-emerald-200',
    cancelled: 'text-slate-600 bg-slate-100 border-slate-200',
  }
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${map[status?.toLowerCase()] || map.cancelled}`
}
</script>
