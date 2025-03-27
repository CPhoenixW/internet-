import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

// 获取用户信息
export const getUserProfile = async () => {
  try {
    const response = await api.get("/user/profile");
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
