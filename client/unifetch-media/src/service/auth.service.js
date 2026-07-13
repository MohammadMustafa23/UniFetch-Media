import api from './axios.js'

export const registerUser = (data) =>{
    return api.post('/auth/register',data);
}

export const verifyOTP = (data) => {
    return api.post('/auth/verify-otp',data);
}

export const resendOTP = (data) => {
  return api.post("/auth/resend-otp", data);
};