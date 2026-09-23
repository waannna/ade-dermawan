<template>
  <header class="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/80 transition-all">
    <!-- {Main Nav} -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- {Brand} -->
      <RouterLink to="/" class="flex items-center gap-2.5 group shrink-0">
        <div class="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="flex items-baseline gap-1.5">
          <span class="font-bold text-lg tracking-tight text-zinc-950 group-hover:text-zinc-700 transition-colors">
            counsela
          </span>
        </div>
      </RouterLink>

      <!-- {Search} -->
      <button
        @click="triggerCommandPalette"
        class="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-zinc-200/90 bg-zinc-50/80 hover:bg-white hover:border-zinc-400 text-zinc-400 hover:text-zinc-900 transition-all text-xs max-w-xs w-full shadow-2xs group"
        title="Buka Command Search (Ctrl+K atau ⌘K)"
      >
        <svg class="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span class="text-zinc-500 text-xs truncate">Cari advokat, dokumen, regulasi...</span>
        <kbd class="ml-auto px-1.5 py-0.5 text-[9px] font-mono font-medium text-zinc-400 bg-white border border-zinc-200 rounded-md">
          ⌘K
        </kbd>
      </button>

      <!-- {Nav Links} -->
      <nav class="hidden lg:flex items-center gap-1 text-xs">
        <RouterLink
          to="/"
          class="px-3.5 py-1.5 rounded-full transition-all font-medium"
          :class="isActive('/') ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'"
        >
          Beranda
        </RouterLink>

        <RouterLink
          to="/lawyers"
          class="px-3.5 py-1.5 rounded-full transition-all font-medium"
          :class="isActive('/lawyers') ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'"
        >
          Daftar Advokat
        </RouterLink>

        <RouterLink
          to="/about"
          class="px-3.5 py-1.5 rounded-full transition-all font-medium"
          :class="isActive('/about') ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'"
        >
          Tentang Kami
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated && (isClient || isLawyer)"
          to="/consultations"
          class="px-3.5 py-1.5 rounded-full transition-all font-medium"
          :class="isActive('/consultations') ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'"
        >
          {{ isClient ? 'Konsultasi Saya' : 'Permintaan Masuk' }}
        </RouterLink>

        <RouterLink
          v-if="isAdmin"
          to="/users"
          class="px-3.5 py-1.5 rounded-full transition-all font-medium"
          :class="isActive('/users') ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'"
        >
          Kelola User
        </RouterLink>

        <RouterLink
          v-if="isAuthenticated && dashboardTarget"
          :to="dashboardTarget"
          class="px-3.5 py-1.5 rounded-full transition-all font-medium"
          :class="isActive(dashboardTarget) ? 'bg-zinc-100 text-zinc-950 font-semibold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'"
        >
          Dashboard
        </RouterLink>
      </nav>

      <!-- {Auth} -->
      <div class="flex items-center gap-2">
        <template v-if="!isAuthenticated">
          <RouterLink
            to="/login"
            class="px-3.5 py-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            Masuk
          </RouterLink>
          <RouterLink
            to="/register"
            class="px-4 py-2 text-xs font-semibold bg-black hover:bg-zinc-800 text-white rounded-full transition-all shadow-sm"
          >
            Daftar
          </RouterLink>
        </template>

        <template v-else>
          <div class="relative" ref="dropdownRef">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 transition-all text-xs"
              aria-label="Menu Pengguna"
            >
              <div class="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[11px] font-mono font-bold uppercase">
                {{ userInitials }}
              </div>
              <span class="font-medium text-zinc-800 hidden sm:inline-block max-w-[100px] truncate">
                {{ userNameFirst }}
              </span>
              <svg class="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            <!-- {Dropdown} -->
            <div
              v-if="openUser"
              class="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-2xl shadow-xl py-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div class="px-4 py-2.5 border-b border-zinc-100">
                <p class="font-bold text-zinc-900 truncate">{{ user?.nama }}</p>
                <p class="text-[11px] text-zinc-400 truncate mt-0.5">{{ user?.email }}</p>
                <span class="inline-block mt-1 text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                  {{ user?.role }}
                </span>
              </div>

              <RouterLink
                v-if="dashboardTarget"
                :to="dashboardTarget"
                @click="openUser = false"
                class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
              >
                Dashboard
              </RouterLink>

              <RouterLink
                to="/consultations"
                @click="openUser = false"
                class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors"
              >
                Daftar Konsultasi
              </RouterLink>

              <button
                @click="triggerCommandPalette"
                class="w-full text-left px-4 py-2 text-zinc-700 hover:bg-zinc-50 font-medium transition-colors flex items-center justify-between"
              >
                <span>Cari Cepat</span>
                <kbd class="text-[9px] font-mono bg-zinc-100 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>

              <div class="my-1 border-t border-zinc-100"></div>

              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center justify-between"
              >
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, logout, isAuthenticated, isAdmin, isLawyer, isClient } = useAuth()

const openUser = ref(false)
const dropdownRef = ref(null)

const toggleUserMenu = () => {
  openUser.value = !openUser.value
}

const triggerCommandPalette = () => {
  openUser.value = false
  window.dispatchEvent(new CustomEvent('open-counsela-palette'))
}

const handleLogout = async () => {
  openUser.value = false
  await logout()
  router.push('/login')
}

const isActive = (path) => route.path === path

const userInitials = computed(() => {
  return user.value?.nama ? user.value.nama.charAt(0).toUpperCase() : 'U'
})

const userNameFirst = computed(() => {
  return user.value?.nama ? user.value.nama.split(' ')[0] : 'Akun'
})

const dashboardTarget = computed(() => {
  if (isClient.value) return '/client-dashboard'
  if (isLawyer.value) return '/lawyer-dashboard'
  if (isAdmin.value) return '/admin-dashboard'
  return null
})

const handleClickOutside = (e) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    openUser.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>
