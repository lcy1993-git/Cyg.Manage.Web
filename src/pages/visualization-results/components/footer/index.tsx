import React from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useContainer } from '../../result-page/mobx-store';
import styles from './index.less';
import { observer } from 'mobx-react-lite';
interface Props {
  onlocationClick: () => void;
}

const Divider = () => {
  return <span className={styles.divider}> | </span>;
};

const Footer = observer((props: Props) => {
  const store = useContainer();
  const { vState } = store;
  const { visibleLeftSidebar } = vState;
  const { onlocationClick } = props;

  return (
    <div className={`${styles.footerContainer} flex`}>
      <div className={styles.icon} onClick={() => store.setVisibleLeftSidebar()}>
        {visibleLeftSidebar ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
      </div>
      <div className={'flex1'}></div>
      <div className={styles.mapInfo}>
        <span className={styles.link} onClick={onlocationClick}>
          定位
        </span>
        <Divider />

        <Divider />
        <span>
          经度:
          <span id={'currentPositionX'}></span>
          纬度:
          <span id={'currentPositionY'}></span>
        </span>
        <Divider />
        <span>比例尺:</span>
        <Divider />
        <span id="currentScaleSize"></span>
      </div>
    </div>
  );
});

export default Footer;
