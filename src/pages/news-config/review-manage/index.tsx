import React from 'react';
import styles from './index.less';
import classNames from 'classnames';
import PageCommonWrap from '@/components/page-common-wrap';
import SideTree from './components/side-menu';
import Filterbar from './components/filter-bar';
import { Provider, useContainer } from './store';
import { observer } from 'mobx-react-lite';
import ReviewTable from './components/review-table';

const VisualizationResults: React.FC = observer(() => {
  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.container}>
        <Filterbar />
        <main className={classNames(styles.content, 'flex')}>
          <div className={styles.sideTreeContainer}>
            <SideTree />
          </div>

          <div className={classNames(styles.tableContainer, 'flex1')}>
            <ReviewTable />
          </div>
        </main>
      </div>
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
