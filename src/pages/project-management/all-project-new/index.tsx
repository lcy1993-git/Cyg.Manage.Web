import CommonTitle from '@/components/common-title';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import React, { useState } from 'react';
import AllStatistics from './components/all-statistics';
import SingleStatistics from './components/all-statistics';
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
  return (
    <>
      <PageCommonWrap noPadding={true} noColor={true}>
        <div className={styles.allProjectPage}>
          <div className={styles.allProjectCheckTab}>
            <div className={styles.projectManagementStatisticItem}>
              <SingleStatistics label="全部项目" icon="awaitProcess">
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div>
              <SingleStatistics label="立项审批" icon="awaitProcess">
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div>
              <SingleStatistics label="任务安排" icon="awaitProcess">
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div>
              <SingleStatistics label="评审管理" icon="awaitProcess">
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            <div>
              <SingleStatistics label="结项管理" icon="awaitProcess">
                22{/* {handleStatisticsData(statisticsData?.total)} */}
              </SingleStatistics>
            </div>
            {/* <Tabs>
              <TabPane tab="基本信息" key="1">
                <BaseInfo baseInfo={detailData} />
              </TabPane>
              <TabPane tab="内容" key="2">
                <Content info={detailData} />
              </TabPane>
              <TabPane tab="请求头" key="3">
                <ReqHeader info={detailData} />
              </TabPane>
            </Tabs> */}
          </div>
        </div>
      </PageCommonWrap>
    </>
  );
};

export default React.memo(AllProject);
