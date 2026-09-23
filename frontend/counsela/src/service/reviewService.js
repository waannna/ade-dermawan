import api from "../utils/axios";

const reviewService = {
  createReview: async (data) => {
    const response = await api.post(
      "/reviews",
      data
    );

    return response.data;
  },

  getReviewsByLawyer: async (
    lawyerId
  ) => {
    const response = await api.get(
      `/reviews/lawyer/${lawyerId}`
    );

    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(
      `/reviews/${id}`
    );

    return response.data;
  },
};

export default reviewService;