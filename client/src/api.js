import axios from "axios";

const URL = 'http://localhost:4000';

const requestInterceptorConfig = (config) => {

    const token = sessionStorage.getItem('user');

    config.headers.Authorization = token ? `Bearer ${token}` : '';
    
    return config;
};
const requestInterceptorError = (error) => {

    return Promise.reject(error);
};
axios.interceptors.request.use(requestInterceptorConfig, requestInterceptorError);

export const getUsers = async () => {

    const response = await axios.get(`${URL}/users`);

    if (response.status === 200) {
        return response.data
    } else {
        return
    };

};

export const getUser = async (id) => {

    const response = await axios.get(`${URL}/users/${id}`);

    const user = response.data;

    return user;
};

export const createUser = async ( user ) => {

    const response = await axios.post(`${URL}/users`,user);

    return response;
};

export const updateUser = async (id, user) => {

    const response =await  axios.put(`${URL}/users/${id}`,user);
    return response;
};

export const deleteUser = async (id) => {

    const response =await  axios.delete(`${URL}/users/${id}`);

    return response;
};

export const verifyUser = async (user) => {

    const response = await axios.post(`${URL}/users/login`,user);
    if(response.data.success){
        return response.data;
    }else {
        return response.data
    }
};



export const getServices = async () => {

    const response = await axios.get(`${URL}/services`);

    if (response.status === 200) {
        return response.data
    } else {
        return
    };
};

export const getService = async (id) => {

    const response = await axios.get(`${URL}/services/${id}`);

    const service = response.data;

    return service;
};

export const createService = async ( service ) => {

    const response =await axios.post(`${URL}/services`,service);

    return response;
};

export const updateService = async (id, service) => {

    const response =await axios.put(`${URL}/services/${id}`,service);
    return response;
};

export const deleteService = async (id) => {

    const response =await axios.delete(`${URL}/services/${id}`);

    return response;
};



export const getAppointments = async () => {

    const response =await axios.get(`${URL}/appointments`);
    if (response.status === 200) {
        return response.data
    } else {
        return
    };
};

export const getAppointment = async (id) => {

    const response = await axios.get(`${URL}/appointments/${id}`);

    const appointment = response.data;

    return appointment;
};

export const createAppointment = async ( appointment ) => {

    const response = await axios.post(`${URL}/appointments`,appointment);

    return response;
};

export const updateAppointment = async (id, appointment) => {

    const response =await axios.put(`${URL}/appointments/${id}`,appointment);
    return response;
};

export const deleteAppointment = async (id) => {

    const response =await axios.delete(`${URL}/appointments/${id}`);

    return response;
};