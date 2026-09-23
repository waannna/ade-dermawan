import { ref, computed } from 'vue'
import authService from '../service/authService'

const user = ref(null)
const loading = ref(true)
let isInitialized = false

export const useAuth = () => {
  const initializeAuth = async () => {
    if (isInitialized) return
    isInitialized = true
    try {
      loading.value = true
      const response = await authService.getProfile()
      const userData = response.user || response
      if (userData && userData.id) {
        user.value = userData
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        user.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    } catch (err) {
      console.warn('Auth initialization check:', err.message)
      user.value = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } finally {
      loading.value = false
    }
  }

  const login = (userData) => {
    user.value = userData
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout API error:', err)
    } finally {
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }

  const updateUser = (updatedData) => {
    if (!user.value) return
    user.value = { ...user.value, ...updatedData }
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  const isAuthenticated = computed(() => Boolean(user.value && user.value.id))
  const isAdmin = computed(() => user.value?.role?.toLowerCase() === 'admin')
  const isLawyer = computed(() => user.value?.role?.toLowerCase() === 'lawyer')
  const isClient = computed(() => user.value?.role?.toLowerCase() === 'client')

  return {
    user,
    loading,
    initializeAuth,
    login,
    logout,
    updateUser,
    isAuthenticated,
    isAdmin,
    isLawyer,
    isClient,
  }
}

export default useAuth
