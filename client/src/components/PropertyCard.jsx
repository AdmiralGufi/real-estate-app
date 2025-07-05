import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, DollarSign } from 'lucide-react';
import { logEvent } from '../services/analytics';
import { somToUsd, formatUsd, formatSom } from '../services/currencyConverter';

const PropertyCard = ({ property, onCardClick }) => {
  const [showUsd, setShowUsd] = useState(false);
  
  const handleCardClick = () => {
    // Отслеживаем клик по объекту
    logEvent('Property', 'CardClick', `ID: ${property.id}`, property.price);
    // Вызываем основную функцию
    onCardClick(property);
  };
  
  const toggleCurrency = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события на родительский div
    setShowUsd(!showUsd);
    logEvent('UI', 'CurrencyToggle', `Property ID: ${property.id}`, showUsd ? 0 : 1);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow"
      onClick={handleCardClick}
    >
      <div className="relative">
          <img src={property.imageUrl} alt={property.title} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">{property.type}</div>
          
          {/* Отметка о снижении цены или горячем предложении */}
          {property.hotDeal && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Горячее предложение
            </div>
          )}
          
          {property.discountPercent && (
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{property.discountPercent}%
            </div>
          )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <div 
            className="text-2xl font-bold text-primary group relative"
            title={showUsd 
              ? `${property.price.toLocaleString('ru-RU')} сом`
              : formatUsd(somToUsd(property.price))
            }
          >
            {showUsd 
              ? formatUsd(somToUsd(property.price)) 
              : `${property.price.toLocaleString('ru-RU')} сом`
            }
            
            {/* Всплывающая подсказка с альтернативной валютой */}
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-sm p-2 rounded whitespace-nowrap z-10">
              {showUsd 
                ? `${property.price.toLocaleString('ru-RU')} сом`
                : formatUsd(somToUsd(property.price))
              }
            </div>
          </div>
          <button 
            onClick={toggleCurrency}
            className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-100 hover:bg-gray-200 transition-colors"
            title={showUsd ? "Показать в сомах" : "Показать в долларах"}
          >
            <DollarSign size={16} className={`${showUsd ? "text-green-600" : "text-gray-600"}`} />
          </button>
        </div>
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
