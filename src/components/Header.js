import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.search}>
        <span className={styles.searchIcon}>🔍</span>
        <input type="text" placeholder="Search projects..." className={styles.searchInput} />
      </div>
      
      <div className={styles.actions}>
        <button className={styles.newBtn}>
          <span className={styles.btnIcon}>+</span>
          New Project
        </button>
        <div className={styles.profile}>
          <div className={styles.avatar}>A</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
