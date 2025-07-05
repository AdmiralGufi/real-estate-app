import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from './PropertyCard';

const PropertyList = ({ properties, onFilterChange, onCardClick, allDistricts }) => {
  const [filters, setFilters] = useState({ type: 'all', district: 'all', minPrice: '', maxPrice: '' });

  const handleFilterChange = (e) => {
    const newFilters = { ...filters, [e.target.name]: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <section id="объекты" className="py-16 lg:py-24 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Актуальные предложения</h2>
            <p className="text-lg text-gray-600 mt-2">Ознакомьтесь с лучшими объектами в нашем каталоге</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 p-6 bg-white rounded-xl shadow-md">
          <select name="type" onChange={handleFilterChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary">
            <option value="all">Все типы</option>
            <option value="Квартира">Квартира</option>
            <option value="Дом">Дом</option>
            <option value="Коммерция">Коммерция</option>
          </select>
          <select name="district" onChange={handleFilterChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary">
            <option value="all">Все районы</option>
            {allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input type="number" name="minPrice" placeholder="Цена от, ₽" onChange={handleFilterChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary" />
          <input type="number" name="maxPrice" placeholder="Цена до, ₽" onChange={handleFilterChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary" />
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {properties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onCardClick={onCardClick}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertyList;
