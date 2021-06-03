import React, { FC } from 'react';
import { Modal } from 'antd';
export interface ExportMapPositionModalProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ExportMapPositionModal: FC<ExportMapPositionModalProps> = (props) => {
  const { visible, onOk, onCancel } = props;
  
  return (
    <Modal
      title="导出项目坐标"
      centered
      destroyOnClose
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
    >
      确认导出所选项目的点坐标
    </Modal>
  );
};

export default ExportMapPositionModal;
