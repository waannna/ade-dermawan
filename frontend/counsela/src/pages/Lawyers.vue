<template>
  <div class="space-y-8 text-zinc-950">
    <!-- {Header} -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-6 border-b border-zinc-200/90">
      <div>
        <div class="text-xs font-semibold text-zinc-500 tracking-wide">
          Direktori Advokat
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mt-1">
          Direktori Advokat
        </h1>
        <p class="text-xs text-zinc-500 mt-1 max-w-xl">
          Temukan advokat sesuai bidang hukum, bandingkan profil, dan jadwalkan konsultasi.
        </p>
      </div>

      <!-- {Search} -->
      <div class="w-full sm:w-80">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Cari firma, advokat, spesialisasi..."
            class="w-full text-xs px-4 py-2.5 pl-9 rounded-full border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black shadow-2xs"
          />
          <svg class="w-3.5 h-3.5 absolute left-3.5 top-3 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="absolute right-3.5 top-2.5 text-zinc-400 hover:text-zinc-700 flex items-center justify-center p-0.5 cursor-pointer"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- {Filter Bar} -->
    <div class="bg-white border border-zinc-200/90 rounded-2xl p-4 shadow-2xs space-y-4">
      <!-- {Categories} -->
      <div class="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div class="flex flex-wrap items-center gap-1.5 min-w-max">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="selectedCategory = cat"
            class="px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
            :class="selectedCategory === cat
              ? 'bg-black text-white font-semibold shadow-2xs'
              : 'bg-zinc-100/80 text-zinc-700 hover:bg-zinc-200/70'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- {View Mode} -->
        <div class="flex items-center gap-1 bg-zinc-100 p-1 rounded-full border border-zinc-200 shrink-0">
          <button
            @click="viewMode = 'grid'"
            class="px-3 py-1 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            :class="viewMode === 'grid' ? 'bg-white text-black shadow-2xs' : 'text-zinc-500 hover:text-black'"
            title="Tampilan Grid"
          >
            <LayoutGrid class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Grid</span>
          </button>
          <button
            @click="viewMode = 'table'"
            class="px-3 py-1 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            :class="viewMode === 'table' ? 'bg-white text-black shadow-2xs' : 'text-zinc-500 hover:text-black'"
            title="Tampilan Tabel"
          >
            <List class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Tabel</span>
          </button>
        </div>
      </div>

      <!-- {Controls} -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-zinc-100 text-xs">
        <div class="flex flex-wrap items-center gap-4">
          <!-- {Availability} -->
          <label class="flex items-center gap-2 cursor-pointer select-none text-zinc-700 font-medium">
            <input
              type="checkbox"
              v-model="onlyAvailable"
              class="w-3.5 h-3.5 rounded text-black accent-black cursor-pointer"
            />
            <span>Hanya yang siap menerima konsultasi</span>
          </label>

          <!-- {Experience} -->
          <div class="flex items-center gap-1.5 text-zinc-600">
            <span class="text-xs text-zinc-500 font-medium">Pengalaman:</span>
            <select
              v-model.number="minExperience"
              class="p-1 px-2 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-medium cursor-pointer"
            >
              <option :value="0">Semua</option>
              <option :value="5">&gt; 5 Tahun</option>
              <option :value="10">&gt; 10 Tahun</option>
              <option :value="15">&gt; 15 Tahun</option>
            </select>
          </div>
        </div>

        <!-- {Sort} -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-zinc-500 font-medium">Urutkan:</span>
          <select
            v-model="sortBy"
            class="text-xs font-medium px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="rating">Rating Tertinggi</option>
            <option value="pengalaman">Pengalaman Terlama</option>
            <option value="tarif_asc">Tarif Terendah</option>
            <option value="tarif_desc">Tarif Tertinggi</option>
          </select>
        </div>
      </div>
    </div>

    <!-- {Counter} -->
    <div class="flex flex-wrap items-center justify-between text-xs text-zinc-500">
      <div class="flex items-center gap-2">
        <span>Menampilkan <strong class="text-zinc-900 font-semibold">{{ filteredAndSortedLawyers.length }}</strong> dari <strong class="text-zinc-900 font-semibold">{{ lawyers.length }}</strong> advokat</span>
        <button v-if="selectedCategory !== 'Semua Bidang' || searchTerm || onlyAvailable || minExperience > 0" class="text-black font-semibold hover:underline ml-2 cursor-pointer" @click="resetFilters">
          Reset Filter
        </button>
      </div>
      <span class="text-zinc-400 hidden sm:inline">Pilih centang bandingkan untuk komparasi profil</span>
    </div>

    <!-- {Loading} -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
      <div
        v-for="i in 6"
        :key="i"
        class="h-56 sm:h-64 bg-zinc-100 rounded-2xl sm:rounded-3xl animate-pulse border border-zinc-200"
      ></div>
    </div>

    <!-- {Empty} -->
    <div
      v-else-if="paginatedLawyers.length === 0"
      class="p-16 text-center bg-white border border-zinc-200 rounded-3xl text-xs text-zinc-500 space-y-3"
    >
      <p class="text-base font-bold text-zinc-900">Tidak ada advokat yang memenuhi kriteria</p>
      <p class="max-w-md mx-auto">
        Kombinasi filter yang Anda pilih saat ini belum memiliki kecocokan data.
      </p>
      <button
        @click="resetFilters"
        class="px-5 py-2 text-xs font-semibold bg-black text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
      >
        Tampilkan Semua Advokat
      </button>
    </div>

    <!-- {Grid View} -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
      <LawyerCard
        v-for="lawyer in paginatedLawyers"
        :key="lawyer.id"
        :lawyer="lawyer"
        :is-compared="isCompared(lawyer.id)"
        @toggle-compare="handleToggleCompare"
      />
    </div>

    <!-- {Table View} -->
    <div v-else-if="viewMode === 'table'" class="bg-white border border-zinc-200/90 rounded-2xl overflow-hidden shadow-2xs">
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left border-collapse">
          <thead>
            <tr class="bg-zinc-50 border-b border-zinc-200 text-xs font-medium text-zinc-500">
              <th class="py-3 px-4 w-12 text-center">Pilih</th>
              <th class="py-3 px-4">Advokat & Firma</th>
              <th class="py-3 px-4">Spesialisasi</th>
              <th class="py-3 px-4">Pengalaman</th>
              <th class="py-3 px-4">Rating</th>
              <th class="py-3 px-4">Tarif Sesi</th>
              <th class="py-3 px-4">Status</th>
              <th class="py-3 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100">
            <tr
              v-for="l in paginatedLawyers"
              :key="l.id"
              class="hover:bg-zinc-50/70 transition-colors"
            >
              <!-- {Checkbox} -->
              <td class="py-3 px-4 text-center">
                <input
                  type="checkbox"
                  :checked="isCompared(l.id)"
                  @change="handleToggleCompare(l)"
                  class="w-3.5 h-3.5 rounded accent-black cursor-pointer"
                />
              </td>

              <!-- {Lawyer} -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <img
                    :src="l.foto_profil || defaultAvatar"
                    :alt="l.firma_hukum"
                    class="w-9 h-9 rounded-xl object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                  />
                  <div>
                    <RouterLink :to="`/lawyers/${l.id}`" class="font-bold text-zinc-950 hover:underline block leading-snug">
                      {{ l.firma_hukum }}
                    </RouterLink>
                    <span class="text-[11px] font-mono text-zinc-400 block">#ADV-{{ String(l.id).padStart(3, '0') }}</span>
                  </div>
                </div>
              </td>

              <!-- {Specialty} -->
              <td class="py-3 px-4 font-medium text-zinc-800">
                {{ l.spesialisasi }}
              </td>

              <!-- {Experience} -->
              <td class="py-3 px-4 text-zinc-600">
                {{ l.pengalaman || 0 }} Tahun
              </td>

              <!-- {Rating} -->
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 font-mono font-semibold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200 text-[11px]">
                  <Star class="w-3 h-3 fill-zinc-900 text-zinc-900" />
                  <span>{{ Number(l.rating || 5).toFixed(1) }}</span>
                </span>
              </td>

              <!-- {Fee} -->
              <td class="py-3 px-4">
                <span class="font-bold text-zinc-950 block">
                  Rp {{ Number(l.tarif_konsultasi || 0).toLocaleString('id-ID') }}
                </span>
                <span class="text-[11px] text-zinc-400">
                  DP 50%: Rp {{ Math.floor(Number(l.tarif_konsultasi || 0) / 2).toLocaleString('id-ID') }}
                </span>
              </td>

              <!-- {Status} -->
              <td class="py-3 px-4">
                <span
                  class="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                  :class="l.status_aktif ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-zinc-100 text-zinc-400 border border-zinc-200'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="l.status_aktif ? 'bg-emerald-500' : 'bg-zinc-400'"></span>
                  {{ l.status_aktif ? 'Aktif' : 'Penuh' }}
                </span>
              </td>

              <!-- {Action} -->
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <RouterLink
                    :to="`/lawyers/${l.id}`"
                    class="px-2.5 py-1 text-xs font-medium border border-zinc-200 hover:bg-zinc-100 text-zinc-700 rounded-full transition-colors"
                  >
                    Lihat Profil
                  </RouterLink>
                  <RouterLink
                    :to="`/consultation/new?lawyer=${l.id}`"
                    class="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black hover:bg-zinc-800 text-white rounded-full transition-colors shadow-2xs"
                  >
                    <span>Pilih Advokat</span>
                    <ArrowRight class="w-3 h-3" />
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- {Pagination} -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 pt-6 border-t border-zinc-200">
      <button
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="px-3.5 py-1.5 rounded-full text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        Sebelumnya
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="w-8 h-8 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer"
          :class="currentPage === page
            ? 'bg-black text-white shadow-2xs'
            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'"
        >
          {{ page }}
        </button>
      </div>

      <button
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="px-3.5 py-1.5 rounded-full text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      >
        Selanjutnya
      </button>
    </div>

    <!-- {Compare Drawer} -->
    <LawyerCompareDrawer
      :selected-lawyers="comparedLawyers"
      @clear="comparedLawyers = []"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { LayoutGrid, List, Star, X, ArrowRight } from '@lucide/vue'
