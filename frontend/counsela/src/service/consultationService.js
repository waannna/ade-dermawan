import api from "../utils/axios"

const consultationService = {
  // CREATE
  createConsultation: async (data) => {
    const response = await api.post("/consultations", data)
    return response.data
  },

  // GET ALL
  getConsultations: async () => {
    const response = await api.get("/consultations")
    return response.data
  },

  // GET DETAIL BY ID
  getConsultationById: async (id) => {
    const response = await api.get(`/consultations/${id}`)
    return response.data
  },

  // UPDATE STATUS
  updateStatus: async (id, status) => {
    const response = await api.patch(`/consultations/${id}/status`, { status })
    return response.data
  },

  // UPDATE MEETING LINK
  updateMeetingLink: async (id, meeting_link) => {
    const response = await api.patch(`/consultations/${id}/meeting-link`, { meeting_link })
    return response.data
  },

  // DELETE
  deleteConsultation: async (id) => {
    const response = await api.delete(`/consultations/${id}`)
    return response.data
  }
}

export default consultationService