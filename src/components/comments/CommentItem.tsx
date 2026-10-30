import { useState } from 'react';
import { Button, Spin, Tooltip, Typography } from 'antd';
import type { Comment } from '../../types/hn';
import { formatFullDate, formatRelativeTime, plural } from '../../utils/format';
import styles from './CommentItem.module.css';

interface CommentItemProps {
  comment: Comment;
  /**
   * Загруженные ответы на комментарий (контейнер берёт их из кэша запросов).
   * undefined — ответы ещё не запрашивались. Нужно только если у комментария есть kids.
   */
  getChildComments?: (comment: Comment) => Comment[] | undefined;
  /** идёт ли сейчас догрузка ответов на этот комментарий */
  isChildCommentsLoading?: (comment: Comment) => boolean;
  /**
   * Вызывается при КАЖДОМ раскрытии ветки (не при сворачивании).
   * Контейнер сам решает, нужна ли догрузка: сравнивает kids с уже загруженным.
   */
  onToggleChildren?: (comment: Comment) => void;
}

export function CommentItem({
  comment,
  getChildComments,
  isChildCommentsLoading,
  onToggleChildren,
}: CommentItemProps) {
  const [expanded, setExpanded] = useState(false);
  const hasKids = comment.kids.length > 0;
  const childrenLoading = expanded && (isChildCommentsLoading?.(comment) ?? false);
  const childComments = expanded ? (getChildComments?.(comment) ?? []) : [];
  const removed = comment.deleted === true;

  const handleToggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (next) {
      onToggleChildren?.(comment);
    }
  };

  return (
    <li className={`${styles.item} ${comment.dead ? styles.dead : ''}`}>
      <div className={styles.header}>
        {removed || !comment.by ? (
          <Typography.Text type="secondary" italic>
            [deleted]
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary" strong className={styles.author}>
            {comment.by}
          </Typography.Text>
        )}
        {!removed && comment.time > 0 && (
          <Tooltip title={formatFullDate(comment.time)}>
            <Typography.Text type="secondary" className={styles.time}>
              {formatRelativeTime(comment.time)}
            </Typography.Text>
          </Tooltip>
        )}
      </div>

      <div className={styles.text}>
        {removed || !comment.text ? (
          <Typography.Text type="secondary" italic>
            Comment deleted
          </Typography.Text>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: comment.text }} />
        )}
      </div>

      {hasKids && (
        <Button type="link" size="small" className={styles.toggle} onClick={handleToggle}>
          {expanded
            ? 'Hide replies'
            : `Show ${comment.kids.length} ${plural(comment.kids.length, 'reply', 'replies')}`}
        </Button>
      )}

      {expanded && (
        <div className={styles.children}>
          {childrenLoading ? (
            <Spin size="small" />
          ) : childComments.length > 0 ? (
            <ul className={styles.nestedList}>
              {childComments.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  getChildComments={getChildComments}
                  isChildCommentsLoading={isChildCommentsLoading}
                  onToggleChildren={onToggleChildren}
                />
              ))}
            </ul>
          ) : (
            <Typography.Text type="secondary" className={styles.noAnswers}>
              No replies found
            </Typography.Text>
          )}
        </div>
      )}
    </li>
  );
}
