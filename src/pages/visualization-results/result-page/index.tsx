import React from 'react';
import styles from './index.less';
import classNames from 'classnames';
import PageCommonWrap from '@/components/page-common-wrap';
import SideTree from '../components/side-tree';
import MapContainerShell from '../components/map-container-shell';
import Filterbar from '../components/filter-bar';
import { Provider, useContainer } from './mobx-store';
import { observer } from 'mobx-react-lite';
import { MenuFoldOutlined } from '@ant-design/icons';

const VisualizationResults: React.FC = observer(() => {
  const store = useContainer();
  const { vState } = store;
  const { visibleLeftSidebar } = vState;
  return (
    <PageCommonWrap noPadding={true}>
      <Filterbar />
      <main
        className={classNames(
          styles.content,
          'flex',
          styles.sideNavShow,
          visibleLeftSidebar ? '' : styles.sideNavHide,
        )}
      >
        <div className={styles.sideTreeContainer}>
          <div className={styles.sideNav}>
            <SideTree selectCityId="510000"/>
          </div>
          <div className={styles.sideTreefooter}>
            <div className={styles.icon} onClick={() => store.setVisibleLeftSidebar()}>
              {visibleLeftSidebar ? <MenuFoldOutlined style={{ fontSize: 16 }} /> : null}
            </div>
          </div>
        </div>

        <div className={classNames(styles.mapContainer, 'flex1')}>
          <MapContainerShell />
        </div>
      </main>
    </PageCommonWrap>
  );
});

const StoreProvider: React.FC = () => {
  return (
    <Provider>
      <VisualizationResults />
    </Provider>
  );
};

export default StoreProvider;
