import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:5171/api",
});

export default client;
