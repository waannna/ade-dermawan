import { useState, useEffect, useCallback } from "react"
import useAuth from "./useAuth"
import api from "../utils/axios"
import { toast } from "react-hot-toast"

const useNotifications = () => {
  const { user, isAuthenticated, isLawyer, isClient } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [seenNotifications, setSeenNotifications] = useState(() => {
    const saved = localStorage.getItem("seenNotifications")
    return saved ? JSON.parse(saved) : []
  })

  const fetchConsultations = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      const response = await api.get("/consultations")
      let consultations = response.data.data || []

      if (isLawyer) {
        consultations = consultations.filter(c => c.lawyer_id === user?.id || c.lawyer_name === user?.nama)
      } else if (isClient) {
        consultations = consultations.filter(c => c.client_id === user?.id)
      }

      const newNotifications = []

      consultations.forEach(consultation => {
        const notifId = `${consultation.id}-${consultation.status}`
        
        if (!seenNotifications.includes(notifId)) {
          let title = ""
          let message = ""
          let type = ""

          if (isLawyer && consultation.status === "pending") {
            title = "📢 Orderan Baru!"
            message = `${consultation.client_name || "Client"} memesan konsultasi "${consultation.judul_kasus}"`
            type = "order"
          } 
          else if (isClient && consultation.status === "approved" && !seenNotifications.includes(`${consultation.id}-approved`)) {
            title = "✅ Konsultasi Disetujui!"
            message = `Konsultasi "${consultation.judul_kasus}" telah disetujui oleh lawyer`
            type = "approved"
          }
          else if (isClient && consultation.status === "completed" && !seenNotifications.includes(`${consultation.id}-completed`)) {
            title = "🎉 Konsultasi Selesai!"
            message = `Konsultasi "${consultation.judul_kasus}" telah selesai. Terima kasih telah menggunakan Counsela!`
            type = "completed"
          }
          else if (isClient && consultation.status === "cancelled" && !seenNotifications.includes(`${consultation.id}-cancelled`)) {
            title = "❌ Konsultasi Ditolak"
            message = `Konsultasi "${consultation.judul_kasus}" ditolak oleh lawyer`
            type = "cancelled"
          }

          if (title) {
            newNotifications.push({
              id: notifId,
              consultationId: consultation.id,
              title,
              message,
              type,
              status: consultation.status,
              createdAt: new Date().toISOString(),
              read: false
            })
          }
        }
      })

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev])
        
        newNotifications.forEach(notif => {
          toast(notif.title, {
            duration: 5000,
            icon: notif.type === "order" ? "🔔" : notif.type === "approved" ? "✅" : "📋",
            style: {
              borderRadius: '16px',
              background: '#1e293b',
              color: '#fff',
            }
          })
        })
        
        const newSeen = [...seenNotifications, ...newNotifications.map(n => n.id)]
        setSeenNotifications(newSeen)
        localStorage.setItem("seenNotifications", JSON.stringify(newSeen))
      }

      setUnreadCount(notifications.filter(n => !n.read).length + newNotifications.length)

    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }, [isAuthenticated, isLawyer, isClient, user, seenNotifications, notifications.length])

  // Hanya fetch sekali saat mount, TIDAK polling dengan setInterval
  useEffect(() => {
    if (isAuthenticated) {
      fetchConsultations()
    }
  }, [fetchConsultations, isAuthenticated])

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refreshNotifications: fetchConsultations
  }
}

export default useNotifications