import CyTip from '@/components/cy-tip';
import { modifyExportPowerState } from '@/services/project-management/all-project';
import { useControllableValue } from 'ahooks';
import { Divider, Form, message, Modal, Radio } from 'antd';
import React, { Dispatch, useState } from 'react';
import { SetStateAction } from 'react';

// import styles from './index.less';

interface AuditKnotParams {
  projectIds: string[];
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent: () => void;
}

const AuditKnotModal: React.FC<AuditKnotParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [powerStatus, setPowerStatus] = useState<boolean>(true);

  const { projectIds, finishEvent } = props;

  const modifyPowerStatus = async () => {
    await modifyExportPowerState({
      isEnable: powerStatus,
      projectIds: projectIds,
    });
    message.success('操作成功');
    setState(false);
    finishEvent?.();
  };

  return (
    <Modal
      maskClosable={false}
      title="结项审批"
      width={755}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => modifyPowerStatus()}
      cancelText="取消"
      okText="确认"
      bodyStyle={{ height: 120, padding: 0 }}
    >
      <CyTip>该项目已申请结项，请选择执行以下操作：</CyTip>
      <Divider>
        <Radio.Group onChange={(e) => setPowerStatus(e.target.value)} value={powerStatus}>
          <Radio value={true}>启用</Radio>
          <Radio value={false}>禁用</Radio>
        </Radio.Group>
      </Divider>
    </Modal>
  );
};

export default AuditKnotModal;
