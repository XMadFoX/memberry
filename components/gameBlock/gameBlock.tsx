import styles from './gameBlock.module.css';
import Image from 'next/image';
import { createContext, ReactChild, useEffect, useState } from 'react';
import Link from 'next/link';
import Heart from './heart';
import useTimer from './useTimer';
import usePrevious from '@lib/usePrevious';

interface GameContextI {
  startTimer: (time: number | null, accuracy?: number | undefined) => void;
  timeLeft: number | null;
  userHp: number;
  enemyHp: number;
  setUserHp: (hp: number) => void;
  setEnemyHp: (hp: number) => void;
}

const GameContext = createContext<GameContextI>({} as GameContextI);
export { GameContext };

export default function GameBlock({
  children,
  id,
}: {
  children: ReactChild;
  id?: string;
}) {
  const [userHp, setUserHp] = useState(9);
  const [enemyHp, setEnemyHp] = useState(9);

  const { start: startTimer, timeLeft } = useTimer();

  const prevUserHp = usePrevious(userHp);
  const prevEnemyHp = usePrevious(enemyHp);

  useEffect(() => {
    if (userHp >= prevUserHp) return;
  }, [userHp]);
  useEffect(() => {
    if (enemyHp >= prevEnemyHp) return;
  }, [enemyHp]);

  return (
    <div
      className={styles.game_page}
      style={{ backgroundImage: `url(/bg/${id ? id : 'default'}.webp)` }}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.timer}>
            {typeof timeLeft == 'number' &&
              timeLeft >= 0 &&
              (timeLeft / 1000).toFixed(2)}
          </div>
          <div className={styles.leave}>
            <Link href="/home">
              <a>
                <span></span>
              </a>
            </Link>
          </div>
        </div>
        <div className={styles.main}>
          <div className={styles.heart}>
            <div className={styles.heart_block}>
              {userHp >= 0 && <Heart hp={userHp} n={1} />}
              {userHp >= 3 && <Heart hp={userHp} n={2} />}
              {userHp >= 6 && <Heart hp={userHp} n={3} />}
            </div>
            <div className={styles.hero}>
              <div className={styles.hero__item}>
                <Image
                  src={`/game/knight.svg`}
                  height={230}
                  width={230}
                  alt="Рыцарь"
                />
              </div>
              <div className={styles.hero__item} style = {id == "knight-move" ? {top:"-67px"} : id == "remember-squares" ? {top: "-64px"} : {}}>
                <Image
                  src={`/game/enemies/${id || 'dragon'}.svg`}
                  height={230}
                  width={230}
                  alt="Враг"
                />
              </div>
            </div>
            <div className={styles.heart_block}>
              {enemyHp >= 0 && <Heart hp={enemyHp} n={1} />}
              {enemyHp >= 3 && <Heart hp={enemyHp} n={2} />}
              {enemyHp >= 6 && <Heart hp={enemyHp} n={3} />}
            </div>
          </div>
          <div className={styles.playing_block}>
            <GameContext.Provider
              value={{
                startTimer,
                timeLeft,
                userHp,
                setUserHp,
                enemyHp,
                setEnemyHp,
              }}>
              {children}
            </GameContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
}
