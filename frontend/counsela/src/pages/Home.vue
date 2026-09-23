<template>
  <div class="space-y-16 sm:space-y-20 py-4 text-zinc-950">
    <!-- {Hero} -->
    <section class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <!-- {Left Column} -->
      <div class="lg:col-span-7 space-y-6">
        <h1 class="text-4xl sm:text-6xl font-bold tracking-tighter text-zinc-950 leading-[1.06]">
          Konsultasi hukum online.<br />
          <span class="text-zinc-400">Mudah, aman & terpercaya.</span>
        </h1>

        <p class="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl font-normal">
          Dapatkan pendampingan dan konsultasi hukum langsung dari advokat resmi. Kerahasiaan data terjaga dengan sistem pembayaran bertahap (DP 50%).
        </p>

        <!-- {Actions} -->
        <div class="flex flex-wrap items-center gap-3 pt-2">
          <RouterLink
            :to="isAuthenticated ? '/consultation/new' : '/register'"
            class="px-6 py-3.5 text-xs sm:text-sm font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-all shadow-sm flex items-center gap-2"
          >
            <span>{{ isAuthenticated ? 'Jadwalkan Konsultasi' : 'Mulai Konsultasi' }}</span>
            <ArrowRight class="w-4 h-4" />
          </RouterLink>

          <RouterLink
            to="/lawyers"
            class="px-5 py-3.5 text-xs sm:text-sm font-semibold bg-white border border-zinc-200 hover:border-black hover:bg-zinc-50 text-zinc-900 rounded-full transition-all"
          >
            Direktori Advokat ({{ lawyers.length }})
          </RouterLink>

          <button
            @click="triggerPalette"
            class="px-4 py-3.5 text-xs font-mono font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-full border border-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Buka Pencarian Cepat"
          >
            <span>⌘K</span>
            <span class="text-[11px] font-sans text-zinc-500">Pencarian Cepat</span>
          </button>
        </div>

        <!-- {Highlights} -->
        <div class="grid grid-cols-3 gap-3 pt-6 border-t border-zinc-200/80 text-xs">
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5 font-semibold text-zinc-950">
              <ShieldCheck class="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>Kerahasiaan Terjamin</span>
            </div>
            <p class="text-[11px] text-zinc-500 leading-snug">Privasi data terlindungi</p>
          </div>
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5 font-semibold text-zinc-950">
              <Scale class="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>Advokat Berizin</span>
            </div>
            <p class="text-[11px] text-zinc-500 leading-snug">Terdaftar & berpengalaman</p>
          </div>
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5 font-semibold text-zinc-950">
              <CheckCircle2 class="w-3.5 h-3.5 text-zinc-900 shrink-0" />
              <span>Pembayaran Bertahap</span>
            </div>
            <p class="text-[11px] text-zinc-500 leading-snug">DP 50%, sisa setelah sesi</p>
          </div>
        </div>

        <!-- {Domains} -->
        <div class="pt-2">
          <p class="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2">
            BIDANG HUKUM:
          </p>
          <div class="flex flex-wrap gap-1.5">
            <RouterLink
              v-for="domain in popularDomains"
              :key="domain"
              :to="`/lawyers?domain=${encodeURIComponent(domain)}`"
              class="px-3 py-1 rounded-full text-xs bg-white hover:bg-black hover:text-white border border-zinc-200 text-zinc-700 transition-all font-medium"
            >
              {{ domain }}
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- {Triage} -->
      <div class="lg:col-span-5 bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-black"></span>
            <h3 class="text-xs font-semibold tracking-tight text-zinc-900">
              Panduan Awal Masalah Hukum
            </h3>
          </div>
          <span class="text-[11px] font-medium text-zinc-500">Saran Langkah</span>
        </div>

        <p class="text-xs text-zinc-500 leading-relaxed">
          Pilih bidang masalah dan tahapan kasus Anda untuk melihat saran langkah awal:
        </p>

        <!-- {Topic} -->
        <div class="space-y-1.5">
          <label class="text-[11px] text-zinc-500 block font-medium">1. Bidang Permasalahan</label>
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="t in triageOptions"
              :key="t.id"
              @click="activeTriage = t"
              class="p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer"
              :class="activeTriage.id === t.id
                ? 'bg-black text-white font-semibold border-black shadow-sm'
                : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'"
            >
              <span class="font-medium block leading-tight">{{ t.name }}</span>
            </button>
          </div>
        </div>

        <!-- {Stage} -->
        <div class="space-y-1.5">
          <label class="text-[11px] text-zinc-500 block font-medium">2. Tahapan Kasus Saat Ini</label>
          <select
            v-model="selectedStage"
            class="w-full text-xs font-medium p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:border-black cursor-pointer"
          >
            <option value="pencegahan">Pencegahan / Draf Kontrak Baru</option>
            <option value="somasi">Telah Menerima Somasi / Teguran</option>
            <option value="negosiasi_macet">Musyawarah Gagal</option>
            <option value="litigasi">Persiapan Gugatan / Sidang</option>
          </select>
        </div>

        <!-- {Output} -->
        <div class="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2 text-xs">
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-zinc-950 font-bold font-mono">{{ activeTriage.law }}</span>
            <span class="text-zinc-500">{{ activeTriage.sla }}</span>
          </div>
          <p class="text-zinc-800 font-medium leading-relaxed">
            {{ activeTriage.stages[selectedStage] || activeTriage.stages['pencegahan'] }}
          </p>
          <div class="pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px]">
            <span class="text-zinc-500">{{ getLawyerCount(activeTriage.id) }} Advokat Tersedia</span>
            <RouterLink
              :to="`/lawyers?domain=${encodeURIComponent(activeTriage.name)}`"
              class="font-semibold text-black hover:underline inline-flex items-center gap-1"
            >
              <span>Pilih Advokat</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- {Fee Calculator} -->
    <section class="border border-zinc-200/90 rounded-3xl p-6 sm:p-8 bg-white shadow-sm space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-zinc-100 pb-4">
        <div>
          <span class="text-xs font-semibold text-zinc-500 block">
            Perkiraan Biaya
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mt-1">
            Simulasi Biaya Konsultasi
          </h2>
          <p class="text-xs text-zinc-500 mt-1">
            Sistem pembayaran bertahap. DP 50% di awal dan pelunasan dilakukan setelah sesi selesai.
          </p>
        </div>
        <span class="text-xs px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-full text-zinc-700 font-medium">
          Skema DP 50%
        </span>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 items-center">
        <!-- {Controls} -->
        <div class="lg:col-span-7 space-y-6">
          <!-- {Services} -->
          <div class="space-y-2">
            <label class="text-xs font-semibold text-zinc-700">Pilih Jenis Layanan Hukum:</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="svc in serviceTypes"
                :key="svc.id"
                @click="selectedService = svc"
                class="p-3 text-center rounded-2xl border text-xs transition-all cursor-pointer"
                :class="selectedService.id === svc.id
                  ? 'bg-black text-white font-semibold border-black shadow-sm'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'"
              >
                <span class="block text-xs font-bold">{{ svc.name }}</span>
                <span class="text-[11px] text-zinc-400 block mt-1">{{ svc.duration }}</span>
              </button>
            </div>
          </div>

          <!-- {Complexity} -->
          <div class="space-y-2 pt-2">
            <div class="flex justify-between items-center text-xs">
              <label class="text-xs font-semibold text-zinc-700">Tingkat Kompleksitas Perkara:</label>
              <span class="font-semibold text-zinc-900">{{ complexityLabels[complexityLevel] }}</span>
            </div>
            <input
              type="range"
              min="1"
              max="4"
              v-model.number="complexityLevel"
              class="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-black"
            />
            <div class="flex justify-between text-[11px] text-zinc-500">
              <span>Sederhana</span>
              <span>Menengah</span>
              <span>Komersial</span>
              <span>Litigasi Penuh</span>
            </div>
          </div>
        </div>

        <!-- {Summary} -->
        <div class="lg:col-span-5 p-6 bg-zinc-950 text-white rounded-3xl border border-zinc-800 space-y-5">
          <div class="flex justify-between items-center border-b border-zinc-800 pb-3">
            <span class="text-xs font-semibold text-zinc-400">
              Rincian Pembayaran
            </span>
            <span class="text-xs text-emerald-400 font-medium">Aman & Terpercaya</span>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex justify-between items-baseline">
              <span class="text-zinc-400">Estimasi Total Biaya:</span>
              <span class="text-2xl font-bold text-white tracking-tight">
                Rp {{ calculatedTotal.toLocaleString('id-ID') }}
              </span>
            </div>
            <div class="flex justify-between text-zinc-300">
              <span>Pembayaran Awal (DP 50%):</span>
              <span class="font-bold font-mono">Rp {{ Math.floor(calculatedTotal / 2).toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between text-zinc-400">
              <span>Pelunasan Setelah Sesi Konsultasi:</span>
              <span class="font-mono">Rp {{ Math.floor(calculatedTotal / 2).toLocaleString('id-ID') }}</span>
            </div>
          </div>

          <RouterLink
            to="/lawyers"
            class="inline-flex items-center justify-center gap-1.5 w-full text-center py-3 bg-white hover:bg-zinc-200 text-black rounded-full font-semibold text-xs transition-colors"
          >
            <span>Pilih Advokat untuk Layanan Ini</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- {Documents} -->
    <section id="document-vault" class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-zinc-200 pb-4">
        <div>
          <span class="text-xs font-semibold text-zinc-500 block">
            Contoh Dokumen
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight mt-1">
            Contoh Dokumen & Surat Perjanjian
          </h2>
          <p class="text-xs text-zinc-500 mt-1">
            Kumpulan contoh format dokumen hukum yang dapat Anda gunakan sebagai referensi.
          </p>
        </div>
        <span class="text-xs text-zinc-600 font-medium px-3 py-1 bg-zinc-100 rounded-full border border-zinc-200">
          Format Standar
        </span>
      </div>

      <div class="grid lg:grid-cols-12 gap-6 items-start">
        <!-- {Selector} -->
        <div class="lg:col-span-4 space-y-2">
          <button
            v-for="doc in documentTemplates"
            :key="doc.id"
            @click="activeDoc = doc"
            class="w-full text-left p-4 rounded-2xl border transition-all text-xs cursor-pointer"
            :class="activeDoc.id === doc.id
              ? 'bg-black text-white font-semibold border-black shadow-sm'
              : 'bg-white border-zinc-200 text-zinc-800 hover:bg-zinc-50'"
          >
            <div class="flex items-center justify-between">
              <span class="font-mono text-[11px] opacity-70">{{ doc.code }}</span>
            </div>
            <h4 class="font-bold text-sm mt-1 tracking-tight">{{ doc.title }}</h4>
            <p class="text-[11px] opacity-80 mt-1 font-normal line-clamp-2">{{ doc.desc }}</p>
          </button>
        </div>

        <!-- {Preview} -->
        <div class="lg:col-span-8 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 relative">
          <div class="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <span class="text-[11px] text-zinc-400 block font-medium">
                Kode Dokumen: {{ activeDoc.code }}
              </span>
              <h3 class="text-lg font-bold text-zinc-950 mt-0.5 tracking-tight">
                {{ activeDoc.title }}
              </h3>
            </div>
            <span class="text-[11px] px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium">
              Format Standar
            </span>
          </div>

          <div class="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80 font-mono text-xs text-zinc-800 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto">
            {{ activeDoc.sampleText }}
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span class="text-[11px] text-zinc-500 font-mono">
              Dapat dibahas bersama advokat saat sesi konsultasi.
            </span>
            <div class="flex items-center gap-2">
              <button
                @click="copyDocSample"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border border-zinc-200 rounded-full hover:bg-zinc-100 text-zinc-700 transition-colors cursor-pointer"
              >
                <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5 text-zinc-500" />
                <span>{{ copied ? 'Tersalin ke Clipboard' : 'Salin Draf Teks' }}</span>
              </button>
              <RouterLink
                to="/consultation/new"
                class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-colors shadow-sm"
              >
                <span>Ajukan Dokumen ke Advokat</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- {Featured Lawyers} -->
    <section class="space-y-4 sm:space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-zinc-200 pb-4 gap-3">
        <div>
          <span class="text-xs font-semibold text-zinc-500 block">
            Rekomendasi Advokat
          </span>
          <h2 class="text-xl sm:text-2xl font-bold text-zinc-950 mt-0.5 tracking-tight">
            Pilihan Advokat Berpengalaman
          </h2>
          <p class="text-xs text-zinc-500 mt-1">
            Gunakan centang "Bandingkan" pada kartu untuk melihat perbandingan profil.
          </p>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1 sm:pt-0">
          <!-- {Navigation} -->
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              @click="scrollCarousel('left')"
              :disabled="!canScrollLeft"
              class="w-8 h-8 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Geser ke kiri"
              title="Geser ke kiri"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button
              type="button"
              @click="scrollCarousel('right')"
              :disabled="!canScrollRight"
              class="w-8 h-8 rounded-full border border-zinc-200 bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-zinc-700 transition-colors shadow-2xs cursor-pointer"
              aria-label="Geser ke kanan"
              title="Geser ke kanan"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>

          <RouterLink
            to="/lawyers"
            class="text-xs font-semibold text-zinc-900 hover:text-zinc-600 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors"
          >
            <span>Buka Semua Advokat ({{ lawyers.length }})</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>
      </div>

      <!-- {Loading} -->
      <div
        v-if="loading"
        class="flex gap-3 sm:gap-5 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="i in 4"
          :key="i"
          class="w-[245px] sm:w-[290px] shrink-0 h-64 sm:h-72 bg-zinc-100 rounded-2xl sm:rounded-3xl animate-pulse border border-zinc-200"
        ></div>
      </div>

      <div v-else-if="featuredLawyers.length === 0" class="p-12 text-center bg-white border border-zinc-200 rounded-2xl text-xs text-zinc-500">
        Belum ada data advokat.
      </div>

      <!-- {Carousel} -->
      <div
        v-else
        ref="carouselRef"
        @scroll.passive="updateScrollButtons"
        class="flex gap-3 sm:gap-5 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="lawyer in featuredLawyers"
          :key="lawyer.id"
          class="w-[245px] sm:w-[290px] shrink-0 snap-start flex flex-col"
        >
          <LawyerCard
            :lawyer="lawyer"
            :is-compared="isCompared(lawyer.id)"
            @toggle-compare="handleToggleCompare"
            class="h-full"
          />
        </div>
        <div class="w-1 shrink-0 -ml-2 sm:hidden"></div>
      </div>
    </section>

    <!-- {FAQ} -->
    <section class="max-w-3xl mx-auto space-y-6">
      <div class="text-center space-y-2">
        <span class="text-xs font-semibold text-zinc-500 block">
          Tanya Jawab
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
          Pertanyaan yang Sering Diajukan
        </h2>
        <p class="text-xs text-zinc-500">
          Jawaban atas hal-hal yang sering ditanyakan seputar layanan dan konsultasi.
        </p>
      </div>

      <div class="space-y-2.5">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="bg-white border border-zinc-200 rounded-2xl overflow-hidden transition-all shadow-2xs"
        >
          <button
            @click="faq.open = !faq.open"
            class="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-950 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            <span>{{ faq.q }}</span>
            <ChevronDown
              class="w-4 h-4 text-zinc-400 shrink-0 ml-3 transition-transform duration-200"
              :class="{ 'rotate-180 text-zinc-900': faq.open }"
            />
          </button>
          <div v-if="faq.open" class="px-4 pb-4 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100 bg-zinc-50/50">
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- {Compare Drawer} -->
    <LawyerCompareDrawer
      :selected-lawyers="comparedLawyers"
      @clear="comparedLawyers = []"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ArrowRight, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Copy, Scale, ShieldCheck } from '@lucide/vue'
import { useAuth } from '../composables/useAuth'
import lawyerService from '../service/lawyerService'
import LawyerCard from '../components/LawyerCard.vue'
import LawyerCompareDrawer from '../components/LawyerCompareDrawer.vue'

const { isAuthenticated } = useAuth()

const lawyers = ref([])
const loading = ref(true)
const comparedLawyers = ref([])
const copied = ref(false)

const carouselRef = ref(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

const updateScrollButtons = () => {
  if (!carouselRef.value) return
  const { scrollLeft, scrollWidth, clientWidth } = carouselRef.value
  canScrollLeft.value = scrollLeft > 10
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 10
}

const scrollCarousel = (direction) => {
  if (!carouselRef.value) return
  const scrollAmount = carouselRef.value.clientWidth * 0.75
  carouselRef.value.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth'
  })
  setTimeout(updateScrollButtons, 350)
}

