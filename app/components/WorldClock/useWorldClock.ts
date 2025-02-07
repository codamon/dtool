import { useState, useEffect } from 'react';
import { fetchWeather } from '../../lib/api/weather';

interface City {
  name: string;
  timezone: string;
  code: string;
}

interface CityData extends City {
  time: string;
  weather: number;
  tempMin: number;
  tempMax: number;
  description: string;
  tomorrowTemp: number;
  tomorrowTempMin: number;
  tomorrowTempMax: number;
  tomorrowDescription: string;
}

const CITIES: City[] = [
  { name: 'Auckland', timezone: 'Pacific/Auckland', code: 'Auckland' },
  { name: 'Wanzhou', timezone: 'Asia/Shanghai', code: 'Wanzhou' },
  { name: 'Chengdu', timezone: 'Asia/Shanghai', code: 'Chengdu' },
  { name: 'Huludao', timezone: 'Asia/Shanghai', code: 'Huludao' }
];

export const useWorldClock = () => {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateCityData = async () => {
      try {
        const updatedCities = await Promise.all(
          CITIES.map(async (city) => {
            const time = new Date().toLocaleTimeString('zh-CN', {
              timeZone: city.timezone,
              hour12: false,
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const weatherData = await fetchWeather(city.code);
            
            return {
              ...city,
              time,
              weather: weatherData.temperature,
              tempMin: weatherData.tempMin,
              tempMax: weatherData.tempMax,
              description: weatherData.description,
              tomorrowTemp: weatherData.tomorrowTemp,
              tomorrowTempMin: weatherData.tomorrowTempMin,
              tomorrowTempMax: weatherData.tomorrowTempMax,
              tomorrowDescription: weatherData.tomorrowDescription
            };
          })
        );
        
        setCityData(updatedCities);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    updateCityData();
    const weatherInterval = setInterval(updateCityData, 60000);

    const timeInterval = setInterval(() => {
      setCityData(prevData => 
        prevData.map(city => ({
          ...city,
          time: new Date().toLocaleTimeString('zh-CN', {
            timeZone: city.timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
          })
        }))
      );
    }, 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  return { cityData, loading, error };
}; 