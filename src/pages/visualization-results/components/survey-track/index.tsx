import React from 'react';
import { Tooltip } from 'antd';
import {NodeIndexOutlined, AimOutlined} from '@ant-design/icons';
import { useContainer } from '../../result-page/mobx-store';
import styles from './index.less';

const SurveyTrack = () => {

  const store = useContainer();
  const { vState } = store;
  const { observeTrack } = vState;

  const onCilickPositionMap = () => {
    store.togglePositionMap();
    store.setOnPositionClickState();
  };

  return (
    <div className={styles.surveyTrackWrap}>
      <Tooltip placement="left" title={observeTrack ? '关闭勘察轨迹' : '打开勘察轨迹'}>
        <div className={`${styles.icon} ${observeTrack ? styles.active : ""}`} onClick={() => store.toggleObserveTrack(!observeTrack)}><NodeIndexOutlined /></div>
      </Tooltip>
      <Tooltip placement="left" title="项目定位">
        <div className={styles.icon} onClick={onCilickPositionMap}><AimOutlined /></div>
      </Tooltip>

    </div>
  );
}

export default SurveyTrack;