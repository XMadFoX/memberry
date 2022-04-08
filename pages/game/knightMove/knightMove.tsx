import styles from './knightMove.module.css';
import { useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import { GameContext } from '@components/gameBlock/gameBlock';
import Image from 'next/image';
import GameFinished from '@/components/GameFinished';
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

var randomPlaceKnight = Math.floor(Math.random() * 63);
var countClick = 0;

function checkWidth(element: any) {
  return element.offsetWidth;
}
const KnightMove = () => {
  let whiteFlag = 1;
  const horse = useRef<HTMLDivElement>(null);
  const cellBlock = useRef<HTMLDivElement>(null);
  const [winGame,setWinGame] = useState(0)

  const [arrayMove, setArrayMove] = useState<any>([]);
  const { startTimer, timeLeft, userHp, enemyHp, setUserHp, setEnemyHp } =
    useContext(GameContext);
  const [countMisstake, setCountMisstake] = useState(1);
  const [right, setRight] = useState(1);
  let randomMove = Math.floor(Math.random() * move.length);
  let x = randomPlaceKnight % 8;
  let y = Math.floor(randomPlaceKnight / 8);
  let coordinateX = 0;
  let coordinateY = 0;
  const [looseGame, setLooseGame] = useState(0);

  const [level, setLevel] = useState(2);
  useEffect(() => {
    if (timeLeft==0) {
      setLooseGame(1)
    }
  },[timeLeft])
  const moveHorse = (count: number) => {
    let width = checkWidth(horse.current);
    setTimeout(() => {
      if (horse.current !== null) {
        horse.current.setAttribute(
          'style',
          `visibility:hidden; transform: translate(${
            coordinateX + move[randomMove][0] * width
          }px,${coordinateY + move[randomMove][1] * width}px);`
        );
        x += move[randomMove][0];
        y += move[randomMove][1];
        coordinateX += move[randomMove][0] * width;
        coordinateY += move[randomMove][1] * width;
        randomMove = Math.floor(Math.random() * move.length);
        arrayMove.push([x, y]);
        startTimer(10);
        console.log('Конь показал как ходить');
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
              coordinateX + move[randomMove][0] * width
            }px,${coordinateY + move[randomMove][1] * width}px);`
          );
          if (i < count) {
            x += move[randomMove][0];
            y += move[randomMove][1];
            coordinateX += move[randomMove][0] * width;
            coordinateY += move[randomMove][1] * width;
            randomMove = Math.floor(Math.random() * move.length);
            arrayMove.push([x, y]);
          }
        }
      }, 1000 * i);
    }
  };

  const cellClick = (index: number) => {
    let xClick = index % 8;
    let yClick = Math.floor(index / 8);
    if (arrayMove[countClick]) {
      if (
        arrayMove[countClick][0] == xClick &&
        arrayMove[countClick][1] == yClick
      ) {
        if (cellBlock.current !== null) {
          let i = 0;
          cellBlock.current.childNodes.forEach((element: any) => {
            if (index == i) {
              element.style = `background-color:green`;
            }
            i++;
          });
        }
        console.log('вы правильно ответили');
        setRight(right + 1);
        
        countClick++;
      } else {
        if (cellBlock.current !== null) {
          let i = 0;
          cellBlock.current.childNodes.forEach((element: any) => {
            if (index == i) {
              element.style = `background-color:red`;
            }
            i++;
          });
          setUserHp(userHp - 3);
          setCountMisstake(countMisstake + 1);

          if (countMisstake == 3) {
            setLevel(1);
            startTimer(0);
            randomPlaceKnight = Math.floor(Math.random() * 63);
            randomMove = Math.floor(Math.random() * move.length);
            x = randomPlaceKnight % 8;
            y = Math.floor(randomPlaceKnight / 8);
            coordinateX = 0;
            coordinateY = 0;
            countClick = 0;
            setArrayMove([]);
            console.log('Вы проиграли');
            setLooseGame(1);
            if (cellBlock.current !== null) {
              cellBlock.current.childNodes.forEach((element: any) => {
                element.style = `background-color:none`;
              });
            }
          }
        }
      }
      if (countClick == arrayMove.length) {
        setEnemyHp(enemyHp - 3);
        if (cellBlock.current !== null) {
          cellBlock.current.childNodes.forEach((element: any) => {
            element.style = `background-color:none`;
          });
        }
        startTimer(0);
        console.log('Вы выиграли');
        setLevel(level + 1);
        randomPlaceKnight = Math.floor(Math.random() * 63);
        randomMove = Math.floor(Math.random() * move.length);
        x = randomPlaceKnight % 8;
        y = Math.floor(randomPlaceKnight / 8);
        coordinateX = 0;
        coordinateY = 0;
        countClick = 0;
        setArrayMove([]);
      }
    }
  };
  useEffect(()=>{
    if(enemyHp == 0) {
      setWinGame(1)
    }
  },[enemyHp])
  if (looseGame == 1) {
    return (
      <GameFinished won = {false}  restart = {()=> {
        setLevel(2);
        randomPlaceKnight = Math.floor(Math.random() * 63);
        randomMove = Math.floor(Math.random() * move.length);
        x = randomPlaceKnight % 8;
        y = Math.floor(randomPlaceKnight / 8);
        coordinateX = 0;
        coordinateY = 0;
        countClick = 0;
        setUserHp(9);
        setEnemyHp(9)
        setArrayMove([]);
        setLooseGame(0);
      }}/>
    )
  }  
  if (winGame == 1) {
    return (
      <GameFinished won = {true}  restart = {()=> {}}/>
    )
  }  


  return (
    <div className={styles.game}>
      <h1 className={styles.title}>Ход конем</h1>

      <h2 className={styles.subtitle}>Ваш уровень {level - 1}</h2>
      <div className={styles.chess} ref={cellBlock}>
        {chessDesk.map((index) => {
          whiteFlag *= -1;
          let isClicked = 0;
          if (index % 8 == 0) whiteFlag *= -1;

          return (
            <div
              onClick={() => {
                cellClick(index);
              }}
              key={index}
              className={
                styles.chess_cell +
                ' ' +
                (whiteFlag == 1 ? styles.white : styles.black) +
                ' ' +
                (isClicked == 1 ? styles.click : '')
              }>
              <div className={styles.wrapper}>
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
            </div>
          );
        })}
      </div>
      <button className={styles.btn} onClick={() => moveHorse(level)} >
        Готов
      </button>
    </div>
  );
};

export default KnightMove;
