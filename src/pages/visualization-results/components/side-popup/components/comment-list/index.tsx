import { List, Comment } from 'antd';
import React, { createRef, FC } from 'react';
import Scrollbars from 'react-custom-scrollbars';
export interface ReviewListItemDataType {
  author: string;
  content: React.ReactNode;
  datetime: React.ReactNode;
}
export interface CommentListProps {
  commentListData?: ReviewListItemDataType[];
}

const CommentList: FC<CommentListProps> = (props) => {
  const { commentListData } = props;
  const scrollbars = createRef<Scrollbars>();
  return (
    <>
      <Scrollbars autoHide ref={scrollbars} style={{ marginBottom: 32, height: 300 }}>
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
