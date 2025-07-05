import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropertyCard from './PropertyCard';

// The component now receives onFiltersChange to pass filter state up
// and no longer receives onFilterChange which triggered fetches.
const PropertyList = ({ 
  properties = [], 
  onFiltersChange, 
  onPropertyClick, 
  allDistricts = [], 
  currencyPreference = 'som',
  onSortChange
}) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    // Pass the change up to the parent component (App.jsx)
    onFiltersChange(name, value);
  };
  
  const handleSortChange = (e) => {
    if (onSortChange) {
      onSortChange(e.target.value);
    }
  };

  return (
    <section id="объекты" className="py-16 lg:py-24 bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">Актуальные предложения</h2>
            <p className="text-lg text-gray-600 mt-2">Ознакомьтесь с лучшими объектами в нашем каталоге</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-6 bg-white rounded-xl shadow-md">
          <select name="type" onChange={handleFilterChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary">
            <option value="all">Все типы</option>
            <option value="Квартира">Квартира</option>
            <option value="Дом">Дом</option>
            <option value="Коммерция">Коммерция</option>
          </select>
          <select name="district" onChange={handleFilterChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary">
            <option value="all">Все районы</option>
            {Array.isArray(allDistricts) && allDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <input 
            type="number" 
            name="minPrice" 
            placeholder={currencyPreference === 'usd' ? "Цена от, $" : "Цена от, сом"} 
            onChange={handleFilterChange} 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary" 
          />
          <input 
            type="number" 
            name="maxPrice" 
            placeholder={currencyPreference === 'usd' ? "Цена до, $" : "Цена до, сом"} 
            onChange={handleFilterChange} 
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary" 
          />
        </div>
        
        <div className="flex justify-between items-center mb-10">
          <p className="text-gray-700">
            <span className="font-semibold">{properties.length}</span> объектов найдено
          </p>
          
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-sm text-gray-600">Сортировать:</label>
            <select 
              id="sort-select"
              onChange={handleSortChange}
              className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="new">Сначала новые</option>
              <option value="price_asc">По цене (сначала дешевле)</option>
              <option value="price_desc">По цене (сначала дороже)</option>
              <option value="area_asc">По площади (по возрастанию)</option>
              <option value="area_desc">По площади (по убыванию)</option>
            </select>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {Array.isArray(properties) && properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard 
                  key={property.id} 
                  property={property} 
                  onCardClick={onPropertyClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-10">
                <p>Объекты не найдены. Попробуйте изменить фильтры.</p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertyList;
