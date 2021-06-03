import React, { FC } from 'react';
import { Modal } from 'antd';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import CommentTable from '../comment-table';
export interface CommentModalProps {
  visible?: boolean;
  onOk: () => void;
  onCancel: () => void;
  checkedProjectIdList: ProjectList[];
}

const CommentModal: FC<CommentModalProps> = (props) => {
  const { checkedProjectIdList, visible, onOk, onCancel } = props;

  return (
    <Modal
      title="审阅列表"
      centered
      destroyOnClose
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={1500}
    >
      {checkedProjectIdList.length > 0 ? (
        <CommentTable
          projectId={checkedProjectIdList[0].id}
          engineerId={checkedProjectIdList[0].engineerId}
        />
      ) : null}
    </Modal>
  );
};

export default CommentModal;
