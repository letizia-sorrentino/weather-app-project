//DOM elements
const search = document.getElementById('search');
const spinner = document.getElementById('spinner');
const errorMessage = document.getElementById('error-message');
const cityName = document.getElementById('city-name');
const today = document.getElementById('today');
const hourly = document.getElementById('hourly');
const forecast = document.getElementById('forecast');

//Variables
let searchValue;
let apiData;

const getSpinner = () => {
    spinner.innerHTML = `<div class="spinner"> </div>`
};
getSpinner();


//Async function working with Geolocation
const success = async ({ coords }) => {
    const { latitude, longitude } = coords;
    console.log(latitude, longitude, coords);

    //talk to the weather api
    try {
        const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=7191fefc1ad22b3e9a87628b612c82a9`);
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

    } catch (error) {
        console.log('Api said NO!');
    }

};

const error = (error) => {
    console.log(error);
    errorMessage.innerHTML = `<p class="error">Unable to retrieve your location, please refresh or add your location manually</p>`
}

const config = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 1000
}

navigator.geolocation.getCurrentPosition(success, error, config);

const removeSpinner = () => {
    spinner.remove();
    errorMessage.remove();
}

const updateLocation = () => {
    cityName.innerHTML = `<h2>${apiData.city.name}, ${apiData.city.country}</h2>`
};

const updateTodayCard = () => {
    const element = apiData.list[0];
    const todayWeather = `<div class="today-card">  
            <div class="today-weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
            <div class="today-weather-info">
            <p class="today-temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
            <p class="temp-max">H. ${Math.round(element.main.temp_max - 273.15)}&#8451</p>
            <p class="temp-min">L. ${Math.round(element.main.temp_min - 273.15)}&#8451</p>
            <p class="today-description">${element.weather[0].description}</p>
            </div>
            </div> `
    today.innerHTML = todayWeather;
};

const updateHourlyCard = () => {
    const hourlyData = apiData.list.slice(0, 5);
    const hourlyWeather = hourlyData.map(element => {
        return `<div class="weather-info"> 
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <p class="hours">${new Date(element.dt * 1000).getHours().toLocaleString()}:00</p>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
        <p class="description">${element.weather[0].description}</p>
        </div>`
    });

    hourly.innerHTML = `<div class="hourly-card">
    <h3 class="card-title">Hourly Forecast</h3>
    <div class="weather-card">${hourlyWeather.join("")}</div>
    </div>`

};

const updateForecastCard = () => {
    const forecastData = apiData.list.slice(4, apiData.list.length - 1);
    console.log(forecastData);

    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const forecastWeather = forecastData.map(element => {
        // console.log(new Date(element.dt * 1000).getHours()) 
        if (new Date(element.dt * 1000).getHours() !== 19) {
            return
        }

        return `
        <div class="weather-info"> 
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <p class="day">${weekday[new Date(element.dt * 1000).getDay()]}</p>
        <p class="date">${new Date(element.dt * 1000).getDate()} ${month[new Date(element.dt * 1000).getMonth()]}</p>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
        <p class="description">${element.weather[0].description}</p>
        </div>`
    });

    forecast.innerHTML = `<div class="forecast-card">
    <h3 class="card-title">Daily Forecast</h3>
    <div class="weather-card">${forecastWeather.join("")}</div>
    </div>`
}


//change background colour
const setBackgroundColor = () => {
    const weatherConditions = apiData.list[0].weather[0].main;
    console.log(weatherConditions);

    switch (weatherConditions) {
        case 'Thunderstorm':
            document.body.style.background = 'rgb(148,156,169)';
            break;

        case 'Drizzle':
            document.body.style.background = 'rgb(148,156,169)';
            break;

        case 'Rain':
            document.body.style.background = 'rgb(148,156,169)';
            break;

        case 'Snow':
            document.body.style.background = 'rgb(242,242,242)';
            break;

        case 'Mist':
            document.body.style.background = 'rgb(242,242,242)';
            break;

        case 'Clear':
            document.body.style.background = 'rgba(20,158,220,255)';
            break;

        case 'Clouds':
            document.body.style.background = 'rgb(148,156,169)';
            break;

        default:
            document.body.style.background = 'rgba(20,158,220,255)';
    }

}

const getData = async () => {

    try {
        const { data } = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=7191fefc1ad22b3e9a87628b612c82a9`);
        apiData = data;
        console.log(apiData);
        removeSpinner();
        updateLocation();
        updateTodayCard();
        updateHourlyCard();
        updateForecastCard();
        setBackgroundColor();

    } catch (error) {
        console.log('Api said NO!');
        errorMessage.innerHTML = `<p class="error">Unable to retrieve your location</p>`
    }
}

//User's input 
search.addEventListener('input', (e) => {

    //get the search value
    searchValue = e.target.value;
    console.log(searchValue);
    getData();
});


