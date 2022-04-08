import styles from './index.module.css';
import Link from 'next/link';
function Landing() {
  return (
    <div className={styles.landing}>
      <h1 className={styles.title}>Победи дракона <br /> развивая память</h1>
      <Link href="./home">
          <a className={styles.link}> <span>Начать</span> </a> 
      </Link>
    </div>
  );
}

export default Landing;
