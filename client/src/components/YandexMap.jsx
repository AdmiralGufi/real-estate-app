import React, { useEffect, useRef, useState } from 'react';
import { logEvent } from '../services/analytics';

const YandexMap = ({ properties }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [placemarks, setPlacemarks] = useState([]);
  
  // Загружаем Яндекс Карты
  useEffect(() => {
    if (!window.ymaps) {
      const script = document.createElement('script');
      const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || '8c1cefda-a209-4939-94e5-00994f4bc0f7';
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      script.onload = () => {
        window.ymaps.ready(() => {
          setMapLoaded(true);
        });
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
      
      // Логируем событие инициализации карты
      logEvent('Map', 'Initialize', 'YandexMaps');
      
      // Добавляем обработчик для отслеживания перемещения карты
      yandexMap.events.add('boundschange', () => {
        logEvent('Map', 'BoundsChange', 'YandexMaps');
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
          
          // Добавляем обработчик клика для отслеживания
          placemark.events.add('click', () => {
            logEvent('Map', 'PlacemarkClick', `Property ID: ${property.id}`, property.price);
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
      
      setPlacemarks(newPlacemarks);
      
      // Добавляем глобальную функцию для выбора объекта из балуна
      window.selectProperty = (id) => {
        const selectedProperty = properties.find(p => p.id === id);
        if (selectedProperty) {
          // Вызываем событие выбора объекта
          const event = new CustomEvent('property-selected', { detail: selectedProperty });
          document.dispatchEvent(event);
          
          // Логируем событие
          logEvent('Map', 'PropertySelectedFromBalloon', `Property ID: ${id}`, selectedProperty.price);
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
      <div className="mt-4 text-sm text-gray-500">
        Нажмите на маркер, чтобы увидеть детали объекта. Используйте колесо мыши для масштабирования.
      </div>
    </div>
  );
};

export default YandexMap;
