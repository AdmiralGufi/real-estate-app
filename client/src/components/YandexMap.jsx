import React, { useEffect, useRef, useState } from 'react';

const YandexMap = ({ properties }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [clusterer, setClusterer] = useState(null);
  const [error, setError] = useState(null);
  
  // Функция загрузки API Яндекс.Карт
  const loadYMapsApi = () => {
    return new Promise((resolve, reject) => {
      if (window.ymaps) {
        console.log('YMaps API already loaded');
        resolve(window.ymaps);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      
      script.onload = () => {
        if (window.ymaps) {
          window.ymaps.ready(() => {
            console.log('YMaps API loaded successfully');
            resolve(window.ymaps);
          });
        } else {
          reject(new Error('YMaps API failed to load correctly'));
        }
      };
      
      script.onerror = (error) => {
        console.error('Failed to load YMaps API', error);
        reject(new Error('Failed to load YMaps API'));
      };
      
      document.head.appendChild(script);
    });
  };
  
  // Загружаем API Яндекс.Карт
  useEffect(() => {
    let isMounted = true;
    
    loadYMapsApi()
      .then((ymaps) => {
        if (isMounted) {
          console.log('YMaps API ready for use');
          setMapLoaded(true);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error('Error loading YMaps API:', error);
          setError('Не удалось загрузить API Яндекс.Карт');
        }
      });
      
    return () => {
      isMounted = false;
    };
  }, []);

  // Инициализируем карту
  useEffect(() => {
    if (!mapLoaded || !window.ymaps || !mapRef.current) return;

    try {
      console.log('Initializing Yandex Map...');
      // Координаты центра Бишкека
      const bishkekCenter = [42.8746, 74.5698];
      
      const map = new window.ymaps.Map(mapRef.current, {
        center: bishkekCenter,
        zoom: 12,
        controls: ['zoomControl', 'fullscreenControl', 'geolocationControl']
      });
      
      // Создаем кластер для группировки меток
      const clustererInstance = new window.ymaps.Clusterer({
        preset: 'islands#invertedBlueClusterIcons',
        groupByCoordinates: false,
        clusterDisableClickZoom: false,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false
      });
      
      map.geoObjects.add(clustererInstance);
      
      setMapInstance(map);
      setClusterer(clustererInstance);
      
      console.log('Yandex Map initialized successfully');
    } catch (err) {
      console.error('Error initializing Yandex Map:', err);
      setError(`Ошибка инициализации карты: ${err.message}`);
    }
  }, [mapLoaded]);

  // Добавляем метки объектов на карту
  useEffect(() => {
    if (!mapInstance || !clusterer || !properties || properties.length === 0) return;
    
    try {
      console.log('Adding markers to map...');
      // Очищаем предыдущие метки
      clusterer.removeAll();
      
      const placemarks = [];
      const bounds = new window.ymaps.GeoObjectCollection();
      
      properties.forEach(property => {
        if (property.coordinates && property.coordinates.length === 2) {
          // Создаем балун (всплывающее окно) с информацией
          const balloonContent = `
            <div class="map-balloon">
              <h3>${property.title}</h3>
              <p>${property.address}</p>
              <p><strong>Цена:</strong> ${property.price.toLocaleString()} сом</p>
              <p><strong>Тип:</strong> ${property.type}</p>
              <button onclick="window.selectProperty('${property.id}')">Подробнее</button>
            </div>
          `;
          
          // Выбираем цвет маркера в зависимости от типа объекта
          const placemark = new window.ymaps.Placemark(
            property.coordinates,
            {
              balloonContent: balloonContent,
              hintContent: property.title
            },
            {
              preset: 'islands#circleIcon',
              iconColor: property.type === 'Квартира' ? '#3b82f6' : 
                         property.type === 'Дом' ? '#10b981' : 
                         property.type === 'Коммерция' ? '#f59e0b' : '#4f46e5'
            }
          );
          
          placemarks.push(placemark);
          bounds.add(placemark);
        }
      });
      
      // Добавляем все метки на карту
      clusterer.add(placemarks);
      
      // Устанавливаем границы карты, чтобы видеть все объекты
      if (placemarks.length > 0) {
        mapInstance.setBounds(bounds.getBounds(), {
          checkZoomRange: true,
          zoomMargin: 100
        }).then(() => {
          if (mapInstance.getZoom() > 16) mapInstance.setZoom(16);
        });
      }
      
      // Создаем глобальную функцию для выбора объекта из балуна
      window.selectProperty = (id) => {
        const selectedProperty = properties.find(p => p.id.toString() === id.toString());
        if (selectedProperty) {
          // Создаем и вызываем пользовательское событие
          const event = new CustomEvent('property-selected', { detail: selectedProperty });
          document.dispatchEvent(event);
        }
      };
      
      console.log('Added', placemarks.length, 'property markers to map');
    } catch (err) {
      console.error('Error adding markers to map:', err);
    }
    
    return () => {
      // Очистка при размонтировании
      if (window.selectProperty) {
        delete window.selectProperty;
      }
    };
  }, [mapInstance, clusterer, properties]);

  // Компонент возвращает карту или сообщение об ошибке
  return (
    <div className="rounded-xl shadow-lg overflow-hidden">
      <h2 className="text-2xl font-bold text-secondary mb-4">Объекты на карте</h2>
      
      {error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">Проверьте подключение к интернету или попробуйте позже.</p>
        </div>
      ) : (
        <div 
          ref={mapRef} 
          className="w-full h-[500px] rounded-lg overflow-hidden"
        >
          {!mapLoaded && (
            <div className="w-full h-full flex justify-center items-center bg-gray-100">
              <p className="text-gray-500">Загрузка карты...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default YandexMap;
