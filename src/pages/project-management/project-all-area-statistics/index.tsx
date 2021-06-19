import PageCommonWrap from '@/components/page-common-wrap';
import React from 'react';
import { useState } from 'react';
import TabsWindow from './components/tabs-window';
import TitleWindow from './components/title-window';
import styles from './index.less';

const ProjectAllAreaStatistics: React.FC = () => {
  const [tabsChooseValue, setTabsChooseValue] = useState<string>('1');
  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.projectAllAreaStatistics}>
        <div className={styles.statisticsTop}>
          <div className={styles.processContent}>
            <TabsWindow
              value={tabsChooseValue}
              onChange={setTabsChooseValue}
              tabsArray={[
                { name: '综合进度', value: '1' },
                { name: '项目进度', value: '2' },
              ]}
            ></TabsWindow>
          </div>
          <div className={styles.topOtherContent}>
            <div className={styles.overdueContent}>
              <TitleWindow title="即将逾期"></TitleWindow>
            </div>
            <div className={styles.projectDataContent}>
              <TitleWindow title="实时项目数据"></TitleWindow>
            </div>
          </div>
        </div>
        <div className={styles.statisticsBottom}>
          <div className={styles.projectStatisticsContent}>
            <TitleWindow title="项目统计"></TitleWindow>
          </div>
          <div className={styles.surveyRateContent}>
            <TitleWindow title="勘察率"></TitleWindow>
          </div>
          <div className={styles.projectProcessListContent}>
            <TabsWindow
              value={tabsChooseValue}
              onChange={setTabsChooseValue}
              tabsArray={[
                { name: '综合进度', value: '1' },
                { name: '项目进度', value: '2' },
              ]}
            ></TabsWindow>
          </div>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default ProjectAllAreaStatistics;
