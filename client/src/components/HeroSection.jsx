import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = ({ onNavigate }) => (
  <section id="hero" className="relative h-[70vh] bg-cover bg-center flex items-center justify-center text-white" style={{backgroundImage: "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80')"}}>
    <div className="absolute inset-0 bg-black/50"></div>
    <motion.div 
      className="relative text-center p-4 z-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Найдите дом своей мечты</h1>
      <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">Мы помогаем вам найти идеальное место для жизни, работы и инвестиций.</p>
      <button onClick={() => onNavigate('объекты')} className="mt-8 bg-primary text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-transform hover:scale-105">Смотреть объекты</button>
    </motion.div>
  </section>
);

export default HeroSection;
