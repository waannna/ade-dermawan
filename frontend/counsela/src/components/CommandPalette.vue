<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-100"
      @click.self="close"
      @keydown.esc="close"
    >
      <div
        class="w-full max-w-xl bg-white border border-zinc-200/90 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-100 flex flex-col max-h-[75vh]"
        role="dialog"
        aria-modal="true"
      >
        <!-- {Search Input} -->
        <div class="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-200/80 bg-zinc-50/50">
          <svg class="w-4 h-4 text-zinc-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="Cari advokat, template dokumen, regulasi, atau menu..."
            class="flex-1 bg-transparent text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
            @keydown.down.prevent="navigateDown"
            @keydown.up.prevent="navigateUp"
            @keydown.enter.prevent="selectCurrent"
          />
          <kbd class="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-white border border-zinc-200 rounded">
            ESC
          </kbd>
        </div>

        <!-- {Filters} -->
        <div class="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-100 bg-white overflow-x-auto text-[11px]">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="px-2.5 py-0.5 rounded-full transition-colors whitespace-nowrap text-xs"
            :class="activeCategory === cat ? 'bg-black text-white font-medium' : 'text-zinc-500 hover:bg-zinc-100'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- {Results} -->
        <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div v-if="filteredItems.length === 0" class="p-8 text-center text-xs text-zinc-400 font-sans">
            Tidak ada hasil untuk "{{ query }}"
          </div>

          <div
            v-for="(item, idx) in filteredItems"
            :key="item.id || idx"
            @click="triggerItem(item)"
            @mouseenter="selectedIndex = idx"
            class="flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors text-xs"
            :class="selectedIndex === idx ? 'bg-zinc-100 text-zinc-950 font-medium' : 'text-zinc-700 hover:bg-zinc-50'"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200/80 flex items-center justify-center shrink-0">
                <svg v-if="item.type === 'action'" class="w-3.5 h-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                <svg v-else-if="item.type === 'lawyer'" class="w-3.5 h-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <svg v-else-if="item.type === 'doc'" class="w-3.5 h-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <svg v-else class="w-3.5 h-3.5 text-zinc-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="truncate">{{ item.title }}</span>
                  <span
                    v-if="item.badge"
                    class="text-[10px] font-medium px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700 shrink-0"
                  >
                    {{ item.badge }}
                  </span>
                </div>
                <p class="text-[11px] text-zinc-400 font-normal truncate mt-0.5">{{ item.subtitle }}</p>
              </div>
            </div>

            <span class="text-xs text-zinc-400 shrink-0 font-medium">
              {{ item.actionLabel || 'Buka' }} ↵
            </span>
          </div>
        </div>

        <!-- {Shortcuts} -->
        <div class="px-4 py-2.5 bg-zinc-50 border-t border-zinc-200/80 flex items-center justify-between text-[11px] text-zinc-500">
          <div class="flex items-center gap-3">
            <span>↑↓ Navigasi</span>
            <span>↵ Buka</span>
            <span>Esc Tutup</span>
          </div>
          <span class="font-medium text-zinc-700">Counsela Search</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import lawyerService from '../service/lawyerService'

const router = useRouter()
const isOpen = ref(false)
const query = ref('')
const selectedIndex = ref(0)
const inputRef = ref(null)
const activeCategory = ref('Semua')

const categories = ['Semua', 'Aksi Cepat', 'Advokat', 'Draf Dokumen', 'Pasal UU']

