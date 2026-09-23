<template>
  <div class="max-w-4xl mx-auto py-2 sm:py-8 text-zinc-950">
    <!-- {Header} -->
    <div class="hidden sm:flex items-center justify-between border-b border-zinc-200 pb-3 mb-8 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
      <div class="flex items-center gap-3">
        <span class="font-bold text-zinc-950">COUNSELA</span>
        <span>•</span>
        <span>PENDAFTARAN AKUN</span>
      </div>
      <div class="text-[10px] text-zinc-400 font-mono">AKUN BARU</div>
    </div>

    <div class="grid lg:grid-cols-12 gap-5 lg:gap-8 items-start">
      <!-- {Info Column} -->
      <div class="lg:col-span-5 space-y-4 sm:space-y-6 text-xs">
        <div class="space-y-1.5 sm:space-y-2">
          <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Daftar Akun Baru
          </h1>
          <p class="text-zinc-500 leading-relaxed text-xs sm:text-sm">
            Daftarkan diri Anda untuk menjadwalkan konsultasi hukum online.
          </p>
        </div>

        <div class="hidden lg:block border-t border-zinc-100 pt-5 space-y-4">
          <div class="p-4 rounded-2xl bg-white border border-zinc-200 space-y-1.5 shadow-2xs">
            <span class="font-mono text-[10px] text-zinc-400 uppercase block font-semibold">
              Skema Pembayaran 50 / 50
            </span>
            <p class="text-zinc-500 leading-relaxed text-[11px]">
              Tarif jasa konsultasi tertera transparan. DP 50% untuk reservasi jadwal, dan pelunasan 50% setelah konsultasi selesai.
            </p>
          </div>

          <div class="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1">
            <span class="font-mono text-[10px] text-zinc-400 uppercase block font-semibold">
              Data Sesuai Identitas
            </span>
            <p class="text-[11px] text-zinc-500 leading-relaxed">
              Pastikan nama yang Anda cantumkan sesuai dengan identitas resmi (KTP/Paspor) guna keperluan administrasi konsultasi.
            </p>
          </div>
        </div>
      </div>

      <!-- {Form Column} -->
      <div class="lg:col-span-7 bg-white border border-zinc-200 rounded-3xl p-5 sm:p-8 shadow-sm">
        <div class="hidden sm:flex justify-between items-center pb-4 mb-6 border-b border-zinc-100 text-xs">
          <span class="font-bold text-zinc-950 text-sm">Formulir Pendaftaran</span>
          <span class="text-[10px] text-zinc-400 font-mono">ROLE: CLIENT</span>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4 text-xs">
          <div>
            <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              v-model="formData.nama"
              type="text"
              placeholder="Contoh: Budi Santoso"
              class="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black transition-colors shadow-2xs"
              required
            />
          </div>

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

          <div class="grid sm:grid-cols-2 gap-3.5">
            <div>
              <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
                Kata Sandi
              </label>
              <input
                v-model="formData.password"
                type="password"
                placeholder="Min. 8 karakter"
                class="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black transition-colors shadow-2xs"
                required
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-zinc-700 mb-1.5">
                Konfirmasi Sandi
              </label>
              <input
                v-model="formData.confirmPassword"
                type="password"
                placeholder="Ulangi sandi"
                class="w-full px-4 py-3 rounded-2xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:border-black transition-colors shadow-2xs"
                required
              />
            </div>
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="loading"
              class="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-black hover:bg-zinc-800 text-white font-semibold rounded-full text-xs sm:text-sm tracking-wide transition-all disabled:opacity-50 shadow-sm cursor-pointer"
            >
              <span>{{ loading ? 'Mendaftarkan...' : 'Daftar Akun Baru' }}</span>
              <ArrowRight v-if="!loading" class="w-4 h-4" />
            </button>
          </div>
        </form>

        <div class="mt-6 pt-5 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-500">
          <span>Sudah memiliki akun?</span>
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-1 font-semibold text-zinc-950 hover:underline"
          >
            <span>Masuk ke Akun</span>
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
import { ArrowRight } from '@lucide/vue'
import authService from '../service/authService'
import { toast } from '../composables/useToast'

const router = useRouter()

const formData = ref({
  nama: '',
  email: '',
  password: '',
  confirmPassword: '',
})
const loading = ref(false)

const handleSubmit = async () => {
  if (formData.value.password.length < 8) {
    toast.error('Kata sandi minimal 8 karakter')
    return
  }
  if (formData.value.password !== formData.value.confirmPassword) {
    toast.error('Konfirmasi kata sandi tidak cocok')
    return
  }

  loading.value = true
  try {
    await authService.register({
      nama: formData.value.nama,
      email: formData.value.email,
      password: formData.value.password,
    })
    toast.success('Pendaftaran akun berhasil. Silakan masuk ke portal.')
    router.push('/login')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Registrasi gagal, mohon periksa kembali data Anda')
  } finally {
    loading.value = false
  }
}
</script>
