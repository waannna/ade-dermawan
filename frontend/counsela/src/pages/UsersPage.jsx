import { useEffect, useState } from "react"
import api from "../utils/axios"
import { toast } from "react-hot-toast"

const Icons = {
  Users: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Loading: () => (
    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
}

const UsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({ nama: "", email: "" })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users")
      setUsers(response.data.data || [])
    } catch (error) { 
      toast.error("Gagal memuat data user") 
    } finally { 
      setLoading(false) 
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (id, nama) => {
    if (!confirm(`Yakin ingin menghapus user "${nama}"?`)) return
    try { 
      await api.delete(`/users/${id}`)
      toast.success("User berhasil dihapus")
      fetchUsers()
    } catch (error) { 
      toast.error("Gagal menghapus user") 
    }
  }

  const handleUpdateRole = async (id, newRole) => {
    try { 
      await api.put(`/users/${id}`, { role: newRole })
      toast.success(`Role user berhasil diubah menjadi ${newRole}`)
      fetchUsers()
    } catch (error) { 
      console.error("Update role error:", error)
      toast.error(error.response?.data?.message || "Gagal mengubah role")
    }
  }

  const openEditModal = (user) => { 
    setEditingUser(user)
    setEditForm({ nama: user.nama, email: user.email })
  }

  const handleSaveEdit = async () => {
    try { 
      await api.put(`/users/${editingUser.id}`, { nama: editForm.nama, email: editForm.email })
      toast.success("User berhasil diupdate")
      setEditingUser(null)
      fetchUsers()
    } catch (error) { 
      toast.error("Gagal mengupdate user") 
    }
  }

  const getRoleBadge = (role) => {
    switch(role) {
      case "admin": 
        return <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Admin</span>
      case "lawyer": 
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Lawyer</span>
      default: 
        return <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Client</span>
    }
  }

  const lawyerCount = users.filter(u => u.role === "lawyer").length
  const clientCount = users.filter(u => u.role === "client").length

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.Loading />
        <span className="ml-2 text-gray-500">Loading data user...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold">Kelola User</h1>
        <p className="text-purple-100 mt-1">Kelola semua user yang terdaftar di aplikasi Counsela</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition">
          <div className="w-10 h-10 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-2">
            <Icons.Users className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{users.length}</p>
          <p className="text-xs text-gray-500">Total User</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition">
          <div className="w-10 h-10 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-2">
            <Icons.Users className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-600">{lawyerCount}</p>
          <p className="text-xs text-gray-500">Lawyer</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center shadow-md hover:shadow-lg transition">
          <div className="w-10 h-10 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2">
            <Icons.Users className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{clientCount}</p>
          <p className="text-xs text-gray-500">Client</p>
        </div>
      </div>

      {/* Tabel User */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">📋 Daftar User</h2>
        </div>
        
        {users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada user terdaftar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr className="text-gray-600 dark:text-gray-300">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Bergabung</th>
                  <th className="p-3 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-3 text-gray-800 dark:text-gray-200">{user.id}</td>
                    <td className="p-3 font-medium text-gray-800 dark:text-white">{user.nama}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-300 break-all">{user.email}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="text-xs p-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="client">Client</option>
                          <option value="lawyer">Lawyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-3 text-gray-500 dark:text-gray-400">{new Date(user.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 transition">
                          <Icons.Edit /> Edit
                        </button>
                        <button onClick={() => handleDelete(user.id, user.nama)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center gap-1 transition">
                          <Icons.Trash /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Edit User */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 transition">
                <Icons.Close />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                <input
                  type="text"
                  value={editForm.nama}
                  onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alamat Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSaveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition">
                Simpan
              </button>
              <button onClick={() => setEditingUser(null)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-3 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage