import styles from './schulteTable.module.css';
import { useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import GameBlock from '../../../components/gameBlock/gameBlock';
import { count } from 'console';
import GameFinished from '@/components/GameFinished/gameFinished';
import { GameContext } from '@components/gameBlock/gameBlock';
function setInt(array: number[], int: number) {
  array = [];
  for (let i = 1; i < int + 1; i++) {
    array.push(i);
  }
  return array;
}

const mixCard = (array: number[]) => {
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

function SchulteTable() {
  const [winGame, setWinGame] = useState(0);
  const [arrayInt, setArrayInt] = useState<number[]>([]);
  const [chooseNumber, setChooseNumber] = useState(1);
  const [countInt, setCountInt] = useState(3);
  const [looseGame, setLooseGame] = useState(0);
  const [firstClick, setFirstClick] = useState(0);
  const { startTimer, timeLeft, userHp, enemyHp, setUserHp, setEnemyHp } =
    useContext(GameContext);
  const schulte = useRef<HTMLDivElement>(null);
  useEffect (()=> {
    if (timeLeft == 0) {
      setFirstClick(0)
      setLooseGame(1)
      setCountInt(3)
      startTimer(0)
      
    }
  }, [timeLeft])
  useEffect (()=>{
    console.log(enemyHp)
    if(enemyHp == 0) {
      setWinGame(1)
      console.log(winGame)
    }
  },[enemyHp])
  useEffect(() => {
    if (schulte.current !== null) {
      schulte.current.setAttribute(
        'style',
        `grid-template: repeat(${countInt},1fr)/repeat(${countInt},1fr)`
      );
      setArrayInt(mixCard(setInt(arrayInt, countInt ** 2)));
      setCountInt(countInt + 1);
    }
  }, []);

  const clickInt = (clickNumber: number) => {
    if (firstClick == 0) {
      setFirstClick(1)
      startTimer(countInt**3/4)
    }
    if (
      clickNumber == arrayInt.length &&
      chooseNumber == arrayInt.length &&
      schulte.current !== null
    ) {
      schulte.current.setAttribute(
        'style',
        `grid-template: repeat(${countInt},1fr)/repeat(${countInt},1fr)`
      );
      setChooseNumber(1);
      setArrayInt(mixCard(setInt(arrayInt, countInt ** 2)));
      if (countInt == 6) {
        return;
      }
      setCountInt(countInt + 1);
      setFirstClick(0)
      startTimer(0)
      setEnemyHp(enemyHp-3)
    }
    if (clickNumber == chooseNumber && chooseNumber != arrayInt.length) {
      setChooseNumber(chooseNumber + 1);
    } 
    if(clickNumber != chooseNumber) {
      setUserHp(userHp - 3);
    }
    if (userHp == 3) {
      setFirstClick(0)
      setCountInt(3);
      startTimer(0)
      setLooseGame(1);
    }
  };

  useEffect (()=> {
    console.log(schulte.current)
    if (schulte.current !== null) {
      schulte.current.setAttribute(
        'style',
        `grid-template: repeat(${countInt},1fr)/repeat(${countInt},1fr)`      
      );
      setCountInt(countInt + 1);
    }
  },[looseGame])
  const newGame = () => {
    setLooseGame(0);
    setArrayInt([]);
    setChooseNumber(1);
    setArrayInt(mixCard(setInt(arrayInt, countInt ** 2)));
    setUserHp(9)
    setEnemyHp(9)
  };


  if(looseGame == 1) {
    return (
      <GameFinished won = {false}  restart = {()=> {
        newGame()
      }}/>
    )
  }

  if (winGame == 1) {
    return (
      <GameFinished won={true} restart={() => {

      }} />
    )
  }
  return (
    <>
      <div className={styles.game}>
        <h2 className={styles.find_number}>Найдите число: {chooseNumber}</h2>
        <div className={styles.schulte} ref={schulte}>
          {arrayInt.map((int: number) => {
            return (
              <div
                className={styles.schulte__item}
                key={int}
                onClick={() => clickInt(int)}>
                {int}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default SchulteTable;
