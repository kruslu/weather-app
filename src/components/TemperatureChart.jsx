import { useState, useEffect } from 'react'
import './TemperatureChart.css'

const TemperatureChart = ({ forecastData }) => {
  const [chartData, setChartData] = useState([])

  const processDailyData = (list) => {
    const dailyMap = new Map()

    list.forEach(item => {
      const date = new Date(item.dt * 1000)
      const dateKey = date.toDateString()

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: date,
          temps: [],
          weather: item.weather[0].main,
          icon: item.weather[0].icon
        })
      }

      dailyMap.get(dateKey).temps.push(item.main.temp)
    })

    const result = []
    dailyMap.forEach((value) => {
      const temps = value.temps
      result.push({
        date: value.date,
        dayTemp: Math.max(...temps),
        nightTemp: Math.min(...temps),
        avgTemp: temps.reduce((a, b) => a + b, 0) / temps.length,
        weather: value.weather
      })
    })

    return result.slice(0, 7)
  }

  useEffect(() => {
    if (forecastData && forecastData.list) {
      const dailyData = processDailyData(forecastData.list)
      setChartData(dailyData)
    }
  }, [forecastData])

  const formatDate = (date) => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const month = date.getMonth() + 1
    const day = date.getDate()
    const dayOfWeek = days[date.getDay()]
    return `${month}/${day} ${dayOfWeek}`
  }

  const getWeatherIcon = (weather) => {
    const weatherMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌪️',
      'Fog': '🌫️'
    }
    return weatherMap[weather] || '☀️'
  }

  if (chartData.length === 0) {
    return null
  }

  const maxTemp = Math.max(...chartData.map(d => d.dayTemp))
  const minTemp = Math.min(...chartData.map(d => d.nightTemp))
  const tempRange = maxTemp - minTemp || 1

  return (
    <div className="temperature-chart-container">
      <h2 className="chart-title">温度趋势</h2>
      <div className="chart-wrapper">
        <div className="chart-grid">
          {chartData.map((data, index) => (
            <div key={index} className="chart-column">
              <div className="chart-date">{formatDate(data.date)}</div>
              <div className="chart-weather-icon">{getWeatherIcon(data.weather)}</div>
              <div className="chart-temps">
                <div className="chart-temp high">
                  {Math.round(data.dayTemp)}°
                </div>
                <div className="chart-temp-bar">
                  <div
                    className="chart-temp-fill"
                    style={{
                      height: `${((data.dayTemp - minTemp) / tempRange) * 100}%`,
                      background: `linear-gradient(to top, #4facfe 0%, #00f2fe 100%)`
                    }}
                  ></div>
                </div>
                <div className="chart-temp low">
                  {Math.round(data.nightTemp)}°
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-color high"></span>
            <span>最高温度</span>
          </div>
          <div className="legend-item">
            <span className="legend-color low"></span>
            <span>最低温度</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemperatureChart
