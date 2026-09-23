<template>
  <div class="max-w-4xl mx-auto py-2 sm:py-8 text-zinc-950">
    <!-- {Header} -->
    <div class="hidden sm:flex items-center justify-between border-b border-zinc-200 pb-3 mb-8 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
      <div class="flex items-center gap-3">
        <span class="font-bold text-zinc-950">COUNSELA</span>
        <span>•</span>
        <span>MASUK KE AKUN</span>
      </div>
      <div class="text-[10px] text-emerald-800 font-semibold flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        AKSES AMAN
      </div>
    </div>

    <div class="grid lg:grid-cols-12 gap-5 lg:gap-8 items-start">
      <!-- {Info Column} -->
      <div class="lg:col-span-5 space-y-4 sm:space-y-6 text-xs">
        <div class="space-y-1.5 sm:space-y-2">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Masuk ke Akun Anda
          </h1>
          <p class="text-zinc-500 leading-relaxed text-xs sm:text-sm">
            Silakan masuk untuk melihat jadwal konsultasi dan dokumen hukum Anda.
          </p>
        </div>

        <div class="hidden lg:block border-t border-zinc-100 pt-5 space-y-4">
          <div class="p-4 rounded-2xl bg-white border border-zinc-200 space-y-1.5 shadow-2xs">
            <span class="font-mono text-[10px] text-zinc-400 uppercase block font-semibold">
              Kerahasiaan Advokat - Klien
            </span>
            <p class="text-zinc-500 leading-relaxed text-[11px]">
              Sesi konsultasi, pertukaran berkas, dan histori transaksi dilindungi oleh asas kerahasiaan jabatan advokat.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span class="font-mono text-[10px] text-zinc-400 uppercase block font-semibold">
              Keamanan Akun
            </span>
            <p class="text-[11px] text-zinc-500 leading-relaxed">
              Sesi login dilindungi enkripsi aman. Jangan pernah membagikan email atau kata sandi Anda kepada pihak lain.
            </p>
          </div>
        </div>
      </div>

      <!-- {Form Column} -->
      <div class="lg:col-span-7 bg-white border border-zinc-200 rounded-3xl p-5 sm:p-8 shadow-sm">
        <div class="hidden sm:flex justify-between items-center pb-4 mb-6 border-b border-zinc-100 text-xs">
          <span class="font-bold text-zinc-950 text-sm">Formulir Masuk</span>
          <span class="text-[10px] text-zinc-400 font-mono">STATUS: AKTIF</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 text-xs">
          <div>
            <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
              Alamat Email
            </label>
            <input
              v-model="formData.email"
              type="email"
              placeholder="nama@domain.com"
              class="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black transition-colors shadow-2xs"
              required
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="text-xs font-semibold text-zinc-700">
                Kata Sandi
              </label>
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="inline-flex items-center gap-1 text-[10px] font-mono text-zinc-400 hover:text-black transition-colors cursor-pointer"
              >
                <component :is="showPassword ? EyeOff : Eye" class="w-3.5 h-3.5" />
                <span>{{ showPassword ? 'Sembunyikan' : 'Lihat' }}</span>
              </button>
            </div>
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black transition-colors shadow-2xs"
              required
            />
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-semibold rounded-full text-xs sm:text-sm tracking-wide transition-all disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <span>{{ loading ? 'Memverifikasi...' : 'Masuk' }}</span>
              <ArrowRight v-if="!loading" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 pt-5 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-500">
          <span>Belum memiliki akun?</span>
          <RouterLink
            to="/register"
            class="inline-flex items-center gap-1 font-semibold text-zinc-950 hover:underline"
          >
            <span>Daftar di sini</span>
            <ArrowRight class="w-3 h-3" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Eye, EyeOff } from '@lucide/vue'
import authService from '../service/authService'
import { useAuth } from '../composables/useAuth'
import { toast } from '../composables/useToast'

const router = useRouter()
const { login } = useAuth()

const formData = ref({
  email: '',
  password: '',
})
const loading = ref(false)
const showPassword = ref(false)

const handleSubmit = async () => {
  if (!formData.value.email || !formData.value.password) {
    toast.error('Mohon lengkapi email dan kata sandi')
    return
  }

  loading.value = true
  try {
    const res = await authService.login(formData.value)
    login(res.user)
    toast.success(`Selamat datang kembali, ${res.user.nama}`)

    const role = res.user.role?.toLowerCase()
    if (role === 'admin') router.push('/admin-dashboard')
    else if (role === 'lawyer') router.push('/lawyer-dashboard')
    else router.push('/client-dashboard')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Kredensial email atau sandi tidak valid')
  } finally {
    loading.value = false
  }
}
</script>
