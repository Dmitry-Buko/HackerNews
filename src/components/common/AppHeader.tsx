import type { ReactNode } from "react";
import { Avatar } from "antd";
import styles from "./AppHeader.module.css";

interface AppHeaderProps {
  /** Контекстные действия страницы — сюда страницы кладут кнопку обновления */
  actions?: ReactNode;
}

export function AppHeader({ actions }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo} aria-hidden="true">
          Y
        </div>
        <span className={styles.logoText}>Hacker News</span>

        <div className={styles.spacer} />

        {actions}

        <span className={styles.divider} aria-hidden="true" />

        <Avatar size={28} className={styles.avatar}>
          DB
        </Avatar>
      </div>
    </header>
  );
}
