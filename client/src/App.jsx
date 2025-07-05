import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getProperties } from './services/api';
import { logPageView, logEvent, logConversion } from './services/analytics';
import { updateExchangeRate, somToUsd, usdToSom } from './services/currencyConverter';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PropertyList from './components/PropertyList';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import PropertyModal from './components/PropertyModal';
import AdminPanel from './components/AdminPanel';
import AddProperty from './components/AddProperty';
import YandexMap from './components/YandexMap';

const HomePage = ({ 
  properties, 
  filteredProperties, 
  selectedProperty, 
  setSelectedProperty, 
  isAdmin, 
  handleNavigate, 
  handleAdminLogin, 
  handleAdminLogout, 
  handleAddProperty, 
  handleEditProperty, 
  handleDeleteProperty, 
  handleFilterChange,
  handleCurrencyChange,
  currencyPreference,
  isLoading,
  error,
  allDistricts
}) => (
  <div className="min-h-screen bg-gray-50">
    <Header 
      onNavigate={handleNavigate} 
      isAdmin={isAdmin} 
      onAdminLogin={handleAdminLogin} 
      onAdminLogout={handleAdminLogout}
      currencyPreference={currencyPreference}
      onCurrencyChange={handleCurrencyChange}
    />
    <main>
      <HeroSection onNavigate={handleNavigate} />
      {isLoading ? (
        <div className="text-center py-10">Загрузка объектов...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <PropertyList 
          properties={filteredProperties || []} 
          onPropertyClick={setSelectedProperty} 
          onFiltersChange={handleFilterChange}
          onSortChange={handleSortChange}
          currencyPreference={currencyPreference}
          allDistricts={allDistricts || []}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <YandexMap properties={filteredProperties || []} />
      </div>
      <AboutSection />
      <ContactSection />
    </main>
    <Footer />
    
    <AnimatePresence>
      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}
    </AnimatePresence>
    
    {isAdmin && (
      <AdminPanel 
        properties={properties || []}
        onAddProperty={handleAddProperty}
        onEditProperty={handleEditProperty}
        onDeleteProperty={handleDeleteProperty}
      />
    )}
  </div>
);

export default function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allDistricts, setAllDistricts] = useState([]);
  const [currencyPreference, setCurrencyPreference] = useState('som'); // 'som' или 'usd'
  const [sortOrder, setSortOrder] = useState('new'); // Добавляем состояние для сортировки
  const [filters, setFilters] = useState({
    type: 'all',
    district: 'all',
    minPrice: '',
    maxPrice: ''
  });
  
  const location = useLocation();
  
  // Отслеживание изменения страницы
  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);
  
  // Обновление курса валют при загрузке приложения
  useEffect(() => {
    updateExchangeRate()
      .then(rate => console.log('Exchange rate loaded:', rate))
      .catch(err => console.error('Failed to update exchange rate:', err));
  }, []);
  
  // Функция для переключения валюты
  const handleCurrencyChange = (newCurrency) => {
    setCurrencyPreference(newCurrency);
    logEvent('UI', 'CurrencyPreferenceChange', newCurrency);
  };
  
  const handleSortChange = (sortValue) => {
    setSortOrder(sortValue);
    
    // Применяем сортировку к текущим отфильтрованным объектам
    const sorted = [...filteredProperties].sort((a, b) => {
      switch(sortValue) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'area_asc':
          return a.area - b.area;
        case 'area_desc':
          return b.area - a.area;
        case 'new':
        default:
          // По умолчанию сортируем по ID (предполагая, что новые объекты имеют большие ID)
          return b.id - a.id;
      }
    });
    
    setFilteredProperties(sorted);
    logEvent('UI', 'SortOrderChange', sortValue);
  };
  
  // ...existing code...
  // This now only loads data from API once at the beginning
  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProperties();
      if (Array.isArray(data)) {
        setProperties(data);
        setFilteredProperties(data);
        
        // Safely extract unique districts
        const districts = [];
        data.forEach(property => {
          if (property && property.location && property.location.district) {
            if (!districts.includes(property.location.district)) {
              districts.push(property.location.district);
            }
          }
        });
        setAllDistricts(districts);
      } else {
        console.error("API did not return an array:", data);
        setError("Не удалось получить данные в ожидаемом формате.");
        setProperties([]);
        setFilteredProperties([]);
      }
    } catch (error) {
      console.error("Ошибка при загрузке объектов:", error);
      setError(`Ошибка сети: ${error.message}`);
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch properties only once when the component mounts
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Log page views
  useEffect(() => {
    logPageView(location.pathname);
  }, [location.pathname]);

  // New function to handle filter changes
  const handleFilterChange = (name, value) => {
    // Update filters state
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Apply filters to the properties
    let result = [...properties];
    
    // Type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type);
    }
    
    // District filter
    if (filters.district && filters.district !== 'all') {
      result = result.filter(p => p.location?.district === filters.district);
    }
    
    // Price range filter with currency conversion
    if (filters.minPrice) {
      const minPriceInSom = currencyPreference === 'usd' 
        ? usdToSom(Number(filters.minPrice)) 
        : Number(filters.minPrice);
        
      result = result.filter(p => p.price >= minPriceInSom);
    }
    if (filters.maxPrice) {
      const maxPriceInSom = currencyPreference === 'usd' 
        ? usdToSom(Number(filters.maxPrice)) 
        : Number(filters.maxPrice);
        
      result = result.filter(p => p.price <= maxPriceInSom);
    }
    
    // Update filtered properties
    setFilteredProperties(result);
  };

  const handleNavigate = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdminLogin = () => {
    // Fake login logic
    setIsAdmin(true);
  };
  
  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  // Admin actions are simulated locally for this MVP
  const handleAddProperty = (newProperty) => {
    const propertyToAdd = { ...newProperty, id: Date.now() };
    setProperties(prev => [propertyToAdd, ...prev]);
    setFilteredProperties(prev => [propertyToAdd, ...prev]);
  };

  const handleEditProperty = (updatedProperty) => {
    const updater = (prev) => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p);
    setProperties(updater);
    setFilteredProperties(updater);
  };

  const handleDeleteProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
    setFilteredProperties(filteredProperties.filter(p => p.id !== id));
  };

  // Log property interactions
  const handlePropertyInteraction = (propertyId, action) => {
    logEvent('property_interaction', {
      property_id: propertyId,
      action: action,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage
        properties={properties}
        filteredProperties={filteredProperties}
        selectedProperty={selectedProperty}
        setSelectedProperty={trackPropertySelection}
        isAdmin={isAdmin}
        handleNavigate={handleNavigate}
        handleAdminLogin={handleAdminLogin}
        handleAdminLogout={handleAdminLogout}
        handleAddProperty={handleAddProperty}
        handleEditProperty={handleEditProperty}
        handleDeleteProperty={handleDeleteProperty}          handleFilterChange={handleFilterChange}
          handleCurrencyChange={handleCurrencyChange}
          handleSortChange={handleSortChange}
          currencyPreference={currencyPreference}
        isLoading={isLoading}
        error={error}
        allDistricts={allDistricts}
      />} />
      <Route path="/add" element={<AddProperty onAddProperty={handleAddProperty} />} />
    </Routes>
  );
}
