const getWeatherData = require('../src/getWeatherData');

test('returns weather data for a valid city', async () => {
  const data = await getWeatherData('London');
  expect(data.main).toHaveProperty('temp');  // Adjusting to match the structure
  expect(data.main).toHaveProperty('humidity');
});

test('throws error for invalid city', async () => {
  await expect(getWeatherData('InvalidCity')).rejects.toThrow('City not found');
});

