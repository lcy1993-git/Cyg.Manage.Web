import { getVersionUpdate } from '@/services/common';
import { useControllableValue, useRequest } from 'ahooks';
import { version } from '../../../../public/config/request';
import { Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styles from './index.less';
import { useEffect } from 'react';
import uuid from 'node-uuid';
import { serverCodeArray } from '../../../../public/config/request';

interface VersionInfoModalProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
}

const VersionInfoModal: React.FC<VersionInfoModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [nowClickVersion, setNowClickVersion] = useState<string>('');
  const [historyVersionModalVisible, setHistoryVersionModalVisible] = useState<boolean>(false);
  const [historyVersionData, setHistoryVersionData] = useState<any[]>([]);

  const thisHostName = window.location.hostname;
  const serverCode = serverCodeArray[thisHostName];
  console.log(serverCode);

  const { data: versionInfo, run: getVersionInfoEvent } = useRequest(
    () =>
      getVersionUpdate({
        productCode: '1301726010322214912',
        moduleCode: 'ManageWebV2',
        versionNo: version,
        serverCode: serverCode,
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

  //查看历史版本
  const checkHistoryInfo = async (item: any) => {
    setNowClickVersion(item);
    await getVersionUpdate({
      productCode: '1301726010322214912',
      moduleCode: 'ManageWebV2',
      versionNo: item,
      serverCode: serverCode,
    }).then((data) => {
      setHistoryVersionData(data.data.description);
    });
    setHistoryVersionModalVisible(true);
  };

  return (
    <>
      <Modal
        footer=""
        title={`v${nowClickVersion}`}
        visible={historyVersionModalVisible}
        onCancel={() => setHistoryVersionModalVisible(false)}
        width={650}
      >
        <div className={styles.versionItem}>
          <div className={styles.versionItemTitle}>【更新说明】</div>
          <div className={styles.versionItemContent}>
            {historyVersionData ? historyVersionData : '无'}
          </div>
        </div>
      </Modal>
      <Modal
        title="版本功能更新"
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
          <div className={styles.versionItemTitle}>【更新说明】</div>
          <div className={styles.versionItemContent}>{versionInfo?.data.description}</div>
        </div>
        {/* <div className={styles.versionItem}>
        <div className={styles.versionItemTitle}>【体验优化】</div>
        <div className={styles.versionItemContent}>{versionInfo?.roleName}</div>
      </div> */}
        <div className={styles.versionItem}>
          <div className={styles.versionItemTitle}>【历史版本】</div>

          {versionInfo?.data.branchAvailableVersions?.map((item: string) => {
            return (
              <div
                key={uuid.v1()}
                onClick={() => checkHistoryInfo(item)}
                className={styles.historyVersion}
              >
                {item}
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default VersionInfoModal;
