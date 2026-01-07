import { useState, useEffect, useCallback } from 'react'
import './App.css'
import CitySearch from './components/CitySearch'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import WeatherAlerts from './components/WeatherAlerts'
import WeatherDetails from './components/WeatherDetails'
import HourlyForecast from './components/HourlyForecast'
import TemperatureChart from './components/TemperatureChart'
import WeatherMetrics from './components/WeatherMetrics'
import CityFavorites from './components/CityFavorites'
import WeatherBackground from './components/WeatherBackground'
import weatherService from './services/weatherService'

function App() {
  const [currentWeather, setCurrentWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [weatherType, setWeatherType] = useState('clear')
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const savedFavorites = localStorage.getItem('weatherFavorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites))
  }, [favorites])

  const handleAddFavorite = (cityName) => {
    const exists = favorites.some(fav => fav.name === cityName)
    if (!exists) {
      setFavorites([...favorites, { name: cityName, weather: null }])
    }
  }

  const handleRemoveFavorite = (index) => {
    setFavorites(favorites.filter((_, i) => i !== index))
  }

  const handleSelectFavorite = async (city) => {
    await handleCitySelect(city)
  }

  const updateFavoriteWeather = (cityName, weatherData) => {
    setFavorites(prevFavorites =>
      prevFavorites.map(fav =>
        fav.name === cityName
          ? { ...fav, weather: { temp: weatherData.main.temp, icon: weatherData.weather[0].icon } }
          : fav
      )
    )
  }

  // 默认加载北京天气
  useEffect(() => {
    handleCitySelect({ name: '北京' })
  }, [])

  const handleCitySelect = async (city) => {
    setLoading(true)
    setError(null)
    try {
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(city.name),
        weatherService.getForecast(city.name)
      ])

      setCurrentWeather(currentData)
      setForecast(forecastData)
      setWeatherType(currentData.weather[0].main)

      updateFavoriteWeather(city.name, currentData)

      if (currentData.coord) {
        const alertsData = await weatherService.getWeatherAlerts(
          currentData.coord.lat,
          currentData.coord.lon
        )
        setAlerts(alertsData)
      }
    } catch (err) {
      setError('获取天气数据失败，请检查网络连接或城市名称')
      console.error('Error fetching weather data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      <WeatherBackground weatherType={weatherType} />
      
      <div className="app-content">
        <header className="app-header">
          <h1>天气预报</h1>
        </header>

        <main className="app-main">
          <CitySearch onCitySelect={handleCitySelect} />
          <CityFavorites
            favorites={favorites}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            onSelectCity={handleSelectFavorite}
          />

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">加载天气数据中...</div>
            </div>
          )}

          {error && (
            <div className="error-container">
              <div className="error-message">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <>
              {currentWeather && <CurrentWeather weatherData={currentWeather} />}
              {forecast && <HourlyForecast forecastData={forecast} />}
              {currentWeather && forecast && <WeatherMetrics currentWeather={currentWeather} forecastData={forecast} />}
              {currentWeather && <WeatherDetails weatherData={currentWeather} />}
              {forecast && <TemperatureChart forecastData={forecast} />}
              {forecast && <Forecast forecastData={forecast} />}
              {alerts.length > 0 && <WeatherAlerts alerts={alerts} />}
            </>
          )}
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>功能特性</h3>
              <ul>
                <li>实时天气查询</li>
                <li>7天天气预报</li>
                <li>24小时预报</li>
                <li>温度趋势图表</li>
                <li>天气指标可视化</li>
                <li>城市搜索</li>
                <li>城市收藏</li>
                <li>空气质量指数</li>
                <li>紫外线指数</li>
                <li>生活指数</li>
                <li>动态背景效果</li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>技术支持</h3>
              <p>使用 高德地图 API 提供数据</p>
              <p className="app-version">天气应用 v2.0</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
