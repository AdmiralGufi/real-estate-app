import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Bath, X, Home, DollarSign } from 'lucide-react';
import { somToUsd, formatUsd, formatSom } from '../services/currencyConverter';

const PropertyModal = ({ property, onClose }) => {
  const [showUsd, setShowUsd] = useState(false);
  
  const toggleCurrency = () => {
    setShowUsd(!showUsd);
  };
  
  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative">
                <img src={property.imageUrl} alt={property.title} className="w-full h-96 object-cover rounded-t-2xl" />
                <button onClick={onClose} className="absolute top-4 right-4 bg-white/70 rounded-full p-2 hover:bg-white">
                    <X size={24} />
                </button>
            </div>
            <div className="p-8">
                <div className="flex flex-col md:flex-row justify-between items-start">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-secondary">{property.title}</h1>
                        <p className="text-gray-500 flex items-center mt-2 text-lg">
                            <MapPin size={20} className="mr-2"/> {property.location.address}, {property.location.district}
                        </p>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-primary mt-4 md:mt-0 flex-shrink-0 flex items-center gap-2">
                        {showUsd 
                          ? formatUsd(somToUsd(property.price))
                          : `${property.price.toLocaleString('ru-RU')} сом`
                        }
                        <button 
                          onClick={toggleCurrency}
                          className="flex items-center justify-center rounded-full w-10 h-10 bg-gray-100 hover:bg-gray-200 transition-colors ml-2"
                          title={showUsd ? "Показать в сомах" : "Показать в долларах"}
                        >
                          <DollarSign size={20} className={`${showUsd ? "text-green-600" : "text-gray-600"}`} />
                        </button>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 my-6 text-gray-700 border-y py-4">
                    <div className="flex items-center gap-2 text-lg"><Home size={24}/> {property.type}</div>
                    {property.type !== 'Коммерция' && (
                      <>
                        <div className="flex items-center gap-2 text-lg"><BedDouble size={24}/> {property.bedrooms} спальни</div>
                        <div className="flex items-center gap-2 text-lg"><Bath size={24}/> {property.bathrooms} ванные</div>
                      </>
                    )}
                    <span className="text-lg font-semibold">{property.area} м²</span>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-secondary mb-3">Описание</h2>
                    <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
                
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-secondary mb-4">Особенности</h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                        {property.features.map(feature => (
                            <li key={feature} className="flex items-center text-gray-700">
                                <div className="bg-blue-100 text-primary rounded-full p-1 mr-3">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="mt-10 text-center">
                    <button className="bg-primary text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-opacity-90 transition-all transform hover:scale-105">
                        Записаться на просмотр
                    </button>
                </div>
            </div>
        </motion.div>
    </motion.div>
  );
};

export default PropertyModal;
