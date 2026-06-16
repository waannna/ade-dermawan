import { useState } from "react"
import lawyerService from "../service/lawyerService"

const useLawyers = () => {
  const [lawyers, setLawyers] = useState([])
  const [selectedLawyer, setSelectedLawyer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchLawyers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await lawyerService.getAllLawyers()
      console.log("Fetched lawyers:", data)
      setLawyers(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("fetchLawyers error:", err)
      setError(err.message || "Gagal memuat data lawyer")
      setLawyers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchLawyerById = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const data = await lawyerService.getLawyerById(id)
      console.log("Fetched lawyer by id:", data)
      setSelectedLawyer(data)
      return data
    } catch (err) {
      console.error("fetchLawyerById error:", err)
      setError(err.message || "Gagal memuat detail lawyer")
      setSelectedLawyer(null)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    lawyers,
    selectedLawyer,
    loading,
    error,
    fetchLawyers,
    fetchLawyerById,
  }
}

export default useLawyers