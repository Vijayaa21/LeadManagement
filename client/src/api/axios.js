import axios from "axios";

const api = axios.create({
  baseURL: "https://leadmanagement-backend.onrender.com/api",
  withCredentials: true 
});

export default api;