const items = ref([
  { category: 'Aksi Cepat', type: 'action', title: 'Jadwalkan Konsultasi Baru', subtitle: 'Pilih advokat dan mulai konsultasi hukum', route: '/consultation/new', actionLabel: 'Buka' },
  { category: 'Aksi Cepat', type: 'action', title: 'Daftar Konsultasi', subtitle: 'Pantau status dan jadwal konsultasi Anda', route: '/consultations', actionLabel: 'Buka' },
  { category: 'Aksi Cepat', type: 'action', title: 'Daftar Advokat', subtitle: 'Cari advokat terverifikasi berdasarkan bidang', route: '/lawyers', actionLabel: 'Buka' },
  { category: 'Aksi Cepat', type: 'action', title: 'Tentang Kami & Landasan Hukum', subtitle: 'Informasi kode etik dan perlindungan hukum klien', route: '/about', actionLabel: 'Lihat' },

  { category: 'Draf Dokumen', type: 'doc', title: 'Surat Somasi Teguran Hukum', subtitle: 'Peringatan resmi wanprestasi & pelanggaran kontrak', route: '/?doc=somasi#document-vault', actionLabel: 'Draf' },
  { category: 'Draf Dokumen', type: 'doc', title: 'Perjanjian Kerahasiaan (NDA)', subtitle: 'Proteksi rahasia dagang & data eksklusif bisnis', route: '/?doc=nda#document-vault', actionLabel: 'Draf' },
  { category: 'Draf Dokumen', type: 'doc', title: 'Perjanjian Kerja Waktu Tertentu (PKWT)', subtitle: 'Sesuai regulasi UU Ketenagakerjaan terbaru', route: '/?doc=pkwt#document-vault', actionLabel: 'Draf' },
  { category: 'Draf Dokumen', type: 'doc', title: 'Surat Kuasa Khusus Litigasi', subtitle: 'Pemberian kuasa resmi perwakilan di pengadilan', route: '/?doc=kuasa#document-vault', actionLabel: 'Draf' },

  { category: 'Pasal UU', type: 'law', title: 'Pasal 19 UU No. 18/2003 (UU Advokat)', subtitle: 'Kewajiban menjaga rahasia hubungan advokat-klien', route: '/about#pasal-19', actionLabel: 'Pasal' },
  { category: 'Pasal UU', type: 'law', title: 'Pasal 1320 & 1338 KUHPerdata', subtitle: 'Syarat sah perjanjian & asas pacta sunt servanda', route: '/about#kuhperdata', actionLabel: 'Pasal' },
  { category: 'Pasal UU', type: 'law', title: 'Pasal 1243 KUHPerdata (Wanprestasi)', subtitle: 'Ganti rugi akibat kelalaian kewajiban perikatan', route: '/about#wanprestasi', actionLabel: 'Pasal' },
])

const filteredItems = computed(() => {
  let list = items.value

  if (activeCategory.value !== 'Semua') {
    list = list.filter((i) => i.category === activeCategory.value)
  }

  if (query.value.trim()) {
    const q = query.value.toLowerCase().trim()
    list = list.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.subtitle.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q)
    )
  }

  return list
})

watch(filteredItems, () => {
  selectedIndex.value = 0
})

const open = () => {
  isOpen.value = true
  query.value = ''
  selectedIndex.value = 0
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const close = () => {
  isOpen.value = false
}

const navigateDown = () => {
  if (selectedIndex.value < filteredItems.value.length - 1) {
    selectedIndex.value++
  } else {
    selectedIndex.value = 0
  }
}

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  } else {
    selectedIndex.value = filteredItems.value.length - 1
  }
}

const selectCurrent = () => {
  const item = filteredItems.value[selectedIndex.value]
  if (item) triggerItem(item)
}

const triggerItem = (item) => {
  close()
  if (item.route) {
    router.push(item.route)
  }
}

const handleKeyDown = (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    if (isOpen.value) close()
    else open()
  }
}

const loadRealLawyers = async () => {
  try {
    const list = await lawyerService.getAllLawyers()
    if (Array.isArray(list)) {
      const lawyerItems = list.map((l) => ({
        category: 'Advokat',
        type: 'lawyer',
        title: l.nama || l.user_name || l.firma_hukum || 'Advokat Berlisensi',
        subtitle: `${l.spesialisasi || 'Hukum'} • ${l.firma_hukum || 'Praktisi Hukum'}`,
        badge: l.rating && Number(l.rating) > 0 ? `Rating ${Number(l.rating).toFixed(1)}` : `${l.pengalaman || 0} Thn Praktik`,
        route: `/lawyers/${l.id}`,
        actionLabel: 'Profil',
      }))
      items.value = [
        ...items.value.filter((i) => i.category !== 'Advokat'),
        ...lawyerItems,
      ]
    }
  } catch (err) {
    console.error('Failed to load lawyers for palette:', err)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('open-counsela-palette', open)
  loadRealLawyers()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('open-counsela-palette', open)
})

defineExpose({ open, close })
</script>
