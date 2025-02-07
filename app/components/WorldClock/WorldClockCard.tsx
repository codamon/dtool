import React, { useRef } from 'react';
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
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations('weather');
  const tc = useTranslations('cities');

  const cityKey = name.toLowerCase();

  const [{ isDragging, currentOffset }, drag] = useDrag({
    type: CARD_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      currentOffset: monitor.getClientOffset(),
    }),
    canDrag: true,
    isDragging: (monitor) => {
      return monitor.getItem()?.index === index;
    },
  });

  const [, drop] = useDrop({
    accept: CARD_TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      // 获取卡片的边界和中心点
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // 从右向左拖动（后往前）
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;
      // 从左向右拖动（前往后）
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;

      requestAnimationFrame(() => {
        moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      });
    },
  });

  drag(drop(ref));

  return (
    <motion.div 
      ref={ref}
      className={`rounded-lg border bg-card text-card-foreground shadow-lg cursor-move
        ${isDragging ? 'opacity-0' : 'opacity-100'}`}
      layout
      style={{
        position: 'relative',
        zIndex: isDragging ? 1000 : 1,
      }}
      // whileHover={{ scale: isDragging ? 1 : 1.02 }}
      // whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        bounce: 0.1,
        duration: 0.3,
        damping: 15,
        stiffness: 150
      }}
      animate={{
        scale: 1,
        transition: {
          duration: 0.2
        }
      }}
    >
      {isDragging && (
        <div
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 1000,
            transform: 'translate(-50%, -50%)',
            width: ref.current?.offsetWidth || 'auto',
            opacity: 0.8,
          }}
        >
          <div className="rounded-lg border bg-card text-card-foreground shadow-lg">
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
          </div>
        </div>
      )}
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