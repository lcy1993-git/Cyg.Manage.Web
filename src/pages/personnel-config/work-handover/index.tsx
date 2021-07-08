import React, { useState } from 'react';
import qs from 'qs';
import { Button, Tabs } from 'antd';
import styles from './index.less';
import PageCommonWrap from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';

import { useMount, useUnmount } from 'ahooks';
import { useLayoutStore } from '@/layouts/context';
import Description from './components/description';

const { TabPane } = Tabs;

const WorkHandover: React.FC = () => {
  const userId = qs.parse(window.location.href.split('?')[1]).id as string;
  const name = qs.parse(window.location.href.split('?')[1]).name as string;
  const [clickTabKey, setClickTabKey] = useState<string>('manage');

  const { setWorkHandoverFlag } = useLayoutStore();

  useMount(() => {
    setWorkHandoverFlag?.(true);
  });

  useUnmount(() => {
    setWorkHandoverFlag?.(false);
    //   window.localStorage.setItem('manageId', '');
  });

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.handover}>
        <div className={styles.moduleTitle}>
          <CommonTitle>工作交接-{name}</CommonTitle>
        </div>
        <div className={styles.moduleHead}>
          <div className={styles.tabTitle}>待交接的方案</div>
          <div className={styles.moduleTabs}>
            <Tabs type="card" onChange={(key) => setClickTabKey(key)}>
              <TabPane tab="项目管理" key={'manage'}>
                1
              </TabPane>
              <TabPane tab="作业任务" key={'mission'}>
                2
              </TabPane>
              <TabPane tab="部组身份" key={'identity'}>
                3
              </TabPane>
              <TabPane tab="其他" key="others">
                <Description />
              </TabPane>
            </Tabs>
          </div>
        </div>
        <div className={styles.actionBtn}>
          <Button type="primary">
            {clickTabKey === 'manage' ? (
              <span>交接</span>
            ) : clickTabKey === 'mission' ? (
              <span>交接</span>
            ) : clickTabKey === 'identity' ? (
              <span>交接</span>
            ) : (
              <span>交接完成</span>
            )}
          </Button>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default WorkHandover;
