import api from "./axiosConfig";

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    return data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  forgotPassword: async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  validateResetToken: async (token) => {
    const { data } = await api.post("/auth/validate-reset-token", { token });
    return data;
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    const { data } = await api.post("/auth/reset-password", {
      token,
      newPassword,
      confirmPassword,
    });
    return data;
  },
};