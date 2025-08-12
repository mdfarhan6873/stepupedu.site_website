'use client'
import React, { useState, useEffect, useRef } from 'react';
import { INameCard } from '@/lib/models/NameCard';

interface NameCardsScrollerProps {
  cards: INameCard[];
}

const NameCardsScroller: React.FC<NameCardsScrollerProps> = ({ cards }) => {
  const scrollRef1 = useRef<HTMLDivElement>(null);
  const scrollRef2 = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (cards.length === 0) return;

    const scroll1 = scrollRef1.current;
    const scroll2 = scrollRef2.current;
    
    if (!scroll1 || !scroll2) return;

    const scrollInterval = setInterval(() => {
      if (!isHovered && cards.length > 1) {
        // Scroll first row to the right
        scroll1.scrollLeft += 1;
        if (scroll1.scrollLeft >= scroll1.scrollWidth / 2) {
          scroll1.scrollLeft = 0;
        }

        // Scroll second row to the left
        scroll2.scrollLeft -= 1;
        if (scroll2.scrollLeft <= 0) {
          scroll2.scrollLeft = scroll2.scrollWidth / 2;
        }
      }
    }, 30);

    return () => clearInterval(scrollInterval);
  }, [cards, isHovered]);

  if (cards.length === 0) {
    return (
      <div className="w-full py-8">
        <div className="text-center text-gray-400">
          <p>No name cards available. Add some cards to see them here!</p>
        </div>
      </div>
    );
  }

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Create balanced rows - alternating cards between rows
  const firstRowCards: INameCard[] = [];
  const secondRowCards: INameCard[] = [];

  cards.forEach((card, index) => {
    if (index % 2 === 0) {
      firstRowCards.push(card);
    } else {
      secondRowCards.push(card);
    }
  });

  // Only duplicate if we have multiple cards for smooth infinite scrolling
  const duplicatedFirstRow = firstRowCards.length > 1 ? [...firstRowCards, ...firstRowCards] : firstRowCards;
  const duplicatedSecondRow = secondRowCards.length > 1 ? [...secondRowCards, ...secondRowCards] : secondRowCards;

  const renderCard = (card: INameCard, rowPrefix: string, index: number) => (
    <div
      key={`${rowPrefix}-${card._id || card.name}-${index}`}
      className="flex-shrink-0 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-3 border border-white border-opacity-20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      style={{ height: '80px', minWidth: '200px' }}
    >
      <div className="flex items-center justify-between h-full">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{card.name}</h3>
          <p className="text-gray-300 text-xs truncate">{card.tag}</p>
        </div>
        <div className="flex flex-col items-center ml-3 flex-shrink-0">
          <div className={`${getPercentageColor(card.percentage)} text-white text-xs font-bold px-2 py-1 rounded-full min-w-[40px] text-center`}>
            {card.percentage}%
          </div>
        </div>
      </div>
    </div>
  );

  // For single card, show it centered without scrolling
  if (cards.length === 1) {
    return (
      <div className="w-full py-6">
        <div className="flex justify-center">
          {renderCard(cards[0], 'single', 0)}
        </div>
        <div className="text-center mt-4">
          <div className="text-gray-300 text-sm">
            Add more cards to see the scrolling effect!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full py-6 space-y-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* First Row - Scrolling Right */}
      {firstRowCards.length > 0 && (
        <div 
          ref={scrollRef1}
          className="flex gap-4 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedFirstRow.map((card, index) => 
            renderCard(card, 'row1', index)
          )}
        </div>
      )}

      {/* Second Row - Scrolling Left */}
      {secondRowCards.length > 0 && (
        <div 
          ref={scrollRef2}
          className="flex gap-4 overflow-x-hidden scrollbar-hide"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedSecondRow.map((card, index) => 
            renderCard(card, 'row2', index)
          )}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default NameCardsScroller;