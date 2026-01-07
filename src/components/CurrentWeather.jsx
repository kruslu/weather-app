import { 
  FaSun, FaCloud, FaCloudRain, FaSnowflake, 
  FaCloudShowersHeavy, FaBolt, FaSmog, 
  FaWind, FaTint, FaThermometerHalf 
} from 'react-icons/fa';

const CurrentWeather = ({ weatherData }) => {
  if (!weatherData) return null;

  const { name, main, weather, wind, clouds, sys } = weatherData;
  const weatherType = weather[0].main.toLowerCase();

  // 获取天气图标
  const getWeatherIcon = () => {
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
    
    const mappedType = weatherMap[weatherType] || 'clouds';
    
    switch (mappedType) {
      case 'clear':
        return <FaSun className="weather-icon sun" />;
      case 'clouds':
        return <FaCloud className="weather-icon cloud" />;
      case 'rain':
        return <FaCloudRain className="weather-icon rain" />;
      case 'drizzle':
        return <FaCloudShowersHeavy className="weather-icon drizzle" />;
      case 'thunderstorm':
        return <FaBolt className="weather-icon thunderstorm" />;
      case 'snow':
        return <FaSnowflake className="weather-icon snow" />;
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
        return <FaSmog className="weather-icon fog" />;
      default:
        return <FaCloud className="weather-icon cloud" />;
    }
  };

  return (
    <div className="current-weather animate-fade-in">
      <div className="weather-header">
        <h2 className="city-name">{name}</h2>
        <div className="country">{sys.country || ''}</div>
      </div>
      
      <div className="weather-main">
        <div className="temperature-container">
          <div className="temperature animate-scale">{Math.round(main.temp)}°C</div>
          {main.feels_like && (
            <div className="feels-like animate-fade-in">体感温度: {Math.round(main.feels_like)}°C</div>
          )}
        </div>
        
        <div className="weather-info">
          <div className="weather-icon-container animate-pulse">
            {getWeatherIcon()}
          </div>
          <div className="weather-description animate-fade-in">{weather[0].description}</div>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item animate-fade-in">
          <div className="detail-icon-container">
            <FaTint className="detail-icon" />
          </div>
          <div className="detail-label">湿度</div>
          <div className="detail-value-container">
            <div className="detail-value">{main.humidity}%</div>
            <div className="humidity-indicator">
              <div className="humidity-bar" style={{ width: `${main.humidity}%` }}></div>
            </div>
          </div>
        </div>
        
        <div className="detail-item animate-fade-in">
          <div className="detail-icon-container">
            <FaWind className="detail-icon" />
            <div className="wind-particles">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="wind-particle" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
          <div className="detail-label">风速</div>
          <div className="detail-value">{wind.speed || 0} 级</div>
        </div>
        
        {clouds && clouds.all > 0 && (
          <div className="detail-item animate-fade-in">
            <div className="detail-icon-container">
              <FaCloud className="detail-icon" />
            </div>
            <div className="detail-label">云量</div>
            <div className="detail-value-container">
              <div className="detail-value">{clouds.all}%</div>
              <div className="cloud-coverage">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="cloud-bar" style={{ opacity: i < Math.ceil(clouds.all / 20) ? 1 : 0.3 }}></div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {main.pressure > 0 && (
          <div className="detail-item animate-fade-in">
            <div className="detail-icon-container">
              <FaThermometerHalf className="detail-icon" />
            </div>
            <div className="detail-label">气压</div>
            <div className="detail-value">{main.pressure} hPa</div>
          </div>
        )}
      </div>

      {(sys.sunrise > 0 || sys.sunset > 0) && (
        <div className="sun-times animate-fade-in">
          {sys.sunrise > 0 && (
            <div className="sun-item">
              <div className="sun-label">日出</div>
              <div className="sun-time">{new Date(sys.sunrise * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          )}
          {sys.sunset > 0 && (
            <div className="sun-item">
              <div className="sun-label">日落</div>
              <div className="sun-time">{new Date(sys.sunset * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CurrentWeather;
