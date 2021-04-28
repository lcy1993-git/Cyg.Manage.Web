import React, { FC } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import styles from './index.less';
import Filterbar from './components/filter-bar';
import SideMenu from './components/side-menu';
import classnames from 'classnames';
import { Provider, useContainer } from './store';

import ReviewTable from './components/review-table';
import { observer } from 'mobx-react-lite';

interface ReviewProps {}

const ReviewManage: FC<ReviewProps> = observer(() => {
  return (
    <PageCommonWrap noPadding>
      <div className={styles.main}>
        <Filterbar />

        <main className={classnames('flex', styles.main)}>
          <div className={styles.sidemenuContainer}>
            <SideMenu />
          </div>

          <div className={styles.reviewTableContainer}>
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
      <ReviewManage />
    </Provider>
  );
};

export default StoreProvider;
