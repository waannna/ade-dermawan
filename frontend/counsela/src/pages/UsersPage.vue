<template>
  <div class="space-y-8 text-zinc-950">
    <!-- {Header} -->
    <div class="pb-6 border-b border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <div class="text-xs font-semibold text-zinc-500 tracking-wide">
          Manajemen Pengguna
        </div>
        <h1 class="text-3xl font-bold tracking-tight text-zinc-950 mt-1">
          Daftar Pengguna
        </h1>
        <p class="text-xs text-zinc-500 mt-1">
          Kelola akun pengguna dan peran akses platform.
        </p>
      </div>

      <span class="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200">
        Total <strong class="text-zinc-900 font-semibold">{{ users.length }}</strong> Akun
      </span>
    </div>

    <!-- {Users Table} -->
    <div class="bg-white border border-zinc-200/90 rounded-3xl shadow-sm overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-xs text-zinc-400 font-sans">
        Memuat data pengguna...
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-xs sm:text-sm">
          <thead class="bg-zinc-50 text-zinc-500 text-xs font-medium border-b border-zinc-200">
            <tr>
              <th class="px-6 py-3.5">Nama Pengguna</th>
              <th class="px-6 py-3.5">Alamat Email</th>
              <th class="px-6 py-3.5">Peran</th>
              <th class="px-6 py-3.5">Terdaftar</th>
              <th class="px-6 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-100 text-zinc-700">
            <tr
              v-for="u in users"
              :key="u.id"
              class="hover:bg-zinc-50/70 transition-colors"
            >
              <td class="px-6 py-4 font-bold text-zinc-950">{{ u.nama }}</td>
              <td class="px-6 py-4 text-zinc-600 text-xs">{{ u.email }}</td>
              <td class="px-6 py-4">
                <select
                  :value="u.role"
                  @change="(e) => handleRoleChange(u.id, e.target.value)"
                  class="text-xs font-medium px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-900 focus:outline-none focus:border-zinc-900 cursor-pointer"
                >
                  <option value="client">Client</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td class="px-6 py-4 text-xs font-mono text-zinc-400">
                {{ u.created_at?.split('T')[0] }}
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="handleDelete(u.id, u.nama)"
                  class="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full border border-rose-200 transition-colors"
                  title="Hapus Akun Pengguna"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Trash2 } from '@lucide/vue'
import api from '../utils/axios'
import { toast } from '../composables/useToast'

const users = ref([])
const loading = ref(true)

const fetchUsers = async () => {
  try {
    loading.value = true
    const res = await api.get('/users')
    users.value = res.data.data || []
  } catch {
    toast.error('Gagal memuat data pengguna')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const handleRoleChange = async (id, role) => {
  try {
    await api.put(`/users/${id}`, { role })
    toast.success('Peran pengguna berhasil diperbarui')
    fetchUsers()
  } catch {
    toast.error('Gagal memperbarui peran pengguna')
  }
}

const handleDelete = async (id, nama) => {
  if (!window.confirm(`Hapus akun pengguna ${nama}? Tindakan ini tidak dapat dibatalkan.`)) return
  try {
    await api.delete(`/users/${id}`)
    toast.success('Akun pengguna berhasil dihapus')
    fetchUsers()
  } catch {
    toast.error('Gagal menghapus pengguna')
  }
}
</script>
