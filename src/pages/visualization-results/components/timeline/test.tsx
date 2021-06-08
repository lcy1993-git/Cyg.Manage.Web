import React, { FC } from 'react';
import {  Modal } from 'antd';
export interface TestModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
 
}

const TestModal: FC<TestModalProps> = (props) => {
  const { visible, onOk, onCancel } = props;

  return (
    <Modal
      title="TestModal"
      centered
      destroyOnClose
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
     Hello TestModal
    </Modal>
  );
};

export default TestModal;
