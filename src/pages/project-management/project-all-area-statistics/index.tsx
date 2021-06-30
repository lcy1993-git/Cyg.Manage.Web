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
import ProjectProcessComponent from './components/project-process-component';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';
import ProjectProcessListComponent from './components/project-process-list-component';


const ProjectAllAreaStatistics: React.FC = () => {
  const [processActiveTab, setProcessActiveTab] = useState<string>('project');
  const [processListActiveTab, setProcessListActiveTab] = useState<string>('comprehensive');
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);

  const { data: companySelectData = [] } = useGetSelectData({
    url: '/ProjectStatistics/GetCompanys',
  });

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.projectAllAreaStatistics}>
        <div className={styles.statisticsTop}>
          <div className={styles.processContent}>
            <TabsWindow
              value={processActiveTab}
              onChange={setProcessActiveTab}
              titleCustomSlot={() =>
                processActiveTab === 'project' && (
                  <div style={{ paddingTop: '8px', paddingRight: '10px', width: '180px' }}>
                    <DataSelect
                      style={{ width: '100%' }}
                      value={companyId}
                      allowClear
                      onChange={(value: any) => {
                        setCompanyId(value);
                      }}
                      placeholder="请选择设计院单位"
                      options={[{label: "全部", value: ""},...companySelectData]}
                    />
                  </div>
                )
              }
              tabsArray={[
                { name: '项目进度', value: 'project' },
                { name: '综合进度', value: 'comprehensive' },
              ]}
            >
              {processActiveTab === 'project' && <ProjectProcessComponent companyId={companyId} />}
              {processActiveTab === 'comprehensive' && <ComprehensiveProcessComponent />}
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
              value={processListActiveTab}
              onChange={setProcessListActiveTab}
              tabsArray={[
                { name: '综合进度榜', value: 'comprehensive' },
                { name: '项目进度榜', value: 'project' },
              ]}
            >
              {processListActiveTab === 'comprehensive' && <ComprehensiveProcessListComponent />}
              {processListActiveTab === 'project' && <ProjectProcessListComponent />} 
            </TabsWindow>
          </div>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default ProjectAllAreaStatistics;
