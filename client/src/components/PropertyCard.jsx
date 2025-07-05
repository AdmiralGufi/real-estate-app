import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath } from 'lucide-react';
import { logEvent } from '../services/analytics';

const PropertyCard = ({ property, onCardClick }) => {
  const handleCardClick = () => {
    // Отслеживаем клик по объекту
    logEvent('Property', 'CardClick', `ID: ${property.id}`, property.price);
    // Вызываем основную функцию
    onCardClick(property);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
          <img src={property.imageUrl} alt={property.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{property.type}</div>
      </div>
      <div className="p-5">
        <p className="text-2xl font-bold text-primary">{property.price.toLocaleString('ru-RU')} ₽</p>
        <h3 className="text-xl font-semibold text-secondary mt-1 truncate">{property.title}</h3>
        <p className="text-gray-500 flex items-center mt-2">
          <MapPin size={16} className="mr-1.5 flex-shrink-0"/> {property.location.district}
        </p>
        <div className="flex justify-start items-center gap-4 mt-4 text-gray-600 border-t pt-3">
          {property.type !== 'Коммерция' && (
            <>
              <div className="flex items-center gap-1.5"><BedDouble size={20}/> {property.bedrooms}</div>
              <div className="flex items-center gap-1.5"><Bath size={20}/> {property.bathrooms}</div>
            </>
          )}
          <span>{property.area} м²</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
