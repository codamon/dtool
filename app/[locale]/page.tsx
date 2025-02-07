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
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">{t('title')}</h1>
        <LayoutGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {cards.map((city, index) => (
              <motion.div
                key={city.name}
                className="transform transition-all duration-300"
                layout
                transition={{
                  layout: {
                    type: "spring",
                    bounce: 0.15,
                    duration: 1000,
                    damping: 20,
                    stiffness: 200
                  }
                }}
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