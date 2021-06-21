import PageCommonWrap from '@/components/page-common-wrap';
import ProjectInfoRefreshList from './components/project-info-refresh-list';
import React from 'react';
import { useState } from 'react';
import OverdueComponent from './components/overdue-component';
import ProjectStatisticsCompoent from './components/project-statistics-component';
import SurveyRateComponent from './components/survey-rate-component';
import TabsWindow from './components/tabs-window';
import TitleWindow from './components/title-window';
import styles from './index.less';
import ComprehensiveProcessListComponent from './components/comprehensive-process-list-component';
import ComprehensiveProcessComponent from './components/comprehensive-process-component';

const ProjectAllAreaStatistics: React.FC = () => {
  const [tabsChooseValue, setTabsChooseValue] = useState<string>('1');

  const [processActiveTab, setProcessActiveTab] = useState<string>('project')

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.projectAllAreaStatistics}>
        <div className={styles.statisticsTop}>
          <div className={styles.processContent}>
            <TabsWindow
              value={processActiveTab}
              onChange={setProcessActiveTab}
              tabsArray={[
                { name: '项目进度', value: 'project' },
                { name: '综合进度', value: 'comprehensive' },
              ]}
            >
              
              {
                processActiveTab === 'comprehensive' &&
                <ComprehensiveProcessComponent />
              }
              
            </TabsWindow>
          </div>
          <div className={styles.topOtherContent}>
            <div className={styles.overdueContent}>
              <TitleWindow title="即将逾期">
                <OverdueComponent />
              </TitleWindow>
            </div>
            <div className={styles.projectDataContent}>
              <TitleWindow title="实时项目数据">
                <ProjectInfoRefreshList />
              </TitleWindow>
            </div>
          </div>
        </div>
        <div className={styles.statisticsBottom}>
          <div className={styles.projectStatisticsContent}>
            <TitleWindow title="项目统计">
              <ProjectStatisticsCompoent />
            </TitleWindow>
          </div>
          <div className={styles.surveyRateContent}>
            <TitleWindow title="勘察率">
              <SurveyRateComponent />
            </TitleWindow>
          </div>
          <div className={styles.projectProcessListContent}>
            <TabsWindow
              value={tabsChooseValue}
              onChange={setTabsChooseValue}
              tabsArray={[
                { name: '综合进度', value: '1' },
                { name: '项目进度', value: '2' },
              ]}
            >
              <ComprehensiveProcessListComponent />
            </TabsWindow>
          </div>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default ProjectAllAreaStatistics;
