import React from 'react';

const ContactSection = () => (
    <section id="контакты" className="py-16 lg:py-24 bg-light">
      <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-secondary">Свяжитесь с нами</h2>
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ваше имя</label>
                    <input type="text" id="name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Сообщение</label>
                    <textarea id="message" rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all text-lg">Отправить</button>
            </form>
          </div>
      </div>
    </section>
);

export default ContactSection;
