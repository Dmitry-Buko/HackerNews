import type { ReactNode } from 'react';
import { Avatar, Badge, Tooltip } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  /** Контекстные действия страницы — сюда страницы кладут кнопку обновления */
  actions?: ReactNode;
}

/**
 * Фиксированная шапка приложения: прилипает к верху при скролле,
 * размывает фон под собой, справа — действия страницы, уведомления и аватар.
 */
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

        <Tooltip title="Notifications">
          <Badge count={3} size="small" offset={[0, 4]}>
            <BellOutlined className={styles.bell} />
          </Badge>
        </Tooltip>

        <Avatar size={28} className={styles.avatar}>
          DB
        </Avatar>
      </div>
    </header>
  );
}
