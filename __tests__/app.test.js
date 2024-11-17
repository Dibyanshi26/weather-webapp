const getWeatherData = require('../src/getWeatherData');
const apiKey = '31701ea4594a7e17254bdc6cdcce3cc1';
const isCelsius = true;

// Mock fetch to avoid real API calls
global.fetch = jest.fn();

beforeEach(() => {
    // Clear all instances and calls to fetch
    fetch.mockClear();
});

// Test for valid city input
test('returns weather data for a valid city', async () => {
    // Mock a valid API response
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            main: { temp: 15, humidity: 50 }
        })
    });

    const data = await getWeatherData('London');
    expect(data.main).toHaveProperty('temp');
    expect(data.main).toHaveProperty('humidity');
});

// Test for invalid city input
test('throws error for an invalid city', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
    });

    await expect(getWeatherData('InvalidCity')).rejects.toThrow('City not found');
});

// Test for special characters in city name
test('returns weather data for a city with special characters', async () => {
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
            main: { temp: 20, humidity: 60 }
        })
    });

    const data = await getWeatherData('São Paulo');
    expect(data.main).toHaveProperty('temp');
    expect(data.main).toHaveProperty('humidity');
});

// Test for non-English characters in city name
test('returns weather data for a city with non-English characters', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
    });

    try {
        await getWeatherData('北京'); // Beijing in Chinese
    } catch (error) {
        expect(error.message).toBe('City not found');
    }
});

// Test for invalid API key
test('throws error for invalid API key', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 401
    });

    await expect(getWeatherData('London', 'INVALID_API_KEY')).rejects.toThrow('Invalid API key');
});

// Increase timeout for network testing
jest.setTimeout(5000);

// Test for network timeout
test('handles network timeout gracefully', async () => {
    fetch.mockImplementationOnce(() => new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Network timeout')), 2500)
    ));

    await expect(getWeatherData('London')).rejects.toThrow('Network timeout');
});

// Test for extreme weather data
test('handles extreme weather data correctly', async () => {
    const extremeWeatherData = { main: { temp: 56.7, humidity: 10 } };
    fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => extremeWeatherData
    });

    const data = await getWeatherData('Death Valley');
    expect(data.main.temp).toBe(56.7);
    expect(data.main.humidity).toBe(10);
});

// Test for empty city input
test('throws error for empty city input', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
    });

    await expect(getWeatherData('')).rejects.toThrow('City not found');
});

// Test for invalid city format (e.g., numeric input)
test('throws error for invalid city format', async () => {
    fetch.mockResolvedValueOnce({
        ok: false,
        status: 404
    });

    await expect(getWeatherData('12345')).rejects.toThrow('City not found');
});

// Test for fetching both current weather and forecast
async function getWeatherForecast(city) {
    const units = isCelsius ? 'metric' : 'imperial';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`);
    if (!response.ok) {
        throw new Error('City not found');
    }
    const forecastData = await response.json();
    if (!forecastData.list) {
        throw new Error('Forecast data not found');
    }
    return forecastData;
}

test('fetches both current weather and forecast for a city', async () => {
    fetch
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ main: { temp: 15, humidity: 55 } })
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ list: [{ dt_txt: "2024-10-30 12:00:00", main: { temp: 16 } }] })
        });

    const currentWeather = await getWeatherData('London');
    const forecastWeather = await getWeatherForecast('London');
    
    expect(currentWeather.main).toHaveProperty('temp');
    expect(forecastWeather.list.length).toBeGreaterThan(0);
});
