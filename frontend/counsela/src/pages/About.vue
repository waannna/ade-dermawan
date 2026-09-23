<template>
  <div class="max-w-4xl mx-auto space-y-12 py-4 text-zinc-950">
    <!-- {Header} -->
    <div class="space-y-3">
      <div class="text-xs font-semibold text-zinc-500 tracking-wide">
        Tentang Platform
      </div>
      <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
        Tentang Counsela
      </h1>
      <p class="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl font-normal">
        Counsela adalah platform konsultasi hukum yang menghubungkan masyarakat dengan advokat berlisensi di Indonesia secara transparan, mudah, dan aman.
      </p>
    </div>

    <!-- {Vision Mission} -->
    <div class="grid sm:grid-cols-2 gap-6">
      <div class="p-6 bg-white border border-zinc-200 rounded-3xl shadow-2xs space-y-2">
        <div class="text-xs font-semibold text-zinc-400">01 • Visi</div>
        <h2 class="font-bold text-lg text-zinc-950 tracking-tight">Akses Bantuan Hukum yang Terbuka</h2>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Membantu masyarakat dan pelaku usaha mendapatkan pendampingan hukum yang jelas, transparan, dan terpercaya.
        </p>
      </div>

      <div class="p-6 bg-white border border-zinc-200 rounded-3xl shadow-2xs space-y-2">
        <div class="text-xs font-semibold text-zinc-400">02 • Misi</div>
        <h2 class="font-bold text-lg text-zinc-950 tracking-tight">Pelayanan Transparan & Aman</h2>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Menghadirkan jadwal konsultasi yang jelas, biaya terukur dengan sistem pembayaran bertahap (DP 50%), serta menjaga kerahasiaan data klien.
        </p>
      </div>
    </div>

    <!-- {Legal Framework} -->
    <div class="space-y-4">
      <div class="border-b border-zinc-200 pb-3">
        <span class="text-xs font-semibold text-zinc-500 tracking-wide">
          Dasar Regulasi
        </span>
        <h3 class="font-bold text-xl text-zinc-950 mt-0.5 tracking-tight">
          Dasar Hukum & Perlindungan Privasi
        </h3>
      </div>

      <div class="space-y-4">
        <!-- {Article 19} -->
        <div id="pasal-19" class="p-6 bg-white border border-zinc-200 rounded-3xl shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-zinc-950 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
              Pasal 19 UU No. 18 Tahun 2003 (UU Advokat)
            </span>
            <span class="text-xs text-zinc-500 font-medium">Kerahasiaan Profesi</span>
          </div>
          <blockquote class="text-xs sm:text-sm text-zinc-800 border-l-2 border-black pl-4 py-1 leading-relaxed">
            "(1) Advokat wajib merahasiakan segala sesuatu yang diketahui atau diperoleh dari Kliennya karena hubungan profesinya, kecuali ditentukan lain oleh Undang-undang.<br/>
            (2) Advokat berhak atas kerahasiaan hubungannya dengan Klien, termasuk perlindungan atas berkas dan dokumennya terhadap penyitaan atau pemeriksaan."
          </blockquote>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Seluruh berkas perkara dan catatan konsultasi dijaga kerahasiaannya dan hanya dapat diakses oleh Klien serta Advokat yang bersangkutan.
          </p>
        </div>

        <!-- {Contracts} -->
        <div id="kuhperdata" class="p-6 bg-white border border-zinc-200 rounded-3xl shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-zinc-950 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
              Pasal 1320 & 1338 KUHPerdata
            </span>
            <span class="text-xs text-zinc-500 font-medium">Hukum Perjanjian</span>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed">
            Semua persetujuan yang dibuat secara sah berlaku sebagai undang-undang bagi mereka yang membuatnya (asas <em>pacta sunt servanda</em>). Dokumen perjanjian disusun mengikuti ketentuan KUHPerdata.
          </p>
        </div>

        <!-- {Breach of Contract} -->
        <div id="wanprestasi" class="p-6 bg-white border border-zinc-200 rounded-3xl shadow-2xs space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-zinc-950 bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
              Pasal 1243 KUHPerdata (Wanprestasi)
            </span>
            <span class="text-xs text-zinc-500 font-medium">Ganti Rugi Sengketa</span>
          </div>
          <p class="text-xs text-zinc-600 leading-relaxed">
            Penggantian biaya, kerugian, dan bunga karena tidak dipenuhinya suatu perikatan mulai diwajibkan jika pihak terkait tetap lalai setelah diberikan teguran (somasi).
          </p>
        </div>
      </div>
    </div>

    <!-- {Security} -->
    <div class="grid sm:grid-cols-3 gap-5">
      <div class="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
        <div class="text-xs font-semibold text-zinc-500">Legalitas</div>
        <h4 class="font-bold text-sm text-zinc-950">Advokat Terverifikasi</h4>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Setiap advokat terdaftar memiliki Berita Acara Sumpah (BAS) Pengadilan Tinggi dan izin praktik yang aktif.
        </p>
      </div>

      <div class="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
        <div class="text-xs font-semibold text-zinc-500">Privasi Data</div>
        <h4 class="font-bold text-sm text-zinc-950">Penyimpanan Aman</h4>
        <p class="text-xs text-zinc-500 leading-relaxed">
          Seluruh berkas bukti perkara disimpan pada sistem penyimpanan aman dan terenkripsi.
        </p>
      </div>

      <div class="p-5 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-2">
        <div class="text-xs font-semibold text-zinc-500">Pembayaran</div>
        <h4 class="font-bold text-sm text-zinc-950">Skema DP 50%</h4>
        <p class="text-xs text-zinc-500 leading-relaxed">
          DP 50% disimpan aman. Pelunasan diteruskan kepada advokat setelah sesi konsultasi terlaksana.
        </p>
      </div>
    </div>

    <!-- {CTA} -->
    <div class="p-8 bg-black text-white rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div class="space-y-1">
        <h3 class="font-bold text-lg text-white tracking-tight">
          Butuh Pendampingan Hukum?
        </h3>
        <p class="text-xs text-zinc-400">
          Pilih advokat yang sesuai dengan kebutuhan perkara Anda sekarang.
        </p>
      </div>
      <RouterLink
        to="/lawyers"
        class="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-white text-black hover:bg-zinc-200 rounded-full transition-all shadow-sm whitespace-nowrap"
      >
        <span>Lihat Direktori Advokat</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ArrowRight } from '@lucide/vue'
</script>
