import Link from 'next/link';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: '⬚' },
    { name: 'Quote Studio', path: '/quote-studio', icon: '✍️' },
    { name: 'Script Wizard', path: '/script-to-video', icon: '⚡' },
    { name: 'Avatar Studio', path: '/talking-avatar', icon: '👤' },
    { name: 'Image Studio', path: '/image-studio', icon: '🎨' },
    { name: 'Audio Studio', path: '/audio-studio', icon: '🔊' },
    { name: 'Video Studio', path: '/text-to-video', icon: '🎬' },
    { name: 'Anim Studio', path: '/image-to-video', icon: '🎞' },
    { name: 'Storyboard', path: '/storyboard', icon: '📋' },
    { name: 'Creative Suite', path: '/creative-suite', icon: '✨' },
    { name: 'Template Store', path: '/template-store', icon: '🏪' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>V</span>
        <span className={styles.logoText}>VisionAI</span>
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <Link href={item.path} key={item.path} className={styles.navItem}>
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.status}>
          <div className={styles.statusDot}></div>
          <span>System Ready</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
