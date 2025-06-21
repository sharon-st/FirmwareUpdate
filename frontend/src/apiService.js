import axios from "axios";

const API_URL = "https://linkfirmware.duckdns.org/api/";

export const firmwareAPI = {
  getAll: async () => axios.get(`${API_URL}firmware-view/`),
  create: async (data) => {
    const token = localStorage.getItem("accessToken");
    return axios.post(`${API_URL}firmware-cud/`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });
  },
  update: async (id, data, token) =>
    axios.put(`${API_URL}firmware-cud/?pk=${id}`, data, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    }),
  delete: async (id, token) =>
    axios.delete(`${API_URL}firmware-cud/?pk=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};
