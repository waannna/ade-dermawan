<template>
  <div class="min-h-screen flex flex-col justify-between bg-white text-zinc-950 selection:bg-black selection:text-white">
    <div>
      <Header />
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-28 lg:pb-20">
        <RouterView v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <Footer class="mb-20 lg:mb-0" />
    <BottomNav />
    <ToastContainer />
    <CommandPalette />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Layout/Header.vue'
import Footer from './components/Layout/Footer.vue'
import BottomNav from './components/Layout/BottomNav.vue'
import ToastContainer from './components/ToastContainer.vue'
import CommandPalette from './components/CommandPalette.vue'
import { useAuth } from './composables/useAuth'

const { initializeAuth } = useAuth()

onMounted(() => {
  initializeAuth()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.12s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
