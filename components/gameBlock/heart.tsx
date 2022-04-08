import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './gameBlock.module.css';

export default function Heart({ hp, n }: { hp: number; n: number }) {
  const [state, setState] = useState(3);

  const calcState = () => {
    if (hp >= n * 3) return 3;
    else if ([2, 5, 8].includes(hp) && n * 3 - 1 >= hp) return 2;
    else if ([1, 4, 7].includes(hp) && n * 3 - 2 >= hp) return 1;
    else return 0;
  };
  useEffect(() => {
    setState(calcState());
  }, [hp]);

  return (
    <>
      <Image
        src={ state == 3 ?  `/game/heart.svg` : state == 2 ? `/game/broken_heart.svg`:`/game/broken_heart.svg`}
        className={styles.heart__element}
        height={45}
        width={45}
        style={{
          opacity: `${state / 3}`,
        }}
        alt="жизнь"
      />
    </>
  );
}
