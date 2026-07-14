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

export const loginUser = (data) => {
    return api.post('/auth/login',data);
}

export const getCurrentUser = () => {
    return api.get('/auth/me');
} 

export const logoutUser = () => {
    return api.get('/auth/logout');
} 

export const getprofile = () => {
    return api.get('/auth/profile');
} 

export const forgotPassword = (data) => {
  return api.post("/auth/forgot-password", data);
}

export const verifyResetOTP = (data) => {
  return api.post("/auth/verify-reset-otp", data);
}

export const ResetPassword = (data) => {
  return api.post("/auth/reset-password", data);
}
