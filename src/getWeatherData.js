const apiKey = '31701ea4594a7e17254bdc6cdcce3cc1';
let isCelsius = true; // Adjust this variable depending on your logic

async function getWeatherData(city, apiKeyOverride = apiKey) {
    const units = isCelsius ? 'metric' : 'imperial';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKeyOverride}&units=${units}`);
    if (!response.ok) {
        throw new Error(response.status === 401 ? 'Invalid API key' : 'City not found');
    }
    return await response.json();
}

module.exports = getWeatherData;
