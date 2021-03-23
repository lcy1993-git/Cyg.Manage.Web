import { getVersionUpdate } from '@/services/common';
import { useControllableValue, useRequest } from 'ahooks';
import { versionArray } from '../../../../public/config/request';
import { Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import styles from './index.less';
import { useEffect } from 'react';

interface VersionInfoModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
}

const VersionInfoModal: React.FC<VersionInfoModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const { data: versionInfo, run: getVersionInfoEvent } = useRequest(
    () =>
      getVersionUpdate({
        productCode: '1301726010322214912',
        moduleCode: 'ManageWebV2',
        versionNo: '1.0.21',
      }),
    {
      manual: true,
    },
  );

  useEffect(() => {
    if (state) {
      getVersionInfoEvent();
    }
  }, [state]);

  return (
    <Modal
      title="版本功能更新"
      bodyStyle={{ height: '450px', overflowY: 'auto' }}
      width={820}
      visible={state as boolean}
      footer=""
      onCancel={() => setState(false)}
    >
      {/* <div className={styles.versionItem}>
        <div className={styles.versionItemTitle}>【新增功能】</div>
        <div className={styles.versionItemContent}>{versionInfo?.description}</div>
      </div> */}
      <div className={styles.versionItem}>
        <div className={styles.versionItemTitle}>【修复问题】</div>
        <div className={styles.versionItemContent}>{versionInfo?.data.description}</div>
      </div>
      {/* <div className={styles.versionItem}>
        <div className={styles.versionItemTitle}>【体验优化】</div>
        <div className={styles.versionItemContent}>{versionInfo?.roleName}</div>
      </div> */}
      {/* <div className={styles.versionItem}>
        <div className={styles.versionItemTitle}>【历史版本】</div>
        <div className={styles.versionItemContent}>{versionArray}</div>
      </div> */}
    </Modal>
  );
};

export default VersionInfoModal;
