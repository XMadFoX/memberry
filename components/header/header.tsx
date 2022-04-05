import type { NextPage } from 'next';
import styles from './header.module.css';
import Link from 'next/link';
import Image from 'next/image';
const Header: NextPage = () => {
  return (
    <header className={styles.header}>
      <div className={styles.header__element}>
        <Link href="/44">memBerry</Link>
      </div>
      <div className={styles.header__element}>
        <Link href="/1">
          <a><Image src={`/icons/tabl top.svg`} height={32} width={32}  alt = "tabl"/></a>
        </Link>
      </div>
      <div className={styles.header__element}>
        <Link href="/2">
          <a><Image src={`/icons/shop.svg`} height={32} width={32} alt = "shop"/></a>
        </Link>
      </div>
      <div className={styles.header__element}>
        <Link href="/3">
          <a> <Image src={`/icons/user.svg`} height={32} width={32} alt = "user"/></a>
        </Link>
      </div>
    </header>
  );
};

export default Header;
