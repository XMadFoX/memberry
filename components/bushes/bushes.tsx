import { getRandomIntMinMax } from '@/lib/random';
import { useEffect, useState } from 'react';
import styles from './bushes.module.css';

export default function Bushes() {
  const size = 5;
  const [bushes, setBushes] = useState<number>(size * size);

  const [highlight, setHighlight] = useState(-1);
  const [order, setOrder] = useState<number[]>([]); // array of indexes

  const [userTurn, setUserTurn] = useState(false);
  const [lockGame, setLockGame] = useState(false);
  const [userOrder, setUserOrder] = useState<number[]>([]);

  const [failIdx, setFailIdx] = useState(-1);
  const [rightIdx, setRightIdx] = useState(-1);
  const [userRightIdx, setUserRightIdx] = useState(-1);

  const [max, setMax] = useState(3); //max steps count
  const [score, setScore] = useState(0); //max steps count

  const [lose, setLose] = useState<boolean>();

  const highlightBush = (idx: number) => {
    setHighlight(idx);
  };

  useEffect(() => {
    setRightIdx(-1);
  }, [userTurn]);

  const showNewBush = () => {
    //reset
    const bush = getRandomIntMinMax(0, bushes);
    setHighlight(bush);
    setLockGame(true);
    setTimeout(() => {
      setHighlight(-1);
      setUserTurn(true);
      setLockGame(false);
    }, 1000);
    setOrder((order) => [...order, bush]);
  };

  const replayPrevious = () => {
    setRightIdx(-1);
    console.log(`replay ${order.length}`);
    let targetIdx = 0;
    let it = setInterval(() => {
      if (targetIdx > order.length) {
        // exit interval
        clearInterval(it);
        setTimeout(() => showNewBush(), 100);
      }
      highlightBush(order[targetIdx]);
      targetIdx++;
    }, 1000);
  };

  const play = () => {
    console.log('play');
    if (order.length > max - 1) {
      setUserTurn(true);
    } else {
      if (order.length > 0) replayPrevious();
      else showNewBush();
    }
  };

  const finishGame = () => {
    console.log('finished');
    setTimeout(() => {
      setOrder([]);
      setUserOrder([]);
      setFailIdx(-1);
      setRightIdx(-1);
      setUserTurn(false);
      setMax(max + 1);
      setScore(score + 100);
    }, 2000);
  };

  const continueGame = () => {
    setOrder([]);
    setUserOrder([]);
    setFailIdx(-1);
    setRightIdx(-1);
    setScore(0);
    setLockGame(false);
    setLose(false);
  };

  const failGame = (rightIdx: number, failIdx: number) => {
    console.log('failed');
    setLockGame(true);
    setUserTurn(false);
    setFailIdx(rightIdx);
    setRightIdx(failIdx);
    setLose(true);
  };

  // when ai turns/user turns
  useEffect(() => {
    if (userTurn || lockGame) return;
    setTimeout(() => play(), 1000);
  }, [order, userTurn]);

  // when user clickes on bush
  useEffect(() => {
    userOrder.forEach((i, idx) => {
      if (i === order[idx]) {
        console.log('nice');
        setRightIdx(-1);
        setFailIdx(-1);
        setUserRightIdx(userOrder[idx]);
        setScore(score + 10);
        // if final item
        if (idx === order.length - 1) {
          setUserTurn(false);
          setUserOrder([]);
        }
        if (idx >= max - 1) {
          finishGame();
        }
      } else {
        console.log(`failed ${i}[${idx}, ${order[idx]}]`);
        failGame(userOrder[idx], order[idx]);
      }
    });
  }, [userOrder]);

  return (
    <div className={styles.container}>
      <p>
        order: {JSON.stringify(order)} (now: {order.length}, max: {max})
      </p>
      <p>
        user order: {JSON.stringify(userOrder)} {userOrder.length}
      </p>
      <p>Счёт: {score}</p>
      <h2>
        {lose ? (
          <>
            <p>Вы проиграли</p>
            <button type="button" onClick={() => continueGame()}>
              Продолжить
            </button>
          </>
        ) : userTurn ? (
          'Воспроизведи последовательность'
        ) : (
          'Запомни последовательность'
        )}
      </h2>
      <div className={styles.game_container}>
        {[...Array(bushes)].map((bush, index) => (
          <button
            type="button"
            onClick={() => {
              if (!userTurn) return;
              setUserOrder((userOrder) => [...userOrder, index]);
            }}
            key={index}
            className={`${styles.bush} ${
              highlight == index ? styles.bush_highlight : ''
            } ${rightIdx == index ? styles.bush_right : ''} ${
              failIdx == index ? styles.bush_fail : ''
            } ${userRightIdx == index ? styles.bush_ok : ''}`}>
            {index}
          </button>
        ))}
      </div>
    </div>
  );
}
