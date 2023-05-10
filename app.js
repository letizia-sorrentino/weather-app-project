//DOM elements
const search = document.getElementById('search');
const msg = document.querySelector('.form-message');
const cityName = document.getElementById('city-name');
const todayCard = document.getElementById('today-card');
const hourlyCard = document.getElementById('hourly-card');
const forecastCard = document.getElementById('forecast-card');

//Variables
let searchValue;
let apiData;

//Async function working with Geolocation
const success = async ({ coords }) => {
    const { latitude, longitude } = coords;
    console.log(latitude, longitude, coords);

    //talk to the weather api
    const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=7191fefc1ad22b3e9a87628b612c82a9`);
    console.log(data);
    console.log(data.city.name);

    //getLocation(data);
    setWeather(data, data.list);
}

const setWeather = (data, list) => {
    //Show City Name 
    const location = `<div class="location"><h2>${data.city.name}</h2></div> `

    //today-weather card
    const todayData = list.slice(0, 1);
    const todayWeather = todayData.map(element => {
        return `<div class="today-weather"> 
            <div class="today-weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
            <div class="today-weather-info"><p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
            <p class="temp-max">H. ${Math.round(element.main.temp_max - 273.15)}&#8451</p>
            <p class="temp-min">L. ${Math.round(element.main.temp_min - 273.15)}&#8451</p>
            <p class="description">${element.weather[0].description}</p>
            </div>
            </div > `
    });

    //hourly-weather card
    const hourlyData = list.slice(1, 4);
    const hourlyWeather = hourlyData.map(element => {
        return `<div class="hourly-weather">
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <div class="weather-info> 
        <p class="hours">${new Date(element.dt * 1000).getHours().toLocaleString()}:00</p>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
        <p class="description">${element.weather[0].description}</p>
        </div>
        </div > `
    });

    //daily Forecast Card
    const forecastData = list.slice(4, 7);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const forecastWeather = forecastData.map(element => {
        return `<div class="forecast-weather" >
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <div class="weather-info> 
        <p class="day">${weekday[new Date(element.dt * 1000).getDay()]}</p>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
        <p class="description">${element.weather[0].description}</p>
        </div >
        </div > `
    });

    cityName.innerHTML = location;
    todayCard.innerHTML = todayWeather.join("");
    hourlyCard.innerHTML = hourlyWeather.join("");
    forecastCard.innerHTML = forecastWeather.join("");

}

const error = (error) => {
    console.log(error);
    cityName.innerHTML = `<p class="error-message">Unable to retrieve your location</p>`

}

const config = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 500
}

navigator.geolocation.getCurrentPosition(success, error, config);

const updateLocation = () => {
    cityName.innerHTML = `<h2>${apiData.city.name}, ${apiData.city.country}</h2>`
};

const updateTodayCard = () => {
    const todayData = apiData.list.slice(0, 1);
    const todayWeather = todayData.map(element => {
        return `<div class="today-weather"> 
            <div class="today-weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
            <div class="today-weather-info"><p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
            <p class="temp-max">H. ${Math.round(element.main.temp_max - 273.15)}&#8451</p>
            <p class="temp-min">L. ${Math.round(element.main.temp_min - 273.15)}&#8451</p>
            <p class="description">${element.weather[0].description}</p>
            </div>
            </div > `
    });
    todayCard.innerHTML = todayWeather.join("");

};

const updateHourlyCard = () => {
    const hourlyData = apiData.list.slice(1, 4);
    const hourlyWeather = hourlyData.map(element => {
        return `<div class="hourly-weather">
    <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
    <div class="weather-info> 
    <p class="hours">${new Date(element.dt * 1000).getHours().toLocaleString()}:00</p>
    <p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
    <p class="description">${element.weather[0].description}</p>
    </div>
    </div > `
    });
    hourlyCard.innerHTML = hourlyWeather.join("");
};

const updateForecastCard = () => {
    const forecastData = apiData.list.slice(4, 7);
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const forecastWeather = forecastData.map(element => {
        return `<div class="forecast-weather" >
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <div class="weather-info> 
        <p class="day">${weekday[new Date(element.dt * 1000).getDay()]}</p>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
        <p class="description">${element.weather[0].description}</p>
        </div >
        </div > `
    });
    forecastCard.innerHTML = forecastWeather.join("");
} 

const getData = async () => {

    try {
        const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=7191fefc1ad22b3e9a87628b612c82a9`);
        apiData = data;
        console.log(apiData);
        updateLocation();
        updateTodayCard();
        updateHourlyCard();
        updateForecastCard();

    } catch (error) {
        console.log('Api said NO!');
    }
}

//User's input 
search.addEventListener('input', e => {

    //get the search value
    searchValue = e.target.value;
    console.log(searchValue);
    getData();
});