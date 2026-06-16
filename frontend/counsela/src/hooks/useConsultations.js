import { useState } from "react"
import api from "../utils/axios"

const useConsultations = () => {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get("/consultations")
      console.log("Consultations API Response:", response.data) // Debug
      const data = response.data.data || response.data
      setConsultations(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("fetchConsultations error:", err)
      setError(err.response?.data?.message || "Gagal memuat data konsultasi")
      setConsultations([])
    } finally {
      setLoading(false)
    }
  }

  return {
    consultations,
    loading,
    error,
    fetchConsultations,
  }
}

export default useConsultations