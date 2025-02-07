"use client";
import { CircularProgress } from '@mui/material';
import WorldClockCard from '../components/WorldClock/WorldClockCard';
import { useWorldClock } from '../components/WorldClock/useWorldClock';
import { DndProvider } from '../components/DndProvider';
import { useTranslations } from 'next-intl';
import { useCallback, useState, useEffect } from 'react';
import { motion, LayoutGroup } from 'framer-motion';

export default function Home() {
  const t = useTranslations('weather');
  const { cityData, loading, error } = useWorldClock();
  const [cards, setCards] = useState<typeof cityData>([]);

  useEffect(() => {
    if (!cityData || cityData.length === 0) return;
    
    // Try to get saved order from localStorage
    const savedOrder = localStorage.getItem('cardOrder');
    if (savedOrder && cityData.length > 0) {
      // Rearrange cards using saved order
      const orderIndices = JSON.parse(savedOrder);
      const orderedCards = orderIndices
        .map((code: string) => cityData.find(card => card.code === code))
        .filter(Boolean);
      setCards(orderedCards.length === cityData.length ? orderedCards : cityData);
    } else {
      // If no saved order exists, use default order
      setCards(cityData);
    }
  }, [cityData]);

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards) => {
      if (!prevCards.length) return prevCards;
      const newCards = Array.from(prevCards);
      const dragCard = newCards[dragIndex];
      if (dragCard) {
        newCards.splice(dragIndex, 1);
        newCards.splice(hoverIndex, 0, dragCard);
        // Save new order to localStorage
        localStorage.setItem('cardOrder', 
          JSON.stringify(newCards.map(card => card.code))
        );
      }
      return newCards;
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <DndProvider>
      {/* 拖拽预览层 */}
      <div style={{ position: 'fixed', pointerEvents: 'none', zIndex: 100 }} />
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
        <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {cards.map((city, index) => (
              <motion.div
                key={city.name}
                className="transform"
                layout
                layoutId={city.name}
                transition={{
                  // 布局动画配置
                  layout: {
                    type: "spring",    // 使用弹簧动画
                    bounce: 0.15,      // 减小弹跳系数使动画更平滑
                    duration: 0.6,     // 动画持续时间(秒)
                    damping: 25,       // 增加阻尼使动画更平滑
                    stiffness: 250     // 降低刚度使动画更自然
                  }
                }}
                initial={false}
                animate={{
                  scale: 1,
                  opacity: 1
                }}
                drag={false}           // 禁用原生拖拽以避免冲突
                dragConstraints={false}
                dragElastic={0}
              >
                <WorldClockCard 
                  {...city}
                  index={index}
                  moveCard={moveCard}
                />
              </motion.div>
            ))}
          </div>
        </LayoutGroup>
      </div>
    </DndProvider>
  );
} 