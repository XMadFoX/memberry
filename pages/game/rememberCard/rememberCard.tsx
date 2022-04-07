import styles from './rememberCard.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import { keyDocument } from '.pnpm/@urql+core@2.4.3_graphql@16.3.0/node_modules/@urql/core/dist/types/utils';
import GameBlock from '../../../components/gameBlock/gameBlock';

interface cardI {
  id: number;
  img: string;
}

const cards: cardI[] = [
  { id: 1, img: 'facebook' },
  { id: 2, img: 'youtube' },
  { id: 3, img: 'whatsapp' },
  { id: 4, img: 'vk' },
  { id: 5, img: 'instagram' },
  { id: 6, img: 'gmail' },
];

function RememberCard() {
  const [arrayCards, setArrayCards] = useState<cardI[]>([]);
  const [openedCard, setOpenedCard] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [counterForEndGame, setCounterForEndGame] = useState(0);
  const [randomIndexArray, setRandomIndexArray] = useState<number[]>([
    0, 0, 0, 0, 0, 0,
  ]);
  let pairArrayCard: cardI[] = [];
  const increasing = (arrayFrom: cardI[], arrayTo: cardI[]) => {
    for (let i = 0; i < 2; i++) {
      let randomIndex = Math.floor(Math.random() * arrayFrom.length);
      let maxIndex = randomIndexArray.indexOf(Math.max(...randomIndexArray));
      if (randomIndex !== maxIndex) {
        arrayTo.push(arrayFrom[randomIndex]);
        arrayTo.push(arrayFrom[randomIndex]);
        randomIndexArray[randomIndex]++;
      } else {
        i--;
      }
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
    <GameBlock>
      <div className={styles.game}>
        <div className={styles.cards}>
          {arrayCards.map((item, index: number) => {
            let isFlipped = false;
            if (openedCard.includes(index)) isFlipped = true;
            if (matched.includes(index)) isFlipped = true;
            return (
              <div
                key={index}
                className={
                  styles.card + ' ' + (isFlipped ? styles.flipped : '')
                }
                onClick={() => flipCard(index)}>
                <div className={styles.inner}>
                  <div className={styles.front}>
                    <Image
                      src={`/game/rememberCard/${item.img}.svg`}
                      height={128}
                      width={128}
                      alt="front-card"
                    />
                  </div>
                  <div className={styles.back}>
                    <Image
                      src={`/game/rememberCard/question.svg`}
                      height={128}
                      width={128}
                      alt="back-card"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GameBlock>
  );
}

export default RememberCard;
