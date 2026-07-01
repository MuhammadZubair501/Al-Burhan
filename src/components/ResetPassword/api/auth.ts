import axios from "axios";

const BASE = "http://192.9.210.50:5000/api";

export const getUserByEmail = (email: string) =>
  axios.post(`${BASE}/auth/get-user-by-email`, { email });

// ✅ FIXED ROUTES (IMPORTANT)
export const requestOTP = (email: string) =>
  axios.post(`${BASE}/otp/send`, { email });

export const verifyOTP = (email: string, otp: string) =>
  axios.post(`${BASE}/otp/verify`, { email, otp });