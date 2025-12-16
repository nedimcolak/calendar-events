import api from "./api";

export const getUser = async () => {
  try {
    const res = await api.get("/api/auth/me", { withCredentials: true });
    return res.data.user;
  } catch {
    return null;
  }
};
