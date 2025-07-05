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

export const createProperty = async (propertyData) => {
    try {
        const response = await axios.post(`${API_URL}/properties`, propertyData);
        return response.data;
    } catch (error) {
        console.error("Could not create property", error);
        throw error;
    }
};

export const updateProperty = async (id, propertyData) => {
    try {
        const response = await axios.put(`${API_URL}/properties/${id}`, propertyData);
        return response.data;
    } catch (error) {
        console.error(`Could not update property with id ${id}`, error);
        throw error;
    }
};

export const deleteProperty = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/properties/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Could not delete property with id ${id}`, error);
        throw error;
    }
};
