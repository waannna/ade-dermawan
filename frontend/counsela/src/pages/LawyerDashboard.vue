<template>
  <div class="space-y-8 text-zinc-950">
    <!-- {Header} -->
    <div class="pb-6 border-b border-zinc-200">
      <div class="text-xs font-semibold text-zinc-500 tracking-wide">
        Portal Advokat
      </div>
      <h1 class="text-3xl font-bold tracking-tight text-zinc-950 mt-1">
        Dashboard Advokat
      </h1>
      <p class="text-xs text-zinc-500 mt-1">
        Kelola jadwal konsultasi, terima permintaan klien, dan atur tautan rapat.
      </p>
    </div>

    <!-- {Stats} -->
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

    <!-- {Orders Table} -->
    <div class="bg-white border border-zinc-200/90 rounded-3xl shadow-sm overflow-hidden">
      <div class="px-6 py-5 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 class="text-base font-bold text-zinc-950 tracking-tight">
            Permintaan Konsultasi
          </h2>
          <p class="text-xs text-zinc-500">Daftar konsultasi yang masuk ke jadwal Anda</p>
        </div>
        <span class="text-xs font-medium text-zinc-600 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          Total <strong class="text-zinc-900 font-semibold">{{ myOrders.length }}</strong> Kasus
        </span>
      </div>

      <div v-if="loading" class="p-12 text-center text-xs text-zinc-400 font-sans">
        Memuat daftar konsultasi...
      </div>

      <div
        v-else-if="myOrders.length === 0"
        class="p-16 text-center text-xs text-zinc-500 space-y-2"
      >
        <p class="text-base font-bold text-zinc-800">Belum ada permintaan konsultasi</p>
        <p>Permintaan konsultasi baru dari klien akan muncul di sini.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-zinc-50 text-zinc-500 text-xs font-medium border-b border-zinc-200">
            <tr>
              <th class="px-6 py-3.5">Klien</th>
              <th class="px-6 py-3.5">Pokok Kasus</th>
              <th class="px-6 py-3.5">Jadwal Sesi</th>
              <th class="px-6 py-3.5">Status</th>
              <th class="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 text-zinc-700">
            <tr
              v-for="c in myOrders"
              :key="c.id"
              class="hover:bg-zinc-50/70 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-zinc-950">
                {{ c.client_name || '-' }}
              </td>
              <td class="px-6 py-4 max-w-xs truncate font-medium text-zinc-900">
                {{ c.judul_kasus }}
              </td>
              <td class="px-6 py-4 text-xs font-mono whitespace-nowrap">
                {{ c.tanggal_konsultasi?.split('T')[0] }} • {{ c.jam_konsultasi }} WIB
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusBadge(c.status)">
                  {{ c.status?.replace('_', ' ') }}
                </span>
              </td>
              <td class="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                <!-- {Actions Pending} -->
                <template v-if="c.status === 'pending'">
                  <button
                    @click="handleAction(c.id, 'accept')"
                    :disabled="loadingAction"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-colors shadow-2xs disabled:opacity-50"
                  >
                    <Check class="w-3 h-3" />
                    <span>Terima</span>
                  </button>
                  <button
                    @click="handleAction(c.id, 'reject')"
                    :disabled="loadingAction"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold border border-zinc-300 hover:bg-zinc-100 text-zinc-800 rounded-full transition-colors disabled:opacity-50"
                  >
                    <X class="w-3 h-3" />
                    <span>Tolak</span>
                  </button>
                </template>

                <!-- {Actions Meeting Link} -->
                <button
                  v-if="c.status === 'accepted' && c.dp_payment_status === 'paid'"
                  @click="openMeetingModal(c)"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-full transition-colors shadow-2xs"
                >
                  <Video class="w-3 h-3" />
                  <span>Tautan Rapat</span>
                </button>

                <!-- {Actions Complete} -->
                <button
                  v-if="c.status === 'ongoing'"
                  @click="handleAction(c.id, 'complete')"
                  :disabled="loadingAction"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-zinc-900 hover:bg-black text-white rounded-full transition-colors shadow-2xs disabled:opacity-50"
                >
                  <CheckCircle class="w-3 h-3" />
                  <span>Selesaikan</span>
                </button>

                <RouterLink
                  :to="`/consultations/${c.id}`"
                  class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 hover:underline"
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

    <!-- {Meeting Modal} -->
    <div
      v-if="meetingModal"
      class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
    >
      <form
        @submit.prevent="handleSaveMeeting"
        class="bg-white border border-zinc-200 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl text-sm"
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
              Tautan Rapat
            </div>
            <h3 class="font-bold text-lg text-zinc-950 mt-1 tracking-tight">
              Tautan Rapat Konsultasi
            </h3>
            <p class="text-xs text-zinc-500 mt-1">
              Masukkan URL Google Meet atau Zoom untuk sesi klien: <strong>{{ meetingModal.client_name }}</strong>
            </p>
          </div>
          <button
            type="button"
            @click="meetingModal = null"
            class="w-7 h-7 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 flex items-center justify-center transition-colors"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
            URL Rapat
          </label>
          <input
            v-model="meetingLink"
            type="url"
            placeholder="https://meet.google.com/xyz-abcd-efg"
            class="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-zinc-900 shadow-2xs font-mono"
            required
          />
        </div>

        <div class="flex justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            @click="meetingModal = null"
            class="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loadingAction"
            class="px-5 py-2 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-all disabled:opacity-50 shadow-sm"
          >
            {{ loadingAction ? 'Menyimpan...' : 'Simpan & Beritahu Klien' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Check, X, Video, CheckCircle, FileText } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import api from '../utils/axios'
import { toast } from '../composables/useToast'

const { user } = useAuth()

const consultations = ref([])
const loading = ref(true)
const meetingModal = ref(null)
const meetingLink = ref('')
const loadingAction = ref(false)

const fetchConsultations = async () => {
  try {
    loading.value = true
    const res = await api.get('/consultations')
    consultations.value = res.data.data || res.data || []
  } catch (err) {
    toast.error('Gagal memuat konsultasi perkara')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchConsultations()
})

const myOrders = computed(() => {
  return consultations.value.filter(
    (c) => c.lawyer_id === user.value?.id || c.lawyer_name === user.value?.nama
  )
})

const stats = computed(() => [
  {
    label: 'Permintaan Baru',
    count: myOrders.value.filter((c) => c.status === 'pending').length,
    color: 'text-amber-700',
  },
  {
    label: 'Siap Sesi (DP Lunas)',
    count: myOrders.value.filter((c) => c.status === 'accepted' && c.dp_payment_status === 'paid').length,
    color: 'text-blue-700',
  },
  {
    label: 'Konsultasi Berjalan',
    count: myOrders.value.filter((c) => c.status === 'ongoing').length,
    color: 'text-indigo-700',
  },
  {
    label: 'Perkara Selesai',
    count: myOrders.value.filter((c) => c.status === 'completed').length,
    color: 'text-emerald-700',
  },
])

const handleAction = async (id, actionType) => {
  loadingAction.value = true
  try {
    if (actionType === 'accept') {
      await api.patch(`/consultations/${id}/accept`)
    } else if (actionType === 'reject') {
      await api.patch(`/consultations/${id}/status`, { status: 'cancelled' })
    } else if (actionType === 'complete') {
      await api.patch(`/consultations/${id}/complete-case`)
    }
    toast.success('Status perkara berhasil diperbarui')
    await fetchConsultations()
  } catch (err) {
    toast.error('Gagal memproses perubahan status perkara')
  } finally {
    loadingAction.value = false
  }
}

const openMeetingModal = (c) => {
  meetingModal.value = c
  meetingLink.value = c.meeting_link || ''
}

const handleSaveMeeting = async () => {
  if (!meetingLink.value.trim()) {
    toast.error('Masukkan URL video conference rapat')
    return
  }
  loadingAction.value = true
  try {
    await api.patch(`/consultations/${meetingModal.value.id}/add-meeting-link`, {
      meeting_link: meetingLink.value,
    })
    toast.success('Tautan rapat berhasil disimpan')
    meetingModal.value = null
    meetingLink.value = ''
    await fetchConsultations()
  } catch {
    toast.error('Gagal menyimpan tautan rapat')
  } finally {
    loadingAction.value = false
  }
}

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
