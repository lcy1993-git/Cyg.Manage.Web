import React from 'react';
import { Tabs } from 'antd';
import styles from './index.less';

const { TabPane } = Tabs;
const MissionTab: React.FC = () => {
  return (
    <div className={styles.missionTabs}>
      <Tabs className="normalTabs noMargin">
        <TabPane tab="勘察任务" key="prospect">
          11
        </TabPane>
        <TabPane tab="设计任务" key="design">
          22
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MissionTab;
