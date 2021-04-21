import React from 'react';
import {MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import { useContainer } from '../../result-page/store';
import styles from './index.less';

interface Props {
  onlocationClick: ()=> void;
  scaleSize: string;
  onSatelliteMapClick: ()=> void;
  onStreetMapClick: ()=> void;
}
 
const Divider = () => {
  return (
    <span className={styles.divider}> | </span>
  )
};

const Footer= (props: Props) => {
  const { vState, setVisibleLeftSidebar } = useContainer();
  const { visibleLeftSidebar } = vState;
  const {scaleSize, onSatelliteMapClick, onStreetMapClick, onlocationClick } = props;

  return (
    <div className={`${styles.footerContainer} flex`}>
      <div className={styles.icon} onClick={setVisibleLeftSidebar}>
        {visibleLeftSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </div>
      <div className={"flex1"}></div>
      <div className={styles.mapInfo}>
        <span className={styles.link} onClick={onlocationClick}>定位</span><Divider />
        <span className={styles.link} onClick={onStreetMapClick}>街道图</span><Divider />
        <span className={styles.link} onClick={onSatelliteMapClick}>卫星图</span><Divider />
        <span>经度:
          <span id={"currentPositionX"}></span>
           纬度:
           <span id={"currentPositionY"}></span>
        </span><Divider />
        <span>比例尺:</span><Divider />
        <span id="currentScaleSize">{scaleSize}</span>
      </div>
    </div>
  );
};

export default Footer;
