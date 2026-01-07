const WeatherBackground = ({ weatherType }) => {
  // 根据天气类型获取背景样式
  const getBackgroundStyle = () => {
    // 高德地图天气类型映射到背景样式
    const weatherMap = {
      '晴': 'clear',
      '多云': 'clouds',
      '阴': 'clouds',
      '小雨': 'rain',
      '中雨': 'rain',
      '大雨': 'rain',
      '暴雨': 'rain',
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
    
    const mappedType = weatherMap[weatherType?.toLowerCase()] || weatherType?.toLowerCase() || 'default';
    
    switch (mappedType) {
      case 'clear':
        return {
          background: 'linear-gradient(135deg, #87CEEB 0%, #98D8C8 100%)',
          className: 'bg-clear'
        };
      case 'clouds':
        return {
          background: 'linear-gradient(135deg, #B0BEC5 0%, #CFD8DC 100%)',
          className: 'bg-clouds'
        };
      case 'rain':
      case 'drizzle':
        return {
          background: 'linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)',
          className: 'bg-rain'
        };
      case 'thunderstorm':
        return {
          background: 'linear-gradient(135deg, #2C3E50 0%, #4CA1AF 100%)',
          className: 'bg-thunderstorm'
        };
      case 'snow':
        return {
          background: 'linear-gradient(135deg, #E0EAF5 0%, #FFFFFF 100%)',
          className: 'bg-snow'
        };
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'dust':
      case 'fog':
        return {
          background: 'linear-gradient(135deg, #BDC3C7 0%, #E2E8F0 100%)',
          className: 'bg-fog'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #87CEEB 0%, #98D8C8 100%)',
          className: 'bg-default'
        };
    }
  };

  const bgStyle = getBackgroundStyle();

  return (
    <div className={`weather-background ${bgStyle.className}`} style={bgStyle} />
  );
};

export default WeatherBackground;
