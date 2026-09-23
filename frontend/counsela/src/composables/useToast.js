import { ref } from 'vue'

const toasts = ref([])
let idCounter = 0

export const useToast = () => {
  const addToast = (message, type = 'info', duration = 3500) => {
    const id = ++idCounter
    toasts.value.push({ id, message, type })
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
    return id
  }

  const removeToast = (id) => {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value.splice(idx, 1)
    }
  }

  const success = (message, duration) => addToast(message, 'success', duration)
  const error = (message, duration) => addToast(message, 'error', duration)
  const info = (message, duration) => addToast(message, 'info', duration)

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  }
}

export const toast = {
  success: (msg, dur) => useToast().success(msg, dur),
  error: (msg, dur) => useToast().error(msg, dur),
  info: (msg, dur) => useToast().info(msg, dur),
}
