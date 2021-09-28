import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import { isArray } from 'lodash';
import React from 'react';

interface ModalConfirmProps {
  title: string;
  content: string;
  // setState: Dispatch<SetStateAction<boolean>>;
  changeEvent: () => void;
  selectData?: any[];
}

const ModalConfirm: React.FC<ModalConfirmProps> = (props) => {
  const { title = '删除', content = '确定删除选中项吗？', changeEvent, selectData } = props;

  const confirmEvent = () => {
    if (selectData && isArray(selectData) && selectData.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: '确认',
      cancelText: '取消',
      onOk: changeEvent,
    });
  };

  return (
    <>
      <Button className="mr7" onClick={() => confirmEvent()}>
        <DeleteOutlined />
        删除
      </Button>
    </>
  );
};

export default ModalConfirm;
