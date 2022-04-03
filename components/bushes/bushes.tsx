import { getRandomIntMinMax } from '@/lib/random';
import { useEffect, useState } from 'react';
import styles from './bushes.module.css';

export default function Bushes() {
  const size = 5;
  const [bushes, setBushes] = useState<number>(size * size);

  const [highlight, setHighlight] = useState(-1);
  const [order, setOrder] = useState<number[]>([]); // array of indexes

  const [userTurn, setUserTurn] = useState(false);
  const [userOrder, setUserOrder] = useState<number[]>([]);

  const [failIdx, setFailIdx] = useState(-1);
  const [rightIdx, setRightIdx] = useState(-1);
  const [userRightIdx, setUserRightIdx] = useState(-1);

  const play = () => {
    console.log(order.length);
    if (order.length > 4) {
      setUserTurn(true);
    } else {
      //reset
      const bush = getRandomIntMinMax(0, bushes);
      setHighlight(bush);
      setTimeout(() => setHighlight(-1), 1000);
      setOrder((order) => [...order, bush]);
    }
  };

  useEffect(() => {
    if (userTurn) return;
    setTimeout(() => play(), 1000);
  }, [order, userTurn]);

  useEffect(() => {
    const idx = userOrder.length - 1;
    if (userOrder[idx] !== order[idx]) {
      setRightIdx(order[idx]);
      setFailIdx(userOrder[idx]);
      console.log(`fail, ${userOrder[idx]} !== ${order[idx]}`);
    } else {
      setRightIdx(-1);
      setFailIdx(-1);
      setUserRightIdx(userOrder[idx]);
      console.log('success');
    }
    if (idx >= 4) {
      console.log('finished');
      setUserTurn(false);
      setTimeout(() => {
        setOrder([]);
        setUserOrder([]);
      }, 2000);
    }
  }, [userOrder]);

  return (
    <div className={styles.container}>
      <p>
        order: {JSON.stringify(order)} ({order.length})
      </p>
      <p>
        user order: {JSON.stringify(userOrder)} {userOrder.length}
      </p>
      {userTurn && <h2>Now you</h2>}
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
