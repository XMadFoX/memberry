import type { NextPage } from 'next';
import styles from './header.module.css';
import Link from 'next/link';
import Image from 'next/image';
const Header: NextPage = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__element}>
        <Link href="/home">
          <a>
            <Image src="/logo.svg" width={64} height={64} alt="Memberry" />
          </a>
        </Link>
      </div>
      <div className={styles.header__element} style={{ opacity: 0.5 }}>
        <Link href="#leaderboard">
          <a>
            <Image
              src={`/icons/tabl_top.svg`}
              height={32}
              width={32}
              alt="Таблица лидеров"
            />
          </a>
        </Link>
      </div>
      <div className={styles.header__element} style={{ opacity: 0.5 }}>
        <Link href="#shop">
          <a>
            <Image
              src={`/icons/shop.svg`}
              height={32}
              width={32}
              alt="Магазин"
            />
          </a>
        </Link>
      </div>
      <div className={styles.header__element}>
        <Link href="/register">
          <a>
            <Image src={`/icons/user.svg`} height={32} width={32} alt="Вход" />
          </a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
