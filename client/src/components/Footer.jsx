import React from 'react';

const Footer = () => (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} EstateFlow. Все права защищены.</p>
        <p className="text-sm text-gray-400 mt-1">Современные решения для вашей недвижимости</p>
      </div>
    </footer>
);

export default Footer;
