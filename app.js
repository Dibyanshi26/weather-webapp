const apiKey = '31701ea4594a7e17254bdc6cdcce3cc1';
const weatherDiv = document.getElementById('weather');
const forecastDiv = document.getElementById('forecast');
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');  // Input field for manual entry
const citySelect = document.getElementById('city-select');  // Dropdown for city selection
const loadingSpinner = document.getElementById('loading-spinner');
const unitToggleBtn = document.getElementById('unit-toggle');
let isCelsius = true;

// Toggle between Celsius and Fahrenheit
unitToggleBtn.addEventListener('click', () => {
    isCelsius = !isCelsius;  
    const city = getSelectedCity();
    if (city) {
        fetchWeather(city);
        fetchWeatherForecast(city);  
    }
    unitToggleBtn.textContent = isCelsius ? "Switch to °F" : "Switch to °C";
});

// Add click event to search button
searchBtn.addEventListener('click', () => {
    const city = getSelectedCity();
    if (city) {
        fetchWeather(city);
        fetchWeatherForecast(city); 
    } else {
        weatherDiv.innerHTML = '<p>Please enter or select a city.</p>';
    }
});

// Function to determine which city to use: dropdown or manual input
function getSelectedCity() {
    const cityFromInput = cityInput.value.trim();
    const cityFromDropdown = citySelect.value;
    
    // If both a dropdown and manual input are provided, use the dropdown; otherwise, prioritize whichever is filled
    return cityFromDropdown || cityFromInput;
}

// Show and hide loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Function to fetch current weather data
async function fetchWeather(city) {
    showLoading();
    const units = isCelsius ? 'metric' : 'imperial';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`);
        hideLoading();
        if (response.ok) {
            const data = await response.json();
            displayWeather(data);
        } else if (response.status === 404) {
            weatherDiv.innerHTML = `<p>City not found. Please try again.</p>`;
        } else {
            weatherDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        }
    } catch (error) {
        weatherDiv.innerHTML = `<p>Unable to fetch data. Please check your internet connection.</p>`;
        hideLoading();
    }
}

// Function to determine the season based on latitude and current month
function getSeason(lat) {
    const month = new Date().getMonth(); // 0 = January, 11 = December
    const hemisphere = lat >= 0 ? 'Northern' : 'Southern'; // Determine hemisphere based on latitude

    if (hemisphere === 'Northern') {
        if (month >= 2 && month <= 4) return 'Spring';
        if (month >= 5 && month <= 7) return 'Summer';
        if (month >= 8 && month <= 10) return 'Autumn';
        return 'Winter';
    } else {
        if (month >= 2 && month <= 4) return 'Autumn';
        if (month >= 5 && month <= 7) return 'Winter';
        if (month >= 8 && month <= 10) return 'Spring';
        return 'Summer';
    }
}

// Function to display current weather data including timezone and season
function displayWeather(data) {
    const { name, main, weather, wind, sys, coord, timezone } = data;
    const season = getSeason(coord.lat);
    const timeZoneOffset = timezone / 3600; // Convert timezone from seconds to hours
    const country = sys.country;
    
    weatherDiv.innerHTML = `
        <h2>City: ${name}, ${country}</h2>
        <p>Temperature: ${main.temp}°${isCelsius ? 'C' : 'F'}</p>
        <p>Weather: ${weather[0].description}</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Pressure: ${main.pressure} hPa</p>
        <p>Wind Speed: ${wind.speed} ${isCelsius ? 'm/s' : 'mph'}</p>
        <p>Geocode: Latitude ${coord.lat}, Longitude ${coord.lon}</p>
        <p>Timezone: UTC ${timeZoneOffset > 0 ? '+' : ''}${timeZoneOffset}</p>
        <p>Season: ${season}</p>
        <p>Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
    `;
}

// Function to fetch the 5-day weather forecast data
async function fetchWeatherForecast(city) {
    showLoading();
    const units = isCelsius ? 'metric' : 'imperial';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`);
        hideLoading();
        if (response.ok) {
            const data = await response.json();
            displayWeatherForecast(data);
        } else {
            forecastDiv.innerHTML = `<p>Forecast not available. Please try again.</p>`;
        }
    } catch (error) {
        forecastDiv.innerHTML = `<p>Unable to fetch data. Please check your internet connection.</p>`;
        hideLoading();
    }
}

// Function to display the 5-day weather forecast
function displayWeatherForecast(data) {
    const forecastList = data.list;

    let forecastHTML = '<h3>5-Day Forecast</h3><div class="forecast-container">';
    
    forecastList.forEach((item, index) => {
        if (index % 8 === 0) {  // Show data once every 24 hours
            forecastHTML += `
                <div class="forecast-item">
                    <p><strong>${item.dt_txt.split(' ')[0]}</strong></p>  <!-- Date -->
                    <p>Temperature: ${item.main.temp}°${isCelsius ? 'C' : 'F'}</p>
                    <p>Weather: ${item.weather[0].description}</p>
                    <p>Humidity: ${item.main.humidity}%</p>
                    <p>Pressure: ${item.main.pressure} hPa</p>
                    <p>Wind Speed: ${item.wind.speed} ${isCelsius ? 'm/s' : 'mph'}</p>
                </div>
            `;
        }
    });

    forecastHTML += '</div>';
    forecastDiv.innerHTML = forecastHTML;
}
