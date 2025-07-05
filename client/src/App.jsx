import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { getProperties } from './services/api';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import PropertyList from './components/PropertyList';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import PropertyModal from './components/PropertyModal';
import AdminPanel from './components/AdminPanel';
import AddProperty from './components/AddProperty';

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
  fetchAndSetProperties, 
  isLoading, // Pass isLoading
  error // Pass error
}) => (
  <div className="min-h-screen bg-gray-50">
    <Header onNavigate={handleNavigate} isAdmin={isAdmin} onAdminLogin={handleAdminLogin} onAdminLogout={handleAdminLogout} />
    <main>
      <HeroSection onNavigate={handleNavigate} />
      {isLoading ? (
        <div className="text-center py-10">Загрузка объектов...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : (
        <PropertyList 
          properties={filteredProperties} 
          onPropertyClick={setSelectedProperty} 
          onFilterChange={fetchAndSetProperties} 
        />
      )}
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
        properties={properties}
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
  
  const fetchAndSetProperties = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProperties(filters);
      if (Array.isArray(data)) {
        setFilteredProperties(data);
        if (Object.keys(filters).length === 0) {
          setProperties(data);
        }
      } else {
        console.error("API did not return an array:", data);
        setError("Не удалось получить данные в ожидаемом формате.");
        setFilteredProperties([]); // Reset to empty array on error
      }
    } catch (error) {
      console.error("Ошибка при загрузке объектов:", error);
      setError(`Ошибка сети: ${error.message}`);
      setFilteredProperties([]); // Reset to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndSetProperties();
  }, [fetchAndSetProperties]);

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

  return (
    <Routes>
      <Route path="/" element={<HomePage
        properties={properties}
        filteredProperties={filteredProperties}
        selectedProperty={selectedProperty}
        setSelectedProperty={setSelectedProperty}
        isAdmin={isAdmin}
        handleNavigate={handleNavigate}
        handleAdminLogin={handleAdminLogin}
        handleAdminLogout={handleAdminLogout}
        handleAddProperty={handleAddProperty}
        handleEditProperty={handleEditProperty}
        handleDeleteProperty={handleDeleteProperty}
        fetchAndSetProperties={fetchAndSetProperties}
        isLoading={isLoading}
        error={error}
      />} />
      <Route path="/add" element={<AddProperty onAddProperty={handleAddProperty} />} />
    </Routes>
  );
}
