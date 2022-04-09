import Link from 'next/link';
import { Button } from '@mantine/core';
import useSave from '@/lib/useSave';
import { useEffect } from 'react';
import styles from './gameFinished.module.css';
import { useRouter } from 'next/router';
import { useLocalStorageValue } from '@mantine/hooks';

export default function GameFinished({
  won,
  restart,
}: {
  won: boolean;
  restart: () => void;
}) {
  const { completed, setCompleted, storyMode, setStoryMode } = useSave();
  const router = useRouter();

  useEffect(() => {
    if (won) setCompleted();
  }, []);

  const [localLevels, setLocalsLevels] = useLocalStorageValue({
    key: 'levels',
    serialize: (value: string[]) => JSON.stringify(value),
    deserialize: (value: string) => (value ? JSON.parse(value) : []),
    defaultValue: [],
  });

  const nextLevel = () => {
    router.push(
      `/game/${localLevels[completed < 5 ? completed : completed - 5]}`
    );
  };

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
        <Button color="lime" onClick={() => (won ? nextLevel() : restart())}>
          {won && storyMode ? 'Следующий уровень' : 'Попробовать снова'}
        </Button>
      </div>
    </div>
  );
}
