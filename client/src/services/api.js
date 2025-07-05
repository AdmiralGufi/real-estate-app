import axios from 'axios';

// Создаем базовый axios-клиент с настройками
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: false // Отключаем отправку cookies для избежания CORS проблем
});

// Интерцептор для отлавливания ошибок
axiosClient.interceptors.response.use(
    response => response,
    error => {
        console.error('API Error:', error);
        if (error.response) {
            // Сервер ответил кодом не 2xx
            console.log('Error data:', error.response.data);
            console.log('Error status:', error.response.status);
        } else if (error.request) {
            // Запрос был отправлен, но нет ответа
            console.log('Error request:', error.request);
            // В режиме разработки можно использовать моковые данные
            if (process.env.NODE_ENV === 'development') {
                console.log('Using mock data in development mode');
                // Здесь можно вернуть моковые данные
            }
        } else {
            // Произошла ошибка при настройке запроса
            console.log('Error message:', error.message);
        }
        return Promise.reject(error);
    }
);

export const getProperties = async (filters) => {
    try {
        const response = await axiosClient.get(`/properties`, { params: filters });
        return response.data;
    } catch (error) {
        console.error("Could not fetch properties", error);
        // В режиме разработки возвращаем моковые данные
        if (process.env.NODE_ENV === 'development') {
            console.log('Returning mock properties data');
            return mockProperties;
        }
        throw error;
    }
};

export const getPropertyById = async (id) => {
    try {
        const response = await axiosClient.get(`/properties/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Could not fetch property with id ${id}`, error);
        // В режиме разработки возвращаем моковые данные
        if (process.env.NODE_ENV === 'development') {
            console.log(`Returning mock property data for id: ${id}`);
            return mockProperties.find(p => p.id.toString() === id.toString()) || mockProperties[0];
        }
        throw error;
    }
};

export const createProperty = async (propertyData) => {
    try {
        const response = await axiosClient.post(`/properties`, propertyData);
        return response.data;
    } catch (error) {
        console.error("Could not create property", error);
        throw error;
    }
};

export const updateProperty = async (id, propertyData) => {
    try {
        const response = await axiosClient.put(`/properties/${id}`, propertyData);
        return response.data;
    } catch (error) {
        console.error(`Could not update property with id ${id}`, error);
        throw error;
    }
};

export const deleteProperty = async (id) => {
    try {
        const response = await axiosClient.delete(`/properties/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Could not delete property with id ${id}`, error);
        throw error;
    }
};

// Моковые данные для режима разработки
const mockProperties = [
  {
    id: 1,
    title: "Современная квартира в центре",
    description: "Просторная светлая квартира с современным ремонтом в центре города",
    price: 4500000,
    area: 85,
    rooms: 3,
    floor: 5,
    totalFloors: 9,
    address: "ул. Киевская, 95",
    district: "Центр",
    type: "Квартира",
    status: "Продажа",
    coordinates: [42.87461, 74.59936],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80"
    ],
    features: ["Балкон", "Кондиционер", "Парковка"]
  },
  {
    id: 2,
    title: "Дом с участком в Бишкеке",
    description: "Уютный дом с большим участком, идеально для семьи",
    price: 12000000,
    area: 180,
    landArea: 600,
    rooms: 5,
    address: "ул. Жукеева-Пудовкина, 43",
    district: "Асанбай",
    type: "Дом",
    status: "Продажа",
    coordinates: [42.84850, 74.58911],
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80"
    ],
    features: ["Гараж", "Сад", "Теплый пол"]
  },
  {
    id: 3,
    title: "Коммерческое помещение в Бизнес-центре",
    description: "Офисное помещение с ремонтом в современном бизнес-центре",
    price: 8500000,
    area: 120,
    address: "пр. Чуй, 219",
    district: "Центр",
    type: "Коммерция",
    status: "Продажа",
    coordinates: [42.87206, 74.61922],
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80"
    ],
    features: ["Отдельный вход", "Парковка", "Охрана"]
  },
  {
    id: 4,
    title: "Элитная квартира с видом на горы",
    description: "Роскошная квартира с панорамными окнами и видом на горы",
    price: 9800000,
    area: 150,
    rooms: 4,
    floor: 12,
    totalFloors: 14,
    address: "ул. Исанова, 79",
    district: "Филармония",
    type: "Квартира",
    status: "Продажа",
    coordinates: [42.87793, 74.61033],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80"
    ],
    features: ["Панорамный вид", "Теплый пол", "Подземный паркинг", "Охрана"]
  }
];
