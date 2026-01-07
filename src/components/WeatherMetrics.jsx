import { useState, useEffect } from 'react'
import { FaTint, FaWind, FaEye, FaThermometerHalf } from 'react-icons/fa'
import './WeatherMetrics.css'

const WeatherMetrics = ({ currentWeather, forecastData }) => {
  const [metrics, setMetrics] = useState([])

  const calculateMetrics = (current, forecast) => {
    const currentMetrics = {
      humidity: current.main.humidity,
      windSpeed: current.wind.speed,
      visibility: current.visibility / 1000,
      pressure: current.main.pressure
    }

    const forecastMetrics = []
    if (forecast && forecast.list) {
      for (let i = 0; i < forecast.list.length && i < 8; i++) {
        const item = forecast.list[i]
        forecastMetrics.push({
          time: new Date(item.dt * 1000).getHours(),
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          visibility: item.visibility / 1000
        })
      }
    }

    return {
      current: currentMetrics,
      forecast: forecastMetrics
    }
  }

  useEffect(() => {
    if (currentWeather && forecastData) {
      const metricsData = calculateMetrics(currentWeather, forecastData)
      setMetrics(metricsData)
    }
  }, [currentWeather, forecastData])

  const getHumidityLevel = (humidity) => {
    if (humidity < 30) return { level: '干燥', color: '#f44336', icon: '🏜️' }
    if (humidity < 50) return { level: '舒适', color: '#4caf50', icon: '😊' }
    if (humidity < 70) return { level: '湿润', color: '#2196f3', icon: '💧' }
    return { level: '潮湿', color: '#9c27b0', icon: '🌊' }
  }

  const getWindLevel = (speed) => {
    if (speed < 2) return { level: '无风', color: '#9e9e9e', icon: '🍃' }
    if (speed < 4) return { level: '微风', color: '#4caf50', icon: '🌿' }
    if (speed < 6) return { level: '和风', color: '#2196f3', icon: '🌬️' }
    if (speed < 8) return { level: '清风', color: '#ff9800', icon: '🍃' }
    return { level: '强风', color: '#f44336', icon: '🌪️' }
  }

  const getVisibilityLevel = (visibility) => {
    if (visibility < 1) return { level: '差', color: '#f44336', icon: '🌫️' }
    if (visibility < 5) return { level: '一般', color: '#ff9800', icon: '🌥️' }
    if (visibility < 10) return { level: '良好', color: '#4caf50', icon: '🌤️' }
    return { level: '极佳', color: '#2196f3', icon: '☀️' }
  }

  if (!metrics.current) {
    return null
  }

  const humidityInfo = getHumidityLevel(metrics.current.humidity)
  const windInfo = getWindLevel(metrics.current.windSpeed)
  const visibilityInfo = getVisibilityLevel(metrics.current.visibility)

  return (
    <div className="weather-metrics-container">
      <h2 className="metrics-title">天气指标</h2>
      
      <div className="metrics-grid">
        <div className="metric-card humidity">
          <div className="metric-icon">
            <FaTint />
          </div>
          <div className="metric-content">
            <div className="metric-label">湿度</div>
            <div className="metric-value">{metrics.current.humidity}%</div>
            <div className="metric-level" style={{ color: humidityInfo.color }}>
              {humidityInfo.icon} {humidityInfo.level}
            </div>
            <div className="metric-bar">
              <div
                className="metric-bar-fill"
                style={{
                  width: `${metrics.current.humidity}%`,
                  background: `linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card wind">
          <div className="metric-icon">
            <FaWind />
          </div>
          <div className="metric-content">
            <div className="metric-label">风速</div>
            <div className="metric-value">{metrics.current.windSpeed.toFixed(1)} m/s</div>
            <div className="metric-level" style={{ color: windInfo.color }}>
              {windInfo.icon} {windInfo.level}
            </div>
            <div className="metric-bar">
              <div
                className="metric-bar-fill"
                style={{
                  width: `${Math.min(metrics.current.windSpeed * 10, 100)}%`,
                  background: `linear-gradient(90deg, #667eea 0%, #764ba2 100%)`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card visibility">
          <div className="metric-icon">
            <FaEye />
          </div>
          <div className="metric-content">
            <div className="metric-label">能见度</div>
            <div className="metric-value">{metrics.current.visibility.toFixed(1)} km</div>
            <div className="metric-level" style={{ color: visibilityInfo.color }}>
              {visibilityInfo.icon} {visibilityInfo.level}
            </div>
            <div className="metric-bar">
              <div
                className="metric-bar-fill"
                style={{
                  width: `${Math.min(metrics.current.visibility * 10, 100)}%`,
                  background: `linear-gradient(90deg, #f093fb 0%, #f5576c 100%)`
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="metric-card pressure">
          <div className="metric-icon">
            <FaThermometerHalf />
          </div>
          <div className="metric-content">
            <div className="metric-label">气压</div>
            <div className="metric-value">{metrics.current.pressure} hPa</div>
            <div className="metric-level" style={{ color: '#4caf50' }}>
              📊 正常
            </div>
            <div className="metric-bar">
              <div
                className="metric-bar-fill"
                style={{
                  width: `${((metrics.current.pressure - 900) / 200) * 100}%`,
                  background: `linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {metrics.forecast.length > 0 && (
        <div className="metrics-forecast">
          <h3 className="forecast-title">未来8小时趋势</h3>
          <div className="forecast-grid">
            {metrics.forecast.map((metric, index) => (
              <div key={index} className="forecast-item">
                <div className="forecast-time">{metric.time}:00</div>
                <div className="forecast-metrics">
                  <div className="forecast-metric">
                    <FaTint />
                    <span>{metric.humidity}%</span>
                  </div>
                  <div className="forecast-metric">
                    <FaWind />
                    <span>{metric.windSpeed.toFixed(1)}m/s</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherMetrics
