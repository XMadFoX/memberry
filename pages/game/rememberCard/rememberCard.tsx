import styles from './rememberCard.module.css';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';

import { GameContext } from '@components/gameBlock/gameBlock';
interface cardI {
  id: number;
  img: string;
}

const cards: cardI[] = [
  { id: 1, img: 'banana' },
  { id: 2, img: 'bread' },
  { id: 3, img: 'burger' },
  { id: 4, img: 'corn' },
  { id: 5, img: 'croissant' },
  { id: 6, img: 'cucumber' },
  { id: 7, img: 'cupcake' },
  { id: 8, img: 'doughnut' },
  { id: 9, img: 'french_fries' },
  { id: 10, img: 'ice_cream' },
  { id: 11, img: 'meat' },
  { id: 12, img: 'pizza' },
  { id: 13, img: 'strawberry' },
  { id: 14, img: 'watermelon' },
];

function RememberCard() {
  
  const [arrayCards, setArrayCards] = useState<cardI[]>([]);
  const [openedCard, setOpenedCard] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [counterForEndGame, setCounterForEndGame] = useState(0);
  const [looseGame, setLooseGame] = useState(0);
  const [randomIndexArray, setRandomIndexArray] = useState<number[]>([
    0, 0, 0, 0, 0, 0,
  ]);
  let width = 0
  const { startTimer, timeLeft, userHp, enemyHp, setUserHp, setEnemyHp } =
    useContext(GameContext);
  let pairArrayCard: cardI[] = [];
  const increasing = (arrayFrom: cardI[], arrayTo: cardI[]) => {
    width = arrayTo.length
    if(width !==0 ) {
      width /=2
    }
    arrayTo = []

    for (let i = 0; i < width+2; i++) {
      let randomIndex = Math.floor(Math.random() * arrayFrom.length);
     
      arrayTo.push(arrayFrom[randomIndex]);
      arrayTo.push(arrayFrom[randomIndex]);
      randomIndexArray[randomIndex]++;
    }
    return arrayTo;
  };
  pairArrayCard = increasing(cards, pairArrayCard);
  const mixCard = (array: cardI[]) => {
    let currentCardLength = array.length;
    while (currentCardLength != 0) {
      let randomIndex = Math.floor(Math.random() * currentCardLength);
      currentCardLength--;
      let tempValue = array[currentCardLength];
      array[currentCardLength] = array[randomIndex];
      array[randomIndex] = tempValue;
    }
    return array;
  };

  useEffect(() => {
    setArrayCards(mixCard(pairArrayCard));
  }, []);

  useEffect(() => {
    if (openedCard.length < 2) return;
    const firstCard = arrayCards[openedCard[0]];
    const SecondCard = arrayCards[openedCard[1]];
    if (
      SecondCard &&
      firstCard.id == SecondCard.id &&
      openedCard[0] != openedCard[1]
    ) {
      setMatched([...matched, openedCard[0], openedCard[1]]);
    }
    if (openedCard.length == 2) setTimeout(() => setOpenedCard([]), 700);
    if (matched.length + 2 == arrayCards.length) {
      setTimeout(() => {
        setCounterForEndGame(counterForEndGame + 1);
        if (counterForEndGame == 4) {
          console.log('Вы выиграли');
          return;
        }
        pairArrayCard = increasing(cards, pairArrayCard);
        setOpenedCard([]);
        setMatched([]);
        setArrayCards(mixCard(increasing(cards, arrayCards)));
        return;
      }, 700);
    }
  }, [openedCard]);
  const flipCard = (index: number) => {
    for (let i = 0; i < openedCard.length; i++) {
      if (index == openedCard[i]) {
        return;
      }
    }
    if (openedCard.length < 2) {
      setOpenedCard((opened) => [...opened, index]);
    }
  };

  return (
    <div className={styles.game}>
      <div className={styles.cards}>
        {arrayCards.map((item, index: number) => {
          let isFlipped = false;
          if (openedCard.includes(index)) isFlipped = true;
          if (matched.includes(index)) isFlipped = true;
          return (
            <div
              key={index}
              className={styles.card + ' ' + (isFlipped ? styles.flipped : '')}
              onClick={() => flipCard(index)}>
              <div className={styles.inner}>
                <div className={styles.front}>
                  <Image
                    src={`/game/rememberCard/${item.img}.svg`}
                    height={128}
                    width={128}
                  />
                </div>
                <div className={styles.back}>
                  <Image
                    src={`/game/rememberCard/question.svg`}
                    height={128}
                    width={128}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {looseGame == 1 && (
        <div className={styles.loose}>
          <span>Вы проиграли</span>
          <button className={styles.button_again} onClick={newGame}>
            <span>Начать снова</span>{' '}
          </button>
        </div>
      )}
    </div>
  );
}

export default RememberCard;
