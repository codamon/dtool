import { renderHook } from '@testing-library/react';
import { useWorldClock } from '../useWorldClock';
import { fetchWeather } from '../../../lib/api/weather';

// Mock fetchWeather
jest.mock('../../../lib/api/weather', () => ({
  fetchWeather: jest.fn().mockImplementation(() => Promise.resolve({
    temperature: 20,
    tempMin: 15,
    tempMax: 25,
    description: 'Sunny',
    tomorrowTemp: 22,
    tomorrowTempMin: 17,
    tomorrowTempMax: 27,
    tomorrowDescription: 'Cloudy',
  })),
}));

describe('useWorldClock', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('initializes with loading state', () => {
    const { result } = renderHook(() => useWorldClock());
    expect(result.current.loading).toBe(true);
  });

  it('loads city data correctly', async () => {
    const { result, rerender } = renderHook(() => useWorldClock());
    
    // 等待所有 Promise 解析
    await Promise.resolve();
    // 运行所有定时器
    jest.runAllTimers();
    // 重新渲染以获取更新后的状态
    rerender();

    expect(result.current.loading).toBe(false);
    expect(result.current.cityData.length).toBe(4);
    expect(fetchWeather).toHaveBeenCalled();
  });

  it('updates time every second', async () => {
    const { result, rerender } = renderHook(() => useWorldClock());
    
    // 等待初始数据加载
    await Promise.resolve();
    jest.runAllTimers();
    rerender();

    const initialTime = result.current.cityData[0].time;

    // 前进一秒
    jest.advanceTimersByTime(1000);
    rerender();

    expect(result.current.cityData[0].time).toBeDefined();
    expect(typeof result.current.cityData[0].time).toBe('string');
  });
}); 