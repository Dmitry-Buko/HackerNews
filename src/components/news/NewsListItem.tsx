import { useState } from 'react';
import type { MouseEvent } from 'react';
import { Tag, Tooltip, Typography } from 'antd';
import { CaretUpFilled } from '@ant-design/icons';
import type { Story } from '../../types/hn';
import { categoryColor } from '../../utils/category';
import { formatFullDate, formatRelativeTime } from '../../utils/format';
import styles from './NewsListItem.module.css';

interface NewsListItemProps {
  story: Story;
  /** порядковый номер в списке (1–100) */
  index: number;
  /**
   * Клик по строке. Контейнер страницы передаёт здесь навигацию
   * (например, navigate(`/news/${id}`)). Не передан — строка некликабельна.
   */
  onOpen?: (storyId: number) => void;
  /**
   * Голосование (для будущей интеграции с API). Видимое состояние кнопки
   * компонент держит сам: клик переключает голос, счётчик меняется на 1.
   */
  onUpvote?: (storyId: number) => void;
}

/** Одна строка списка новостей: номер, кнопка голосования, заголовок с тегом категории, автор и дата */
export function NewsListItem({ story, index, onOpen, onUpvote }: NewsListItemProps) {
  const [voted, setVoted] = useState(false);
  const score = story.score + (voted ? 1 : 0);

  const handleUpvote = (e: MouseEvent<HTMLButtonElement>) => {
    // чтобы голос не открывал новость
    e.stopPropagation();
    setVoted((v) => !v);
    onUpvote?.(story.id);
  };

  return (
    <li
      className={`${styles.item} ${onOpen ? styles.clickable : ''}`}
      onClick={onOpen ? () => onOpen(story.id) : undefined}
    >
      <span className={styles.index}>{index}.</span>

      <div className={styles.voteBox}>
        <Tooltip title={voted ? 'Remove vote' : 'Upvote'}>
          <button
            type="button"
            aria-label="Upvote"
            className={`${styles.voteBtn} ${voted ? styles.voted : ''}`}
            onClick={handleUpvote}
          >
            <CaretUpFilled />
          </button>
        </Tooltip>
        <span className={styles.score}>{score}</span>
      </div>

      <div className={styles.body}>
        <div className={styles.titleRow}>
          <Typography.Text strong className={styles.title}>
            {story.title}
          </Typography.Text>
          {story.category && (
            <Tag color={categoryColor(story.category)} className={styles.category}>
              {story.category}
            </Tag>
          )}
        </div>
        <Typography.Text type="secondary" className={styles.meta}>
          {story.by} ·{' '}
          <Tooltip title={formatFullDate(story.time)}>{formatRelativeTime(story.time)}</Tooltip>
        </Typography.Text>
      </div>
    </li>
  );
}