const handleResize = () => {
  updateScrollButtons()
}

const triggerPalette = () => {
  window.dispatchEvent(new CustomEvent('open-counsela-palette'))
}

const isCompared = (id) => comparedLawyers.value.some((l) => l.id === id)

const handleToggleCompare = (lawyer) => {
  const idx = comparedLawyers.value.findIndex((l) => l.id === lawyer.id)
  if (idx > -1) {
    comparedLawyers.value.splice(idx, 1)
  } else {
    if (comparedLawyers.value.length >= 3) {
      alert('Maksimal komparasi 3 advokat secara bersamaan.')
      return
    }
    comparedLawyers.value.push(lawyer)
  }
}

const popularDomains = [
  'Hukum Korporasi & Bisnis',
  'Hukum Pidana',
  'Sengketa Kontrak',
  'Ketenagakerjaan & PHK',
  'Hak Waris & Keluarga',
  'Kekayaan Intelektual (HKI)',
  'Sengketa Lahan & Properti',
]

const triageOptions = [
  {
    id: 'kontrak',
    name: 'Sengketa Kontrak & Bisnis',
    law: 'PASAL 1243 & 1338 KUHPERDATA',
    sla: '1-2 SESI KONSULTASI',
    stages: {
      pencegahan: 'Audit klausul potensi wanprestasi sebelum penandatanganan addendum resmi.',
      somasi: 'Penyusunan somasi balasan (jawaban teguran hukum) dengan tenggat 3x24 jam untuk membantah dalil.',
      negosiasi_macet: 'Penyusunan draf penyelesaian sengketa alternatif (ADR / Mediasi Komersial) sebelum jalur pengadilan.',
      litigasi: 'Pendaftaran gugatan perdata wanprestasi atau perbuatan melawan hukum (PMH) ke Pengadilan Negeri.',
    },
  },
  {
    id: 'naker',
    name: 'Ketenagakerjaan & PHK',
    law: 'UU NO. 11/2020 JO PP 35/2021',
    sla: '2-3 TAHAPAN BIPARTIT',
    stages: {
      pencegahan: 'Penyesuaian klausul PKWT / PKWTT dengan aturan kompensasi berakhirnya kontrak kerja.',
      somasi: 'Perhitungan kompensasi pesangon, uang penghargaan masa kerja, dan penggantian hak secara proporsional.',
      negosiasi_macet: 'Pendaftaran permohonan pencatatan perselisihan ke Disnaker setempat untuk mediasi tripartit.',
      litigasi: 'Pengajuan gugatan perselisihan pemutusan hubungan kerja ke Pengadilan Hubungan Industrial (PHI).',
    },
  },
  {
    id: 'pidana',
    name: 'Pidana & Kejahatan Siber',
    law: 'KUHP & UU ITE NO. 1/2024',
    sla: 'URGENSI 24 JAM',
    stages: {
      pencegahan: 'Legal advice mengenai batasan pencemaran nama baik vs kritik serta perlindungan data pribadi.',
      somasi: 'Tuntutan klarifikasi publik dan penghapusan konten yang mencemarkan reputasi dalam waktu 2x24 jam.',
      negosiasi_macet: 'Pengumpulan alat bukti digital tersertifikasi (screenshot, metadata, log transfer).',
      litigasi: 'Pendampingan Berita Acara Pemeriksaan (BAP) sebagai Saksi atau Terlapor di kantor Kepolisian.',
    },
  },
  {
    id: 'waris',
    name: 'Harta Waris & Properti',
    law: 'KOMPILASI HUKUM ISLAM / BW',
    sla: 'MEDIASI KELUARGA',
    stages: {
      pencegahan: 'Inventarisasi surat hak milik, sertifikat tanah, dan silsilah ahli waris yang sah.',
      somasi: 'Pemberitahuan resmi pembagian hak waris sesuai ketentuan hukum perdata/agama yang berlaku.',
      negosiasi_macet: 'Musyawarah pembagian waris dengan pendampingan advokat sebagai mediator independen.',
      litigasi: 'Pengajuan gugatan pembagian waris atau penetapan ahli waris ke Pengadilan Agama / Pengadilan Negeri.',
    },
  },
]

