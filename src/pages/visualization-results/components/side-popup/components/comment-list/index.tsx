import { List, Comment, Tooltip, message, Spin } from 'antd';
import React, { createRef, FC, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { CommentType, fetchCommentList } from '@/services/visualization-results/side-popup';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { CommentListItemDataType } from '../..';
import styles from './index.less';
export interface ReviewListItemDataType {
  author: string;
  content: React.ReactNode;
  datetime: React.ReactNode;
}
export interface CommentListProps {
  height: number;
  loading?: boolean;
  commentList?: CommentType[];
}

const CommentList: FC<CommentListProps> = (props) => {
  const { height, commentList = [], loading = true } = props;

  const scrollbars = createRef<Scrollbars>();
  const generatprCommentListData = commentList.map((v) => ({
    author: v.creator,
    content: <p>{v.content}</p>,
    datetime: (
      <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
        <span>{moment(v.createdOn).fromNow()}</span>
      </Tooltip>
    ),
  }));

  return (
    <Scrollbars autoHide ref={scrollbars} style={{ marginBottom: 32, height }}>
      {loading ? (
        <Spin spinning={loading} className={styles.loading} tip="正在载入中..."></Spin>
      ) : (
        <List
          className="comment-list"
          header={`${CommentList?.length}条 审阅内容`}
          itemLayout="horizontal"
          dataSource={generatprCommentListData}
          renderItem={(item) => (
            <li>
              <Comment author={item.author} content={item.content} datetime={item.datetime} />
            </li>
          )}
        />
      )}
    </Scrollbars>
  );
};

export default CommentList;
