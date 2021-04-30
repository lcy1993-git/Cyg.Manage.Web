import React, { Profiler } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import PageCommonWrap from '@/components/page-common-wrap';
import SideMenu from '../components/side-menu';
import MapContainerShell from '../components/map-container-shell';
import { Provider, useContainer } from './mobx-store';
import Timeline from '../components/timeline';
import ListMenu from '../components/list-menu';
import { observer } from 'mobx-react-lite';

const VisualizationResults: React.FC = observer(() => {
  const { vState } = useContainer();
  const { visibleLeftSidebar, observeTrackTimeline, observeTrack, checkedProjectDateList } = vState;

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
      <main
        className={classNames(
          styles.content,
          'flex',
          visibleLeftSidebar ? styles.sideNavShow : styles.sideNavHide,
        )}
      >
        <div className={styles.sideNav}>
          <SideMenu />
        </div>

        <div className={classNames(styles.mapContainer, 'flex1')}>
          <div className={styles.timelineContainer}>
            <div>
              {checkedProjectDateList && checkedProjectDateList.length > 0 ? (
                <Timeline type="normal" height={60} width={400} dates={checkedProjectDateList} />
              ) : null}
            </div>
          </div>
          <div className={styles.observeTimelineContainer}>
            <div style={{ marginTop: '16px' }}>
              {observeTrackTimeline && observeTrackTimeline.length > 0 && observeTrack ? (
                <Timeline type="observe" height={60} width={400} dates={observeTrackTimeline} />
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
