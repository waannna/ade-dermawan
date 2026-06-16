import { useState } from "react"
import api from "../utils/axios"

const useLawyerSchedule = () => {
  const [loading, setLoading] = useState(false)
  const [bookedSlots, setBookedSlots] = useState([])

  const fetchBookedSlots = async (lawyerId, date) => {
    if (!lawyerId || !date) return []
    
    try {
      setLoading(true)
      const response = await api.get(`/consultations/lawyer/${lawyerId}/schedule`, {
        params: { tanggal: date }
      })
      const booked = response.data.data || []
      setBookedSlots(booked)
      return booked
    } catch (error) {
      console.error("Gagal mengambil jadwal:", error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const isTimeSlotAvailable = (time) => {
    return !bookedSlots.some(slot => slot.jam_konsultasi === time)
  }

  const getAvailableTimeSlots = (timeSlots) => {
    return timeSlots.filter(time => isTimeSlotAvailable(time))
  }

  return {
    loading,
    bookedSlots,
    fetchBookedSlots,
    isTimeSlotAvailable,
    getAvailableTimeSlots
  }
}

export default useLawyerSchedule