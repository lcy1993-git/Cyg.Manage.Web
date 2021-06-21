import CyTip from '@/components/cy-tip';
import { modifyExportPowerState } from '@/services/project-management/all-project';
import { useControllableValue } from 'ahooks';
import { Divider, Form, message, Modal, Radio } from 'antd';
import React, { Dispatch, useState } from 'react';
import { SetStateAction } from 'react';

// import styles from './index.less';

interface ExportPowerModalModalProps {
  projectIds: string[];
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent: () => void;
}

const ExportPowerModal: React.FC<ExportPowerModalModalProps> = (props) => {
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
      title="导出坐标权限设置"
      width={755}
      visible={state as boolean}
      destroyOnClose
      onCancel={() => setState(false)}
      onOk={() => modifyPowerStatus()}
      cancelText="取消"
      okText="确认"
      bodyStyle={{ height: 120, padding: 0 }}
    >
      <CyTip>
        通过启用/禁用此条目可以赋予/取消设计端导出该项目坐标的权限; 当前已选择{projectIds.length}
        个项目，请确认启用/禁用设计端导出坐标的权限。
      </CyTip>
      <Divider>
        <Radio.Group onChange={(e) => setPowerStatus(e.target.value)} value={powerStatus}>
          <Radio value={true}>启用</Radio>
          <Radio value={false}>禁用</Radio>
        </Radio.Group>
      </Divider>
    </Modal>
  );
};

export default ExportPowerModal;
