import { Tooltip } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import surveyTrackPng from '@/assets/icon-image/survey-track.png';
import surveyTrackLightPng from '@/assets/icon-image/survey-track-light.png';
import { useContainer } from '../../result-page/mobx-store';
import classNames from 'classnames';
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
        <div className={classNames(styles.icon, observeTrack ? styles.active : "")} onClick={() => store.toggleObserveTrack(!observeTrack)}>
          <img className={styles.surveyTrackImg} src={ observeTrack ? surveyTrackLightPng : surveyTrackPng } alt="" />
        </div>
      </Tooltip>
      <Tooltip placement="left" title="定位至已选项目">
        <div className={styles.icon} onClick={onCilickPositionMap}><AimOutlined /></div>
      </Tooltip>
    </div>
  );
}

export default SurveyTrack;