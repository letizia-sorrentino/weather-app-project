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
    const hourlyData = apiData.slice(1, 4);
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
    hourlyCard.innerHTML = hourlyWeather.join("");
};

const updateForecastCard = () => {
    const forecastData = apiData.slice(4, 7);
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

updateLocation();
updateTodayCard();
updateHourlyCard();
updateForecastCard();