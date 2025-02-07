import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeatherState {
  location: string;
  temperature: number;
  condition: string;
  time: string;
}

const initialState: WeatherState = {
  location: '',
  temperature: 0,
  condition: '',
  time: '',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setWeather: (state, action: PayloadAction<WeatherState>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setWeather } = weatherSlice.actions;
export default weatherSlice.reducer; 