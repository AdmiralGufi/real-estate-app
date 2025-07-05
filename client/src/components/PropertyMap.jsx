import React, { useEffect, useRef, useState } from 'react';

const PropertyMap = ({ properties }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  // Загружаем API Google Maps
  useEffect(() => {
    // Проверяем, загружен ли уже скрипт Google Maps
    if (!window.google) {
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Определяем функцию инициализации для коллбэка
      window.initMap = () => {
        setMapLoaded(true);
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Удаляем скрипт при размонтировании компонента
        document.head.removeChild(script);
        window.initMap = null;
      };
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Инициализируем карту после загрузки API
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Координаты центра Бишкека
      const bishkekCenter = { lat: 42.8746, lng: 74.5698 };
      
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: bishkekCenter,
        zoom: 12,
        styles: [
          // Можно добавить стили для карты
        ]
      });
      
      setMap(newMap);
    }
  }, [mapLoaded]);

  // Добавляем маркеры на карту
  useEffect(() => {
    if (map && properties && properties.length > 0) {
      // Удаляем предыдущие маркеры
      markers.forEach(marker => marker.setMap(null));
      const newMarkers = [];
      
      // Информационное окно для отображения деталей при клике
      const infoWindow = new window.google.maps.InfoWindow();
      
      // Координаты для ограничения области видимости
      const bounds = new window.google.maps.LatLngBounds();
      
      properties.forEach(property => {
        // Проверяем наличие координат
        if (property.coordinates && property.coordinates.lat && property.coordinates.lng) {
          const position = {
            lat: property.coordinates.lat,
            lng: property.coordinates.lng
          };
          
          // Создаем маркер
          const marker = new window.google.maps.Marker({
            position,
            map,
            title: property.title,
            animation: window.google.maps.Animation.DROP
          });
          
          // Добавляем клик по маркеру
          marker.addListener('click', () => {
            // Содержимое информационного окна
            const content = `
              <div style="max-width: 200px;">
                <h3 style="font-weight: bold; margin-bottom: 5px;">${property.title}</h3>
                <p style="margin: 5px 0;">${property.location.district}</p>
                <p style="font-weight: bold; color: #4f46e5;">${property.price.toLocaleString('ru-RU')} ₽</p>
                <p>${property.area} м²</p>
              </div>
            `;
            
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
          });
          
          newMarkers.push(marker);
          bounds.extend(position);
        }
      });
      
      // Устанавливаем область видимости карты
      if (newMarkers.length > 0) {
        map.fitBounds(bounds);
      }
      
      setMarkers(newMarkers);
    }
  }, [map, properties]);
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-5">
      <h2 className="text-2xl font-bold mb-4">Карта объектов в Бишкеке</h2>
      <div 
        ref={mapRef} 
        className="w-full h-[500px] rounded-lg"
        style={{ border: '1px solid #e2e8f0' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
          <div className="text-lg font-medium">Загрузка карты...</div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
