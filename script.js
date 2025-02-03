// Function to get air quality data based on the city name
async function getAirQuality() {
    const city = document.getElementById("city").value.trim();
    const apiKey = "589eae90e30012c3c62f4cb4b8c1ddb4";  // Replace with your OpenWeatherMap API key

    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    // Geocoding API to get the coordinates from city name
    const geocodeUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    
    try {
        // Get coordinates of the city
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();

        // Handle errors in fetching city data
        if (geocodeData.cod !== 200) {
            alert("City not found! Please try a valid city name.");
            document.getElementById("location").innerText = "City: N/A";
            document.getElementById("airQualityIndex").innerText = "Air Quality Index: N/A";
            document.getElementById("pollutants").innerText = "Pollutants: N/A";
            return;
        }

        const { lat, lon } = geocodeData.coord;
        const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        
        // Get air quality data
        const airQualityResponse = await fetch(airQualityUrl);
        const airQualityData = await airQualityResponse.json();

        // Handle missing air quality data
        if (!airQualityData.list || !airQualityData.list[0]) {
            alert("Air quality data not available!");
            return;
        }

        const airQualityIndex = airQualityData.list[0].main.aqi;
        const pollutants = airQualityData.list[0].components;
        let pollutantsText = `PM2.5: ${pollutants.pm2_5} µg/m³, PM10: ${pollutants.pm10} µg/m³, NO2: ${pollutants.no2} µg/m³`;

        let airQuality = "";
        switch (airQualityIndex) {
            case 1:
                airQuality = "Good";
                break;
            case 2:
                airQuality = "Fair";
                break;
            case 3:
                airQuality = "Moderate";
                break;
            case 4:
                airQuality = "Poor";
                break;
            case 5:
                airQuality = "Very Poor";
                break;
            default:
                airQuality = "Unknown";
        }

        // Update the UI with the air quality information
        document.getElementById("location").innerText = `City: ${city}`;
        document.getElementById("airQualityIndex").innerText = `Air Quality Index: ${airQuality}`;
        document.getElementById("pollutants").innerText = `Pollutants: ${pollutantsText}`;

        // Show the result container smoothly
        document.querySelector('.result').classList.add('show');
    } catch (error) {
        console.error("Error fetching air quality data:", error);
        alert("Error fetching data! Please try again.");
    }
}
