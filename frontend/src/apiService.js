import axios from "axios";

const API_URL = "http://localhost:8000/api/";

export const firmwareAPI = {
  getAll: async () => axios.get(`${API_URL}firmware-view/`),
  create: async (data, token) =>
    axios.post(`${API_URL}firmware-cud/`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    }),
  update: async (id, data, token) =>
    axios.put(`${API_URL}firmware-cud/?pk=${id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    }),
  delete: async (id, token) =>
    axios.delete(`${API_URL}firmware-cud/?pk=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
