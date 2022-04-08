import { getRandomIntMinMax } from '@lib/random';
import React, { useEffect, useState } from 'react';
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
  };

  const newGame = () => {
    setWon(false);
    const newBoardSize = getRandomIntMinMax(3, 6);
    setBoardSize(newBoardSize);
    const cellsCount = newBoardSize * newBoardSize;
    generateBoard(cellsCount);
    console.log('new bs', newBoardSize);
    // then fires useEffect with rightSquares dependency
  };

  useEffect(() => {
    newGame();
  }, []);

  useEffect(() => {
    const cellsCount = boardSize * boardSize;
    setSquares([...new Array(cellsCount)]);
    console.log('cells', cellsCount);
    setShowRight(true);
    setUserRight([]);
    setUserWrong(-1);
    setTimeout(() => {
      setShowRight(false);
      console.log('right', rightSquares);
    }, 5000);
  }, [rightSquares]);

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
    if (rightSquares[idx] === true) {
      setUserRight([...userRight, idx]);
      if (userRight.length + 1 === countRightSquares()) {
        console.log('won');
        setWon(true);
      }
    } else {
      setUserWrong(idx);
      setShowRight(true);
    }
  };

  const handleClick = (idx: number) => {
    if (showRight) return;
    guess(idx);
  };

  return (
    <>
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
      {showRight && userWrong === -1 && (
        <button onClick={() => start()}>Запомнил</button>
      )}
      {(won || userWrong > 0) && (
        <button onClick={() => newGame()}>Дальше</button>
      )}
    </>
  );
}
