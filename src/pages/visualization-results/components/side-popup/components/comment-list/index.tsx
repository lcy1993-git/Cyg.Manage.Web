import { List, Comment, Tooltip, Spin, Alert } from 'antd';
import React, { createRef, FC } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { CommentType } from '@/services/visualization-results/side-popup';
import moment from 'moment';
import styles from './index.less';
export interface ReviewListItemDataType {
  author: string;
  content: React.ReactNode;
  datetime: React.ReactNode;
}
export interface CommentListProps {
  height: number;
  loading?: boolean;
  isDelete?: boolean;
  horizontal?: boolean; //标题是否和类容水平显示
  commentList?: CommentType[];
}

const CommentList: FC<CommentListProps> = (props) => {
  const { height, commentList = [], loading = true, isDelete = false, horizontal = false } = props;

  const scrollbars = createRef<Scrollbars>();
  const generatprCommentListData = commentList.map((v, idx) => ({
    author: (
      <>
        {idx + 1}. 由 {v.creator}{' '}
      </>
    ),
    content: <p>{v.content}</p>,
    datetime: (
      <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment(v.createdOn).fromNow()} 添加</span>
      </Tooltip>
    ),
  }));

  return (
    <div className="flex">
      {horizontal ? <div style={{ width: '8%', paddingTop: 16 }}>审阅内容 </div> : null}

      <Scrollbars autoHide ref={scrollbars} style={{ marginBottom: 32, height }}>
        {loading ? (
          <Spin spinning={loading} className={styles.loading} tip="正在载入中..."></Spin>
        ) : (
          <>
            {isDelete ? (
              <Alert closable message="该点位已被删除，以下数据仅作为历史记录" type="error" />
            ) : null}

            <List
              className="comment-list"
              itemLayout="horizontal"
              header={!horizontal ? `${commentList?.length}条 审阅内容` : null}
              dataSource={generatprCommentListData}
              renderItem={(item, idx) => (
                <li>
                  <Comment author={item.author} content={item.content} datetime={item.datetime} />
                </li>
              )}
            />
          </>
        )}
      </Scrollbars>
    </div>
  );
};

export default CommentList;
