import React from 'react';
import { Clock } from 'lucide-react';
import { WeatherIcon } from '../WeatherIcon';
import { useDrag, useDrop } from 'react-dnd';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const CARD_TYPE = 'CLOCK_CARD';

interface WorldClockCardProps {
  name: string;
  time: string;
  weather: number;
  tempMin: number;
  tempMax: number;
  description: string;
  tomorrowTemp: number;
  tomorrowTempMin: number;
  tomorrowTempMax: number;
  tomorrowDescription: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
}

const WorldClockCard: React.FC<WorldClockCardProps> = ({
  name,
  time,
  weather,
  tempMin,
  tempMax,
  description,
  tomorrowTemp,
  tomorrowTempMin,
  tomorrowTempMax,
  tomorrowDescription,
  index,
  moveCard
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const t = useTranslations('weather');
  const tc = useTranslations('cities');

  const cityKey = name.toLowerCase();

  const [{ isDragging }, drag] = useDrag({
    type: CARD_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // Get dragged element boundaries
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const mousePosition = monitor.getClientOffset();
      if (!mousePosition) return;
      
      // Get mouse position relative to the hovered card
      const mouseX = mousePosition.x - hoverBoundingRect.left;
      const cardWidth = hoverBoundingRect.width;
      
      // Define the left side threshold (e.g., 30% of card width)
      const leftThreshold = cardWidth * 0.3;
      
      // Only trigger when mouse is in the left side of a different card
      if (dragIndex === hoverIndex || mouseX > leftThreshold) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const dragDropRef = drag(drop(ref));

  return (
    <motion.div 
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-lg cursor-move
        ${isDragging ? 'opacity-50 z-50' : 'opacity-100'}
        transform transition-transform duration-300 ease-in-out`}
      layout
      style={{
        position: isDragging ? 'relative' : 'static',
      }}
      whileHover={{ scale: isDragging ? 1.02 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        bounce: 0.15,
        duration: 0.5,
        damping: 20,
        stiffness: 200
      }}
    >
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <h3 className="text-xl font-bold">{tc(cityKey.toLowerCase())}</h3>
        <Clock className="h-6 w-6 text-gray-500" />
      </div>
      <div className="p-6 pt-2">
        <div className="space-y-4">
          <div>
            <div className="text-3xl font-bold">{time}</div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-500">{t('current')}</h4>
            <div className="flex items-center space-x-2">
              <WeatherIcon description={description} />
              <span className="text-lg">{weather}°C</span>
            </div>
            <div className="text-sm text-gray-500">
              {t('range')}: {tempMin}°C ~ {tempMax}°C
            </div>
            <div className="text-sm text-gray-500">
              {t('condition')}: {description}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-500">{t('tomorrow')}</h4>
            <div className="flex items-center space-x-2">
              <WeatherIcon description={tomorrowDescription} />
              <span className="text-lg">{tomorrowTemp}°C</span>
            </div>
            <div className="text-sm text-gray-500">
              {t('range')}: {tomorrowTempMin}°C ~ {tomorrowTempMax}°C
            </div>
            <div className="text-sm text-gray-500">
              {t('condition')}: {tomorrowDescription}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorldClockCard; 