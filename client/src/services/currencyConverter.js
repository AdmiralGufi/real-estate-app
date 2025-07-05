// Сервис для конвертации валют
// Курс сома к доллару (1 USD = X KGS)
// Курс может обновляться из внешнего API

let exchangeRate = 89.5; // Примерный курс сома к доллару (1 USD = 89.5 KGS)

// Функция для обновления курса из внешнего API
export const updateExchangeRate = async () => {
  try {
    // Используем бесплатный API для получения актуального курса
    // Можно заменить на любой другой API валют
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    
    if (data && data.rates && data.rates.KGS) {
      exchangeRate = data.rates.KGS;
      console.log('Exchange rate updated:', exchangeRate);
      return exchangeRate;
    }
    
    return exchangeRate;
  } catch (error) {
    console.error('Failed to update exchange rate:', error);
    return exchangeRate; // Возвращаем текущий курс в случае ошибки
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
