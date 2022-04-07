import styles from './schulteTable.module.css';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import GameBlock from '../../../components/gameBlock/gameBlock';
import { count } from 'console';

function setInt(array: number[], int: number) {
  array = []
  for (let i = 1; i < int + 1; i++) {
    array.push(i);
  }
  return array
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
  const [arrayInt, setArrayInt] = useState<number[]>([]);
  const [chooseNumber, setChooseNumber] = useState(1)
  const [countInt, setCountInt] = useState(3)
  const schulte = useRef(null)

  useEffect(() => {
    schulte.current.style = `grid-template: repeat(${countInt},1fr)/repeat(${countInt},1fr)`
    setArrayInt(mixCard(setInt(arrayInt,countInt**2)))
    setCountInt(countInt+1)
  }, []);


  const clickInt = (clickNumber:number) => {
        if (clickNumber == arrayInt.length && chooseNumber == arrayInt.length) {
            schulte.current.style = `grid-template: repeat(${countInt},1fr)/repeat(${countInt},1fr)`
            setChooseNumber(1)
            setArrayInt(mixCard(setInt(arrayInt,countInt**2)))
            if (countInt == 6) {
                return
            }
            setCountInt(countInt+1)

        }
        if (clickNumber == chooseNumber && chooseNumber != arrayInt.length) {
            setChooseNumber(chooseNumber+1)  
        }
        

  }

  return (
    <>
      <GameBlock>
        <div className={styles.game}>
        <h2 className={styles.find_number}>Найдите число: {chooseNumber}</h2>
            <div className={styles.schulte} ref ={schulte}>
                
                {arrayInt.map((int:number) => {

                    
                    return (
                        <div className= {styles.schulte__item} key = {int} onClick = {() => clickInt(int)}>
                            {int}
                        </div>
                    )
                })}
            </div>
        </div>
      </GameBlock>
    </>
  );
}

export default SchulteTable;
