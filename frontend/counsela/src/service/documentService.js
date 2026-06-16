// src/services/documentService.js

import api from "../utils/axios";

const documentService = {
  uploadDocument: async (
    consultationId,
    file
  ) => {
    const formData = new FormData();

    formData.append(
      "document",
      file
    );

    const response = await api.post(
      `/documents/upload/${consultationId}`,
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  getDocuments: async (
    consultationId
  ) => {
    const response = await api.get(
      `/documents/${consultationId}`
    );

    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(
      `/documents/${id}`
    );

    return response.data;
  },
};

export default documentService;