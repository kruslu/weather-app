import { 
  FaSun, FaCloud, FaCloudRain, FaSnowflake, 
  FaCloudShowersHeavy, FaBolt, FaSmog 
} from 'react-icons/fa';

const HourlyForecast = ({ forecastData }) => {
  if (!forecastData || !forecastData.list || forecastData.list.length === 0) {
    return null;
  }

  const getWeatherIcon = (weatherType) => {
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
    
    const mappedType = weatherMap[weatherType] || 'clouds';
    
    switch (mappedType) {
      case 'clear':
        return <FaSun className="hourly-icon sun" />;
      case 'clouds':
        return <FaCloud className="hourly-icon cloud" />;
      case 'rain':
        return <FaCloudRain className="hourly-icon rain" />;
      case 'drizzle':
        return <FaCloudShowersHeavy className="hourly-icon drizzle" />;
      case 'thunderstorm':
        return <FaBolt className="hourly-icon thunderstorm" />;
      case 'snow':
        return <FaSnowflake className="hourly-icon snow" />;
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
        return <FaSmog className="hourly-icon fog" />;
      default:
        return <FaCloud className="hourly-icon cloud" />;
    }
  };

  const getCurrentHour = () => {
    const now = new Date();
    return now.getHours();
  };

  const getHourlyData = () => {
    const currentHour = getCurrentHour();
    const hourlyData = [];
    
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % 24;
      const date = new Date();
      date.setHours(hour, 0, 0, 0);
      
      const forecastItem = forecastData.list.find(item => {
        const itemDate = new Date(item.dt * 1000);
        return itemDate.getHours() === hour;
      });

      if (forecastItem) {
        hourlyData.push({
          hour: hour,
          time: i === 0 ? '现在' : `${hour}:00`,
          temp: Math.round(forecastItem.main.temp),
          icon: getWeatherIcon(forecastItem.weather[0].main),
          description: forecastItem.weather[0].description
        });
      }
    }

    return hourlyData.slice(0, 24);
  };

  const hourlyData = getHourlyData();

  return (
    <div className="hourly-forecast-container animate-fade-in">
      <h3 className="hourly-title">24小时预报</h3>
      
      <div className="hourly-scroll">
        <div className="hourly-items">
          {hourlyData.map((item, index) => (
            <div 
              key={index} 
              className={`hourly-item ${index === 0 ? 'current' : ''} animate-scale`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="hourly-time">{item.time}</div>
              <div className="hourly-icon-wrapper">{item.icon}</div>
              <div className="hourly-temp">{item.temp}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
