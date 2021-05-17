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
  commentList?: CommentType[];
}

const CommentList: FC<CommentListProps> = (props) => {
  const { height, commentList = [], loading = true, isDelete = false } = props;
  console.log(commentList.length);

  const scrollbars = createRef<Scrollbars>();
  const generatprCommentListData = commentList.map((v) => ({
    author: <>由 {v.creator} </>,
    content: <p>{v.content}</p>,
    datetime: (
      <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment(v.createdOn).fromNow()} 添加</span>
      </Tooltip>
    ),
  }));

  return (
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
            header={`${commentList?.length}条 审阅内容`}
            itemLayout="horizontal"
            dataSource={generatprCommentListData}
            renderItem={(item) => (
              <li>
                <Comment author={item.author} content={item.content} datetime={item.datetime} />
              </li>
            )}
          />
        </>
      )}
    </Scrollbars>
  );
};

export default CommentList;
