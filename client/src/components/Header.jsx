import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Menu, X, Plus, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { logConversion } from '../services/analytics';

const Header = ({ onNavigate, onAdminLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Объекты", "О нас", "Контакты"];
  
  const handlePhoneClick = () => {
    // Отслеживаем клик по телефону как конверсию
    logConversion('PhoneClick', { label: 'Header Phone' });
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <Home className="text-primary" size={30} />
          <span className="text-2xl font-bold text-secondary">EstateFlow</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <button key={link} onClick={() => onNavigate(link.toLowerCase().replace(' ', '-'))} className="text-gray-600 hover:text-primary transition-colors text-lg">{link}</button>
          ))}
          <a 
            href="tel:+71234567890" 
            onClick={handlePhoneClick}
            className="text-primary hover:text-primary-dark transition-colors text-lg font-semibold flex items-center gap-1"
          >
            <Phone size={18} />
            +7 (123) 456-78-90
          </a>
        </nav>
        <div className="flex items-center gap-4">
            <Link to="/add" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all text-base font-semibold flex items-center gap-2">
                <Plus size={20} />
                Добавить объект
            </Link>
            <button onClick={onAdminLogin} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all text-base font-semibold">
                Войти
            </button>
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t"
            >
                <div className="flex flex-col items-center p-4 gap-4">
                    {links.map(link => (
                        <button key={link} onClick={() => { onNavigate(link.toLowerCase().replace(' ', '-')); setIsOpen(false); }} className="text-gray-600 hover:text-primary transition-colors w-full py-2">{link}</button>
                    ))}
                    <a 
                      href="tel:+71234567890" 
                      onClick={handlePhoneClick}
                      className="text-primary hover:text-primary-dark transition-colors text-lg font-semibold flex items-center justify-center gap-1 w-full py-2"
                    >
                      <Phone size={18} />
                      +7 (123) 456-78-90
                    </a>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
