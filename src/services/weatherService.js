import axios from 'axios';

const API_KEY = import.meta.env.VITE_AMAP_API_KEY || (typeof window !== 'undefined' && window.WEATHER_CONFIG?.API_KEY) || '';
const BASE_URL = 'https://restapi.amap.com/v3';

const weatherService = {
  // 获取当前天气
  getCurrentWeather: async (city) => {
    try {
      // 先搜索城市获取adcode
      const cityData = await weatherService.searchCity(city);
      if (cityData.length === 0) {
        throw new Error('未找到城市');
      }
      const adcode = cityData[0].adcode;
      
      const response = await axios.get(`${BASE_URL}/weather/weatherInfo`, {
        params: {
          key: API_KEY,
          city: adcode,
          extensions: 'base',
          output: 'JSON'
        }
      });
      
      // 检查响应是否有效
      if (response.data.status !== '1' || !response.data.lives || response.data.lives.length === 0) {
        throw new Error('No weather data available');
      }
      
      // 转换为与OpenWeather API兼容的格式
      const weatherInfo = response.data.lives[0];
      return {
        name: weatherInfo.city,
        main: {
          temp: parseFloat(weatherInfo.temperature),
          humidity: parseInt(weatherInfo.humidity),
          pressure: 0 // 高德API不提供气压
        },
        weather: [{
          main: weatherInfo.weather,
          description: weatherInfo.weather,
          icon: weatherInfo.weather
        }],
        wind: {
          speed: parseFloat(weatherInfo.windpower),
          deg: 0 // 高德API不提供风向角度
        },
        sys: {
          country: '',
          sunrise: 0,
          sunset: 0
        },
        coord: {
          lon: cityData[0].lon,
          lat: cityData[0].lat
        }
      };
    } catch (error) {
      console.error('获取当前天气失败:', error);
      throw error;
    }
  },

  // 获取5天预报
  getForecast: async (city) => {
    try {
      // 先搜索城市获取adcode
      const cityData = await weatherService.searchCity(city);
      if (cityData.length === 0) {
        throw new Error('未找到城市');
      }
      const adcode = cityData[0].adcode;
      
      const response = await axios.get(`${BASE_URL}/weather/weatherInfo`, {
        params: {
          key: API_KEY,
          city: adcode,
          extensions: 'all',
          output: 'JSON'
        }
      });
      
      // 检查响应是否有效
      if (response.data.status !== '1' || !response.data.forecasts || response.data.forecasts.length === 0) {
        throw new Error('No forecast data available');
      }
      
      // 转换为与OpenWeather API兼容的格式
      const forecastList = response.data.forecasts[0].casts.map(cast => {
        return {
          dt: new Date(cast.date).getTime() / 1000,
          main: {
            temp: (parseFloat(cast.daytemp) + parseFloat(cast.nighttemp)) / 2,
            temp_max: parseFloat(cast.daytemp),
            temp_min: parseFloat(cast.nighttemp),
            humidity: 0 // 高德API不提供湿度预报
          },
          weather: [{
            main: cast.dayweather,
            description: cast.dayweather,
            icon: cast.dayweather
          }],
          wind: {
            speed: parseFloat(cast.daypower),
            deg: 0 // 高德API不提供风向角度
          }
        };
      });
      
      return {
        list: forecastList,
        city: {
          name: response.data.forecasts[0].city
        }
      };
    } catch (error) {
      console.error('获取预报失败:', error);
      throw error;
    }
  },

  // 获取天气预警
  getWeatherAlerts: async () => {
    try {
      return [];
    } catch (error) {
      console.error('获取天气预警失败:', error);
      return [];
    }
  },

  // 搜索城市
  searchCity: async (query) => {
    try {
      console.log('调用高德地图城市搜索API，查询:', query);
      
      // 1. 首先尝试使用行政区域查询API，它更适合获取城市级别的数据
      try {
        console.log('尝试使用行政区域查询API...');
        const districtResponse = await axios.get(`${BASE_URL}/config/district`, {
          params: {
            key: API_KEY,
            keywords: query,
            subdistrict: 1, // 获取下一级行政区
            extensions: 'base',
            output: 'JSON'
          }
        });
        
        console.log('行政区域查询API响应:', districtResponse.data);
        
        if (districtResponse.data.status === '1' && districtResponse.data.districts && districtResponse.data.districts.length > 0) {
          const results = [];
          
          // 处理行政区数据，优先获取城市和省份
          const processDistricts = (districts, level = 0) => {
            for (const district of districts) {
              // 确保有center信息
              if (district.center) {
                const centerCoords = district.center.split(',');
                if (centerCoords.length === 2) {
                  results.push({
                    name: district.name,
                    local_names: { zh: district.name },
                    lat: parseFloat(centerCoords[1]),
                    lon: parseFloat(centerCoords[0]),
                    country: district.province || district.name,
                    state: district.name,
                    adcode: district.adcode || '',
                    level: district.level
                  });
                }
              }
              
              // 限制递归深度，避免返回过多子区域
              if (district.districts && district.districts.length > 0 && level < 1) {
                processDistricts(district.districts, level + 1);
              }
            }
          };
          
          processDistricts(districtResponse.data.districts);
          
          if (results.length > 0) {
            return results;
          }
        }
      } catch (districtError) {
        console.error('行政区域查询失败，将尝试POI搜索:', districtError);
      }
      
      // 2. 如果行政区查询失败或没有结果，尝试使用POI搜索API
      console.log('尝试使用POI搜索API...');
      const poiResponse = await axios.get(`${BASE_URL}/place/text`, {
        params: {
          key: API_KEY,
          keywords: query,
          types: '150100', // 城市设施类型
          citylimit: true,
          output: 'JSON',
          offset: 20
        }
      });
      
      console.log('POI搜索API响应:', poiResponse.data);
      
      if (poiResponse.data.status === '1' && poiResponse.data.pois && poiResponse.data.pois.length > 0) {
        // 过滤并整理POI搜索结果，优先选择城市级别的结果
        const cityResults = [];
        const cityNames = new Set();
        
        for (const poi of poiResponse.data.pois) {
          // 优先使用城市名称作为结果
          const cityName = poi.cityname || poi.pname;
          if (cityName && !cityNames.has(cityName)) {
            cityNames.add(cityName);
            
            // 查找该城市的坐标信息（使用第一个匹配该城市的POI的坐标）
            const cityPOI = poiResponse.data.pois.find(p => (p.cityname === cityName || p.pname === cityName));
            if (cityPOI && cityPOI.location) {
              cityResults.push({
                name: cityName,
                local_names: { zh: cityName },
                lat: parseFloat(cityPOI.location.split(',')[1]),
                lon: parseFloat(cityPOI.location.split(',')[0]),
                country: poi.pname || '',
                state: cityName,
                adcode: poi.adcode || ''
              });
            }
          }
        }
        
        // 如果找到城市级别的结果，返回这些结果
        if (cityResults.length > 0) {
          return cityResults;
        }
        
        // 如果没有城市级别的结果，返回所有POI结果
        return poiResponse.data.pois.map(poi => ({
          name: poi.cityname || poi.name,
          local_names: { zh: poi.cityname || poi.name },
          lat: parseFloat(poi.location.split(',')[1]),
          lon: parseFloat(poi.location.split(',')[0]),
          country: poi.pname || '',
          state: poi.cityname || poi.pname || '',
          adcode: poi.adcode || ''
        }));
      }
      
      console.error('未找到任何城市数据');
      return [];
    } catch (error) {
      console.error('搜索城市失败:', error);
      if (error.response) {
        console.error('API响应错误:', error.response.data);
        console.error('API错误码:', error.response.data.infocode);
        console.error('API错误信息:', error.response.data.info);
      } else if (error.request) {
        console.error('API请求未收到响应:', error.request);
      } else {
        console.error('API请求配置错误:', error.message);
      }
      return [];
    }
  }
};

export default weatherService;
