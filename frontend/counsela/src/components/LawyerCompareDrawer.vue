<template>
  <div>
    <!-- {Compare Bar} -->
    <Transition name="slide-up">
      <div
        v-if="selectedLawyers.length > 0"
        class="fixed bottom-20 lg:bottom-6 inset-x-0 z-40 flex justify-center px-4 pointer-events-none"
      >
        <div class="pointer-events-auto bg-black text-white rounded-full p-2.5 sm:px-5 sm:py-3 shadow-2xl border border-zinc-800 flex items-center gap-4 max-w-xl w-full justify-between backdrop-blur-xl">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-full bg-zinc-800 text-white border border-zinc-700 flex items-center justify-center font-mono text-xs font-bold">
              {{ selectedLawyers.length }}/3
            </div>
            <div>
              <p class="text-xs font-semibold text-white">Bandingkan Advokat</p>
              <p class="text-[10px] text-zinc-400 font-mono hidden sm:block">
                Bandingkan tarif, pengalaman, dan bidang keahlian
              </p>
            </div>
          </div>

          <!-- {Thumbnails} -->
          <div class="flex items-center -space-x-2 overflow-hidden">
            <div
              v-for="l in selectedLawyers"
              :key="l.id"
              class="relative w-7 h-7 rounded-full border-2 border-black bg-zinc-800 overflow-hidden shrink-0"
              :title="l.firma_hukum"
            >
              <img :src="l.foto_profil || defaultAvatar" :alt="l.firma_hukum" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="$emit('clear')"
              class="px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Batal
            </button>
            <button
              @click="showModal = true"
              class="px-4 py-1.5 text-xs font-semibold bg-white hover:bg-zinc-200 text-black rounded-full transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Bandingkan</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- {Modal} -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-100"
        @click.self="showModal = false"
      >
        <div class="bg-white border border-zinc-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
          <!-- {Modal Header} -->
          <div class="flex items-center justify-between p-6 border-b border-zinc-200/80 bg-zinc-50/50">
            <div>
              <div class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Perbandingan Advokat
              </div>
              <h2 class="text-xl font-bold text-zinc-950 mt-0.5 tracking-tight">
                Perbandingan Advokat Terpilih
              </h2>
            </div>
            <button
              @click="showModal = false"
              class="w-8 h-8 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-600 flex items-center justify-center transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- {Table Grid} -->
          <div class="p-6 overflow-x-auto">
            <table class="w-full text-xs text-left border-collapse">
              <thead>
                <tr class="border-b border-zinc-200">
                  <th class="py-3 px-4 text-zinc-400 font-mono text-[11px] uppercase w-36">Kriteria</th>
                  <th
                    v-for="l in selectedLawyers"
                    :key="l.id"
                    class="py-3 px-4 text-zinc-950 font-bold text-sm min-w-[200px]"
                  >
                    <div class="flex items-center gap-3">
                      <img
                        :src="l.foto_profil || defaultAvatar"
                        :alt="l.firma_hukum"
                        class="w-10 h-10 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div>
                        <p class="truncate font-bold leading-tight">{{ l.firma_hukum }}</p>
                        <p class="text-[11px] text-zinc-500 font-normal mt-0.5">{{ l.spesialisasi }}</p>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-100">
                <tr>
                  <td class="py-3.5 px-4 font-mono text-[11px] text-zinc-400 uppercase bg-zinc-50/50">Tarif Sesi 60m</td>
                  <td v-for="l in selectedLawyers" :key="l.id" class="py-3.5 px-4 font-bold text-zinc-950 text-sm">
                    Rp {{ Number(l.tarif_konsultasi || 0).toLocaleString('id-ID') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-3.5 px-4 font-mono text-[11px] text-zinc-400 uppercase bg-zinc-50/50">DP 50%</td>
                  <td v-for="l in selectedLawyers" :key="l.id" class="py-3.5 px-4 font-mono text-zinc-900 font-semibold">
                    Rp {{ Math.floor(Number(l.tarif_konsultasi || 0) / 2).toLocaleString('id-ID') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-3.5 px-4 font-mono text-[11px] text-zinc-400 uppercase bg-zinc-50/50">Pengalaman</td>
                  <td v-for="l in selectedLawyers" :key="l.id" class="py-3.5 px-4 font-medium text-zinc-800">
                    {{ l.pengalaman || 0 }} Tahun Praktik
                  </td>
                </tr>
                <tr>
                  <td class="py-3.5 px-4 font-mono text-[11px] text-zinc-400 uppercase bg-zinc-50/50">Rating Klien</td>
                  <td v-for="l in selectedLawyers" :key="l.id" class="py-3.5 px-4">
                    <span class="inline-flex items-center gap-1 font-mono font-semibold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
                      <Star class="w-3 h-3 fill-zinc-900 text-zinc-900" />
                      <span>{{ Number(l.rating || 5).toFixed(1) }}</span>
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="py-3.5 px-4 font-mono text-[11px] text-zinc-400 uppercase bg-zinc-50/50">Ketersediaan</td>
                  <td v-for="l in selectedLawyers" :key="l.id" class="py-3.5 px-4">
                    <span
                      class="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full border"
                      :class="l.status_aktif ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'"
                    >
                      <span class="w-1.5 h-1.5 rounded-full" :class="l.status_aktif ? 'bg-emerald-500' : 'bg-zinc-400'"></span>
                      {{ l.status_aktif ? 'Tersedia Hari Ini' : 'Penuh' }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="py-3.5 px-4 font-mono text-[11px] text-zinc-400 uppercase bg-zinc-50/50">Waktu Respons</td>
                  <td v-for="l in selectedLawyers" :key="l.id" class="py-3.5 px-4 text-zinc-600 font-mono text-[11px]">
                    ~30 Menit
                  </td>
                </tr>
                <tr>
                  <td class="py-4 px-4 bg-zinc-50/50"></td>
                  <td v-for="l in selectedLawyers" :key="l.id" class="py-4 px-4">
                    <RouterLink
                      :to="`/consultation/new?lawyer=${l.id}`"
                      @click="showModal = false"
                      class="inline-flex items-center justify-center gap-1.5 w-full text-center py-2 px-3 bg-black hover:bg-zinc-800 text-white rounded-full font-semibold text-xs transition-all shadow-sm"
                    >
                      <span>Pilih Advokat Ini</span>
                      <ArrowRight class="w-3.5 h-3.5" />
                    </RouterLink>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, Star, ArrowRight } from '@lucide/vue'

defineProps({
  selectedLawyers: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['clear'])

const showModal = ref(false)

const defaultAvatar =
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
