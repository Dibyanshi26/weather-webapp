// __tests__/app.test.js
const getWeatherData = require('../src/getWeatherData'); // Update with actual function path

test('returns weather data for a valid city', async () => {
  const data = await getWeatherData('London');
  expect(data).toHaveProperty('temperature');
  expect(data).toHaveProperty('humidity');
});

test('throws error for invalid city', async () => {
  await expect(getWeatherData('InvalidCity')).rejects.toThrow('City not found');
});
