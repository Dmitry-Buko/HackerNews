import { Alert, Empty, Skeleton } from 'antd';
import type { Comment } from '../../types/hn';
import { CommentItem } from './CommentItem';
import styles from './CommentTree.module.css';

interface CommentTreeProps {
  /** корневые комментарии новости (первый уровень вложенности) */
  rootComments: Comment[];
  /** загрузка корневых комментариев */
  loading?: boolean;
  /** текст ошибки загрузки комментариев */
  error?: string | null;
  /** селектор загруженных ответов — проксируется в каждый CommentItem */
  getChildComments?: (comment: Comment) => Comment[] | undefined;
  /** догружаются ли сейчас ответы — проксируется в каждый CommentItem */
  isChildCommentsLoading?: (comment: Comment) => boolean;
  /** раскрытие ветки (запрос догрузки) — проксируется в каждый CommentItem */
  onToggleChildren?: (comment: Comment) => void;
}

/**
 * Дерево комментариев: корневой список + состояния загрузки/ошибки/пусто.
 * Вложенность обеспечивает рекурсивный CommentItem. Компонент кладите на
 * страницу рядом с StoryDetails (он сам не тянет данные и не знает новость).
 */
export function CommentTree({
  rootComments,
  loading = false,
  error = null,
  getChildComments,
  isChildCommentsLoading,
  onToggleChildren,
}: CommentTreeProps) {
  return (
    <div className="hn-container">
      {loading ? (
        <div className={styles.skeletons}>
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} active title paragraph={{ rows: 2 }} />
          ))}
        </div>
      ) : error ? (
        <Alert type="error" showIcon message="Failed to load comments" description={error} />
      ) : rootComments.length === 0 ? (
        <Empty description="No comments yet" className={styles.empty} />
      ) : (
        <ul className={styles.list}>
          {rootComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              getChildComments={getChildComments}
              isChildCommentsLoading={isChildCommentsLoading}
              onToggleChildren={onToggleChildren}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
