import axios from 'axios'
const weather_key = import.meta.env.VITE_WEATHER_KEY


const getOne = (country) => {
    const lat = country.capitalInfo.latlng[0]
    const lng = country.capitalInfo.latlng[1]
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weather_key}`)
    return request.then(response => response.data)
}

export default { getOne }