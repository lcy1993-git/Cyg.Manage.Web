import CyTip from '@/components/cy-tip';
import { modifyExportPowerState } from '@/services/project-management/all-project';
import { useControllableValue } from 'ahooks';
import { Divider, Form, message, Modal, Radio, TreeSelect } from 'antd';
import React, { Dispatch, useState } from 'react';
import { SetStateAction } from 'react';
import CyFormItem from '@/components/cy-form-item';

// import styles from './index.less';

interface ExportPowerModalParams {
  projectIds: string[];
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  finishEvent: () => void;
}

const AddFavoriteModal: React.FC<ExportPowerModalParams> = (props) => {
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
      <CyTip>您已选中{projectIds.length}个工程，将添加至所选收藏夹。</CyTip>
      <CyFormItem required label="请选择收藏夹">
        <TreeSelect></TreeSelect>
      </CyFormItem>
    </Modal>
  );
};

export default AddFavoriteModal;
