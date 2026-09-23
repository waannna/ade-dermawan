<template>
  <div class="bg-white border border-zinc-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-md hover:border-black transition-all text-zinc-950">
    <div class="space-y-3">
      <!-- {Badge} -->
      <div class="flex justify-between items-center text-xs">
        <span class="font-mono text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
          #CNS-{{ String(id).padStart(4, '0') }}
        </span>
        <span :class="badgeClass">
          {{ statusFormatted }}
        </span>
      </div>

      <!-- {Title} -->
      <div>
        <h3 class="font-bold text-sm text-zinc-950 line-clamp-2 leading-snug">
          {{ judul_kasus }}
        </h3>
        <p class="text-xs text-zinc-500 font-mono mt-1.5 flex items-center gap-3">
          <span class="inline-flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5 text-zinc-400" />
            {{ formattedDate }}
          </span>
          <span class="text-zinc-300">•</span>
          <span class="inline-flex items-center gap-1">
            <Clock class="w-3.5 h-3.5 text-zinc-400" />
            {{ jam_konsultasi }} WIB
          </span>
        </p>
      </div>
    </div>

    <!-- {Actions} -->
    <div class="flex items-center gap-2 pt-3 border-t border-zinc-100 text-xs">
      <RouterLink
        :to="`/consultations/${id}`"
        class="flex-1 text-center py-2 font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-900 rounded-full transition-colors text-xs"
      >
        {{ isCompleted ? 'Rincian & Ulasan' : 'Detail Kasus' }}
      </RouterLink>

      <a
        v-if="meeting_link && !isCompleted"
        :href="meeting_link"
        target="_blank"
        rel="noopener noreferrer"
        class="flex-1 inline-flex items-center justify-center gap-1.5 text-center py-2 font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-colors shadow-2xs text-xs"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Ruang Rapat</span>
      </a>

      <button
        v-if="isArchived"
        @click="handleRestore"
        class="p-2 text-zinc-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors"
        title="Pulihkan ke daftar utama"
        aria-label="Pulihkan"
      >
        <ArchiveRestore class="w-3.5 h-3.5" />
      </button>
      <button
        v-else
        @click="handleHide"
        class="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 rounded-full transition-colors"
        title="Arsipkan dari daftar"
        aria-label="Arsipkan"
      >
        <Archive class="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Archive, ArchiveRestore, Calendar, Clock } from 'lucide-vue-next'
import api from '../utils/axios'
import { toast } from '../composables/useToast'

const props = defineProps({
  id: { type: [String, Number], required: true },
  judul_kasus: { type: String, default: '' },
  tanggal_konsultasi: { type: String, default: '' },
  jam_konsultasi: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  meeting_link: { type: String, default: null },
  isArchived: { type: Boolean, default: false },
})

const emit = defineEmits(['hide', 'restore'])

const isCompleted = computed(() => props.status?.toLowerCase() === 'completed')

const statusFormatted = computed(() => {
  return props.status?.replace('_', ' ')?.toUpperCase()
})

const formattedDate = computed(() => {
  return props.tanggal_konsultasi?.split('T')[0] || '-'
})

const badgeClass = computed(() => {
  const map = {
    pending: 'text-zinc-900 bg-zinc-100 border-zinc-200',
    accepted: 'text-blue-900 bg-blue-50 border-blue-200',
    ongoing: 'text-indigo-900 bg-indigo-50 border-indigo-200',
    waiting_pelunasan: 'text-amber-900 bg-amber-50 border-amber-200',
    completed: 'text-emerald-900 bg-emerald-50 border-emerald-200',
    cancelled: 'text-zinc-400 bg-zinc-100 border-zinc-200',
  }
  const key = props.status?.toLowerCase() || 'cancelled'
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${map[key] || map.cancelled}`
})

const handleHide = async () => {
  if (!window.confirm('Arsipkan konsultasi ini dari tampilan utama?')) return
  try {
    await api.patch(`/consultations/${props.id}/hide`)
    toast.success('Konsultasi berhasil diarsipkan')
    emit('hide')
  } catch (err) {
    toast.error('Gagal mengarsipkan riwayat')
  }
}

const handleRestore = async () => {
  if (!window.confirm('Pulihkan konsultasi ini ke daftar utama?')) return
  try {
    await api.patch(`/consultations/${props.id}/unarchive`)
    toast.success('Konsultasi berhasil dipulihkan')
    emit('restore')
  } catch (err) {
    toast.error('Gagal memulihkan perkara')
  }
}
</script>
