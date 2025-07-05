import React, { useState } from 'react';
import { createProperty } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AddProperty = () => {
    const [formData, setFormData] = useState({
        title: '',
        type: 'Квартира',
        price: '',
        area: '',
        bedrooms: '',
        bathrooms: '',
        location: {
            district: 'Центральный',
            address: ''
        },
        description: '',
        features: [],
        imageUrl: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'district' || name === 'address') {
            setFormData(prev => ({
                ...prev,
                location: { ...prev.location, [name]: value }
            }));
        } else if (name === 'features') {
            setFormData(prev => ({ ...prev, features: value.split(',').map(f => f.trim()) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const propertyData = {
                ...formData,
                price: parseInt(formData.price),
                area: parseInt(formData.area),
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
            };
            const newProperty = await createProperty(propertyData);
            setMessage(`Объект "${newProperty.title}" успешно добавлен!`);
            setTimeout(() => navigate('/'), 2000); // Redirect to home page after 2 seconds
        } catch (error) {
            setMessage('Ошибка при добавлении объекта. Пожалуйста, попробуйте снова.');
            console.error(error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Добавить новый объект</h1>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                <input type="text" name="title" placeholder="Заголовок" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="imageUrl" placeholder="URL изображения" value={formData.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" required />
                <textarea name="description" placeholder="Описание" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
                <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded">
                    <option>Квартира</option>
                    <option>Дом</option>
                    <option>Коммерция</option>
                </select>
                <select name="district" value={formData.location.district} onChange={handleChange} className="w-full p-2 border rounded">
                    <option>Центральный</option>
                    <option>Пригородный</option>
                    <option>Промышленный</option>
                    <option>Исторический</option>
                </select>
                <input type="text" name="address" placeholder="Адрес" value={formData.location.address} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="price" placeholder="Цена" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="area" placeholder="Площадь (кв.м)" value={formData.area} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="bedrooms" placeholder="Кол-во спален" value={formData.bedrooms} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="number" name="bathrooms" placeholder="Кол-во ванных" value={formData.bathrooms} onChange={handleChange} className="w-full p-2 border rounded" required />
                <input type="text" name="features" placeholder="Особенности (через запятую)" value={formData.features.join(', ')} onChange={handleChange} className="w-full p-2 border rounded" />
                
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Добавить объект</button>
            </form>
            {message && <p className="mt-4 text-center text-green-500">{message}</p>}
        </div>
    );
};

export default AddProperty;
