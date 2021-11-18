import CommonTitle from '@/components/common-title';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import React, { useState } from 'react';
import AllStatistics from './components/all-project-statistics';
import SingleStatistics from './components/all-project-statistics';
import { Button, Input, Spin, Tooltip, message, Menu, Modal, Tabs } from 'antd';
import styles from './index.less';
import EngineerTable from './components/engineer-table';
import { useRef } from 'react';
import { useLayoutStore } from '@/layouts/context';
import { useEffect } from 'react';
import ScreenModal from './components/screen-modal';
import AddEngineerModal from './components/add-engineer-modal';
import { Dropdown } from 'antd';
import {
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { TableItemCheckedInfo } from './components/engineer-table/engineer-table-item';
import {
  applyKnot,
  canEditArrange,
  checkCanArrange,
  deleteProject,
  getColumnsConfig,
  getProjectInfo,
  revokeAllot,
  revokeKnot,
} from '@/services/project-management/all-project';
import TableExportButton from '@/components/table-export-button';
import UploadAddProjectModal from './components/upload-batch-modal';
import ArrangeModal from './components/arrange-modal';
import EditArrangeModal from './components/edit-arrange-modal';
import EditExternalArrangeForm from './components/edit-external-modal';
import ExternalArrangeForm from './components/external-arrange-modal';
import ShareModal from './components/share-modal';
import ProjectRecallModal from './components/project-recall-modal';
import ExportPowerModal from './components/export-power-modal';
import AuditKnotModal from './components/audit-knot-modal';
import { useMount, useRequest, useUpdateEffect } from 'ahooks';
import AddFavoriteModal from './components/add-favorite-modal';
import FavoriteList from './components/favorite-list';
import { removeCollectionEngineers } from '@/services/project-management/favorite-list';
import { useMemo } from 'react';

const { Search } = Input;
const { TabPane } = Tabs;

const statisticsObject = {
  '-1': '全部项目',
  '1': '待处理项目',
  '2': '进行中的项目',
  '3': '委托的项目',
  '4': '被共享的项目',
};

const defaultParams = {
  category: [],
  stage: [],
  constructType: [],
  nature: [],
  kvLevel: [],
  status: [],
  majorCategory: [],
  pType: [],
  reformAim: [],
  classification: [],
  attribute: [],
  sourceType: [],
  identityType: [],
  areaType: '-1',
  areaId: '',
  dataSourceType: [],
  logicRelation: 2,
  startTime: '',
  endTime: '',
  designUser: '',
  surveyUser: '',
};

const AllProject: React.FC = () => {
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray();
  const [currentClickTab, setCurrentClickTab] = useState<string>('1');
  const [addEngineerModalVisible, setAddEngineerModalVisible] = useState(false);
  const [batchAddEngineerModalVisible, setBatchAddEngineerModalVisible] = useState(false);

  const addEngineerEvent = () => {
    setAddEngineerModalVisible(true);
  };

  const batchAddEngineerEvent = () => {
    setBatchAddEngineerModalVisible(true);
  };
  const addEngineerMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-project-approval') && (
        <Menu.Item onClick={() => addEngineerEvent()}>立项</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-batch-project') && (
        <Menu.Item onClick={() => batchAddEngineerEvent()}>批量立项</Menu.Item>
      )}
    </Menu>
  );

  return (
    <>
      <PageCommonWrap noPadding={true} noColor={true}>
        <div className={styles.allProjectPage}>
          <div className={styles.allProjectCheckTab}>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('1')}
            >
              <SingleStatistics
                label="我的项目"
                icon="allpro"
                clickTab={currentClickTab === '1' ? '1' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('2')}
            >
              <SingleStatistics
                label="立项审批"
                icon="approval"
                clickTab={currentClickTab === '2' ? '2' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('3')}
            >
              <SingleStatistics
                label="任务安排"
                icon="mission"
                clickTab={currentClickTab === '3' ? '3' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('4')}
            >
              <SingleStatistics
                label="评审管理"
                icon="review"
                clickTab={currentClickTab === '4' ? '4' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div
              className={styles.projectManagementStatisticItem}
              onClick={() => setCurrentClickTab('5')}
            >
              <SingleStatistics
                label="结项管理"
                icon="finish"
                clickTab={currentClickTab === '5' ? '5' : ''}
              >
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
          </div>
          {/* <div style={{ background: 'white' }}>111</div> */}
          <div className={styles.allProjectContent}>
            {currentClickTab === '1' && (
              <div className={styles.myProjectList}>
                <Tabs>
                  <TabPane tab="我的项目" key="mypro">
                    111
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '2' && (
              <div className={styles.projectApprovalList}>
                <Tabs>
                  <TabPane tab="立项待审批" key="awaitApproval">
                    111
                  </TabPane>
                  <TabPane tab="立项审批中" key="inApproval">
                    111
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '3' && (
              <div className={styles.taskArrangeList}>
                <Tabs>
                  <TabPane tab="待安排" key="toArrange">
                    111
                  </TabPane>
                  <TabPane tab="待安排评审" key="toReview">
                    111
                  </TabPane>
                  <TabPane tab="公司待办" key="todo">
                    111
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '4' && (
              <div className={styles.reviewManageList}>
                <Tabs>
                  <TabPane tab="外审中" key="outAudit">
                    222
                  </TabPane>
                </Tabs>
              </div>
            )}
            {currentClickTab === '5' && (
              <div className={styles.finishProjectList}>
                <Tabs>
                  <TabPane tab="待结项" key="awaitFinish">
                    222
                  </TabPane>
                  <TabPane tab="结项审批" key="finishApproval">
                    222
                  </TabPane>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </PageCommonWrap>
    </>
  );
};

export default React.memo(AllProject);
