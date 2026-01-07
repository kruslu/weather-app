import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import weatherService from '../services/weatherService';

const CitySearch = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          console.log('正在搜索城市:', query);
          const data = await weatherService.searchCity(query);
          console.log('搜索结果:', data);
          setResults(data);
        } catch (error) {
          console.error('搜索城市出错:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectCity = (city) => {
    setQuery(city.name);
    setResults([]);
    onCitySelect(city);
  };

  return (
    <div className="city-search" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="搜索城市..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>
      {loading && <div className="search-results loading">加载中...</div>}
      {results.length > 0 && (
        <div className="search-results show">
          {results.map((city, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleSelectCity(city)}
            >
              <div className="city-name">{city.name}</div>
              <div className="city-country">{city.country}</div>
              {city.state && <div className="city-state">{city.state}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CitySearch;
