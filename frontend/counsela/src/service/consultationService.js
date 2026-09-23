import api from "../utils/axios"

const consultationService = {
  createConsultation: async (data) => {
    const response = await api.post("/consultations", data)
    return response.data
  },

  getConsultations: async () => {
    const response = await api.get("/consultations")
    return response.data
  },

  getConsultationById: async (id) => {
    const response = await api.get(`/consultations/${id}`)
    return response.data
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/consultations/${id}/status`, { status })
    return response.data
  },

  updateMeetingLink: async (id, meeting_link) => {
    const response = await api.patch(`/consultations/${id}/meeting-link`, { meeting_link })
    return response.data
  },

  deleteConsultation: async (id) => {
    const response = await api.delete(`/consultations/${id}`)
    return response.data
  },

  getArchivedConsultations: async () => {
    const response = await api.get("/consultations/archived")
    return response.data
  },

  unarchiveConsultation: async (id) => {
    const response = await api.patch(`/consultations/${id}/unarchive`)
    return response.data
  }
}

export default consultationService