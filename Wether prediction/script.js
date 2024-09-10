// Fetch weather data by city name
function getWeather(city) {
    const apiKey = '67c7428b09d142ff5b1e6472b2a9f0aa';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                updateCurrentWeather(data);
                updateForecast(data);
            } else {
                alert('City not found. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again.');
        });
}

// Function to handle "Get Weather" button click
document.getElementById('getWeather').addEventListener('click', function() {
    const location = document.getElementById('location').value;
    getWeather(location);
});

// Function to handle "Use Current Location" button click
document.getElementById('getLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherData(lat, lon);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

// Fetch weather data by coordinates
function fetchWeatherData(lat, lon) {
    const apiKey = '67c7428b09d142ff5b1e6472b2a9f0aa';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                updateCurrentWeather(data);
                updateForecast(data);
            } else {
                alert('Location not found. Please try again.');
            }
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Error fetching weather data. Please try again.");
        });
}

// Update current weather display
function updateCurrentWeather(data) {
    const temp = data.list[0].main.temp;
    const description = data.list[0].weather[0].description;
    const date = new Date(data.list[0].dt_txt).toLocaleDateString();
    const location = `${data.city.name}, ${data.city.country}`;

    document.getElementById('currentTemp').textContent = `${temp}°C`;
    document.getElementById('currentDescription').textContent = description;
    document.getElementById('currentDate').textContent = date;
    document.getElementById('currentLocation').textContent = location;
}

// Update 5-day forecast display
function updateForecast(data) {
    const forecast = document.getElementById('forecastContent');
    forecast.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) { // Every 8th data entry corresponds to approximately 24 hours
        const day = data.list[i];
        const temp = day.main.temp;
        const description = day.weather[0].description;
        const date = new Date(day.dt_txt).toLocaleDateString();
        const icon = day.weather[0].icon;

        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-item';
        forecastDay.innerHTML = `
            <p>${temp}°C</p>
            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}">
            <p>${date}</p>
            <p>${description}</p>
        `;
        forecast.appendChild(forecastDay);
    }
}
