import React, { useMemo, useState } from 'react';
import styles from './index.less';
import Filterbar from '../components/filter-bar';
import classNames from 'classnames';
import PageCommonWrap from '@/components/page-common-wrap';
import SideMenu from '../components/side-menu';
import MapContainerShell from '../components/map-container-shell';
import SidePopup from '../components/side-popup';
import { Provider, useContainer, VisualizationResultsStateType } from './store';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import ProjectDetailModal from '../components/project-detail-modal';
import Timeline from '../components/timeline';
import ListMenu from '../components/list-menu';

interface StoreProps {
  initialState: VisualizationResultsStateType;
}

const VisualizationResults: React.FC = () => {
  const { vState, togglePropertySidePopup } = useContainer();
  const { propertySidePopupShow, visibleLeftSidebar, checkedProjectIdList } = vState;

  return (
    <PageCommonWrap noPadding={true}>
      {/* 顶层filter 筛选项目 */}

      <Filterbar />

      <main
        className={classNames(
          styles.content,
          'flex',
          visibleLeftSidebar ? styles.sideNavShow : styles.sideNavHide,
        )}
      >
        {/* 侧边树形结构 */}

        <div className={styles.sideNav}>
          <SideMenu />
        </div>

        {/* map放在这 */}
        <div className={classNames(styles.mapContainer, 'flex1')}>
          <div className={styles.tilelineContainer}>
            {checkedProjectIdList && checkedProjectIdList.length > 0 ? (
              <Timeline
                height={60}
                width={400}
                // dates={}
              />
            ) : null}
          </div>
          <div className={styles.listMenuContainer}>
            <ListMenu />
          </div>
          <MapContainerShell />
        </div>
      </main>

      <SidePopup visible={false} onClose={() => togglePropertySidePopup()} />
    </PageCommonWrap>
  );
};

const StoreProvider: React.FC<StoreProps> = () => {
  return (
    <Provider>
      <VisualizationResults />
    </Provider>
  );
};

export default StoreProvider;
