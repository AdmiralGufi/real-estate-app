// Сервис для конвертации валют
// Курс сома к доллару (1 USD = X KGS)

// Сохраняем курс в localStorage чтобы не делать лишних запросов
const EXCHANGE_RATE_KEY = 'EXCHANGE_RATE_KGS_USD';
const EXCHANGE_RATE_TIMESTAMP = 'EXCHANGE_RATE_TIMESTAMP';
const DEFAULT_RATE = 89.5; // Примерный курс сома к доллару (1 USD = 89.5 KGS)

// Получение сохраненного курса из localStorage
const getSavedExchangeRate = () => {
  const savedRate = localStorage.getItem(EXCHANGE_RATE_KEY);
  const timestamp = localStorage.getItem(EXCHANGE_RATE_TIMESTAMP);
  
  if (savedRate && timestamp) {
    // Проверяем, не устарел ли курс (обновляем раз в день)
    const now = new Date().getTime();
    const saved = parseInt(timestamp, 10);
    const ONE_DAY = 24 * 60 * 60 * 1000;
    
    if (now - saved < ONE_DAY) {
      return parseFloat(savedRate);
    }
  }
  
  return null;
};

// Глобальная переменная для хранения текущего курса
let exchangeRate = getSavedExchangeRate() || DEFAULT_RATE;

// Функция для обновления курса из внешнего API
export const updateExchangeRate = async () => {
  // Сначала проверяем, не сохранен ли актуальный курс
  const savedRate = getSavedExchangeRate();
  if (savedRate) {
    exchangeRate = savedRate;
    return exchangeRate;
  }
  
  try {
    // Используем несколько API для надежности
    const apis = [
      'https://open.er-api.com/v6/latest/USD',
      'https://api.exchangerate-api.com/v4/latest/USD',
      'https://api.currencyapi.com/v3/latest?apikey=cur_live_FLwYmI7JSqYvAe56LncFHIdjJIAaq4HwQCbJmnM8&currencies=KGS&base_currency=USD'
    ];
    
    for (const apiUrl of apis) {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        let rate = null;
        
        if (apiUrl.includes('open.er-api') && data && data.rates && data.rates.KGS) {
          rate = data.rates.KGS;
        } else if (apiUrl.includes('exchangerate-api') && data && data.rates && data.rates.KGS) {
          rate = data.rates.KGS;
        } else if (apiUrl.includes('currencyapi') && data && data.data && data.data.KGS) {
          rate = data.data.KGS.value;
        }
        
        if (rate) {
          exchangeRate = rate;
          // Сохраняем курс и текущее время в localStorage
          localStorage.setItem(EXCHANGE_RATE_KEY, rate.toString());
          localStorage.setItem(EXCHANGE_RATE_TIMESTAMP, new Date().getTime().toString());
          console.log('Exchange rate updated:', exchangeRate);
          return exchangeRate;
        }
      } catch (err) {
        console.error(`Failed to update exchange rate from ${apiUrl}:`, err);
        continue; // Продолжаем с следующим API
      }
    }
    
    // Если все API недоступны, используем сохраненный или дефолтный курс
    return exchangeRate;
  } catch (error) {
    console.error('Failed to update exchange rate:', error);
    return exchangeRate;
  }
};

// Конвертация из сомов в доллары
export const somToUsd = (somAmount) => {
  return somAmount / exchangeRate;
};

// Конвертация из долларов в сомы
export const usdToSom = (usdAmount) => {
  return usdAmount * exchangeRate;
};

// Форматирование суммы в сомах
export const formatSom = (amount) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
    currencyDisplay: 'symbol'
  }).format(amount);
};

// Форматирование суммы в долларах
export const formatUsd = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Получение текущего курса
export const getExchangeRate = () => exchangeRate;