const getLawyerCount = (domainId) => {
  if (!lawyers.value || lawyers.value.length === 0) return 0
  const keywords = {
    kontrak: ['kontrak', 'bisnis', 'perdata', 'korporasi', 'perjanjian'],
    naker: ['ketenagakerjaan', 'naker', 'phk', 'buruh', 'tenaga'],
    pidana: ['pidana', 'kriminal', 'siber', 'cyber', 'tipikor'],
    waris: ['waris', 'keluarga', 'properti', 'lahan', 'agraria', 'tanah'],
  }[domainId] || []
  const matches = lawyers.value.filter((l) => {
    const spec = (l.spesialisasi || '').toLowerCase()
    return keywords.some((k) => spec.includes(k))
  }).length
  return matches > 0 ? matches : lawyers.value.length
}

const activeTriage = ref(triageOptions[0])
const selectedStage = ref('somasi')

const serviceTypes = [
  { id: 'konsultasi', name: 'Konsultasi Online', duration: '60 Menit', base: 500000 },
  { id: 'somasi', name: 'Draf Surat Somasi', duration: '2-3 Hari Kerja', base: 1200000 },
  { id: 'review', name: 'Legal Audit Kontrak', duration: '1-2 Hari Kerja', base: 2000000 },
  { id: 'litigasi', name: 'Pendampingan Sidang', duration: 'Per Kehadiran', base: 3500000 },
]

