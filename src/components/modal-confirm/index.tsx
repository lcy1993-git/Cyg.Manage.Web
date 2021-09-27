import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface ModalConfirmProps {
  title: string;
  content: string;
  isConfirm: boolean;
  setState: Dispatch<SetStateAction<boolean>>;
  changeEvent: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = (props) => {
  const {
    title = '删除',
    content = '确定删除选中项吗？',
    isConfirm,
    changeEvent,
    setState,
  } = props;

  console.log(isConfirm);

  if (isConfirm) {
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: '确认',
      cancelText: '取消',
      onCancel: () => setState(false),
      onOk: changeEvent,
    });
  }

  return <></>;
};

export default ModalConfirm;
