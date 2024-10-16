const urlBase = `https://api.openweathermap.org/data/2.5/weather`
const API_KEY = '9c498930928348e55806ca68d7c706ec'
const Kelvin = 273.15

document.getElementById('BuscarBoton').addEventListener('click', () => {
    const city = document.getElementById('Ciudad').value;
    if(city){
        fetchWeather(city);
    } else {
        alert('Ingrese una ciudad válida');
    }
});

document.getElementById('MicrofonoBoton').addEventListener('click', () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'es-ES';

    recognition.onresult = function(event) {
        const city = event.results[0][0].transcript;
        document.getElementById('Ciudad').value = city;
        fetchWeather(city);
    };

    recognition.start();
});

document.getElementById('UbicacionBoton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoordinates(latitude, longitude);
        }, error => {
            alert("No se pudo obtener la ubicación. Inténtelo de nuevo.");
        });
    } else {
        alert("La geolocalización no es compatible con este navegador.");
    }
});

function fetchWeather(city) {
    fetch(`${urlBase}?q=${city}&appid=${API_KEY}&lang=es`)
    .then(response => response.json())
    .then(data => showWeatherData(data));
}

function fetchWeatherByCoordinates(lat, lon) {
    fetch(`${urlBase}?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=es`)
        .then(response => response.json())
        .then(data => showWeatherData(data));
}

function showWeatherData(data) {
    const divRespuesta_Datos = document.getElementById('Respuesta_Datos');
    divRespuesta_Datos.innerHTML = '';

    const cityName = data.name;
    const countryName = data.sys.country;
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;

    const cityInfo = document.createElement('h2');
    cityInfo.textContent = `${cityName}, ${countryName}`;

    const tempInfo = document.createElement('p');
    tempInfo.textContent = `La temperatura es: ${Math.floor(temp - Kelvin)}ºC`;

    const humidityInfo = document.createElement('p');
    humidityInfo.textContent = `La humedad es del ${humidity}%`;

    const icoInfo = document.createElement('img');
    icoInfo.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    const descriptionInfo = document.createElement('p');
    descriptionInfo.textContent = `La descripción meteorológica es ${description}`;

    divRespuesta_Datos.appendChild(cityInfo);
    divRespuesta_Datos.appendChild(tempInfo);
    divRespuesta_Datos.appendChild(humidityInfo);
    divRespuesta_Datos.appendChild(icoInfo);
    divRespuesta_Datos.appendChild(descriptionInfo);

    renderWeatherChart(Math.floor(temp - Kelvin), humidity);
}

function renderWeatherChart(temperature, humidity) {
    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Temperatura', 'Humedad'],
            datasets: [{
                label: 'Condiciones climáticas',
                data: [temperature, humidity],
                backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}