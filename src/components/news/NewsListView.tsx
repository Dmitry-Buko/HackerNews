import { Alert, Button, Empty, Skeleton, Tooltip, Typography } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { Story } from '../../types/hn';
import { formatRelativeTime, plural } from '../../utils/format';
import { AppHeader } from '../common/AppHeader';
import { NewsListItem } from './NewsListItem';
import styles from './NewsListView.module.css';

interface NewsListViewProps {
  stories: Story[];
  /** идёт загрузка (первая или обновление) */
  loading?: boolean;
  /** текст ошибки загрузки; null/undefined — ошибки нет */
  error?: string | null;
  /** UNIX-время последнего успешного обновления, в секундах */
  lastUpdatedAt?: number | null;
  /** принудительное обновление списка */
  onRefresh?: () => void;
  /** открытие новости (навигация на /news/:id) — передаётся в каждую строку */
  onOpenStory?: (storyId: number) => void;
}

/**
 * Вся главная страница, кроме выбора данных: фиксированная шапка с кнопкой
 * обновления, состояния загрузки/ошибки/пустого списка и сам список.
 * Компонент «глупый»: что рисовать решает контейнер через props.
 */
export function NewsListView({
  stories,
  loading = false,
  error = null,
  lastUpdatedAt = null,
  onRefresh,
  onOpenStory,
}: NewsListViewProps) {
  const showSkeleton = loading && stories.length === 0;

  return (
    <>
      <AppHeader
        actions={
          <Tooltip title="Refresh stories">
            <Button
              type="text"
              shape="circle"
              aria-label="Refresh stories"
              icon={<ReloadOutlined spin={loading} />}
              onClick={onRefresh}
            />
          </Tooltip>
        }
      />

      <div className="hn-container">
        <Typography.Text type="secondary" className={styles.subline}>
          {stories.length > 0 && `${stories.length} ${plural(stories.length, 'story', 'stories')}`}
          {stories.length > 0 && lastUpdatedAt != null && ' · '}
          {lastUpdatedAt != null && `updated ${formatRelativeTime(lastUpdatedAt)}`}
        </Typography.Text>

        {error && (
          <Alert
            type="error"
            showIcon
            message="Failed to load stories"
            description={error}
            action={
              <Button size="small" danger onClick={onRefresh}>
                Retry
              </Button>
            }
            className={styles.alert}
          />
        )}

        {showSkeleton ? (
          <div className={styles.skeletons}>
            {Array.from({ length: 10 }, (_, i) => (
              <Skeleton key={i} active title paragraph={{ rows: 1 }} />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <Empty description="No stories yet" className={styles.empty} />
        ) : (
          <ul className={styles.list}>
            {stories.map((story, i) => (
              <NewsListItem
                key={story.id}
                story={story}
                index={i + 1}
                onOpen={onOpenStory}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
