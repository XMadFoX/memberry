import { getRandomIntMinMax } from '@lib/random';
import { Button } from '@mantine/core';
import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from '../gameBlock/gameBlock';
import GameFinished from '../GameFinished';
import styles from './squares.module.css';

export default function FillingSquares() {
  const [boardSize, setBoardSize] = useState<number>(3);
  const [squares, setSquares] = useState<any[]>([
    ...new Array(boardSize * boardSize),
  ]);
  const [rightSquares, setRightSquares] = useState<boolean[]>([]);
  const [showRight, setShowRight] = useState(true);
  const [userRight, setUserRight] = useState<number[]>([]);
  const [userWrong, setUserWrong] = useState<number>(-1);

  const [won, setWon] = useState(false);
  const [levelState, setLevelState] = useState<string | undefined>();

  const { startTimer, timeLeft, userHp, enemyHp, setUserHp, setEnemyHp } =
    useContext(GameContext);

  useEffect(() => {
    setSquares(new Array(boardSize * boardSize));
  }, [boardSize]);

  const generateBoard = (length = boardSize * boardSize) => {
    console.log('generating new board with size: ', length);
    const gen = () => {
      const newArr = [];
      for (let i = 0; i < length; i++) {
        newArr.push(getRandomIntMinMax(0, 2) === 1 ? true : false);
      }
      return newArr;
    };
    let newArr = gen();
    while (
      countRightSquares(newArr) > (length === 9 ? 4 : 7) ||
      countRightSquares(newArr) < (length >= 16 ? 4 : 3)
    ) {
      newArr = gen();
    }
    setRightSquares(newArr as boolean[]);
  };

  const start = () => {
    setShowRight(false);
    startTimer((boardSize / 4) * 10);
  };

  const newGame = () => {
    setWon(false);
    const newBoardSize = getRandomIntMinMax(3, 6);
    setBoardSize(newBoardSize);
    const cellsCount = newBoardSize * newBoardSize;
    generateBoard(cellsCount);
    // then fires useEffect with rightSquares dependency
  };

  useEffect(() => {
    newGame();
  }, []);

  useEffect(() => {
    const cellsCount = boardSize * boardSize;
    setSquares([...new Array(cellsCount)]);
    setShowRight(true);
    setUserRight([]);
    setUserWrong(-1);
    setTimeout(() => {
      start();
    }, 5000);
  }, [rightSquares]);

  useEffect(() => {
    if (timeLeft == 0) {
      console.log('Время вышло');
      lose();
    }
  }, [timeLeft]);

  const lose = (idx = 99) => {
    console.log('lose');
    setUserWrong(idx);
    setShowRight(true);
    startTimer(null);
    setUserWrong(99);
    setUserHp(userHp - 1);
  };

  const win = () => {
    console.log('won');
    setWon(true);
    startTimer(null);
    setEnemyHp(enemyHp - 3);
  };

  const countRightSquares = (rs = rightSquares) => {
    // calculate values true in rightSquares
    let count = 0;
    rs.forEach((item) => {
      if (item) count++;
    });
    return count;
  };

  const guess = (idx: number) => {
    // check is this idx in rightSquares equals true
    console.log('guess', idx);
    if (rightSquares[idx] === true) {
      setUserRight([...userRight, idx]);
      if (userRight.length + 1 === countRightSquares()) win();
    } else lose(idx);
  };

  const handleClick = (idx: number) => {
    if (showRight) return;
    guess(idx);
  };

  useEffect(() => {
    if (enemyHp > 0) return;
    startTimer(null);
    console.log('level completed');
    setLevelState('completed');
  }, [enemyHp]);

  useEffect(() => {
    if (userHp > 0) return;
    startTimer(null);
    console.log('level failed');
    setLevelState('failed');
  }, [userHp]);

  if (levelState)
    return (
      <GameFinished
        won={levelState === 'completed'}
        restart={() => {
          setLevelState(undefined);
          newGame();
        }}
      />
    );

  return (
    <>
      <div className={styles.info}>
        {showRight ? (
          userWrong === -1 && (
            <>
              <h2 className={styles.title}>
                Запомните расположение закрашенных квадратов
              </h2>
              <Button onClick={() => start()}>Запомнил</Button>
            </>
          )
        ) : (
          <h2 className={styles.title}>Закрасьте квадраты как было показано</h2>
        )}
        {won && (
          <>
            <h2 className={styles.title}>Правильно!</h2>
            <Button onClick={() => newGame()}>Дальше</Button>
          </>
        )}
        {userWrong > 0 && (
          <>
            <h2 className={styles.title}>Не правильно!</h2>
            <Button onClick={() => newGame()}>Дальше</Button>
          </>
        )}
      </div>
      <div
        className={styles.container}
        style={{
          gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
        }}>
        {squares.map((_, idx) => (
          <button
            key={idx}
            className={styles.cell}
            onClick={() => handleClick(idx)}
            style={
              showRight && rightSquares[idx] === true
                ? { backgroundColor: 'blue' }
                : userWrong == idx
                ? { backgroundColor: 'red' }
                : userRight?.includes(idx)
                ? { backgroundColor: 'green' }
                : {}
            }></button>
        ))}
      </div>
    </>
  );
}
