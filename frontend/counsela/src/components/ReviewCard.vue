<template>
  <div class="bg-white border border-zinc-200 rounded-2xl p-4 space-y-2 text-xs shadow-2xs">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2.5">
        <div class="w-6 h-6 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center font-bold text-xs uppercase font-mono">
          {{ clientInitial }}
        </div>
        <span class="font-semibold text-zinc-900 text-xs">{{ client || 'Klien Terverifikasi' }}</span>
      </div>
      <span class="inline-flex items-center gap-1 font-mono font-semibold text-xs bg-zinc-100 text-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200">
        <Star class="w-3 h-3 text-zinc-900 fill-zinc-900" />
        <span>{{ Number(rating || 5).toFixed(1) }}</span>
      </span>
    </div>

    <p class="text-zinc-600 leading-relaxed pl-8 text-xs">
      "{{ comment }}"
    </p>

    <div v-if="date" class="text-[10px] font-mono text-zinc-400 pl-8 pt-0.5">
      {{ date }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Star } from 'lucide-vue-next'

const props = defineProps({
  client: { type: String, default: '' },
  rating: { type: [Number, String], default: 5 },
  comment: { type: String, default: '' },
  date: { type: String, default: '' },
})

const clientInitial = computed(() => {
  return props.client?.charAt(0)?.toUpperCase() || 'K'
})
</script>