import lawyerService from '../service/lawyerService'
import LawyerCard from '../components/LawyerCard.vue'
import LawyerCompareDrawer from '../components/LawyerCompareDrawer.vue'

const route = useRoute()

const lawyers = ref([])
const loading = ref(true)
const searchTerm = ref('')
const selectedCategory = ref('Semua Bidang')
const sortBy = ref('rating')
const viewMode = ref('grid')
const onlyAvailable = ref(false)
const minExperience = ref(0)
const currentPage = ref(1)
const itemsPerPage = 9
const comparedLawyers = ref([])

const defaultAvatar =
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'

const categories = [
  'Semua Bidang',
  'Bisnis & Korporasi',
  'Pidana',
  'Perdata',
  'Ketenagakerjaan',
  'Kekayaan Intelektual',
  'Properti',
]

const isCompared = (id) => comparedLawyers.value.some((l) => l.id === id)

const handleToggleCompare = (lawyer) => {
  const idx = comparedLawyers.value.findIndex((l) => l.id === lawyer.id)
  if (idx > -1) {
    comparedLawyers.value.splice(idx, 1)
  } else {
    if (comparedLawyers.value.length >= 3) {
      alert('Maksimal komparasi 3 advokat sekaligus.')
      return
    }
    comparedLawyers.value.push(lawyer)
  }
}

const resetFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = 'Semua Bidang'
  sortBy.value = 'rating'
  onlyAvailable.value = false
  minExperience.value = 0
  currentPage.value = 1
}

onMounted(async () => {
  if (route.query.domain) {
    const d = route.query.domain
    if (d.includes('Bisnis') || d.includes('Korporasi')) selectedCategory.value = 'Bisnis & Korporasi'
    else if (d.includes('Pidana')) selectedCategory.value = 'Pidana'
    else if (d.includes('Ketenagakerjaan')) selectedCategory.value = 'Ketenagakerjaan'
    else if (d.includes('Properti') || d.includes('Lahan')) selectedCategory.value = 'Properti'
    else if (d.includes('Intelektual') || d.includes('HKI')) selectedCategory.value = 'Kekayaan Intelektual'
    else searchTerm.value = d
  }

  try {
    loading.value = true
    const res = await lawyerService.getAllLawyers()
    lawyers.value = Array.isArray(res) ? res : []
  } catch (err) {
    console.error('Failed to load lawyers:', err)
  } finally {
    loading.value = false
  }
})

watch([searchTerm, selectedCategory, sortBy, onlyAvailable, minExperience], () => {
  currentPage.value = 1
})

const filteredAndSortedLawyers = computed(() => {
  let list = [...lawyers.value]

  if (selectedCategory.value !== 'Semua Bidang') {
    const cat = selectedCategory.value.toLowerCase()
    list = list.filter((l) => l.spesialisasi?.toLowerCase().includes(cat))
  }

  if (searchTerm.value.trim()) {
    const q = searchTerm.value.toLowerCase().trim()
    list = list.filter(
      (l) =>
        l.firma_hukum?.toLowerCase().includes(q) ||
        l.spesialisasi?.toLowerCase().includes(q) ||
        l.deskripsi?.toLowerCase().includes(q) ||
        l.nama?.toLowerCase().includes(q)
    )
  }

  if (onlyAvailable.value) {
    list = list.filter((l) => l.status_aktif)
  }

  if (minExperience.value > 0) {
    list = list.filter((l) => Number(l.pengalaman || 0) >= minExperience.value)
  }

  if (sortBy.value === 'rating') {
    list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
  } else if (sortBy.value === 'pengalaman') {
    list.sort((a, b) => Number(b.pengalaman || 0) - Number(a.pengalaman || 0))
  } else if (sortBy.value === 'tarif_asc') {
    list.sort((a, b) => Number(a.tarif_konsultasi || 0) - Number(b.tarif_konsultasi || 0))
  } else if (sortBy.value === 'tarif_desc') {
    list.sort((a, b) => Number(b.tarif_konsultasi || 0) - Number(a.tarif_konsultasi || 0))
  }

  return list
})

const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedLawyers.value.length / itemsPerPage)
})

const paginatedLawyers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredAndSortedLawyers.value.slice(start, start + itemsPerPage)
})
</script>
