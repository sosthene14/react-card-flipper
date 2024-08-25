/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { useTimer } from "react-timer-hook";

interface ICard {
  item: string;
  isFlipped: boolean;
  name: string;
  id: number;
}

const cardData: ICard[] = [
  { id: 1, item: "🐁", isFlipped: true, name: "mousse" },
  { id: 2, item: "🐁", isFlipped: true, name: "mousse" },
  { id: 3, item: "🐈", isFlipped: true, name: "cat" },
  { id: 4, item: "🐈", isFlipped: true, name: "cat" },
  { id: 5, item: "🐕", isFlipped: true, name: "dog" },
  { id: 6, item: "🐕", isFlipped: true, name: "dog" },
  { id: 7, item: "🐒", isFlipped: true, name: "monkey" },
  { id: 8, item: "🐒", isFlipped: true, name: "monkey" },
  { id: 9, item: "🦈", isFlipped: true, name: "shark" },
  { id: 10, item: "🦈", isFlipped: true, name: "shark" },
  { id: 11, item: "🦑", isFlipped: true, name: "squid" },
  { id: 12, item: "🦑", isFlipped: true, name: "squid" },
  { id: 13, item: "🕷️", isFlipped: true, name: "spider" },
  { id: 14, item: "🕷️", isFlipped: true, name: "spider" },
  { id: 15, item: "🐍", isFlipped: true, name: "snake" },
  { id: 16, item: "🐍", isFlipped: true, name: "snake" },
  { id: 17, item: "🐊", isFlipped: true, name: "crocodile" },
  { id: 18, item: "🐊", isFlipped: true, name: "crocodile" },
  { id: 19, item: "🐘", isFlipped: true, name: "elephant" },
  { id: 20, item: "🐘", isFlipped: true, name: "elephant" },
];

const shuffle = (array:ICard[]) => {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};



export const CardFlip = () => {
  const [cards, setCards] = useState<ICard[]>(shuffle(cardData));
  const [flippedCards, setFlippedCards] = useState<ICard[]>([]);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentFlippedCount, setCurrentFlippedCount] = useState(0);

  const time = new Date();
  time.setSeconds(time.getSeconds() + 300); // 5 minutes
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: time,
    onExpire: () => {
      alert("Time is up!");
      handleRestart();
    },
  });

  const flipAllCards = useCallback((isFlipped: boolean) => {
    setCards((prevCards) => prevCards.map((card) => ({ ...card, isFlipped })));
  }, []);

  const handleRestart = () => {
    flipAllCards(true);
    setCurrentScore(0);
    setCurrentFlippedCount(0);
    restart(new Date(time.setSeconds(time.getSeconds() + 300)));
    setTimeout(() => flipAllCards(false), 2000);
  };

  useEffect(() => {
    setTimeout(() => flipAllCards(false), 2000);
  }, [flipAllCards]);

  const handleFlip = (index: number) => {
    if (currentFlippedCount < 2) {
      const updatedCards = [...cards];
      updatedCards[index].isFlipped = !updatedCards[index].isFlipped;
      setCards(updatedCards);
      setFlippedCards((prevFlippedCards) => [
        ...prevFlippedCards,
        updatedCards[index],
      ]);
      setCurrentFlippedCount((prevCount) => prevCount + 1);
    }
  };

  const resetFlippedCards = useCallback(() => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        flippedCards.some((flippedCard) => flippedCard.id === card.id)
          ? { ...card, isFlipped: false }
          : card
      )
    );
    setCurrentFlippedCount(0);
    setFlippedCards([]);
  }, [flippedCards]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      if (flippedCards[0].name === flippedCards[1].name) {
        setCurrentScore((prevScore) => prevScore + 2);
        setCurrentFlippedCount(0);
        setFlippedCards([]);
      } else {
        setTimeout(() => resetFlippedCards(), 500);
      }
    }
  }, [flippedCards, resetFlippedCards]);

  return (
    <>
      <p className="text-white text-center pt-5 text-lg">
        Current Score: {currentScore}/{20}
      </p>
      <div style={{ textAlign: "center" }}>
        <div className="text-white text-sm mb-5">
          <span>{minutes}</span>:<span>{seconds}</span>
        </div>
        <button
          className="bg-slate-700 hover:bg-slate-700/50 transition-all duration-200 px-4 py-2 rounded-md text-white"
          onClick={handleRestart}
        >
          Restart
        </button>
      </div>
      <div className="grid pb-10 grid-cols-4 pt-10 max-w-md mx-auto gap-5 place-items-center">
        {cards.map((card, index) => (
          <ReactCardFlip
            key={index}
            isFlipped={card.isFlipped}
            flipDirection="horizontal"
          >
            <div
              onClick={() => handleFlip(index)}
              className="bg-slate-700 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer flex text-3xl justify-center items-center rounded-md h-[100px] w-[75px]"
            >
              <img
                className="w-[75px]"
                src="https://i.pinimg.com/originals/10/80/a4/1080a4bd1a33cec92019fab5efb3995d.png"
              />
            </div>

            <div className="bg-slate-700 hover:bg-slate-700/50 transition-all duration-200 cursor-pointer flex text-3xl justify-center items-center rounded-md h-[100px] w-[75px]">
              {card.item}
            </div>
          </ReactCardFlip>
        ))}
      </div>
    </>
  );
};
