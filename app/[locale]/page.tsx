"use client";
import { CircularProgress } from '@mui/material';
import WorldClockCard from '../components/WorldClock/WorldClockCard';
import { useWorldClock } from '../components/WorldClock/useWorldClock';
import { DndProvider } from '../components/DndProvider';
import { useTranslations } from 'next-intl';
import { useCallback, useState, useEffect } from 'react';

export default function Home() {
  const t = useTranslations('weather');
  const { cityData, loading, error } = useWorldClock();
  const [cards, setCards] = useState<typeof cityData>([]);

  useEffect(() => {
    // Try to get saved order from localStorage
    const savedOrder = localStorage.getItem('cardOrder');
    if (savedOrder && cityData.length > 0) {
      // Rearrange cards using saved order
      const orderIndices = JSON.parse(savedOrder);
      const orderedCards = orderIndices
        .map((name: string) => cityData.find(card => card.name === name))
        .filter(Boolean);
      setCards(orderedCards);
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
          JSON.stringify(newCards.map(card => card.name))
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((city, index) => (
            <WorldClockCard 
              key={city.name} 
              {...city}
              index={index}
              moveCard={moveCard}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
} 