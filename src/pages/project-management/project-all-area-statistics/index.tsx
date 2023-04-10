import PageCommonWrap from '@/components/page-common-wrap'
import { Tooltip } from 'antd'
import React, { useState } from 'react'
import CompanyAndProjectTable from './components/company-and-project-table'
import ComprehensiveProcessListComponent from './components/comprehensive-process-list-component'
import DailyChangeStatistics from './components/daily-change-statistics'
import DailyChangeProjectStatistics from './components/daily-change-project-statistics'
import OverdueComponent from './components/overdue-component'
import OverdueProjectComponent from './components/overdue-project-component'
import ProjectInfoRefreshList from './components/project-info-refresh-list'
import ProjectInfoRefreshProjectList from './components/project-info-refresh-project-list'
import ProjectProcessListComponent from './components/project-process-list-component'
import ProjectStatisticsComponent from './components/project-statistics-component'
import ProjectStatisticsProjectComponent from './components/project-statistics-project-component'
import TitleWindow from './components/title-window'
import styles from './index.less'
import type { CompanyInfo, DataType } from './store'
import { ProjectAllAreaStatisticsProvider } from './store'
import { QuestionCircleOutlined } from '@ant-design/icons'

const ProjectAllAreaStatistics: React.FC = () => {
  // const [processActiveTab, setProcessActiveTab] = useState<string>('project')
  // const [companyId, setCompanyId] = useState<string | undefined>(undefined)

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    companyName: '',
    companyId: '',
  })

  const [dataType, setDataType] = useState<DataType>('company')
  const [projectShareCompanyId, setProjectShareCompanyId] = useState<string>('')

  // const { data: companySelectData = [] } = useGetSelectData({
  //   url: '/ProjectStatistics/GetCompanys',
  // });

  return (
    <ProjectAllAreaStatisticsProvider
      value={{
        companyInfo,
        projectShareCompanyId,
        setCompanyInfo,
        dataType,
        setDataType,
        setProjectShareCompanyId,
      }}
    >
      <PageCommonWrap noPadding={true}>
        <div className={styles.projectAllAreaStatistics}>
          <div className={styles.statisticsTop}>
            <div className={styles.processContent}>
              {/* <TabsWindow
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
                        options={[{ label: '全部', value: '' }, ...companySelectData]}
                      />
                    </div>
                  )
                }
                tabsArray={[
                  { name: '项目进度', value: 'project' },
                  { name: '综合进度', value: 'comprehensive' },
                ]}
              >
                {processActiveTab === 'project' && (
                  <ProjectProcessComponent companyId={companyId!!} />
                )}
                {processActiveTab === 'comprehensive' && <ComprehensiveProcessComponent />}
              </TabsWindow> */}
              <CompanyAndProjectTable />
            </div>
            <div className={styles.topOtherContent}>
              <div className={styles.overdueContent}>
                <TitleWindow
                  title={() => {
                    return (
                      <div>
                        即将逾期 &nbsp;
                        <Tooltip title="项目结束时间距离当前时间不足3天 则进入即将逾期提醒状态">
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </div>
                    )
                  }}
                >
                  {dataType === 'company' ? <OverdueComponent /> : <OverdueProjectComponent />}
                </TitleWindow>
              </div>
              <div className={styles.projectDataContent}>
                <TitleWindow title="实时项目数据">
                  {dataType === 'company' ? (
                    <ProjectInfoRefreshList />
                  ) : (
                    <ProjectInfoRefreshProjectList />
                  )}
                </TitleWindow>
              </div>
            </div>
          </div>
          <div className={styles.statisticsBottom}>
            <div className={styles.surveyRateContent}>
              <TitleWindow title="项目数">
                {dataType === 'company' ? (
                  <DailyChangeStatistics />
                ) : (
                  <DailyChangeProjectStatistics />
                )}
              </TitleWindow>
            </div>
            <div className={styles.projectStatisticsContent}>
              <TitleWindow title="项目统计">
                {dataType === 'company' ? (
                  <ProjectStatisticsComponent />
                ) : (
                  <ProjectStatisticsProjectComponent />
                )}
              </TitleWindow>
            </div>
            <div className={styles.projectProcessListContent}>
              <TitleWindow title={dataType === 'company' ? '综合进度榜' : '项目进度榜'}>
                {dataType === 'company' ? (
                  <ComprehensiveProcessListComponent />
                ) : (
                  <ProjectProcessListComponent />
                )}
              </TitleWindow>
            </div>
          </div>
        </div>
      </PageCommonWrap>
    </ProjectAllAreaStatisticsProvider>
  )
}

export default ProjectAllAreaStatistics
