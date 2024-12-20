const apiKey = '005aa5655f7cf95186184fcf389c2f9f'; // Replace with your OpenWeatherMap API key

document.getElementById('getWeather').addEventListener('click', async () => {
    const city = encodeURIComponent(document.getElementById('cityInput').value.trim());
    const weatherInfo = document.getElementById('weatherInfo');
    const error = document.getElementById('error');

    // Hide previous results and error messages
    weatherInfo.classList.add('hidden');
    error.classList.add('hidden');

    if (!city) {
        error.textContent = 'Please enter a city name.';
        error.classList.remove('hidden');
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const { name, main, weather } = data;
        if (!name || !main || !weather || weather.length === 0) {
            throw new Error('Incomplete data received from the API');
        }

        // Display weather data
        document.getElementById('cityName').textContent = `Weather in ${name}`;
        document.getElementById('temperature').textContent = `Temperature: ${main.temp}°C`;
        document.getElementById('description').textContent = `Condition: ${weather[0].description}`;
        document.getElementById('humidity').textContent = `Humidity: ${main.humidity}%`;

        // AI Recommendation
        const suggestion = getAISuggestion(weather[0].main, main.temp);
        document.getElementById('aiSuggestion').textContent = `AI Suggestion: ${suggestion}`;

        weatherInfo.classList.remove('hidden');
    } catch (err) {
        error.textContent = `Error: ${err.message || 'City not found. Please try again.'}`;
        error.classList.remove('hidden');
        console.error(err); // Log error for debugging
    }
});

// AI Suggestion Function
function getAISuggestion(condition, temperature) {
    if (condition.toLowerCase().includes('rain')) {
        return 'Carry an umbrella and wear waterproof clothing!';
    } else if (condition.toLowerCase().includes('clear') && temperature > 25) {
        return 'It\'s sunny, stay hydrated and wear sunscreen!';
    } else if (condition.toLowerCase().includes('snow')) {
        return 'Wear warm clothes and stay safe!';
    } else if (temperature < 10) {
        return 'It\'s cold, dress warmly!';
    } else if (condition.toLowerCase().includes('cloud')) {
        return 'It\'s cloudy, enjoy the cool weather!';
    } else {
        return 'Have a great day!';
    }
}
