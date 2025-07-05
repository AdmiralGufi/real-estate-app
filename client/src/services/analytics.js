import ReactGA from 'react-ga4';

// Замените 'G-XXXXXXXXXX' на ваш реальный идентификатор измерения Google Analytics
// Вы получите его при создании потока данных в GA4
const TRACKING_ID = 'G-XXXXXXXXXX';

export const initGA = () => {
  if (process.env.NODE_ENV === 'production') {
    // Инициализировать GA только в режиме production
    ReactGA.initialize(TRACKING_ID);
    console.log('GA initialized');
  } else {
    console.log('GA not initialized in development mode');
  }
};

// Отслеживание просмотра страницы
export const logPageView = (path) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.send({ hitType: "pageview", page: path });
    console.log(`Logged pageview for: ${path}`);
  }
};

// Отслеживание событий
export const logEvent = (category, action, label = null, value = null) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      category, // Например: 'Property'
      action,   // Например: 'View'
      label,    // Например: ID объекта
      value     // Любое числовое значение
    });
    console.log(`Logged event: ${category} - ${action} - ${label}`);
  }
};

// Отслеживание конверсий
export const logConversion = (action, properties = {}) => {
  if (process.env.NODE_ENV === 'production') {
    ReactGA.event({
      category: 'Conversion',
      action,
      ...properties
    });
    console.log(`Logged conversion: ${action}`);
  }
};
