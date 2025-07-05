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
  fetchAndSetProperties 
}) => (
  <div className="min-h-screen bg-gray-50">
    <Header onNavigate={handleNavigate} isAdmin={isAdmin} onAdminLogin={handleAdminLogin} onAdminLogout={handleAdminLogout} />
    <main>
      <HeroSection onNavigate={handleNavigate} />
      <PropertyList 
        properties={filteredProperties} 
        onPropertyClick={setSelectedProperty} 
        onFilterChange={fetchAndSetProperties} 
      />
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
  
  const fetchAndSetProperties = useCallback(async (filters = {}) => {
    try {
      const data = await getProperties(filters);
      setFilteredProperties(data);
      if (Object.keys(filters).length === 0) {
        setProperties(data);
      }
    } catch (error) {
      console.error("Ошибка при загрузке объектов:", error);
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
    const updater = (prev) => prev.filter(p => p.id !== id);
    setProperties(updater);
    setFilteredProperties(updater);
  };

  return (
    <Routes>
      <Route path="/" element={
        <HomePage 
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
        />
      } />
      <Route path="/add" element={<AddProperty />} />
    </Routes>
  );
}
