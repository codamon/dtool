import { fetchWeather } from '../weather';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches weather data successfully', async () => {
    const mockWeatherResponse = {
      data: {
        main: {
          temp: 20,
          temp_min: 15,
          temp_max: 25,
        },
        weather: [{ description: 'Sunny' }],
      },
    };

    const mockForecastResponse = {
      data: {
        list: [
          {
            main: {
              temp: 22,
              temp_min: 17,
              temp_max: 27,
            },
            weather: [{ description: 'Cloudy' }],
            dt_txt: new Date().toISOString(),
          },
        ],
      },
    };

    mockedAxios.get
      .mockResolvedValueOnce(mockWeatherResponse)
      .mockResolvedValueOnce(mockForecastResponse);

    const result = await fetchWeather('Auckland');

    expect(result.temperature).toBe(20);
    expect(result.description).toBe('Sunny');
  });

  it('handles errors gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));

    const result = await fetchWeather('InvalidCity');

    expect(result.temperature).toBe(0);
    expect(result.description).toBe('暂无数据');
  });
}); 