const selectedService = ref(serviceTypes[0])
const complexityLevel = ref(2)
const complexityLabels = {
  1: 'Tingkat Sederhana',
  2: 'Tingkat Menengah',
  3: 'Komersial / Nilai Tinggi',
  4: 'Litigasi Multi-Pihak',
}

const calculatedTotal = computed(() => {
  const multiplier = [1, 1, 1.4, 2.0, 2.8][complexityLevel.value] || 1
  return Math.round(selectedService.value.base * multiplier)
})

const documentTemplates = [
  {
    id: 'somasi',
    code: 'DOK-SOM-01',
    title: 'Surat Somasi Wanprestasi (Teguran Hukum)',
    desc: 'Peringatan resmi atas kelalaian pemenuhan kewajiban kontrak atau utang piutang.',
    sampleText: `KEPADA YTH:
Direktur Utama PT Mitra Utama Mandiri
Gedung Perkantoran Sudirman Kav. 21, Jakarta Selatan

PERIHAL: SOMASI I (TEGURAN HUKUM PERTAMA) ATAS KELALAIAN PEMBAYARAN KONTRAK #PKS-2025/08

Dengan hormat,
Untuk dan atas nama Klien kami berdasarkan Surat Kuasa Khusus tertanggal 10 Januari 2026, dengan ini kami sampaikan hal-hal sebagai berikut:
1. Bahwa antara Klien kami dan Saudara telah terikat dalam Perjanjian Pengadaan Sistem Digital tertanggal 15 Agustus 2025.
2. Bahwa prestasi pekerjaan telah diselesaikan 100% dan Berita Acara Serah Terima (BAST) telah ditandatangani bersama.
3. Bahwa hingga tanggal surat ini diterbitkan, Saudara belum menyelesaikan sisa kewajiban pembayaran Termin II sebesar Rp 150.000.000,- (Seratus Lima Puluh Juta Rupiah).

MAKA DENGAN INI KAMI MEMBERIKAN PERINGATAN (SOMASI) KEPADA SAUDARA untuk melunasi kewajiban tersebut selambat-lambatnya dalam waktu 3x24 jam sejak surat ini diterima, atau kami akan menempuh jalur hukum perdata maupun pidana.`,
  },
  {
    id: 'nda',
    code: 'DOK-NDA-02',
    title: 'Perjanjian Kerahasiaan (Non-Disclosure Agreement)',
    desc: 'Perlindungan rahasia dagang, kode sumber, dan data komersial strategis bisnis.',
    sampleText: `PERJANJIAN KERAHASIAAN DAN NON-PENGUNGKAPAN (NDA)

Pada hari ini, disepakati antara:
1. Pihak Pertama (Pihak Pengungkap Rahasia / Disclosing Party); dan
2. Pihak Kedua (Pihak Penerima Rahasia / Receiving Party);

PASAL 1: DEFINISI INFORMASI RAHASIA
Seluruh data teknis, finansial, algoritma piranti lunak, rencana bisnis, serta daftar klien yang disampaikan secara tertulis maupun lisan.

PASAL 2: KEWAJIBAN KERAHASIAAN
Pihak Penerima wajib menjaga kerahasiaan informasi dengan standar kehati-hatian tertinggi dan tidak mengalihkan kepada pihak ketiga mana pun tanpa izin tertulis sebelumnya.

PASAL 3: GANTI RUGI & YURISDIKSI
Pelanggaran atas ketentuan ini memberikan hak kepada Pihak Pengungkap untuk menuntut ganti kerugian materiil dan immateriil melalui Pengadilan Negeri Jakarta Pusat.`,
  },
  {
    id: 'pkwt',
    code: 'DOK-PKWT-03',
    title: 'Perjanjian Kerja Waktu Tertentu (PKWT)',
    desc: 'Format standar sesuai ketentuan PP No. 35 Tahun 2021 dan UU Ketenagakerjaan.',
    sampleText: `SURAT PERJANJIAN KERJA WAKTU TERTENTU (PKWT)
NOMOR: PKWT/HRD/2026/014

PASAL 4: HAK DAN KEWAJIBAN
1. Pengusaha berkewajiban memberikan upah bulanan serta tunjangan sesuai regulasi ketenagakerjaan yang berlaku.
2. Pekerja berkewajiban menjalankan deskripsi kerja dan menjaga etika serta rahasia perusahaan.

PASAL 8: UANG KOMPENSASI BERAKHIRNYA PKWT
Sesuai Pasal 15 PP No. 35/2021, Perusahaan wajib memberikan uang kompensasi kepada Pekerja pada saat berakhirnya jangka waktu PKWT yang dihitung secara proporsional sesuai masa kerja.`,
  },
]

