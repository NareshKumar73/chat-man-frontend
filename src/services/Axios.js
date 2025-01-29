import axios from "axios";

export const baseURL = "http://localhost:9000";

export const Axios = axios.create({
  baseURL: baseURL,
});
