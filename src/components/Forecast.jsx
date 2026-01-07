import {
  FaSun, FaCloud, FaCloudRain, FaSnowflake,
  FaCloudShowersHeavy, FaBolt, FaSmog
} from 'react-icons/fa';

const Forecast = ({ forecastData }) => {
  if (!forecastData || !forecastData.list) return null;

  // 将预报数据按天分组
  const groupByDay = () => {
    const days = {};
    
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toLocaleDateString('zh-CN', { weekday: 'short' });
      
      if (!days[dayKey]) {
        days[dayKey] = {
          date: dayKey,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          weather: item.weather[0],
          timestamp: item.dt
        };
      } else {
        days[dayKey].temp_min = Math.min(days[dayKey].temp_min, item.main.temp_min);
        days[dayKey].temp_max = Math.max(days[dayKey].temp_max, item.main.temp_max);
      }
    });
    
    // 转换为数组并按时间排序
    return Object.values(days).sort((a, b) => a.timestamp - b.timestamp);
  };

  const dailyForecasts = groupByDay();

  // 获取天气图标
  const getWeatherIcon = (weatherType) => {
    // 高德地图天气类型映射到图标
    const weatherMap = {
      '晴': 'clear',
      '多云': 'clouds',
      '阴': 'clouds',
      '小雨': 'rain',
      '中雨': 'rain',
      '大雨': 'rain',
      '暴雨': 'drizzle',
      '雷阵雨': 'thunderstorm',
      '雷阵雨伴有冰雹': 'thunderstorm',
      '小雪': 'snow',
      '中雪': 'snow',
      '大雪': 'snow',
      '暴雪': 'snow',
      '雾': 'fog',
      '霾': 'haze',
      '浮尘': 'dust',
      '扬沙': 'dust',
      '沙尘暴': 'dust'
    };
    
    const mappedType = weatherMap[weatherType.toLowerCase()] || 'clouds';
    
    switch (mappedType) {
      case 'clear':
        return <FaSun className="forecast-icon sun" />;
      case 'clouds':
        return <FaCloud className="forecast-icon cloud" />;
      case 'rain':
        return <FaCloudRain className="forecast-icon rain" />;
      case 'drizzle':
        return <FaCloudShowersHeavy className="forecast-icon drizzle" />;
      case 'thunderstorm':
        return <FaBolt className="forecast-icon thunderstorm" />;
      case 'snow':
        return <FaSnowflake className="forecast-icon snow" />;
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
        return <FaSmog className="forecast-icon fog" />;
      default:
        return <FaCloud className="forecast-icon cloud" />;
    }
  };

  return (
    <div className="forecast animate-fade-in">
      <h3 className="forecast-title">5天预报</h3>
      <div className="forecast-container">
        {dailyForecasts.map((day, index) => (
          <div key={index} className={`forecast-day animate-fade-in animate-scale`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="forecast-date animate-fade-in">{day.date}</div>
            <div className="forecast-icon-container animate-pulse">
              {getWeatherIcon(day.weather.main)}
            </div>
            <div className="forecast-temp animate-fade-in">
              <span className="temp-max">{Math.round(day.temp_max)}°</span>
              <span className="temp-min">{Math.round(day.temp_min)}°</span>
            </div>
            <div className="forecast-desc animate-fade-in">{day.weather.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
