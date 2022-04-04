import styles from './gameBlock.module.css';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
function gameBlock({children}: {children: React.ReactChild}) {
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
              <div className={styles.heart__element}>
                <Image src={`/icons/heart.svg`} height={45} width={45} />
              </div>
              <div className={styles.heart__element}>
                <Image src={`/icons/heart.svg`} height={45} width={45} />
              </div>
              <div className={styles.heart__element}>
                <Image src={`/icons/heart.svg`} height={45} width={45} />
              </div>
            </div>
            <div className={styles.hero}>
              <div className={styles.hero__item}>
                <Image src={`/game/knight.svg`} height={230} width={230} />
              </div>
              <div className={styles.hero__item}>
                <Image src={`/game/dragon.svg`} height={230} width={230} />
              </div>
            </div>
            <div className={styles.heart_block}>
              <div className={styles.heart__element}>
                <Image src={`/icons/heart.svg`} height={45} width={45} />
              </div>
              <div className={styles.heart__element}>
                <Image src={`/icons/heart.svg`} height={45} width={45} />
              </div>
              <div className={styles.heart__element}>
                <Image src={`/icons/heart.svg`} height={45} width={45} />
              </div>
            </div>
          </div>
          <div className={styles.playing_block}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default gameBlock;
