import styles from './rememberCard.module.css';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import Image from 'next/image';
import GameFinished from '@/components/GameFinished/gameFinished';
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
  const [winGame, setWinGame] = useState(0);
  const [firstClick, setFirstClik] = useState(0);
  let width = 0;
  const { startTimer, timeLeft, userHp, enemyHp, setUserHp, setEnemyHp } =
    useContext(GameContext);

  useEffect(() => {
    if (timeLeft == 0) {
      setUserHp(userHp - 3);
      setFirstClik(0);
      setOpenedCard([]);
      setMatched([]);
      if (userHp == 3) {
        setLooseGame(1);
      }
    }
  }, [timeLeft]);
  let pairArrayCard: cardI[] = [];
  const increasing = (arrayFrom: cardI[], arrayTo: cardI[]) => {
    width = arrayTo.length;
    if (width !== 0) {
      width /= 2;
    }
    
    arrayTo = [];

    for (let i = 0; i < width + 2; i++) {
      let randomIndex = Math.floor(Math.random() * arrayFrom.length);

      arrayTo.push(arrayFrom[randomIndex]);
      arrayTo.push(arrayFrom[randomIndex]);
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
        setFirstClik(0);
        startTimer(0);
        setEnemyHp(enemyHp - 3);
        pairArrayCard = increasing(cards, pairArrayCard);
        setOpenedCard([]);
        setMatched([]);
        setArrayCards(mixCard(increasing(cards, arrayCards)));
        return;
      }, 700);
    }
  }, [openedCard]);
  const flipCard = (index: number) => {
    if (firstClick == 0) {
      startTimer(arrayCards.length ** 2 /2);
    }
    setFirstClik(1);
    for (let i = 0; i < openedCard.length; i++) {
      if (index == openedCard[i]) {
        return;
      }
    }
    if (openedCard.length < 2) {
      setOpenedCard((opened) => [...opened, index]);
    }
  };
  useEffect (()=>{
    console.log(enemyHp)
    if(enemyHp == 0) {
      setWinGame(1)
      console.log(winGame)
    }
  },[enemyHp])
  if (looseGame == 1) {
    return (
      <GameFinished
        won={false}
        restart={() => {
          setArrayCards([]);
          setUserHp(9);
          setEnemyHp(9);
          setOpenedCard([]);
          setMatched([]);
          console.log(arrayCards);
          setArrayCards(mixCard(increasing(cards, [])));
          setLooseGame(0);
        }}
      />
    );
  }
  if (winGame == 1) {
    return (
      <GameFinished won={true} restart={() => {}} />
    )
  }
  return (
    <div className={styles.game}>
      <h2 className={styles.title}>Найди пары карт</h2>
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
                    alt="карточка"
                  />
                </div>
                <div className={styles.back}>
                  <Image
                    src={`/game/rememberCard/question.svg`}
                    height={128}
                    width={128}
                    alt="карточка"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RememberCard;
