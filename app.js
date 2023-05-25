//API Key
import { APIKey } from "./config.js";

//DOM elements
const search = document.getElementById('search');
const form = document.getElementById('form');
const btn = document.getElementById('btn');
const spinner = document.getElementById('spinner');
const errorMessage = document.getElementById('error-message');
const cityName = document.getElementById('city-name');
const today = document.getElementById('today');
const hourly = document.getElementById('hourly');
const forecast = document.getElementById('forecast');

//Variables
let searchValue;
let apiData;

//Insert spinner
const getSpinner = () => {
    spinner.innerHTML = `<div class="spinner"> </div>`
};
getSpinner();

//Async function working with Geolocation
const success = async ({ coords }) => {
    const { latitude, longitude } = coords;
    console.log(latitude, longitude, coords);

    //talk to the weather api

    const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${APIKey}`);

    apiData = data;
    console.log(apiData);
    console.log(apiData.city.name);
    console.log(apiData.list[0].weather[0].main);

    //get data and update the DOM 
    removeSpinner();
    updateLocation();
    updateTodayCard();
    updateHourlyCard();
    updateForecastCard();
    setBackgroundColor();

};

const error = (error) => {
    console.log(error);
    errorMessage.innerHTML = `<p class="error">Unable to retrieve your location. Please refresh the page or add your location manually.</p>`;
}

const config = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 2000
}

navigator.geolocation.getCurrentPosition(success, error, config);

//Update the page and remove spinner
const removeSpinner = () => {
    spinner.remove();
    errorMessage.innerHTML = ``;
}

const updateLocation = () => {
    cityName.innerHTML = `<p class="location">${apiData.city.name}, ${apiData.city.country}</p>`
};

const updateTodayCard = () => {
    const element = apiData.list[0];
    const todayWeather = `<div class="today-card">  
            <div class="today-weather-info">
            <p class="today-temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
            <div class="today-weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
            <p class="today-description">${element.weather[0].description}</p>
            <p class="temp-max-min">H:${Math.round(element.main.temp_max - 273.15)}&#176;  L:${Math.round(element.main.temp_min - 273.15)}&#176;</p>
            </div>
            </div> `
    today.innerHTML = todayWeather;
};

const updateHourlyCard = () => {
    const hourlyData = apiData.list.slice(0, 5);
    const hourlyWeather = hourlyData.map(element => {
        return `<div class="hourly-weather-info"> 
        <p class="hours">${new Date(element.dt * 1000).getHours().toLocaleString()}:00</p>
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#176;</p>
        </div>`
    });

    hourly.innerHTML = `<div class="hourly-card">
    <h3 class="card-title">Hourly Forecast</h3>
    <div class="hourly-weather-card">${hourlyWeather.join("")}</div>
    </div>`

}

const updateForecastCard = () => {
    const forecastData = apiData.list.slice(4, apiData.list.length - 1);
    console.log(forecastData);

    const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const forecastWeather = forecastData.map(element => {
        //console.log(new Date(element.dt * 1000).getHours())
        if (new Date(element.dt * 1000).getHours() !== 19) {
            return
        }

        return `
        <div class="forecast-weather-info"> 
        <p class="day">${weekday[new Date(element.dt * 1000).getDay()]}</p>
        <p class="date">${new Date(element.dt * 1000).getDate()} ${month[new Date(element.dt * 1000).getMonth()]}</p>
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#176;</p>
        </div>`
    });

    forecast.innerHTML = `<div class="forecast-card">
    <h3 class="card-title">Daily Forecast</h3>
    <div class="forecast-weather-card">${forecastWeather.join("")}</div>
    </div>`
}

//Change background colour
const setBackgroundColor = () => {
    const weatherConditions = apiData.list[0].weather[0].main;
    console.log(weatherConditions);

    switch (weatherConditions) {
        case 'Thunderstorm':
            document.body.style.background = 'linear-gradient(180deg, rgba(211,223,242,1) 0%, rgba(113,113,140,1) 100%)';

            break;

        case 'Drizzle':
            document.body.style.background = 'linear-gradient(180deg, rgba(211,223,242,1) 0%, rgba(113,113,140,1) 100%)';
            break;

        case 'Rain':
            document.body.style.background = 'linear-gradient(180deg, rgba(211,223,242,1) 0%, rgba(113,113,140,1) 100%)';
            break;

        case 'Snow':
            document.body.style.background = 'linear-gradient(180deg, rgba(211,223,242,1) 0%, rgba(113,113,140,1) 100%)';
            break;

        case 'Mist':
            document.body.style.background = 'linear-gradient(180deg, rgba(211,223,242,1) 0%, rgba(113,113,140,1) 100%)';
            break;

        case 'Clear':
            document.body.style.background = 'linear-gradient(180deg, rgba(148,187,233,1) 51%, rgba(20,158,220,1) 100%)';
            break;

        case 'Clouds':
            document.body.style.background = 'linear-gradient(180deg, rgba(148,187,233,1) 0%, rgba(113,113,140,1)  100%)';
            break;

        default:
            document.body.style.background = 'linear-gradient(180deg, rgba(148,187,233,1) 51%, rgba(20,158,220,1) 100%)';
    }

}

const getData = async () => {

    try {
        const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=${APIKey}`);
        apiData = data;
        console.log(apiData);
        removeSpinner();
        updateLocation();
        updateTodayCard();
        updateHourlyCard();
        updateForecastCard();
        setBackgroundColor();

    } catch (error) {
        if (searchValue === '') {
            console.log('Empty form');
            errorMessage.innerHTML = `<p class="error">Please enter your location.</p>`;
            document.body.style.background = 'radial-gradient(circle, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)';
            cityName.innerHTML = ``;
            today.innerHTML = ``;
            hourly.innerHTML = ``;
            forecast.innerHTML = ``;

        } else {
            console.log('API said no!');
            errorMessage.innerHTML = `<p class="error">Unable to retrieve your location. Please try again.</p>`;
            document.body.style.background = 'radial-gradient(circle, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)';
            cityName.innerHTML = ``;
            today.innerHTML = ``;
            hourly.innerHTML = ``;
            forecast.innerHTML = ``;
        }
    }
}

//User's input 
search.addEventListener('submit', (e) => {
    e.preventDefault()
    searchValue = e.target.value;
    console.log(searchValue);
    getData();
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    searchValue = search.value;
    console.log(searchValue);
    getData(searchValue);
  
});

search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        searchValue = e.target.value;
        console.log(searchValue);
        getData();
        form.reset();
    };

});



