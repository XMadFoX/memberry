import styles from './index.module.css';
import Image from 'next/image';
import Header from '@components/header';
import { useEffect, useRef, useState } from 'react';
import { useLocalStorageValue } from '@mantine/hooks';
import { NextRouter, useRouter } from 'next/router';
import useSave from '@/lib/useSave';

function checkWidth(element: any) {
  return element.offsetWidth;
}

function countSliderItem(parent: any, child: any) {
  return Math.trunc(parent.offsetWidth / child.offsetWidth);
}

export default function HomePage() {
  const router = useRouter();
  const [games, setGames] = useState<string[]>([
    'schulte',
    'knight-move',
    'card-pairs',
    'bushes',
    'remember-squares',
  ]);
  const gameLabels = [
    'Таблица шульте',
    'Передвижения коня',
    'Пары карточек',
    'Порядок кустов',
    'Запомни квадраты',
  ];
  const slider = useRef<HTMLDivElement>(null);
  const slider_block = useRef<HTMLDivElement>(null);
  const slider__item = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  let position = 0;
  let counterHandler = 0;

  const { completed, setStoryMode } = useSave();

  const [levels, setLevels] = useState<string[] | undefined>();
  const [localLevels, setLocalsLevels] = useLocalStorageValue({
    key: 'levels',
    serialize: (value: string[]) => JSON.stringify(value),
    deserialize: (value: string) => (value ? JSON.parse(value) : []),
    defaultValue: [],
  });

  useEffect(() => {
    if (localLevels?.length > 0) {
      setLevels(localLevels);
      return;
    }
    let _levels = [
      'bushes',
      'remember-squares',
      'knight-move',
      'schulte',
      'card-pairs',
    ];
    _levels = _levels.sort(() => Math.random() - 0.5);
    setLevels(_levels);
    setLocalsLevels(_levels);
  }, []);

  const prevHandler = () => {
    let width = checkWidth(slider__item.current);

    if (
      counterHandler >
      countSliderItem(slider_block.current, slider__item.current)
    ) {
      counterHandler -= 1;
      position += width + 70;
      if (slider.current !== null) {
        slider.current.childNodes.forEach((element: any) => {
          element.style = `transform: translateX(${position}px)`;
        });
      }
    }
  };
  const nextHandler = () => {
    if (counterHandler == 0) {
      counterHandler = countSliderItem(
        slider_block.current,
        slider__item.current
      );
    }
    let width = checkWidth(slider__item.current);
    if (counterHandler < games.length) {
      counterHandler += 1;
      position -= width + 70;
      if (slider.current !== null) {
        slider.current.childNodes.forEach((element: any) => {
          element.style = `transform: translateX(${position}px)`;
        });
      }
    }
  };

  const openMenu = () => {
    if (menu.current !== null) {
      menu.current.classList.add(styles.active);
    }
  };
  const closeMenu = () => {
    if (menu.current !== null) {
      menu.current.classList.remove(styles.active);
    }
  };
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.burger_open_menu} onClick={openMenu}>
          <span></span>
        </div>
        <div className={styles.menu} ref={menu}>
          <div className={styles.menu_upper}>
            <div className={styles.logo_menu}>memBerry</div>
            <div className={styles.burger_close_menu} onClick={closeMenu}>
              <span></span>
            </div>
          </div>
          <div className={styles.menu_elements}>
            <div className={styles.menu__item}>Авторизация</div>
            <div className={styles.menu__item}>торговая лавка</div>
            <div className={styles.menu__item}>таблица лидеров</div>
          </div>
        </div>

        <div className="container">
          <div className={styles.block}>
            <nav className={styles.nav}>
              <ul className={styles.levels}>
                {levels &&
                  [...new Array(10)].map((item, index) => (
                    <LevelItem
                      key={index}
                      levels={levels!}
                      lvl={index}
                      gamesCompleted={completed}
                      setStoryMode={setStoryMode}
                      router={router}
                    />
                  ))}
              </ul>
            </nav>
            <button
              className={styles.btn}
              onClick={() => {
                levels &&
                  router.push(
                    `/game/${levels[completed < 5 ? completed : completed - 5]}`
                  );
              }}>
              <span className={styles.btn__text}>играть</span>
            </button>
            <nav className={styles.slider} ref={slider_block}>
              <div className={styles.slider_track} ref={slider}>
                {games.map((game, index) => {
                  return (
                    <div
                      key={game}
                      className={styles.slider__item}
                      ref={slider__item}>
                      <button
                        onClick={() => router.push(`/game/${game}`)}
                        aria-label={gameLabels[index]}
                        className={styles.slider_item}
                        >
                          <Image src={`/lvl/lvl${index+1}.svg)`} width ={"100%"} height = {"100%"} aria-label={gameLabels[index]}>

                          </Image>
                        </button>
                    </div>
                  );
                })}
              </div>
              <button
                className={styles.slider__button + ' ' + styles.slider__prev}
                onClick={prevHandler}>
                <Image
                  src={`/icons/arrow_left.svg`}
                  alt="Left btn"
                  width={64}
                  height={64}
                />
              </button>
              <button
                className={styles.slider__button + ' ' + styles.slider__next}
                onClick={nextHandler}>
                <Image
                  src={`/icons/arrow_right.svg`}
                  alt="Right btn"
                  width={64}
                  height={64}
                />
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}

const LevelItem = ({
  levels,
  lvl,
  gamesCompleted,
  setStoryMode,
  router,
}: {
  levels: string[];
  lvl: number;
  gamesCompleted: number;
  setStoryMode: (storyMode: boolean) => void;
  router: NextRouter;
}) => {
  const play = () => {
    setStoryMode(true);
    router.push(`/game/${levels[lvl < 5 ? lvl : lvl - 5]}`);
  };

  useEffect(() => {
    // TODO: prefetch accessible level
    // if (lvl >= gamesCompleted) router.prefetch(`/game/${lvl}`);
  }, []);

  return (
    <li
      className={`${styles.levels__element} ${
        lvl >= gamesCompleted + 1 ? styles.not_active : ''
      }`}>
      {/* {levels[lvl < 5 ? lvl : lvl - 5]} */}
      <button onClick={() => play()} disabled={lvl >= gamesCompleted + 1}>
        {lvl + 1}
      </button>
    </li>
  );
};
