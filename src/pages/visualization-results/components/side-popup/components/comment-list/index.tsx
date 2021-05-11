import { List, Comment, Tooltip, message } from 'antd';
import React, { createRef, FC, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { CommentType, fetchCommentList } from '@/services/visualization-results/side-popup';
import moment from 'moment';
import { useRequest } from 'ahooks';
import { CommentListItemDataType } from '../..';
export interface ReviewListItemDataType {
  author: string;
  content: React.ReactNode;
  datetime: React.ReactNode;
}
export interface CommentListProps {
  projectId?: string;
  layer?: number;
  deviceId?: string;
  height: number;
}

const CommentList: FC<CommentListProps> = (props) => {
  const { projectId, layer, deviceId, height } = props;
  const [commentListData, setCommentListDate] = useState<CommentListItemDataType[]>();
  const scrollbars = createRef<Scrollbars>();
  function generatprCommentListDate(CommentList?: CommentType[]) {
    if (CommentList) {
      return CommentList.map((v) => ({
        author: v.creator,
        content: <p>{v.content}</p>,
        datetime: (
          <Tooltip title={moment().format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(v.createdOn).fromNow()}</span>
          </Tooltip>
        ),
      }));
    } else {
      return [];
    }
  }
  const { data: responseCommentList } = useRequest(
    () => fetchCommentList({ projectId, layer, deviceId }),
    {
      refreshDeps: [deviceId],
      onSuccess: () => {
        setCommentListDate(generatprCommentListDate(responseCommentList));
      },
      onError: () => {
        message.success('获取审阅失败');
      },
    },
  );
  return (
    <>
      <Scrollbars autoHide ref={scrollbars} style={{ marginBottom: 32, height }}>
        <List
          className="comment-list"
          header={`${commentListData?.length}条 审阅内容`}
          itemLayout="horizontal"
          dataSource={commentListData}
          renderItem={(item) => (
            <li>
              <Comment author={item.author} content={item.content} datetime={item.datetime} />
            </li>
          )}
        />
      </Scrollbars>
    </>
  );
};

export default CommentList;
