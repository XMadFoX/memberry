import { getRandomIntMinMax } from '@/lib/random';
import { Button } from '@mantine/core';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { GameContext } from '../gameBlock/gameBlock';
import styles from './bushes.module.css';
import dynamic from 'next/dynamic';

const GameFinished = dynamic(() => import('../GameFinished'));

export default function Bushes() {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [bushes, setBushes] = useState<number>(boardSize * boardSize);

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

  const [levelState, setLevelState] = useState<string | undefined>();

  const { userHp, enemyHp, setUserHp, setEnemyHp, startTimer, timeLeft } =
    useContext(GameContext);

  const highlightBush = (idx: number) => {
    setHighlight(idx);
  };

  useEffect(() => {
    setBushes(boardSize * boardSize);
    setRightIdx(-1);
  }, [boardSize]);

  useEffect(() => {
    setRightIdx(-1);
  }, [userTurn]);

  useEffect(() => {
    if (timeLeft == 0) {
      setUserOrder([...userOrder, 999]);
      console.log('time is over');
    }
  }, [timeLeft]);

  const showNewBush = () => {
    //reset
    const bush = getRandomIntMinMax(0, bushes);
    setHighlight(bush);
    setLockGame(true);
    setUserRightIdx(-1);
    setTimeout(() => {
      setHighlight(-1);
      setUserTurn(true);
      console.log('start timer');
      startTimer(order.length * 10);
      setLockGame(false);
    }, 1000);
    setOrder((order) => [...order, bush]);
  };

  const replayPrevious = () => {
    setRightIdx(-1);
    setUserRightIdx(-1);
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
      console.log('stop timer');
      startTimer(null);
      if (order.length > 0) replayPrevious();
      else showNewBush();
    }
  };

  const restart = () => {
    setOrder([]);
    setUserOrder([]);
    setScore(0);
    setLose(false);
    setLevelState(undefined);
    setBoardSize(3);
    setBushes(3 * 3);
    setHighlight(-1);
    setUserTurn(false);
    setLockGame(false);
    setFailIdx(-1);
    setRightIdx(-1);
    setUserRightIdx(-1);
    setMax(3);
    setUserHp(9);
    setEnemyHp(9);
    setTimeout(() => {
      setHighlight(-1);
      setUserTurn(true);
      console.log('start timer');
      startTimer(order.length * 10);
      setLockGame(false);
    }, 1000);
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
      setEnemyHp(enemyHp - 3);
      boardSize < 5 && setBoardSize(boardSize + 1);
    }, 2000);
  };

  const continueGame = () => {
    console.log('continue');
    setOrder([]);
    setUserOrder([]);
    setFailIdx(-1);
    setRightIdx(-1);
    setUserRightIdx(-1);
    setScore(0);
    setLockGame(false);
    setLose(false);
  };

  const failGame = (rightIdx: number, failIdx: number) => {
    console.log('failed');
    setLockGame(true);
    setUserTurn(false);
    setFailIdx(failIdx);
    setTimeout(() => {
      setRightIdx(rightIdx);
    }, 100);
    setLose(true);
    setUserHp(userHp - 1);
  };

  // when ai turns/user turns
  useEffect(() => {
    if (userTurn || lockGame) return;
    setTimeout(() => play(), 1000);
  }, [order, userTurn]);

  // when user clicks on bush
  useEffect(() => {
    userOrder.forEach((i, idx) => {
      if (i === order[idx]) {
        console.log('nice');
        setRightIdx(-1);
        setFailIdx(-1);
        setUserRightIdx(userOrder[idx]);
        setScore((s) => s + 10);
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
        failGame(order[idx], userOrder[idx]);
      }
    });
  }, [userOrder]);

  useEffect(() => {
    startTimer(null);
  }, [lose]);

  useEffect(() => {
    if (enemyHp > 0) return;
    startTimer(null);
    console.log('level completed');
    setLevelState('completed');
  }, [enemyHp]);

  useEffect(() => {
    if (userHp > 0) return;
    console.log('level failed');
    setLevelState('failed');
  }, [userHp]);

  if (levelState)
    return (
      <GameFinished
        won={levelState === 'completed' ? true : false}
        restart={() => {
          restart();
        }}
      />
    );
  return (
    <div className={styles.container}>
      <h2 style={{ color: '#fff' }}>
        {lose ? (
          <>
            <p>{timeLeft == 0 ? 'Время вышло' : 'Не правильно'}</p>
            <Button type="button" onClick={() => continueGame()}>
              Продолжить
            </Button>
          </>
        ) : userTurn && !lockGame ? (
          'Повтори последовательность'
        ) : (
          'Запомни последовательность'
        )}
      </h2>
      <div
        className={styles.game_container}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}>
        {[...Array(bushes)].map((bush, index) => (
          <button
            type="button"
            onMouseDown={() => {
              if (!userTurn) return;
              setUserOrder((userOrder) => [...userOrder, index]);
            }}
            key={index}
            className={`${styles.bush} ${
              highlight == index ? styles.bush_highlight : ''
            } ${rightIdx == index ? styles.bush_right : ''} ${
              failIdx == index ? styles.bush_fail : ''
            } ${userRightIdx == index ? styles.bush_ok : ''}`}>
            <Image
              alt={`куст ${index + 1}`}
              height={'100%'}
              width={'100%'}
              src="/game/bushes/bush.svg"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
