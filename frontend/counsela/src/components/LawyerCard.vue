<template>
  <div
    v-if="lawyer"
    class="bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-black hover:-translate-y-0.5 transition-all duration-200 text-zinc-950 group relative"
  >
    <div class="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10 flex items-center gap-1 bg-white/95 sm:bg-zinc-100/90 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full border border-zinc-200/80 shadow-2xs">
      <input
        :id="`compare-${lawyer.id}`"
        type="checkbox"
        :checked="isCompared"
        @change="$emit('toggle-compare', lawyer)"
        class="w-3.5 h-3.5 rounded text-black focus:ring-0 cursor-pointer accent-black"
        aria-label="Pilih untuk komparasi"
      />
      <label :for="`compare-${lawyer.id}`" class="text-[10px] sm:text-[11px] font-medium text-zinc-600 cursor-pointer select-none hidden sm:inline">
        Bandingkan
      </label>
    </div>

    <div class="space-y-2.5 sm:space-y-4 pt-0.5">
      <div class="flex flex-col sm:flex-row items-start gap-2 sm:gap-3.5 sm:pr-20">
        <div class="relative shrink-0">
          <img
            :src="lawyer.foto_profil || defaultAvatar"
            :alt="lawyer.firma_hukum || 'Advokat'"
            @error="handleImgError"
            class="w-11 h-11 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl object-cover border border-zinc-200 bg-zinc-100 shadow-2xs group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
          <span
            v-if="lawyer.status_aktif"
            class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 border-2 border-white"
            title="Aktif Menerima Klien"
          ></span>
        </div>

        <div class="flex-1 min-w-0 w-full">
          <h3 class="font-bold text-xs sm:text-sm text-zinc-950 leading-snug line-clamp-1 group-hover:text-zinc-700 transition-colors">
            {{ lawyer.firma_hukum || 'Firma Hukum' }}
          </h3>

          <p v-if="lawyer.nama && lawyer.nama !== lawyer.firma_hukum" class="text-[11px] text-zinc-700 font-medium truncate hidden sm:block">
            {{ lawyer.nama }}
          </p>

          <p class="text-[10px] sm:text-xs text-zinc-500 truncate mt-0.5 font-medium">
            {{ lawyer.spesialisasi }}
          </p>

          <div class="flex flex-wrap items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
            <span class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200">
              <Star class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-900 fill-zinc-900" />
              <span>{{ Number(lawyer.rating || 5).toFixed(1) }}</span>
            </span>

            <span class="text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
              {{ lawyer.pengalaman || 0 }} Thn
            </span>
          </div>
        </div>
      </div>

      <div class="hidden sm:flex items-center justify-between text-[11px] border-y border-zinc-100 py-2 text-zinc-600 font-medium">
        <span class="flex items-center gap-1.5 text-zinc-800">
          <ShieldCheck class="w-3.5 h-3.5 text-zinc-900" />
          <span>Advokat Berizin Resmi</span>
        </span>
        <span class="text-zinc-400 text-[10px] font-mono">SESI PRIVAT</span>
      </div>

      <div class="py-1.5 px-2.5 sm:py-2.5 sm:px-3.5 bg-zinc-50 border border-zinc-200/80 rounded-xl flex justify-between items-center text-xs">
        <div>
          <span class="text-zinc-400 text-[9px] sm:text-[11px] font-medium block">Tarif Sesi</span>
          <span class="text-[9px] sm:text-[11px] text-zinc-500 hidden sm:block">Sesi 60 Menit</span>
        </div>
        <div class="text-right">
          <span class="font-bold text-zinc-950 text-xs sm:text-sm block">
            Rp {{ formattedFee }}
          </span>
          <span class="text-[9px] sm:text-[10px] font-mono text-zinc-500 hidden sm:block">
            DP 50%: Rp {{ formattedDp }}
          </span>
        </div>
      </div>
    </div>

    <div class="pt-2 sm:pt-1">
      <RouterLink
        :to="`/lawyers/${lawyer.id}`"
        class="sm:hidden block w-full text-center py-2 px-2 text-[11px] font-semibold bg-black text-white hover:bg-zinc-800 rounded-xl transition-all shadow-2xs"
      >
        Lihat Profil
      </RouterLink>

      <div class="hidden sm:grid sm:grid-cols-2 gap-2">
        <RouterLink
          :to="`/lawyers/${lawyer.id}`"
          class="text-center py-2 px-3 text-xs font-semibold border border-zinc-200 hover:border-black hover:bg-zinc-50 text-zinc-900 rounded-xl transition-all"
        >
          Lihat Profil
        </RouterLink>

        <RouterLink
          :to="`/consultation/new?lawyer=${lawyer.id}`"
          class="inline-flex items-center justify-center gap-1.5 text-center py-2 px-3 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-xl transition-all shadow-sm"
        >
          <span>Jadwalkan</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight, ShieldCheck, Star } from '@lucide/vue'

const props = defineProps({
  lawyer: {
    type: Object,
    required: true,
  },
  isCompared: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['toggle-compare'])

const defaultAvatar =
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'

const handleImgError = (e) => {
  e.target.src = defaultAvatar
}

const feeNumber = computed(() => Number(props.lawyer?.tarif_konsultasi || 0))

const formattedFee = computed(() => {
  return feeNumber.value.toLocaleString('id-ID')
})

const formattedDp = computed(() => {
  return Math.floor(feeNumber.value / 2).toLocaleString('id-ID')
})
</script>
