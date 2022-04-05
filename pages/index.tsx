import type { NextPage } from 'next';
import styles from './index.module.css';
import Link from 'next/link';
import { TextInput, Button, Group, Box, Center } from '@mantine/core';
import Image from 'next/image';
import Header from '../components/header';
import { useRef, useState } from 'react';

function checkWidth(element: any) {
  return element.offsetWidth;
}

function countSliderItem(parent: any, child: any) {
  return Math.trunc(parent.offsetWidth / child.offsetWidth);
}

const Start: NextPage = () => {
  const [item, setItem] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const slider = useRef(null);
  const slider_block = useRef(null);
  const slider__item = useRef(null);
  const menu = useRef(null);
  let position = 0;
  let counterHandler = 0;
  const prevHandler = () => {
    let width = checkWidth(slider__item.current);

    if (
      counterHandler >
      countSliderItem(slider_block.current, slider__item.current)
    ) {
      counterHandler -= 1;
      position += width + 70;
      slider.current.childNodes.forEach((element: any) => {
        element.style = `transform: translateX(${position}px)`;
      });
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
    if (counterHandler < 10) {
      counterHandler += 1;
      position -= width + 70;
      slider.current.childNodes.forEach((element: any) => {
        element.style = `transform: translateX(${position}px)`;
      });
    }
  };

  const openMenu = () => {
    menu.current.classList.add(styles.active);
  };
  const closeMenu = () => {
    menu.current.classList.remove(styles.active);
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
                <li className={styles.levels__element}>
                  <Link href="/game/rememberCard">
                    <a>
                      <span>1</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>2</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>3</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>4</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>5</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>6</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>7</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>8</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>9</span>
                    </a>
                  </Link>
                </li>
                <li
                  className={styles.levels__element + ' ' + styles.not_active}>
                  <Link href="#">
                    <a>
                      <span>10</span>
                    </a>
                  </Link>
                </li>
              </ul>
            </nav>
            <button className={styles.btn}>
              <span className={styles.btn__text}>играть</span>
            </button>
            <nav className={styles.slider} ref={slider_block}>
              <div className={styles.slider_track} ref={slider}>
                {item.map((i) => {
                  return (
                    <div
                      key={i}
                      className={styles.slider__item}
                      ref={slider__item}></div>
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
};

export default Start;
