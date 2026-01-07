import { FaExclamationTriangle, FaInfoCircle, FaBell } from 'react-icons/fa';

const WeatherAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  // 获取预警级别对应的样式和图标
  const getAlertSeverity = (event) => {
    const lowerEvent = event.toLowerCase();
    if (lowerEvent.includes('warning') || lowerEvent.includes('alert')) {
      return {
        className: 'alert-warning',
        icon: <FaExclamationTriangle className="alert-icon" />
      };
    } else if (lowerEvent.includes('watch')) {
      return {
        className: 'alert-watch',
        icon: <FaBell className="alert-icon" />
      };
    } else {
      return {
        className: 'alert-info',
        icon: <FaInfoCircle className="alert-icon" />
      };
    }
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 移除HTML标签
  const removeHtmlTags = (html) => {
    return html.replace(/<[^>]*>/g, '');
  };

  return (
    <div className="weather-alerts">
      <h3 className="alerts-title">天气预警</h3>
      <div className="alerts-container">
        {alerts.map((alert, index) => {
          const severity = getAlertSeverity(alert.event);
          return (
            <div key={index} className={`alert-item ${severity.className}`}>
              <div className="alert-header">
                {severity.icon}
                <div className="alert-title">{alert.event}</div>
              </div>
              <div className="alert-description">
                {removeHtmlTags(alert.description)}
              </div>
              <div className="alert-time">
                <div className="time-start">开始: {formatTime(alert.start)}</div>
                <div className="time-end">结束: {formatTime(alert.end)}</div>
              </div>
              {alert.sender_name && (
                <div className="alert-sender">发布者: {alert.sender_name}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherAlerts;
