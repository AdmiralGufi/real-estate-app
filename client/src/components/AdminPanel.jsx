import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';

const AdminForm = ({ property, onSave, onCancel }) => {
    const [formData, setFormData] = useState(property || {
        title: '', type: 'Квартира', price: '', area: '', bedrooms: '', bathrooms: '',
        location: { district: '', address: '' }, description: '', features: '', imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'district' || name === 'address') {
            setFormData(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            price: Number(formData.price),
            area: Number(formData.area),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            features: formData.features.split(',').map(f => f.trim()),
        };
        onSave(finalData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <h3 className="text-xl font-bold mb-4">{property ? 'Редактировать объект' : 'Добавить объект'}</h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Название" className="w-full p-2 border rounded" required />
                    <div className="grid grid-cols-2 gap-3">
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full p-2 border rounded"><option>Квартира</option><option>Дом</option><option>Коммерция</option></select>
                        <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Цена" className="w-full p-2 border rounded" required />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <input name="area" type="number" value={formData.area} onChange={handleChange} placeholder="Площадь (м²)" className="w-full p-2 border rounded" required />
                        <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} placeholder="Спальни" className="w-full p-2 border rounded" />
                        <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} placeholder="Ванные" className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input name="district" value={formData.location.district} onChange={handleChange} placeholder="Район" className="w-full p-2 border rounded" required />
                        <input name="address" value={formData.location.address} onChange={handleChange} placeholder="Адрес" className="w-full p-2 border rounded" required />
                    </div>
                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Описание" className="w-full p-2 border rounded" />
                    <input name="features" value={Array.isArray(formData.features) ? formData.features.join(', ') : formData.features} onChange={handleChange} placeholder="Особенности (через запятую)" className="w-full p-2 border rounded" />
                    <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="URL изображения" className="w-full p-2 border rounded" required />
                    <div className="flex justify-end gap-4 pt-2">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Отмена</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminPanel = ({ onLogout, properties, onAdd, onEdit, onDelete }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);

    const handleEditClick = (property) => {
        setEditingProperty(property);
        setIsFormOpen(true);
    };

    const handleAddClick = () => {
        setEditingProperty(null);
        setIsFormOpen(true);
    };

    const handleSave = (property) => {
        if (editingProperty) {
            onEdit(property);
        } else {
            onAdd(property);
        }
        setIsFormOpen(false);
    };

    return (
        <>
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-2xl p-4 z-50 max-h-[60vh]"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Панель администратора</h2>
                    <button onClick={onLogout} className="p-2 rounded-full hover:bg-gray-200"><X size={24} /></button>
                </div>
                <div className="overflow-y-auto max-h-[calc(60vh-100px)]">
                    <button onClick={handleAddClick} className="w-full flex items-center justify-center gap-2 mb-4 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        <Plus size={20} /> Добавить объект
                    </button>
                    <ul className="space-y-2">
                        {properties.map(p => (
                            <li key={p.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                                <span className="truncate w-2/3">{p.title}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditClick(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit2 size={16} /></button>
                                    <button onClick={() => onDelete(p.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </motion.div>
            {isFormOpen && <AdminForm property={editingProperty} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />}
        </>
    );
};

export default AdminPanel;
