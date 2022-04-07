import styles from './knightMove.module.css';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import GameBlock from '../../../components/gameBlock/gameBlock';
import Image from 'next/image';
import { MutableRefObject } from 'react';

const chessDesk = Array.from({ length: 64 }, (e, i) => i);

const move = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];
function checkWidth(element: any) {
  return element.offsetWidth;
}
function KnightMove() {
  let whiteFlag = 1;
  const horse = useRef<HTMLDivElement>(null);
  const cell = useRef<HTMLDivElement>(null);
  const [arrayMoove, setArrayMoove] = useState<number[]>([]);
  let randomPlaceKnight = Math.floor(Math.random() * 63);
  let randomMove = Math.floor(Math.random() * move.length);
  let x = randomPlaceKnight % 8;
  let y = Math.floor(randomPlaceKnight / 8);
  let cordinateX = 0;
  let cordinateY = 0;
  const [level,setLevel] = useState(2)
  let countClick = 0;

  useEffect(() => {}, []);
  const moveHorse = (count: number) => {
    let width = checkWidth(horse.current);
    setTimeout(() => {
      if (horse.current !== null) {
        horse.current.setAttribute(
          'style',
          `visibility:hidden; transform: translate(${
            cordinateX + move[randomMove][0] * width
          }px,${cordinateY + move[randomMove][1] * width}px);`
        );
        x += move[randomMove][0];
        y += move[randomMove][1];
        cordinateX += move[randomMove][0] * width;
        cordinateY += move[randomMove][1] * width;
        randomMove = Math.floor(Math.random() * move.length);
        arrayMoove.push([x, y]);
      }
    }, 1000 * (count + 1));
    for (let i = 1; i < count + 1; i++) {
      setTimeout(() => {
        while (
          x + move[randomMove][0] > 7 ||
          x + move[randomMove][0] < 0 ||
          y + move[randomMove][1] > 7 ||
          y + move[randomMove][1] < 0
        ) {
          randomMove = Math.floor(Math.random() * move.length);
        }
        if (horse.current !== null) {
          horse.current.setAttribute(
            'style',
            `transform: translate(${
              cordinateX + move[randomMove][0] * width
            }px,${cordinateY + move[randomMove][1] * width}px);`
          );
          if (i < count) {
            x += move[randomMove][0];
            y += move[randomMove][1];
            cordinateX += move[randomMove][0] * width;
            cordinateY += move[randomMove][1] * width;
            randomMove = Math.floor(Math.random() * move.length);
            arrayMoove.push([x, y]);
          }
        }
      }, 1000 * i);
    }
  };

  const cellClick = (index: number) => {
    if (arrayMoove[countClick]) {
      let xClick = index % 8;
      let yClick = Math.floor(index / 8);
      if (
        arrayMoove[countClick][0] == xClick &&
        arrayMoove[countClick][1] == yClick
      ) {
        console.log('вы правильно ответили');
        countClick++;
      }
    }
    if (countClick == arrayMoove.length) {
      console.log("Вы выиграли")
      setLevel(level+1)
      randomPlaceKnight = Math.floor(Math.random() * 63);
      randomMove = Math.floor(Math.random() * move.length);
      x = randomPlaceKnight % 8;
      y = Math.floor(randomPlaceKnight / 8);
      cordinateX = 0;
      cordinateY = 0;
      countClick = 0;
      setArrayMoove([])
    }
  };
  return (
    <>
      <GameBlock>
        <div className={styles.game}>
          <h1>Ход конем</h1>
          <h2>Ваш уровень {level - 1}</h2>
          <div className={styles.chess}>
            {chessDesk.map((index) => {
              whiteFlag *= -1;
              if (index % 8 == 0) whiteFlag *= -1;
              return (
                <div
                  className={
                    styles.chess_cell +
                    ' ' +
                    (whiteFlag == 1 ? styles.white : styles.black)
                  }
                  onClick={() => cellClick(index)}
                  key={index}>
                  {randomPlaceKnight == index && (
                    <div className={styles.horse} ref={horse}>
                      <Image
                        src="/icons/chess_horse.svg"
                        width={55}
                        height={55}
                        alt="конь"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={() => moveHorse(level)}>Готов</button>
        </div>
      </GameBlock>
    </>
  );
}

export default KnightMove;
