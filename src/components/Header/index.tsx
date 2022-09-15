import styles from "./style.module.scss";

function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <h1 className={styles.heading1}>限界しりとりタイマー</h1>
      <span className={styles.title}>
        限界しりとり<span className={styles.red}>タイマー</span>
      </span>
    </header>
  );
}

export default Header;
