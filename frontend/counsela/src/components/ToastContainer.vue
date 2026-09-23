<template>
  <div class="fixed bottom-20 lg:bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
    <TransitionGroup
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform translate-y-2 opacity-0 scale-95"
      enter-to-class="transform translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform translate-y-0 opacity-100 scale-100"
      leave-to-class="transform translate-y-2 opacity-0 scale-95"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 p-3.5 bg-black text-white rounded-2xl shadow-xl border border-zinc-800 text-xs leading-relaxed backdrop-blur-xl"
      >
        <!-- {Icon} -->
        <div class="mt-0.5 shrink-0">
          <CheckCircle v-if="toast.type === 'success'" class="w-4 h-4 text-emerald-400" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-4 h-4 text-red-400" />
          <Info v-else class="w-4 h-4 text-blue-400" />
        </div>

        <!-- {Message} -->
        <div class="flex-1 font-medium text-zinc-100">
          {{ toast.message }}
        </div>

        <!-- {Close} -->
        <button
          @click="removeToast(toast.id)"
          class="text-zinc-400 hover:text-white transition-colors p-0.5 rounded-full"
          aria-label="Tutup"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { CheckCircle, AlertCircle, Info, X } from 'lucide-vue-next'
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>
