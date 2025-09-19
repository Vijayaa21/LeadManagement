import axios from "axios";

const API_URL = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

export default api;
