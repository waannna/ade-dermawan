<template>
  <div class="space-y-8 text-zinc-950">
    <!-- {Header} -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-200">
      <div>
        <RouterLink
          :to="dashboardLink"
          class="text-xs font-medium text-zinc-500 hover:text-black transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Kembali ke Dashboard</span>
        </RouterLink>
        <div class="text-xs font-semibold text-zinc-500 tracking-wide mt-1">
          Konsultasi
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-0.5">
          {{ pageTitle }}
        </h1>
        <p class="text-xs text-zinc-500 mt-1">
          Pantau status persetujuan, pembayaran, dan jadwal konsultasi Anda.
        </p>
      </div>

      <div v-if="isClient">
        <RouterLink
          to="/consultation/new"
          class="px-4 py-2.5 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full shadow-sm transition-all inline-flex items-center gap-1.5"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Jadwalkan Konsultasi Baru</span>
        </RouterLink>
      </div>
    </div>

    <!-- {Status Tabs} -->
    <div class="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-3 text-xs">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        @click="activeStatus = tab.value"
        class="px-3.5 py-1.5 rounded-full font-medium transition-all text-xs"
        :class="activeStatus === tab.value
          ? 'bg-black text-white font-semibold shadow-2xs'
          : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70'"
      >
        {{ tab.label }}
        <span class="ml-1 font-mono text-[10px] opacity-75">
          ({{ countByStatus(tab.value) }})
        </span>
      </button>
    </div>

    <!-- {Loading} -->
    <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="i in 3"
        :key="i"
        class="h-44 bg-zinc-100 rounded-2xl animate-pulse border border-zinc-200"
      ></div>
    </div>

    <!-- {Error} -->
    <div
      v-else-if="error"
      class="p-12 text-center text-xs text-red-700 bg-red-50/50 border border-red-200 rounded-3xl"
    >
      {{ error }}
    </div>

    <!-- {Empty} -->
    <div
      v-else-if="filteredConsultations.length === 0"
      class="p-16 text-center bg-white border border-zinc-200 rounded-3xl text-xs text-zinc-500 space-y-3"
    >
      <div class="w-10 h-10 rounded-full bg-zinc-100 mx-auto flex items-center justify-center text-zinc-400">
        <Scale class="w-5 h-5 text-zinc-500" />
      </div>
      <p class="text-base font-bold text-zinc-900">
        {{ activeStatus === 'archived' ? 'Belum ada konsultasi yang diarsipkan' : 'Belum ada konsultasi pada status ini' }}
      </p>
      <p class="max-w-md mx-auto">
        {{ activeStatus === 'archived'
          ? 'Konsultasi yang Anda arsipkan akan tersimpan di sini.'
          : 'Tidak ada konsultasi yang sesuai dengan filter yang dipilih.' }}
      </p>
      <div v-if="isClient && activeStatus !== 'archived'" class="pt-2">
        <RouterLink to="/consultation/new" class="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-black text-white rounded-full hover:bg-zinc-800 transition-colors">
          <span>Jadwalkan Konsultasi Baru</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </div>

    <!-- {Consultations Grid} -->
    <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ConsultationCard
        v-for="item in filteredConsultations"
        :key="item.id"
        v-bind="item"
        :is-archived="activeStatus === 'archived'"
        @hide="fetchConsultations"
        @restore="fetchConsultations"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, ArrowRight, Plus, Scale } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'
import api from '../utils/axios'
import ConsultationCard from '../components/ConsultationCard.vue'

const { user, isClient, isLawyer } = useAuth()

const consultations = ref([])
const archivedConsultations = ref([])
const loading = ref(true)
const error = ref(null)
const activeStatus = ref('all')

const statusTabs = [
  { label: 'Semua', value: 'all' },
  { label: 'Menunggu Konfirmasi', value: 'pending' },
  { label: 'Siap Sesi / Diterima', value: 'accepted' },
  { label: 'Konsultasi Berjalan', value: 'ongoing' },
  { label: 'Menunggu Pelunasan', value: 'waiting_pelunasan' },
  { label: 'Selesai', value: 'completed' },
  { label: 'Arsip', value: 'archived' },
]

const pageTitle = computed(() => {
  return isLawyer.value ? 'Permintaan Konsultasi Masuk' : 'Daftar Konsultasi Saya'
})

const dashboardLink = computed(() => {
  return isLawyer.value ? '/lawyer-dashboard' : '/client-dashboard'
})

const fetchConsultations = async () => {
  try {
    loading.value = true
    error.value = null
    const [resActive, resArchived] = await Promise.all([
      api.get('/consultations'),
      api.get('/consultations/archived').catch(() => ({ data: { data: [] } })),
    ])
    const dataActive = resActive.data.data || resActive.data
    consultations.value = Array.isArray(dataActive) ? dataActive : []

    const dataArchived = resArchived.data.data || resArchived.data
    archivedConsultations.value = Array.isArray(dataArchived) ? dataArchived : []
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memuat riwayat konsultasi'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConsultations()
})

const countByStatus = (status) => {
  if (status === 'archived') return archivedConsultations.value.length
  if (status === 'all') return consultations.value.length
  return consultations.value.filter((c) => c.status?.toLowerCase() === status).length
}

const filteredConsultations = computed(() => {
  if (activeStatus.value === 'archived') return archivedConsultations.value
  if (activeStatus.value === 'all') return consultations.value
  return consultations.value.filter((c) => c.status?.toLowerCase() === activeStatus.value)
})
</script>
