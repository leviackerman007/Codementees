import axios from 'axios';
const api=axios.create({
    baseURL:"http://localhost:5000/api",
});

api.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

const BASE_URL = 'http://localhost:5000/api';

export const signupUser = async (data) => {
    const res = await api.post("/auth/signup",data);
    return res.data;
}

export const loginUser = async (data) =>{
    const res = await api.post("/auth/login",data);
    return res.data;
}
export default api;