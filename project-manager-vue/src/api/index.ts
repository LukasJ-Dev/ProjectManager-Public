import axios from "axios";

export const baseURL = "http://localhost:3000";

const axiosClient = axios.create({
  baseURL: `${baseURL}/api/v1`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
//Middleware for adding token to requests
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  console.log(config.headers["Authorization"]);
  return config;
});

export const login = async (email: string, password: string) => {
  console.log(email, " ", password);
  const response = await axiosClient.post("/auth/login", {
    email,
    password,
  });
  console.log(response);
  return response.data;
};

export const register = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  profile_image: string
) => {
  /*
  email         String   @unique
  first_name    String
  last_name     String
  password      String
  profile_image String
*/
  const response = await axiosClient.post("/auth/register", {
    data: {
      email,
      password,
      first_name,
      last_name,
      profile_image,
    },
  });
  console.log(response);
  return response.data.data;
};

export const getUser = async () => {
  const response = await axiosClient.get("/auth/user");
  console.log(response);
  return response.data;
};

export const getSuggestions = async (boardTitle: string, boardId: string) => {
  const response = await axiosClient.post("/ai/suggestions", {
    boardTitle,
    boardId,
  });
  return response.data;
};