const activeDoc = ref(documentTemplates[0])

const copyDocSample = async () => {
  try {
    await navigator.clipboard.writeText(activeDoc.value.sampleText)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error(err)
  }
}

const faqs = ref([
  {
    q: 'Bagaimana kerahasiaan perkara saya dijamin secara hukum?',
    a: 'Setiap advokat yang terdaftar di Counsela terikat oleh sumpah profesi dan Pasal 19 Undang-Undang No. 18 Tahun 2003 tentang Advokat, yang menyatakan advokat wajib merahasiakan segala sesuatu yang diketahui atau diperoleh dari Kliennya karena hubungan profesinya. Pelanggaran atas kewajiban ini merupakan pelanggaran kode etik berat.',
    open: true,
  },
  {
    q: 'Bagaimana cara kerja jaminan Escrow 50/50 Counsela?',
    a: 'Saat Anda memesan konsultasi, Anda hanya membayarkan DP sebesar 50%. Dana ini disimpan di rekening penampung aman platform Counsela. Dana tidak akan diteruskan ke advokat sebelum sesi berlangsung sesuai jadwal yang disepakati. Pelunasan sisa 50% dilakukan setelah konsultasi selesai.',
    open: false,
  },
  {
    q: 'Apakah Berita Acara Konsultasi dapat digunakan untuk proses hukum lebih lanjut?',
    a: 'Ya. Setelah konsultasi selesai, advokat akan menerbitkan Resume Konsultasi dan Rekomendasi Langkah Hukum resmi yang tertera di lembar rincian perkara Anda, yang dapat Anda unduh dan jadikan panduan untuk tahapan mediasi atau litigasi.',
    open: false,
  },
  {
    q: 'Bagaimana jika advokat berhalangan hadir pada jam yang dijadwalkan?',
    a: 'Jika advokat berhalangan karena agenda sidang mendadak, Anda berhak memilih penjadwalan ulang tanpa biaya tambahan atau meminta pengembalian dana (refund) 100% secara instan.',
    open: false,
  },
])

const featuredLawyers = computed(() => lawyers.value.slice(0, 8))

onMounted(async () => {
  window.addEventListener('resize', handleResize)
  try {
    loading.value = true
    const data = await lawyerService.getAllLawyers()
    lawyers.value = Array.isArray(data) ? data : []
    await nextTick()
    setTimeout(updateScrollButtons, 200)
  } catch (err) {
    console.error('Failed to load lawyers:', err)
  } finally {
    loading.value = false
    await nextTick()
    setTimeout(updateScrollButtons, 200)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>
