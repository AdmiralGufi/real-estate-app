import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://real-estate-app-dqrc.onrender.com/api';

export const getProperties = async (filters) => {
    try {
        const response = await axios.get(`${API_URL}/properties`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Could not fetch properties", error);
        throw error;
    }
};

export const getPropertyById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/properties/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Could not fetch property with id ${id}`, error);
        throw error;
    }
};
