<template>
  <nav
    class="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-t border-zinc-200/90 lg:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)]"
    aria-label="Navigasi Bawah Seluler"
  >
    <div class="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
      <template v-for="item in navItems" :key="item.id">
        <RouterLink
          v-if="item.isAction"
          :to="item.to"
          class="flex flex-col items-center justify-center -mt-5 group"
          :aria-label="item.label"
        >
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center shadow-md border-2 border-white transition-all duration-200 group-active:scale-95 bg-black text-white hover:bg-zinc-800"
            :class="{ 'ring-2 ring-black': isActive(item.to) }"
          >
            <component :is="item.icon" class="w-5 h-5 stroke-[2.5]" />
          </div>
          <span
            class="text-[10px] tracking-tight mt-1 transition-colors"
            :class="isActive(item.to) ? 'font-bold text-zinc-950' : 'font-medium text-zinc-600'"
          >
            {{ item.label }}
          </span>
        </RouterLink>

        <button
          v-else-if="item.isButton"
          type="button"
          @click="item.action"
          class="flex flex-col items-center justify-center w-full h-full py-1 text-center relative select-none text-zinc-400 hover:text-zinc-900 transition-colors group"
          :aria-label="item.label"
        >
          <div class="relative flex items-center justify-center">
            <component
              :is="item.icon"
              class="w-5 h-5 transition-transform duration-150 group-active:scale-90 stroke-[1.8]"
            />
          </div>
          <span class="text-[10px] leading-tight mt-1 tracking-tight font-medium">
            {{ item.label }}
          </span>
          <span class="w-1 h-1 rounded-full bg-transparent mt-0.5"></span>
        </button>

        <RouterLink
          v-else
          :to="item.to"
          class="flex flex-col items-center justify-center w-full h-full py-1 text-center relative select-none transition-all duration-150 group"
          :class="isActive(item.to) ? 'text-zinc-950' : 'text-zinc-400 hover:text-zinc-600'"
          :aria-label="item.label"
        >
          <div class="relative flex items-center justify-center">
            <component
              :is="item.icon"
              class="w-5 h-5 transition-transform duration-150 group-active:scale-90"
              :class="isActive(item.to) ? 'stroke-[2.2] scale-105' : 'stroke-[1.8]'"
            />
          </div>
          <span
            class="text-[10px] leading-tight mt-1 tracking-tight"
            :class="isActive(item.to) ? 'font-bold text-zinc-950' : 'font-medium'"
          >
            {{ item.label }}
          </span>
          <span
            class="w-1 h-1 rounded-full mt-0.5 transition-colors duration-150"
            :class="isActive(item.to) ? 'bg-black' : 'bg-transparent'"
          ></span>
        </RouterLink>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Home,
  Scale,
  Search,
  FileText,
  LayoutDashboard,
  Plus,
  ShieldCheck,
  User,
  Users
} from '@lucide/vue'
import { useAuth } from '../../composables/useAuth'

const route = useRoute()
const { isAuthenticated, isClient, isLawyer, isAdmin } = useAuth()

const triggerPalette = () => {
  window.dispatchEvent(new CustomEvent('open-counsela-palette'))
}

const isActive = (path) => {
  if (!path) return false
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const navItems = computed(() => {
  if (!isAuthenticated.value) {
    return [
      { id: 'home', label: 'Beranda', to: '/', icon: Home },
      { id: 'lawyers', label: 'Advokat', to: '/lawyers', icon: Scale },
      { id: 'search', label: 'Cari', isButton: true, action: triggerPalette, icon: Search },
      { id: 'about', label: 'Tentang', to: '/about', icon: ShieldCheck },
      { id: 'auth', label: 'Akun', to: '/login', icon: User },
    ]
  }

  if (isClient.value) {
    return [
      { id: 'home', label: 'Beranda', to: '/', icon: Home },
      { id: 'lawyers', label: 'Advokat', to: '/lawyers', icon: Scale },
      { id: 'new', label: 'Konsultasi', to: '/consultation/new', isAction: true, icon: Plus },
      { id: 'consultations', label: 'Konsultasi', to: '/consultations', icon: FileText },
      { id: 'dashboard', label: 'Saya', to: '/client-dashboard', icon: LayoutDashboard },
    ]
  }

  if (isLawyer.value) {
    return [
      { id: 'home', label: 'Beranda', to: '/', icon: Home },
      { id: 'cases', label: 'Konsultasi', to: '/consultations', icon: FileText },
      { id: 'search', label: 'Cari', isButton: true, action: triggerPalette, icon: Search },
      { id: 'lawyers', label: 'Daftar', to: '/lawyers', icon: Scale },
      { id: 'dashboard', label: 'Dashboard', to: '/lawyer-dashboard', icon: LayoutDashboard },
    ]
  }

  if (isAdmin.value) {
    return [
      { id: 'home', label: 'Beranda', to: '/', icon: Home },
      { id: 'dashboard', label: 'Admin', to: '/admin-dashboard', icon: LayoutDashboard },
      { id: 'cases', label: 'Konsultasi', to: '/consultations', icon: FileText },
      { id: 'users', label: 'User', to: '/users', icon: Users },
      { id: 'lawyers', label: 'Advokat', to: '/lawyers', icon: Scale },
    ]
  }

  return [
    { id: 'home', label: 'Beranda', to: '/', icon: Home },
    { id: 'lawyers', label: 'Advokat', to: '/lawyers', icon: Scale },
    { id: 'search', label: 'Cari', isButton: true, action: triggerPalette, icon: Search },
    { id: 'about', label: 'Tentang', to: '/about', icon: ShieldCheck },
    { id: 'auth', label: 'Akun', to: '/login', icon: User },
  ]
})
</script>
