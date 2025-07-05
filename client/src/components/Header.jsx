import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Menu, X } from 'lucide-react';

const Header = ({ onNavigate, onAdminLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Объекты", "О нас", "Контакты"];

  return (
    <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('hero')}>
          <Home className="text-primary" size={30} />
          <span className="text-2xl font-bold text-secondary">EstateFlow</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {links.map(link => (
            <button key={link} onClick={() => onNavigate(link.toLowerCase().replace(' ', '-'))} className="text-gray-600 hover:text-primary transition-colors text-lg">{link}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
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
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
