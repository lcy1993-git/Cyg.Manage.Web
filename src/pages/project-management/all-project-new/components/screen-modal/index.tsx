import React, { Dispatch, SetStateAction } from 'react';
import { useControllableValue } from 'ahooks';

import { Button, Modal, Form } from 'antd';
import { useGetProjectEnum } from '@/utils/hooks';

interface ScreenModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent?: () => void;
  searchParams?: any;
}

const ScreenModal: React.FC<ScreenModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const searchEvent = () => {};

  const resetEvent = () => {};

  const closeEvent = () => {
    setState(false)
  };

  const {
    projectCategory,
    projectClassification,
    projectNature,
    projectConstructType,
    projectStage,
    projectKvLevel,
  } = useGetProjectEnum();

  return (
    <Modal
      maskClosable={false}
      title="筛选条件"
      centered
      width={780}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => resetEvent()}>
          重置
        </Button>,
        <Button key="save" type="primary" onClick={() => searchEvent()}>
          确定
        </Button>,
      ]}
      onCancel={() => closeEvent()}
    >
      <Form preserve={false}>

      </Form>
    </Modal>
  );
};

export default ScreenModal;
