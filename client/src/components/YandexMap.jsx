import React, { useEffect, useRef, useState } from 'react';

const YandexMap = ({ properties }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [error, setError] = useState(null);
  
  // Загружаем Яндекс Карты
  useEffect(() => {
    if (!window.ymaps) {
      const script = document.createElement('script');
      // Используем API ключ из переменных окружения или альтернативный ключ
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY;
      
      if (!apiKey) {
        setError("API ключ Яндекс.Карт не найден");
        return;
      }
      
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      script.onload = () => {
        window.ymaps.ready(() => {
          setMapLoaded(true);
        });
      };
      
      script.onerror = () => {
        setError("Не удалось загрузить API Яндекс.Карт");
      };
      
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else if (window.ymaps) {
      window.ymaps.ready(() => {
        setMapLoaded(true);
      });
    }
  }, []);

  // Инициализируем карту после загрузки API
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // Координаты центра Бишкека
      const bishkekCenter = [42.8746, 74.5698];
      
      const yandexMap = new window.ymaps.Map(mapRef.current, {
        center: bishkekCenter,
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
      });
      
      // Создаем кластер для группировки близко расположенных меток
      const clusterer = new window.ymaps.Clusterer({
        preset: 'islands#invertedBlueClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
      });
      
      setMap({ map: yandexMap, clusterer });
      
      // Аналитика удалена
      
      // Добавляем обработчик для отслеживания перемещения карты
      yandexMap.events.add('boundschange', () => {
        // Аналитика удалена
      });
    }
  }, [mapLoaded]);

  // Добавляем метки на карту
  useEffect(() => {
    if (map && properties && properties.length > 0) {
      // Удаляем предыдущие метки
      if (map.clusterer) {
        map.clusterer.removeAll();
      }
      
      const newPlacemarks = [];
      const bounds = new window.ymaps.GeoObjectCollection();
      
      properties.forEach(property => {
        // Проверяем наличие координат
        if (property.coordinates && property.coordinates.lat && property.coordinates.lng) {
          const coordinates = [property.coordinates.lat, property.coordinates.lng];
          
          // Создаем балун (всплывающее окно) с информацией о недвижимости
          const balloonContent = `
            <div class="property-balloon" style="max-width: 250px;">
              <h3 style="font-weight: bold; margin-bottom: 5px; color: #4f46e5;">${property.title}</h3>
              <div style="margin-bottom: 8px;">
                <img src="${property.imageUrl}" alt="${property.title}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px;">
              </div>
              <p style="margin: 5px 0;"><b>Адрес:</b> ${property.location.address}</p>
              <p style="margin: 5px 0;"><b>Район:</b> ${property.location.district}</p>
              <p style="margin: 5px 0;"><b>Площадь:</b> ${property.area} м²</p>
              <p style="font-weight: bold; color: #4f46e5; font-size: 16px; margin-top: 8px;">${property.price.toLocaleString('ru-RU')} сом</p>
              <button onclick="window.selectProperty(${property.id})" style="background-color: #4f46e5; color: white; border: none; padding: 6px 12px; border-radius: 4px; margin-top: 8px; cursor: pointer; width: 100%;">Подробнее</button>
            </div>
          `;
          
          // Создаем метку
          const placemark = new window.ymaps.Placemark(
            coordinates, 
            {
              balloonContent,
              hintContent: `${property.title} - ${property.price.toLocaleString('ru-RU')} сом`
            }, 
            {
              preset: 'islands#blueDotIcon',
              iconColor: property.type === 'Квартира' ? '#4f46e5' : 
                         property.type === 'Дом' ? '#10b981' : 
                         property.type === 'Коммерция' ? '#f59e0b' : '#4f46e5'
            }
          );
          
          // Добавляем обработчик клика
          placemark.events.add('click', () => {
            // Аналитика удалена
          });
          
          newPlacemarks.push(placemark);
          bounds.add(placemark);
        }
      });
      
      // Добавляем метки на карту через кластеризатор
      if (newPlacemarks.length > 0) {
        map.clusterer.add(newPlacemarks);
        map.map.geoObjects.add(map.clusterer);
        
        // Устанавливаем границы карты, чтобы были видны все метки
        if (newPlacemarks.length > 1) {
          map.map.setBounds(bounds.getBounds(), {
            checkZoomRange: true,
            zoomMargin: 30
          });
        } else if (newPlacemarks.length === 1) {
          map.map.setCenter(newPlacemarks[0].geometry.getCoordinates());
          map.map.setZoom(15);
        }
      }
      
      // Добавляем глобальную функцию для выбора объекта из балуна
      window.selectProperty = (id) => {
        const selectedProperty = properties.find(p => p.id === id);
        if (selectedProperty) {
          // Вызываем событие выбора объекта
          const event = new CustomEvent('property-selected', { detail: selectedProperty });
          document.dispatchEvent(event);
          
          // Аналитика удалена
        }
      };
    }
    
    // Очистка при размонтировании
    return () => {
      if (window.selectProperty) {
        delete window.selectProperty;
      }
    };
  }, [map, properties]);

  // Обработчик для слушания события выбора объекта из карты
  useEffect(() => {
    const handlePropertySelected = (event) => {
      // Здесь можно добавить действия при выборе объекта с карты
      console.log('Property selected from map:', event.detail);
    };
    
    document.addEventListener('property-selected', handlePropertySelected);
    
    return () => {
      document.removeEventListener('property-selected', handlePropertySelected);
    };
  }, []);
  
  // Компонент возвращает карту или сообщение об ошибке
  return (
    <div className="rounded-xl shadow-lg overflow-hidden">
      <h2 className="text-2xl font-bold text-secondary mb-4">Объекты на карте</h2>
      
      {error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">Пожалуйста, проверьте API ключ Яндекс.Карт и добавьте домен в белый список в кабинете разработчика Яндекс.</p>
        </div>
      ) : (
        <div 
          ref={mapRef} 
          className="w-full h-[400px] bg-gray-100 rounded-lg"
          style={{ minHeight: '400px' }}
        >
          {!mapLoaded && (
            <div className="flex items-center justify-center h-full">
              <p>Загрузка карты...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YandexMap;
