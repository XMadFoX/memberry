import Link from 'next/link';
import { Button } from '@mantine/core';
import useSave from '@/lib/useSave';
import { useEffect } from 'react';
import styles from './gameFinished.module.css';

export default function GameFinished({
  won,
  restart,
}: {
  won: boolean;
  restart: () => void;
}) {
  const { completed, setCompleted, storyMode, setStoryMode } = useSave();

  useEffect(() => {
    if (won) setCompleted();
  }, []);

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
          {won && storyMode ? 'Следующий уровень' : 'Попробовать снова'}
        </Button>
      </div>
    </div>
  );
}
