import React from 'react';
import styles from './index.less';
import classNames from 'classnames';
import PageCommonWrap from '@/components/page-common-wrap';
import SideTree from '../components/side-tree';
import MapContainerShell from '../components/map-container-shell';
import Filterbar from '../components/filter-bar';
import { Provider, useContainer } from './mobx-store';
import Timeline from '../components/timeline';
import ListMenu from '../components/list-menu';
import { observer } from 'mobx-react-lite';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

const VisualizationResults: React.FC = observer(() => {
  const store = useContainer();
  const { vState } = store;
  const { visibleLeftSidebar, checkedProjectDateList } = vState;
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
            <SideTree />
          </div>
          <div className={styles.sideTreefooter}>
            <div className={styles.icon} onClick={() => store.setVisibleLeftSidebar()}>
              {visibleLeftSidebar ? <MenuFoldOutlined /> : null}
            </div>
          </div>
        </div>

        <div className={classNames(styles.mapContainer, 'flex1')}>
          <div className={styles.timelineContainer}>
            <div>
              {checkedProjectDateList && checkedProjectDateList.length > 0 ? (
                <Timeline type="normal" height={60} width={400} dates={checkedProjectDateList} />
              ) : null}
            </div>
          </div>

          <div className={styles.listMenuContainer}>
            <ListMenu />
          </div>
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
