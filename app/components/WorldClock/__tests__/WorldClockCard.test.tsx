import { render, screen } from '@testing-library/react';
import WorldClockCard from '../WorldClockCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const mockProps = {
  name: 'Auckland',
  time: '12:00',
  weather: 20,
  tempMin: 15,
  tempMax: 25,
  description: 'Sunny',
  tomorrowTemp: 22,
  tomorrowTempMin: 17,
  tomorrowTempMax: 27,
  tomorrowDescription: 'Cloudy',
  index: 0,
  moveCard: jest.fn(),
};

describe('WorldClockCard', () => {
  it('renders correctly', () => {
    render(
      <DndProvider backend={HTML5Backend}>
        <WorldClockCard {...mockProps} />
      </DndProvider>
    );

    expect(screen.getByText('Auckland')).toBeInTheDocument();
    expect(screen.getByText('12:00')).toBeInTheDocument();
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText(/15°C ~ 25°C/)).toBeInTheDocument();
    expect(screen.getByText(/Sunny/)).toBeInTheDocument();
  });
}); 