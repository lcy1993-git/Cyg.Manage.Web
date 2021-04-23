import React, { Profiler } from 'react';
import styles from './index.less';
import Filterbar from '../components/filter-bar';
import classNames from 'classnames';
import PageCommonWrap from '@/components/page-common-wrap';
import SideMenu from '../components/side-menu';
import MapContainerShell from '../components/map-container-shell';
import { Provider, useContainer } from './mobx-store';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import Timeline from '../components/timeline';
import ListMenu from '../components/list-menu';
import { observer } from 'mobx-react-lite';

const VisualizationResults: React.FC = observer(() => {
  const { vState } = useContainer();
  const { visibleLeftSidebar, checkedProjectIdList, observeTrackTimeline, observeTrack } = vState;
  console.log(visibleLeftSidebar);
  
  const callback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
  ) => {};
  return (
    <PageCommonWrap noPadding={true}>
      {/* 顶层filter 筛选项目 */}

      {/* <Filterbar /> */}

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
            <div>
              {checkedProjectIdList && checkedProjectIdList.length > 0 ? (
                <Timeline
                  height={60}
                  width={400}
                  dates={[...new Set(checkedProjectIdList?.map((v: ProjectList) => v.time))]}
                />
              ) : null}
            </div>
            <div style={{ marginTop: '16px' }}>
              {observeTrackTimeline && observeTrack ? (
                <Timeline height={60} width={400} dates={observeTrackTimeline} />
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
