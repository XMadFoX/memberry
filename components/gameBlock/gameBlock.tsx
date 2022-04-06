import styles from './gameBlock.module.css';
import Image from 'next/image';
import { createContext, ReactChild, useState } from 'react';
import Link from 'next/link';
import Heart from './heart';

export default function GameBlock({ children }: { children: ReactChild }) {
  const [userHp, setUserHp] = useState(9);
  const [enemyHp, setEnemyHp] = useState(9);

  return (
    <div className={styles.game_page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.leave}>
            <Link href="/">
              <span></span>
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
              <div className={styles.hero__item}>
                <Image
                  src={`/game/dragon.svg`}
                  height={230}
                  width={230}
                  alt="Враг: дракон"
                />
              </div>
            </div>
            <div className={styles.heart_block}>
              {enemyHp >= 0 && <Heart hp={enemyHp} n={1} />}
              {enemyHp >= 3 && <Heart hp={enemyHp} n={2} />}
              {enemyHp >= 6 && <Heart hp={enemyHp} n={3} />}
            </div>
          </div>
          </div>
          <div className={styles.playing_block}>{children}</div>
        </div>
      </div>
    </div>
  );
}
