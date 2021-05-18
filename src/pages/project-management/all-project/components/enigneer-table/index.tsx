import { useRequest } from 'ahooks';
import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import {
  AllProjectStatisticsParams,
  getAllotUsers,
  getProjectTableList,
  getExternalArrangeStep,
} from '@/services/project-management/all-project';

import styles from './index.less';
import { useMemo } from 'react';
import { Dropdown, Menu, Pagination } from 'antd';
import { useEffect } from 'react';
import ProjectTableItem, { AddProjectValue, TableItemCheckedInfo } from '../engineer-table-item';

import uuid from 'node-uuid';
import { BarsOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import EmptyTip from '@/components/empty-tip';
import EngineerDetailInfo from '../engineer-detail-info';
import ProjectDetailInfo from '../project-detail-info';
import CyTag from '@/components/cy-tag';
import AddProjectModal from '../add-project-modal';
import EditEnigneerModal from '../edit-engineer-modal';
import EditProjectModal from '../edit-project-modal';
import CopyProjectModal from '../copy-project-modal';
import ArrangeModal from '../arrange-modal';
import CheckResultModal from '../check-result-modal';
import ExternalArrangeModal from '../external-arrange-modal';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import ExternalListModal from '../external-list-modal';

interface ExtractParams extends AllProjectStatisticsParams {
  statisticalCategory?: string;
}

interface EngineerTableProps {
  extractParams: ExtractParams;
  onSelect?: (checkedValue: TableItemCheckedInfo[]) => void;
  afterSearch?: () => void;
}

interface JurisdictionInfo {
  canEdit: boolean;
  canCopy: boolean;
}

const colorMap = {
  立项: 'green',
  委托: 'blue',
  共享: 'yellow',
  执行: 'yellow',
};

// const testData = [
//   {
//     id: '1392813588021792768',
//     companyId: '1266016355747741696',
//     name: '导入工程56',
//     startTime: 1623168000000,
//     endTime: 1625673600000,
//     compileTime: 1623081600000,
//     province: '510000',
//     city: '513400',
//     area: '513438',
//     company: '成都yl电力有限公司',
//     projects: [
//       {
//         id: '1392813588021792769',
//         engineerId: '1392813588021792768',
//         name: '导入工程2-项目24',
//         category: 1,
//         categoryText: '10kV线路',
//         kvLevel: 1,
//         kvLevelText: '交流20kV',
//         nature: 128,
//         natureTexts: ['村村通动力电'],
//         majorCategory: 1,
//         majorCategoryText: '配电线路',
//         constructType: 1,
//         constructTypeText: '新建',
//         batch: 3,
//         batchText: '第三批',
//         stage: 4,
//         stageText: '施工图',
//         dataSourceType: 0,
//         dataSourceTypeText: '勘察',
//         sources: ['无'],
//         allot: null,
//         stateInfo: {
//           id: '1392813588021792769',
//           isResetSurvey: false,
//           status: 17,
//           statusText: '待安排外审',
//           outsideStatus: 0,
//           outsideStatusText: '',
//           isAllot: false,
//           allotId: null,
//           isArrange: true,
//           showStatusText: '待安排',
//           surveyAssessState: 1,
//           surveyAssessStateText: '未评审',
//           designAssessState: 1,
//           designAssessStateText: '未评审',
//           updateTime: 1620907611266,
//           auditStatus: 10,
//         },
//         identitys: [
//           {
//             value: 1,
//             text: '立项',
//           },
//           {
//             value: 4,
//             text: '执行',
//           },
//         ],
//         operationAuthority: {
//           canEdit: true,
//           canCopy: true,
//         },
//       },
//     ],
//     operationAuthority: {
//       canEdit: true,
//       canAddProject: true,
//     },
//   },
// ];

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
  const { extractParams, onSelect, afterSearch } = props;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

  const [currentClickEngineerId, setCurrentClickEngineerId] = useState<string>('');
  const [currentProName, setCurrentProName] = useState<string | undefined>('');

  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false);

  const [currentClickProjectId, setCurrentClickProjectId] = useState('');
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [arrangeUsers, setArrangeUsers] = useState<any>();

  const [externalStepData, setExternalStepData] = useState<any>();

  const [externalArrangeModalVisible, setExternalArrangeModalVisible] = useState<boolean>(false);
  const [externalListModalVisible, setExternalListModalVisible] = useState<boolean>(false);

  const [currentEditEngineerId, setCurrentEditEngineerId] = useState<string>('');
  const [currentEditProjectInfo, setCurrentEditProjectInfo] = useState<any>({});
  const [currentCopyProjectInfo, setCurrentCopyProjectInfo] = useState<any>({});
  const [copyProjectVisible, setCopyProjectVisible] = useState<boolean>(false);
  const [addProjectVisible, setAddProjectVisible] = useState<boolean>(false);
  const [editProjectVisible, setEditProjectVisible] = useState<boolean>(false);
  const [editEngineerVisible, setEditEngineerVisible] = useState<boolean>(false);
  const [projectNeedInfo, setProjectNeedInfo] = useState({
    engineerId: '',
    areaId: '',
    company: '',
    companyName: '',
  });

  const [arrangeModalVisible, setArrangeModalVisible] = useState<boolean>(false);
  const [currentArrageProjectId, setCurrentArrageProjectId] = useState<string>('');
  const [currentProjectArrangeType, setCurrentProjectArrageType] = useState<string>();
  const [arrangeAllotCompanyId, setArrangeAllotCompanyId] = useState<string>();

  const [checkResultVisible, setCheckResultVisible] = useState<boolean>(false);
  const [checkResultPorjectInfo, setCheckResultProjectInfo] = useState({
    projectId: '',
    projectName: '',
    projectStatus: '',
    projectStage: '',
  });

  const addProjectEvent = (projectNeedValue: AddProjectValue) => {
    setAddProjectVisible(true);
    setProjectNeedInfo(projectNeedValue);
  };

  const { data: tableData, loading, run } = useRequest(getProjectTableList, { manual: true });

  const { run: getArrangeUsers } = useRequest(getAllotUsers, {
    manual: true,
  });

  const { run: getExternalStep } = useRequest(getExternalArrangeStep, {
    manual: true,
  });

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const tableResultData = useMemo(() => {
    if (tableData) {
      const { items, pageIndex, pageSize, total } = tableData;

      return {
        items: items ?? [],
        pageIndex,
        pageSize,
        total,
        dataStartIndex: Math.floor((pageIndex - 1) * pageSize + 1),
        dataEndIndex: Math.floor((pageIndex - 1) * pageSize + (items ?? []).length),
        projectLen:
          items
            ?.filter((item: any) => item.projects && item.projects.length > 0)
            .map((item: any) => item.projects)
            .flat().length ?? 0,
      };
    }
    return {
      items: [],
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      dataStartIndex: 0,
      dataEndIndex: 0,
      projectLen: 0,
    };
  }, [JSON.stringify(tableData)]);

  const projectItemMenu = (
    jurisdictionInfo: JurisdictionInfo,
    tableItemData: any,
    engineerInfo: any,
    status: any,
  ) => {
    return (
      <Menu>
        {jurisdictionInfo.canEdit && buttonJurisdictionArray?.includes('all-project-edit-project') && (
          <Menu.Item
            onClick={() =>
              editProjectEvent({
                projectId: tableItemData.id,
                areaId: engineerInfo.province,
                company: engineerInfo.company,
                companyName: engineerInfo.company,
              })
            }
          >
            编辑
          </Menu.Item>
        )}
        {jurisdictionInfo.canCopy && buttonJurisdictionArray?.includes('all-project-copy-project') && (
          <Menu.Item
            onClick={() =>
              copyProjectEvent({
                projectId: tableItemData.id,
                areaId: engineerInfo.province,
                company: engineerInfo.company,
                engineerId: engineerInfo.id,
                companyName: engineerInfo.company,
              })
            }
          >
            复制项目
          </Menu.Item>
        )}
        {buttonJurisdictionArray?.includes('all-project-check-result') && (
          <Menu.Item
            onClick={() =>
              checkResult({
                projectId: tableItemData.id,
                projectName: tableItemData.name,
                projectStatus: tableItemData.stateInfo.statusText,
                projectStage: tableItemData.stageText,
              })
            }
          >
            查看成果
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const checkResult = (projectInfo: any) => {
    setCheckResultProjectInfo(projectInfo);
    setCheckResultVisible(true);
  };

  const arrange = (projectId: string, projectType?: number, allotCompanyId?: string) => {
    setCurrentArrageProjectId(projectId);
    setCurrentProjectArrageType(projectType ? String(projectType) : undefined);
    setArrangeAllotCompanyId(allotCompanyId);
    setArrangeModalVisible(true);
  };

  const arrangeFinish = () => {
    setArrangeModalVisible(false);
    run({
      ...extractParams,
      pageIndex,
      pageSize,
    });
    setTableSelectData([]);
    afterSearch?.();
  };

  const projectTableColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      render: (record: any) => {
        return (
          <u
            className="canClick"
            onClick={() => {
              setCurrentClickProjectId(record.id);
              setProjectModalVisible(true);
            }}
          >
            {record.name}
          </u>
        );
      },
    },
    {
      title: '项目分类',
      dataIndex: 'categoryText',
      width: '6.15%',
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevelText',
      width: '6.15%',
    },
    {
      title: '项目性质',
      dataIndex: 'natureTexts',
      width: '10%',
      render: (record: any) => {
        const { natureTexts = [] } = record;
        return natureTexts.map((item: any) => {
          return (
            <CyTag key={uuid.v1()} className="mr7">
              {item}
            </CyTag>
          );
        });
      },
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
      width: '6.15%',
    },
    {
      title: '建设类型',
      dataIndex: 'constructTypeText',
      width: '6.15%',
    },
    {
      title: '项目批次',
      dataIndex: 'batchText',
      width: '6.15%',
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
      width: '6.15%',
    },
    {
      title: '现场数据来源',
      dataIndex: 'dataSourceTypeText',
      width: '8%',
    },
    {
      title: '项目状态',
      width: '6.15%',
      dataIndex: 'statusText',
      render: (record: any) => {
        const { stateInfo, allot, identitys } = record;
        let arrangeType: any = null;
        let allotCompanyId: any = null;

        if (allot) {
          arrangeType = allot.allotType;
          allotCompanyId = allot.allotCompanyGroup;
        }
        return (
          <>
            {buttonJurisdictionArray?.includes('all-project-copy-project') && (
              <span>
                {!stateInfo.isArrange &&
                identitys.findIndex((item: any) => item.value === 4) > -1 ? (
                  <span
                    className="canClick"
                    onClick={() => arrange(record.id, arrangeType, allotCompanyId)}
                  >
                    {stateInfo?.statusText}
                  </span>
                ) : stateInfo.status === 17 && stateInfo.auditStatus === 5 ? (
                  <span>{stateInfo?.auditStatusText}</span>
                ) : stateInfo.status === 17 && stateInfo.auditStatus === 10 ? (
                  <span
                    className="canClick"
                    onClick={() => externalArrange(record.id, record.name)}
                  >
                    {stateInfo?.auditStatusText}
                  </span>
                ) : stateInfo.status === 17 && stateInfo.auditStatus === 13 ? (
                  <span className="canClick" onClick={() => externalEdit(record.id)}>
                    {stateInfo?.auditStatusText}
                  </span>
                ) : stateInfo.status === 17 && stateInfo.auditStatus === 15 ? (
                  <span className="canClick" onClick={() => externalEdit(record.id)}>
                    {stateInfo?.auditStatusText}
                  </span>
                ) : (
                  <span>{stateInfo?.statusText}</span>
                )}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('all-project-copy-project') && (
              <span>{stateInfo?.statusText}</span>
            )}
          </>
        );
      },
    },
    {
      title: '项目来源',
      dataIndex: 'sources',
      width: '6.15%',
      render: (record: any) => {
        const { sources = [] } = record;
        return sources.map((item: any) => {
          return (
            <span key={uuid.v1()}>
              <CyTag color={colorMap[item.text] ? colorMap[item.text] : 'green'}>
                <span>{item}</span>
              </CyTag>
            </span>
          );
        });
      },
    },
    {
      title: '项目身份',
      dataIndex: 'identitys',
      width: '8%',
      render: (record: any) => {
        const { identitys = [] } = record;
        return identitys
          .filter((item: any) => item.text)
          .map((item: any) => {
            return (
              <span className="mr7" key={uuid.v1()}>
                <CyTag color={colorMap[item.text] ? colorMap[item.text] : 'green'}>
                  {item.text}
                </CyTag>
              </span>
            );
          });
      },
    },
    {
      title: '操作',
      dataIndex: 'operationAuthority',
      width: '60px',
      render: (record: any, engineerInfo: any) => {
        const { operationAuthority } = record;

        return (
          <Dropdown
            overlay={() =>
              projectItemMenu(operationAuthority, record, engineerInfo, record.stateInfo.status)
            }
            placement="bottomLeft"
            arrow
          >
            <BarsOutlined />
          </Dropdown>
        );
      },
    },
  ];

  //外审安排
  const externalArrange = async (projectId: string, proName?: string) => {
    const res = await getArrangeUsers(projectId, 6);
    setCurrentClickProjectId(projectId);
    setCurrentProName(proName);
    const exUsers = res?.map((item) => {
      return {
        value: item.userId,
        text: item.userNameText,
      };
    });
    setArrangeUsers(exUsers);

    setExternalArrangeModalVisible(true);
  };

  //外审列表
  const externalEdit = async (projectId: string) => {
    const res = await getExternalStep(projectId);

    setCurrentClickProjectId(projectId);
    setExternalStepData(res);
    setExternalListModalVisible(true);
  };

  const tableItemSelectEvent = (projectSelectInfo: TableItemCheckedInfo) => {
    // 监测现在数组是否含有此id的数据
    const hasData = tableSelectData.findIndex(
      (item) => item.projectInfo.id === projectSelectInfo.projectInfo.id,
    );
    const copyData: TableItemCheckedInfo[] = JSON.parse(JSON.stringify(tableSelectData));
    if (hasData > -1) {
      copyData.splice(hasData, 1, projectSelectInfo);
      setTableSelectData(copyData);
      onSelect?.(copyData);
    } else {
      // 代表没有数据，那就直接插进去
      setTableSelectData([...tableSelectData, projectSelectInfo]);
      onSelect?.([...tableSelectData, projectSelectInfo]);
    }
  };

  const projectNameClickEvent = (engineerId: string) => {
    setCurrentClickEngineerId(engineerId);
    setEngineerModalVisible(true);
  };

  const editProjectEvent = (projectNeedInfo: any) => {
    setEditProjectVisible(true);
    setCurrentEditProjectInfo(projectNeedInfo);
  };

  const copyProjectEvent = (projectNeedInfo: any) => {
    setCopyProjectVisible(true);
    setCurrentCopyProjectInfo(projectNeedInfo);
  };

  const editEngineerEvent = (data: AddProjectValue) => {
    setEditEngineerVisible(true);
    setCurrentEditEngineerId(data.engineerId);
  };

  const projectTableShow = tableResultData?.items.map((item: any, index: number) => {
    return (
      <ProjectTableItem
        editEngineer={editEngineerEvent}
        addProject={addProjectEvent}
        getClickProjectId={projectNameClickEvent}
        onChange={tableItemSelectEvent}
        columns={projectTableColumns}
        key={item.id}
        projectInfo={item}
      />
    );
  });

  // 列显示处理
  const currentPageChange = (page: any, size: any) => {
    // 判断当前page是否改变, 没有改变代表是change页面触发
    if (pageSize === size) {
      setPageIndex(page === 0 ? 1 : page);
    }
  };

  const pageSizeChange = (page: any, size: any) => {
    setPageIndex(1);
    setPageSize(size);
  };

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    refresh: () => {
      run({
        ...extractParams,
        pageIndex,
        pageSize,
      });
      setTableSelectData([]);
    },
    search: () => {
      setPageIndex(1);
      run({
        ...extractParams,
        pageIndex: 1,
        pageSize,
      });
      setTableSelectData([]);
    },
    searchByParams: (params: object) => {
      setPageIndex(1);
      run({
        ...params,
        pageIndex: 1,
        pageSize,
      });
      setTableSelectData([]);
    },
  }));

  const tableItemEventFinish = () => {
    run({
      ...extractParams,
      pageIndex,
      pageSize,
    });
    setTableSelectData([]);
    afterSearch?.();
  };

  // 页码发生变化，重新进行请求
  useEffect(() => {
    run({
      ...extractParams,
      pageIndex,
      pageSize,
    });
    setTableSelectData([]);
  }, [pageSize, pageIndex]);

  return (
    <div className={styles.projectTable}>
      <div className={styles.projectTableContent}>
        <Spin spinning={loading}>
          {tableResultData.items.length > 0 && projectTableShow}
          {tableResultData.items.length === 0 && <EmptyTip className="pt20" />}
        </Spin>
      </div>

      <div className={styles.projectTablePaging}>
        <div className={styles.projectTablePagingLeft}>
          <span>显示第</span>
          <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
          <span>到第</span>
          <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
          <span>条记录，总共</span>
          <span className={styles.importantTip}>{tableResultData.items.length}</span>
          <span>个工程，</span>
          <span className={styles.importantTip}>{tableResultData.projectLen}</span>个项目
        </div>
        <div className={styles.projectTablePagingRight}>
          <Pagination
            pageSize={pageSize}
            onChange={currentPageChange}
            size="small"
            total={tableResultData.total}
            current={pageIndex}
            // hideOnSinglePage={true}
            showSizeChanger
            showQuickJumper
            onShowSizeChange={pageSizeChange}
          />
        </div>
      </div>
      {checkResultVisible && (
        <CheckResultModal
          visible={checkResultVisible}
          onChange={setCheckResultVisible}
          changeFinishEvent={arrangeFinish}
          projectInfo={checkResultPorjectInfo}
        />
      )}
      {engineerModalVisible && (
        <EngineerDetailInfo
          engineerId={currentClickEngineerId}
          visible={engineerModalVisible}
          onChange={setEngineerModalVisible}
        />
      )}
      {projectModalVisible && (
        <ProjectDetailInfo
          projectId={currentClickProjectId}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
        />
      )}
      {arrangeModalVisible && (
        <ArrangeModal
          allotCompanyId={arrangeAllotCompanyId}
          finishEvent={arrangeFinish}
          visible={arrangeModalVisible}
          onChange={setArrangeModalVisible}
          projectIds={[currentArrageProjectId]}
          defaultSelectType={currentProjectArrangeType}
        />
      )}
      {editEngineerVisible && (
        <EditEnigneerModal
          engineerId={currentEditEngineerId}
          visible={editEngineerVisible}
          onChange={setEditEngineerVisible}
          changeFinishEvent={tableItemEventFinish}
        />
      )}
      {editProjectVisible && (
        <EditProjectModal
          companyName={currentEditProjectInfo.companyName}
          projectId={currentEditProjectInfo.projectId}
          company={currentEditProjectInfo.company}
          areaId={currentEditProjectInfo.areaId}
          visible={editProjectVisible}
          onChange={setEditProjectVisible}
          changeFinishEvent={tableItemEventFinish}
        />
      )}
      {copyProjectVisible && (
        <CopyProjectModal
          companyName={currentCopyProjectInfo.companyName}
          projectId={currentCopyProjectInfo.projectId}
          engineerId={currentCopyProjectInfo.engineerId}
          company={currentCopyProjectInfo.company}
          areaId={currentCopyProjectInfo.areaId}
          visible={copyProjectVisible}
          onChange={setCopyProjectVisible}
          changeFinishEvent={tableItemEventFinish}
        />
      )}
      {addProjectVisible && (
        <AddProjectModal
          companyName={projectNeedInfo.companyName}
          changeFinishEvent={tableItemEventFinish}
          visible={addProjectVisible}
          onChange={setAddProjectVisible}
          engineerId={projectNeedInfo.engineerId}
          areaId={projectNeedInfo.areaId}
          company={projectNeedInfo.company}
        />
      )}

      {externalArrangeModalVisible && (
        <ExternalArrangeModal
          projectId={currentClickProjectId}
          proName={currentProName}
          arrangeUsers={arrangeUsers}
          onChange={setExternalArrangeModalVisible}
          visible={externalArrangeModalVisible}
          search={afterSearch}
        />
      )}

      <ExternalArrangeModal
        projectId={currentClickProjectId}
        proName={currentProName}
        arrangeUsers={arrangeUsers}
        onChange={setExternalArrangeModalVisible}
        visible={true}
        search={afterSearch}
      />

      {externalListModalVisible && (
        <ExternalListModal
          projectId={currentClickProjectId}
          visible={externalListModalVisible}
          onChange={setExternalListModalVisible}
          stepData={externalStepData}
          refresh={afterSearch}
        />
      )}
    </div>
  );
};

export default forwardRef(EngineerTable);
