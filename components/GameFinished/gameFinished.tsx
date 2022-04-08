import { Button } from '@mantine/core';
import Link from 'next/link';
import styles from './gameFinished.module.css';

export default function gameFinished({
  won,
  restart,
}: {
  won: boolean;
  restart: () => void;
}) {
  return (
    <div className={styles.finished}>
      <h2 className={styles.finished_title}>
        {won ? 'Вы выиграли' : 'Вы проиграли'}
      </h2>
      <div className={styles.finished_btns}>
        <Link href="/" passHref>
          <Button component="a" color="teal">
            Вернуться в Главное меню
          </Button>
        </Link>
        <Button color="lime" onClick={() => (won ? {} : restart())}>
          {won ? 'Следующий уровень' : 'Попробовать снова'}
        </Button>
      </div>
    </div>
  );
}
