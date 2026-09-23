<template>
  <footer class="border-t border-zinc-200/90 bg-white text-zinc-600 mt-24">
    <!-- {Footer Content} -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
        <!-- {Col Brand} -->
        <div class="lg:col-span-4 space-y-4">
          <div class="flex items-center gap-2.5">
            <div class="w-7 h-7 rounded-xl bg-black text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
            <div>
              <span class="text-base font-bold tracking-tight text-zinc-950">counsela</span>
              <span class="text-[11px] text-zinc-400 block -mt-0.5">Platform Hukum Digital</span>
            </div>
          </div>

          <p class="text-xs text-zinc-500 leading-relaxed">
            Platform konsultasi hukum online yang menghubungkan Anda dengan advokat berlisensi secara aman dan transparan.
          </p>

          <div class="p-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-[11px] text-zinc-600 space-y-1">
            <div class="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <svg class="w-3 h-3 text-zinc-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Pasal 19 UU No. 18/2003
            </div>
            <p class="text-[11px] leading-normal text-zinc-400">
              Semua data konsultasi dan pembicaraan dilindungi kerahasiaan hubungan advokat dan klien.
            </p>
          </div>
        </div>

        <!-- {Col Practice Areas} -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-semibold text-zinc-900 tracking-tight">
            Bidang Hukum
          </h4>
          <ul class="space-y-2 text-xs text-zinc-500">
            <li><RouterLink to="/lawyers" class="hover:text-black transition-colors">Hukum Bisnis, Korporasi & Kontrak</RouterLink></li>
            <li><RouterLink to="/lawyers" class="hover:text-black transition-colors">Hukum Pidana Umum & Khusus</RouterLink></li>
            <li><RouterLink to="/lawyers" class="hover:text-black transition-colors">Sengketa Perdata, Waris & Properti</RouterLink></li>
            <li><RouterLink to="/lawyers" class="hover:text-black transition-colors">Ketenagakerjaan & PHK</RouterLink></li>
            <li><RouterLink to="/lawyers" class="hover:text-black transition-colors">Hak Kekayaan Intelektual (HKI)</RouterLink></li>
            <li><RouterLink to="/lawyers" class="hover:text-black transition-colors">Pajak Korporasi & Kepailitan</RouterLink></li>
          </ul>
        </div>

        <!-- {Col Navigation} -->
        <div class="lg:col-span-2 space-y-3">
          <h4 class="text-xs font-semibold text-zinc-900 tracking-tight">
            Informasi
          </h4>
          <ul class="space-y-2 text-xs text-zinc-500">
            <li><RouterLink to="/about" class="hover:text-black transition-colors">Tentang Kami</RouterLink></li>
            <li><RouterLink to="/lawyers" class="hover:text-black transition-colors">Daftar Advokat</RouterLink></li>
            <li><RouterLink to="/login" class="hover:text-black transition-colors">Masuk</RouterLink></li>
            <li><RouterLink to="/register" class="hover:text-black transition-colors">Daftar Akun</RouterLink></li>
            <li><span class="text-zinc-400">Pembayaran Bertahap 50/50</span></li>
            <li><span class="text-zinc-400">Kode Etik Advokat</span></li>
          </ul>
        </div>

        <!-- {Col Contact} -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-semibold text-zinc-900 tracking-tight">
            Kontak
          </h4>
          <div class="space-y-2 text-xs text-zinc-500">
            <p class="font-semibold text-zinc-900">PT Counsela Teknologi Nusantara</p>
            <p class="text-[11px] text-zinc-400">
              Gedung Equity Tower Lt. 28, SCBD<br />
              Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190
            </p>
            <div class="pt-1 text-xs space-y-1">
              <p>Email: <span class="text-zinc-900 font-medium">sekretariat@counsela.id</span></p>
              <p>Hotline: <span class="text-zinc-900 font-medium">(021) 5098-8888</span></p>
              <p class="text-emerald-700 font-medium text-[11px]">Layanan: 08.00 - 18.00 WIB</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- {Bottom Bar} -->
    <div class="border-t border-zinc-200/90 bg-zinc-50/50 py-4 px-6 text-xs text-zinc-500">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <div class="flex items-center gap-3 text-xs text-zinc-400">
          <span>&copy; {{ currentYear }} Counsela. Hak cipta dilindungi undang-undang.</span>
          <span>•</span>
          <span>PSE Terdaftar Kominfo</span>
        </div>

        <div class="flex items-center gap-4 text-[11px] text-zinc-500">
          <span class="hover:text-black cursor-pointer">Syarat & Ketentuan</span>
          <span>•</span>
          <span class="hover:text-black cursor-pointer">Kebijakan Privasi</span>
          <span>•</span>
          <span class="hover:text-black cursor-pointer">ISO 27001</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
