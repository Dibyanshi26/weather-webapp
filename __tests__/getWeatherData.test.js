const getWeatherData = require('../src/getWeatherData');

// Ensure fetch is mocked
beforeEach(() => {
  fetch.resetMocks();
});

describe('getWeatherData Tests', () => {
  test('should throw "City not found" error for an invalid city', async () => {
    // Mock the fetch response to simulate a 404 error
    fetch.mockResponseOnce('', { status: 404 });

    await expect(getWeatherData('invalid-city')).rejects.toThrow('City not found');
  });

  test('should return data when called with a valid city', async () => {
    // Mock the fetch response to simulate a valid response with JSON data
    fetch.mockResponseOnce(JSON.stringify({
      weather: [{ description: 'clear sky' }],
      main: { temp: 25 },
    }));

    const result = await getWeatherData('sample-city');
    expect(result).toBeDefined();
    expect(result.weather[0].description).toBe('clear sky');
    expect(result.main.temp).toBe(25);
  });
});
