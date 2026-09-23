<template>
  <div class="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-100">
    <div
      class="bg-white border border-zinc-200 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-xl text-sm"
      role="dialog"
      aria-modal="true"
    >
      <div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-zinc-500 tracking-wide">Ulasan Konsultasi</span>
          <button @click="$emit('close')" class="text-zinc-400 hover:text-black p-1 rounded-full">
            <X class="w-4 h-4" />
          </button>
        </div>
        <h3 class="font-bold text-base text-zinc-950 mt-1">
          Beri Ulasan Advokat
        </h3>
        <p class="text-xs text-zinc-500 mt-0.5 truncate">{{ consultation?.judul_kasus }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-zinc-800 mb-2">
            Tingkat Kepuasan Layanan
          </label>
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="rating = star"
              class="w-10 h-10 rounded-2xl text-xs font-mono font-bold border transition-all flex items-center justify-center gap-1"
              :class="star <= rating ? 'bg-black text-white border-black shadow-sm' : 'border-zinc-200 text-zinc-400 hover:bg-zinc-50'"
            >
              <Star class="w-3.5 h-3.5" :class="star <= rating ? 'fill-white text-white' : 'text-zinc-400'" />
              <span>{{ star }}</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-zinc-800 mb-1.5">
            Komentar & Pengalaman Konsultasi
          </label>
          <textarea
            v-model="komentar"
            rows="3"
            placeholder="Tuliskan pengalaman konsultasi Anda dengan jelas dan objektif..."
            class="w-full text-xs px-3.5 py-2.5 border rounded-2xl border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black resize-none shadow-2xs"
            required
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-zinc-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-5 py-2 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-colors disabled:opacity-50 shadow-2xs"
          >
            {{ submitting ? 'Mengirim...' : 'Kirim Ulasan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Star, X } from 'lucide-vue-next'
import api from '../utils/axios'
import { toast } from '../composables/useToast'

const props = defineProps({
  consultation: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'success'])

const rating = ref(5)
const komentar = ref('')
const submitting = ref(false)

const handleSubmit = async () => {
  if (!komentar.value.trim()) {
    toast.error('Mohon tulis ulasan pengalaman Anda')
    return
  }

  submitting.value = true
  try {
    await api.post('/reviews', {
      consultation_id: props.consultation.id,
      rating: rating.value,
      komentar: komentar.value,
    })
    toast.success('Ulasan berhasil dikirim')
    emit('success')
    emit('close')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal mengirim ulasan')
  } finally {
    submitting.value = false
  }
}
</script>
