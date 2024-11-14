// src/getWeatherData.js
const apiKey = '31701ea4594a7e17254bdc6cdcce3cc1'; // Replace with your actual API key

async function getWeatherData(city) {
    const units = 'metric'; // Set this as needed
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`);
    if (!response.ok) {
        throw new Error('City not found');
    }
    return await response.json();
}

module.exports = getWeatherData;
