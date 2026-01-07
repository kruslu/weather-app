import { 
  FaLungs, FaSun, FaWalking, FaCar, 
  FaTshirt, FaUmbrella, FaRunning, 
  FaHeartbeat, FaSnowflake, FaWind
} from 'react-icons/fa';

const WeatherDetails = ({ weatherData }) => {
  if (!weatherData) return null;

  const { main, weather, wind } = weatherData;
  const weatherType = weather[0].main.toLowerCase();

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: '优', color: '#4CAF50', icon: '😊' };
    if (aqi <= 100) return { level: '良', color: '#8BC34A', icon: '🙂' };
    if (aqi <= 150) return { level: '轻度污染', color: '#FFC107', icon: '😐' };
    if (aqi <= 200) return { level: '中度污染', color: '#FF9800', icon: '😷' };
    if (aqi <= 300) return { level: '重度污染', color: '#F44336', icon: '😨' };
    return { level: '严重污染', color: '#9C27B0', icon: '😱' };
  };

  const getUVLevel = (uv) => {
    if (uv <= 2) return { level: '弱', color: '#4CAF50', advice: '无需防护' };
    if (uv <= 5) return { level: '中等', color: '#FFC107', advice: '建议防护' };
    if (uv <= 7) return { level: '强', color: '#FF9800', advice: '需要防护' };
    if (uv <= 10) return { level: '很强', color: '#F44336', advice: '加强防护' };
    return { level: '极强', color: '#9C27B0', advice: '避免外出' };
  };

  const getLifestyleAdvice = () => {
    const temp = main.temp;

    return {
      sports: temp > 30 ? '不适宜' : temp > 20 ? '适宜' : temp > 10 ? '较适宜' : '不适宜',
      travel: weatherType.includes('雨') || weatherType.includes('雪') ? '不适宜' : '适宜',
      clothes: temp < 10 ? '羽绒服' : temp < 20 ? '外套' : temp < 30 ? '长袖' : '短袖',
      umbrella: weatherType.includes('雨') ? '需要' : '不需要'
    };
  };

  const lifestyle = getLifestyleAdvice();
  const aqiLevel = getAQILevel(75);
  const uvLevel = getUVLevel(5);

  return (
    <div className="weather-details-container animate-fade-in">
      <h3 className="details-title">详细天气信息</h3>
      
      <div className="details-grid">
        <div className="detail-card animate-scale">
          <div className="detail-card-header">
            <FaLungs className="detail-card-icon" />
            <span className="detail-card-title">空气质量</span>
          </div>
          <div className="detail-card-content">
            <div className="aqi-display">
              <span className="aqi-value">75</span>
              <span className="aqi-emoji">{aqiLevel.icon}</span>
            </div>
            <div className="aqi-level" style={{ color: aqiLevel.color }}>{aqiLevel.level}</div>
            <div className="aqi-bar">
              <div className="aqi-bar-fill" style={{ width: '75%', backgroundColor: aqiLevel.color }}></div>
            </div>
          </div>
        </div>

        <div className="detail-card animate-scale">
          <div className="detail-card-header">
            <FaSun className="detail-card-icon" />
            <span className="detail-card-title">紫外线指数</span>
          </div>
          <div className="detail-card-content">
            <div className="uv-display">
              <span className="uv-value">5</span>
              <span className="uv-emoji">☀️</span>
            </div>
            <div className="uv-level" style={{ color: uvLevel.color }}>{uvLevel.level}</div>
            <div className="uv-advice">{uvLevel.advice}</div>
          </div>
        </div>

        <div className="detail-card animate-scale">
          <div className="detail-card-header">
            <FaRunning className="detail-card-icon" />
            <span className="detail-card-title">运动指数</span>
          </div>
          <div className="detail-card-content">
            <div className="lifestyle-value">{lifestyle.sports}</div>
            <div className="lifestyle-desc">
              {lifestyle.sports === '适宜' && '适合户外运动'}
              {lifestyle.sports === '较适宜' && '可以适当运动'}
              {lifestyle.sports === '不适宜' && '建议室内运动'}
            </div>
          </div>
        </div>

        <div className="detail-card animate-scale">
          <div className="detail-card-header">
            <FaCar className="detail-card-icon" />
            <span className="detail-card-title">出行指数</span>
          </div>
          <div className="detail-card-content">
            <div className="lifestyle-value">{lifestyle.travel}</div>
            <div className="lifestyle-desc">
              {lifestyle.travel === '适宜' && '适合外出活动'}
              {lifestyle.travel === '不适宜' && '注意天气变化'}
            </div>
          </div>
        </div>

        <div className="detail-card animate-scale">
          <div className="detail-card-header">
            <FaTshirt className="detail-card-icon" />
            <span className="detail-card-title">穿衣指数</span>
          </div>
          <div className="detail-card-content">
            <div className="lifestyle-value">{lifestyle.clothes}</div>
            <div className="lifestyle-desc">建议穿着{lifestyle.clothes}</div>
          </div>
        </div>

        <div className="detail-card animate-scale">
          <div className="detail-card-header">
            <FaUmbrella className="detail-card-icon" />
            <span className="detail-card-title">雨伞指数</span>
          </div>
          <div className="detail-card-content">
            <div className="lifestyle-value">{lifestyle.umbrella}</div>
            <div className="lifestyle-desc">
              {lifestyle.umbrella === '需要' ? '记得带伞' : '无需带伞'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
