import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 获取用户信息
export const getUserInfo = async () => {
  try {
    const userId = localStorage.getItem("ID");
    if (!userId) {
      console.error("用户ID不存在");
      return null;
    }
    const response = await axios.get(`http://localhost:5000/api/userinfo/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
};

// 获取用户信息
export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile/");
    return response.data;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return {};
  }
};

// 更新用户信息
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put("/user/profile", userData);
    return response.data;
  } catch (error) {
    console.error("更新用户信息失败:", error);
  }
};
