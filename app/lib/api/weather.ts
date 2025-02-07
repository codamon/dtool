import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

interface WeatherResponse {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    description: string;
  }>;
}

interface ForecastResponse {
  list: Array<{
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
    }>;
    dt_txt: string;
  }>;
}

interface WeatherData {
  temperature: number;
  tempMin: number;
  tempMax: number;
  description: string;
  tomorrowTemp: number;
  tomorrowTempMin: number;
  tomorrowTempMax: number;
  tomorrowDescription: string;
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    const [weatherRes, forecastRes] = await Promise.all([
      axios.get<WeatherResponse>(BASE_URL, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'zh_cn'
        }
      }),
      axios.get<ForecastResponse>('https://api.openweathermap.org/data/2.5/forecast', {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'zh_cn'
        }
      })
    ]);

    // 获取今天的日期
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 获取今天所有预报数据
    const todayForecasts = forecastRes.data.list.filter(item => {
      const itemDate = new Date(item.dt_txt);
      return itemDate.getDate() === today.getDate();
    });
    
    // 获取明天所有预报数据
    const tomorrowForecasts = forecastRes.data.list.filter(item => {
      const itemDate = new Date(item.dt_txt);
      return itemDate.getDate() === tomorrow.getDate();
    });
    
    // 计算今天的温度区间
    const todayTemps = todayForecasts.map(f => f.main.temp);
    const tempMin = Math.min(...todayTemps, weatherRes.data.main.temp);
    const tempMax = Math.max(...todayTemps, weatherRes.data.main.temp);
    
    // 计算明天的温度区间
    const tomorrowTemps = tomorrowForecasts.map(f => f.main.temp);
    const tomorrowTempMin = Math.min(...tomorrowTemps);
    const tomorrowTempMax = Math.max(...tomorrowTemps);
    
    // 获取明天中午的天气描述
    const tomorrowNoon = tomorrowForecasts.find(item => {
      const date = new Date(item.dt_txt);
      return date.getHours() === 12;
    });

    return {
      temperature: Math.round(weatherRes.data.main.temp),
      tempMin: Math.round(tempMin),
      tempMax: Math.round(tempMax),
      description: weatherRes.data.weather[0].description,
      tomorrowTemp: Math.round(tomorrowNoon?.main.temp ?? 0),
      tomorrowTempMin: Math.round(tomorrowTempMin),
      tomorrowTempMax: Math.round(tomorrowTempMax),
      tomorrowDescription: tomorrowNoon?.weather[0].description ?? '暂无数据'
    };
  } catch (error) {
    return {
      temperature: 0,
      tempMin: 0,
      tempMax: 0,
      description: '暂无数据',
      tomorrowTemp: 0,
      tomorrowTempMin: 0,
      tomorrowTempMax: 0,
      tomorrowDescription: '暂无数据'
    };
  }
} 