import { useState } from 'react'
import { FaHeart, FaTrash, FaPlus } from 'react-icons/fa'
import './CityFavorites.css'

const CityFavorites = ({ favorites, onAddFavorite, onRemoveFavorite, onSelectCity }) => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCityName, setNewCityName] = useState('')

  const handleAddFavorite = () => {
    if (newCityName.trim()) {
      onAddFavorite(newCityName.trim())
      setNewCityName('')
      setShowAddModal(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddFavorite()
    }
  }

  return (
    <div className="city-favorites-container">
      <div className="favorites-header">
        <h2 className="favorites-title">
          <FaHeart className="heart-icon" />
          收藏城市
        </h2>
        <button
          className="add-city-btn"
          onClick={() => setShowAddModal(true)}
          title="添加城市"
        >
          <FaPlus />
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <FaHeart className="empty-icon" />
          <p>还没有收藏的城市</p>
          <p className="empty-hint">点击 + 按钮添加你喜欢的城市</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((city, index) => (
            <div
              key={index}
              className="favorite-card"
              onClick={() => onSelectCity(city)}
            >
              <div className="favorite-content">
                <h3 className="favorite-city-name">{city.name}</h3>
                {city.weather && (
                  <div className="favorite-weather">
                    <span className="weather-icon">{city.weather.icon}</span>
                    <span className="weather-temp">{Math.round(city.weather.temp)}°C</span>
                  </div>
                )}
              </div>
              <button
                className="remove-favorite-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveFavorite(index)
                }}
                title="取消收藏"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">添加城市</h3>
            <input
              type="text"
              className="city-input"
              placeholder="输入城市名称（如：北京）"
              value={newCityName}
              onChange={(e) => setNewCityName(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="modal-btn cancel-btn"
                onClick={() => setShowAddModal(false)}
              >
                取消
              </button>
              <button
                className="modal-btn confirm-btn"
                onClick={handleAddFavorite}
                disabled={!newCityName.trim()}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CityFavorites
