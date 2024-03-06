import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Filter = ({text, filter, handler}) => {
  return (
    <div>
      {text} <input value={filter} onChange={handler} />
    </div>
  )
}

const Flag = ({country}) => {
  return (
    <div>
      <img src={country.flags.png}></img>
    </div>
  )
}

const Capital = ({country}) => {
  return (
    <ul>
      {country.capital.map((capital, i) => <li key={i}>{capital} </li>)}
    </ul>
  )
}

const Languages = ({country}) => {
  const languages = Object.values(country.languages)
  return (
    <ul>
    {languages.map((language, i) => <li key={i}>{language}</li>)}
    </ul>
  )
}

const WeatherIcon = ({icon}) => {
  return (
    <div>
      <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`}></img>
    </div>
  )
}

const Weather = ({country}) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    weatherService
    .getOne(country)
      .then(weatherData => {
        setWeather(weatherData)
      })
  }, [])
  
  if (weather) {
    return (
      <div>
        <h2>Weather in {country.capital[0]}</h2>
        <div>
          temperature {Math.round((weather.main.temp-273.15) * 100) / 100} Celsius
        </div>
        <WeatherIcon icon={weather.weather[0].icon} />
        <div>
          wind {weather.wind.speed} m/s
        </div>
      </div>
    )
  }
}

const Countries = ({countries, handleClick}) => {
  if (countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  
  }

  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div><b>capital:</b></div>
        <Capital country={country} />
        <div><b>area:</b> {country.area}</div>
        <br></br>
        <div><b>languages:</b></div>
        <Languages country={country} />
        <Flag country={country} />
        <Weather country={country} />
      </div>
    )
  }

  return (
    <ul>
      {countries.map(country => <li key={country.name.official}>{country.name.common} <button onClick={() => handleClick(country)}>show</button></li>)}
    </ul>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  useEffect(() => {
    countryService
      .getAll()
        .then(allCountries => {
        setCountries(allCountries)
        })
  }, [])

  const countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(countryFilter.toLowerCase()))

  const handleFilterChange = (event) => setCountryFilter(event.target.value)

  const showCountry = (country) => setCountryFilter(country.name.common)

  return (
    <div>
      <Filter text="find countries:" filter={countryFilter} handler={handleFilterChange} />
      <div>
        <Countries countries={countriesToShow} handleClick={showCountry} />
      </div>
    </div>
  )
}

export default App
