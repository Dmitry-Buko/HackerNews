import { Button, Divider, Space, Tooltip, Typography } from 'antd';
import { ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Story } from '../../types/hn';
import {
  formatCommentsCount,
  formatFullDate,
  formatRelativeTime,
  formatScore,
} from '../../utils/format';
import { AppHeader } from '../common/AppHeader';
import styles from './StoryDetails.module.css';

interface StoryDetailsProps {
  story: Story;
  /** состояние загрузки комментариев — крутит кнопку обновления в шапке */
  commentsLoading?: boolean;
  /** перезагрузить новость и комментарии */
  onRefreshComments?: () => void;
  /** возврат к списку новостей (navigate('/') или navigate(-1)) */
  onBack?: () => void;
}

export function StoryDetails({
  story,
  commentsLoading = false,
  onRefreshComments,
  onBack,
}: StoryDetailsProps) {
  return (
    <>
      <AppHeader
        actions={
          <Tooltip title="Refresh comments">
            <Button
              type="text"
              shape="circle"
              aria-label="Refresh comments"
              icon={<ReloadOutlined spin={commentsLoading} />}
              onClick={onRefreshComments}
            />
          </Tooltip>
        }
      />

      <div className="hn-container">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className={styles.back}
        >
          Back to news list
        </Button>

        <Typography.Title level={2} className={styles.title}>
          {story.url ? (
            <Typography.Link href={story.url} target="_blank" rel="noreferrer">
              {story.title} ↗
            </Typography.Link>
          ) : (
            story.title
          )}
        </Typography.Title>

        <Space size="middle" wrap className={styles.meta}>
          <Typography.Text type="secondary">{story.by}</Typography.Text>
          <Typography.Text type="secondary">
            <Tooltip title={formatFullDate(story.time)}>
              {formatRelativeTime(story.time)}
            </Tooltip>
          </Typography.Text>
          <Typography.Text type="secondary">▲ {formatScore(story.score)}</Typography.Text>
        </Space>

        <Divider className={styles.divider} />

        <Typography.Title level={4} className={styles.commentsTitle}>
          {formatCommentsCount(story.descendants)}
        </Typography.Title>
      </div>
    </>
  );
}
