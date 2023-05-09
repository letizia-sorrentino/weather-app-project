//DOM elements
const form = document.getElementById('city');
const input = document.getElementById('cityInput');
const button= document.getElementById('btn');
const msg = document.querySelector('.form-message');
const cityName = document.getElementById('city-name');
const todayCard = document.getElementById('today-card');
const hourlyCard = document.getElementById('hourly-card');
const forecastCard = document.getElementById('forecast-card');


form.addEventListener('submit', e => {
    //prevent default form submission
    e.preventDefault();
    
    //hide any message that might be displayed
    msg.textContent = '';
    msg.classList.remove('visible');
    
    //get the search value
    let inputVal = input.value;
    console.log(inputVal);
    return inputVal;
    });


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
        const city = data.city.name;
        const location = `<div class="location"><h2>${city}</h2></div> ` 

    //today-weather card
    const todayData = list.slice(0,1);
    const todayWeather = todayData.map(element => {
        return `<div class="today-weather"> 
            <div class="today-weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
            <div class="today-weather-info"><p class="temp">${Math.round(element.main.temp- 273.15)}&#8451</p>
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
        <p class="hours">${new Date(element.dt * 1000).getHours().toLocaleString()}</p>
        <p class="temp">${Math.round(element.main.temp - 273.15)}&#8451</p>
        <p class="description">${element.weather[0].description}</p>
        </div>
        </div > `
    });

    //daily Forecast Card
    const forecastData = list.slice(4,7);
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    
    const forecastWeather = forecastData.map(element => {
        return `<div class="forecast-weather" >
        <div class="weather-icon"><img src="https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png"></div>
        <div class="weather-info> 
        <p class="day">${weekday[new Date(element.dt*1000).getDay()]}</p>
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
}

const config = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 1000
}

navigator.geolocation.getCurrentPosition(success, error, config);