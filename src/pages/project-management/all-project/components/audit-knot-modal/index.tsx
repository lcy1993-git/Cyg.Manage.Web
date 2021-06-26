import CyTip from '@/components/cy-tip';
import { auditKnot } from '@/services/project-management/all-project';
import { useControllableValue } from 'ahooks';
import { message, Modal, Radio } from 'antd';
import React, { Dispatch, useState } from 'react';
import { SetStateAction } from 'react';
import styles from './index.less';

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

  const auditKnotEvent = async () => {
    await auditKnot(powerStatus, projectIds);
    message.success('操作成功');
    setState(false);
    finishEvent?.();
  };

  return (
    <Modal
      maskClosable={false}
      title="结项审批"
      width="500px"
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => auditKnotEvent()}
      cancelText="取消"
      okText="确认"
      bodyStyle={{ height: 150, padding: 0 }}
    >
      <CyTip>该项目已申请结项，请选择执行以下操作：</CyTip>
      <Radio.Group onChange={(e) => setPowerStatus(e.target.value)} value={powerStatus}>
        <div className={styles.auditKnot}>
          <Radio value={true}>结项通过</Radio>
          <div className={styles.noAuditKnot}>
            <Radio value={false}>结项退回</Radio>
          </div>
        </div>
      </Radio.Group>
    </Modal>
  );
};

export default AuditKnotModal;
