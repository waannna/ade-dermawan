import api from "../utils/axios"

const lawyerService = {
  getAllLawyers: async () => {
    try {
      const response = await api.get("/lawyers")
      console.log("API Response /lawyers:", response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error getAllLawyers:", error)
      throw error
    }
  },

  getLawyerById: async (id) => {
    try {
      const response = await api.get(`/lawyers/${id}`)
      console.log("API Response /lawyers/${id}:", response.data)
      return response.data.data || response.data
    } catch (error) {
      console.error("Error getLawyerById:", error)
      throw error
    }
  },

  createLawyer: async (lawyerData) => {
    const response = await api.post("/lawyers", lawyerData)
    return response.data
  },

  updateLawyer: async (id, lawyerData) => {
    const response = await api.put(`/lawyers/${id}`, lawyerData)
    return response.data
  },

  deleteLawyer: async (id) => {
    const response = await api.delete(`/lawyers/${id}`)
    return response.data
  }
}

export default lawyerService