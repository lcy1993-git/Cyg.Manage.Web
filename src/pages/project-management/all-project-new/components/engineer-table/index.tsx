/* eslint-disable no-nested-ternary */
import EmptyTip from '@/components/empty-tip';
import {
  AllProjectStatisticsParams,
  applyKnot,
  auditKnot,
  getExternalArrangeStep,
  getProjectInfo,
  getProjectTableList,
} from '@/services/project-management/all-project';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { delay } from '@/utils/utils';
import { useRequest, useSize } from 'ahooks';
import { Menu, message, Popconfirm } from 'antd';
import { Spin } from 'antd';
import { Pagination } from 'antd';
import React from 'react';
import { forwardRef } from 'react';
import { Ref } from 'react';
import { useImperativeHandle } from 'react';
import { useRef } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';
import EngineerTableItem, { AddProjectValue, TableItemCheckedInfo } from './engineer-table-item';
import ScrollView from 'react-custom-scrollbars';
import styles from './index.less';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';
import { Dropdown } from 'antd';
import { BarsOutlined } from '@ant-design/icons';
import { TableContext } from './table-store';
import CheckResultModal from '../check-result-modal';
import EngineerDetailInfo from '../engineer-detail-info';
import ProjectDetailInfo from '../project-detail-info';
import ArrangeModal from '../arrange-modal';
import EditEnigneerModal from '../edit-engineer-modal';
import EditProjectModal from '../edit-project-modal';
import CopyProjectModal from '../copy-project-modal';
import AddProjectModal from '../add-project-modal';
import ExternalArrangeModal from '../external-arrange-modal';
import ExternalListModal from '../external-list-modal';
import AuditKnotModal from '../audit-knot-modal';
import moment from 'moment';

const colorMap = {
  立项: 'green',
  委托: 'blue',
  共享: 'yellow',
  执行: 'yellow',
};

interface ExtractParams extends AllProjectStatisticsParams {
  statisticalCategory?: string;
}

interface JurisdictionInfo {
  canEdit: boolean;
  canCopy: boolean;
}

interface EngineerTableProps {
  extractParams: ExtractParams;
  onSelect?: (checkedValue: TableItemCheckedInfo[]) => void;
  finishEvent?: () => void;
  getStatisticsData?: (value: any) => void;
  columnsConfig: string[];
}

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
  const { extractParams, onSelect, getStatisticsData, columnsConfig = [], finishEvent } = props;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

  const [currentClickEngineerId, setCurrentClickEngineerId] = useState<string>('');
  const [checkResultPorjectInfo, setCheckResultProjectInfo] = useState({
    projectId: '',
    projectName: '',
    projectStatus: '',
    projectStage: '',
  });
  const [currentClickProjectId, setCurrentClickProjectId] = useState<string>('');
  const [currentArrageProjectId, setCurrentArrageProjectId] = useState<string>('');
  const [currentProjectArrangeType, setCurrentProjectArrageType] = useState<string>();
  const [arrangeAllotCompanyId, setArrangeAllotCompanyId] = useState<string>();
  const [currentDataSourceType, setCurrentDataSourceType] = useState<number>();
  const [currentEditEngineerId, setCurrentEditEngineerId] = useState<string>('');
  const [currentEditProjectInfo, setCurrentEditProjectInfo] = useState<any>({});
  const [currentCopyProjectInfo, setCurrentCopyProjectInfo] = useState<any>({});
  const [projectNeedInfo, setProjectNeedInfo] = useState({
    engineerId: '',
    areaId: '',
    company: '',
    companyName: '',
  });
  const [currentProName, setCurrentProName] = useState<string | undefined>('');
  const [externalStepData, setExternalStepData] = useState<any>();

  const [checkResultVisible, setCheckResultVisible] = useState<boolean>(false);
  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false);
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [externalArrangeModalVisible, setExternalArrangeModalVisible] = useState<boolean>(false);
  const [externalListModalVisible, setExternalListModalVisible] = useState<boolean>(false);
  const [copyProjectVisible, setCopyProjectVisible] = useState<boolean>(false);
  const [addProjectVisible, setAddProjectVisible] = useState<boolean>(false);
  const [editProjectVisible, setEditProjectVisible] = useState<boolean>(false);
  const [editEngineerVisible, setEditEngineerVisible] = useState<boolean>(false);
  const [arrangeModalVisible, setArrangeModalVisible] = useState<boolean>(false);

  const [auditKnotModalVisible, setAuditKnotModalVisible] = useState<boolean>(false);

  const { data: tableData, loading, run } = useRequest(getProjectTableList, { manual: true });

  const scrollbar = useRef<any>(null);
  const tableContentRef = useRef<HTMLDivElement>(null);

  const tableContentSize = useSize(tableContentRef);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const projectNameClickEvent = (engineerId: string) => {
    setCurrentClickEngineerId(engineerId);
    setEngineerModalVisible(true);
  };

  const editProjectEvent = (info: any) => {
    setEditProjectVisible(true);
    setCurrentEditProjectInfo(info);
  };

  const copyProjectEvent = (info: any) => {
    setCopyProjectVisible(true);
    setCurrentCopyProjectInfo(info);
  };

  const editEngineerEvent = (data: AddProjectValue) => {
    setEditEngineerVisible(true);
    setCurrentEditEngineerId(data.engineerId);
  };

  const checkResult = (projectInfo: any) => {
    setCheckResultProjectInfo(projectInfo);
    setCheckResultVisible(true);
  };

  const [leftNumber, setLeftNumber] = useState<number>(0);

  const { run: getExternalStep } = useRequest(getExternalArrangeStep, {
    manual: true,
  });

  const projectItemMenu = (
    jurisdictionInfo: JurisdictionInfo,
    tableItemData: any,
    engineerInfo: any,
  ) => {
    return (
      <Menu>
        {jurisdictionInfo.canEdit && buttonJurisdictionArray?.includes('all-project-edit-project') && (
          <Menu.Item
            onClick={() => {
              editProjectEvent({
                projectId: tableItemData.id,
                areaId: engineerInfo.province,
                company: engineerInfo.company,
                companyName: engineerInfo.company,
                startTime: engineerInfo.startTime,
                endTime: engineerInfo.endTime,
                status: tableItemData.stateInfo.status,
              });
            }}
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
                startTime: engineerInfo.startTime,
                endTime: engineerInfo.endTime,
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

  const arrange = async (projectId: string, projectType?: number, allotCompanyId?: string) => {
    const projectInfo = await getProjectInfo(projectId);
    setCurrentDataSourceType(Number(projectInfo?.dataSourceType));
    setCurrentArrageProjectId(projectId);
    setCurrentProjectArrageType(projectType ? String(projectType) : undefined);
    setArrangeAllotCompanyId(allotCompanyId);
    setArrangeModalVisible(true);
  };

  // 外审安排
  const externalArrange = async (projectId: string, proName?: string) => {
    setCurrentClickProjectId(projectId);
    setCurrentProName(proName);
    setExternalArrangeModalVisible(true);
  };

  // 外审列表
  const externalEdit = async (projectId: string) => {
    const res = await getExternalStep(projectId);

    setCurrentClickProjectId(projectId);
    setExternalStepData(res);
    setExternalListModalVisible(true);
  };

  const completeConfig = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 300,
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
      ellipsis: true,
    },
    {
      title: '项目分类',
      dataIndex: 'categoryText',
      width: 100,
      ellipsis: true,
    },
    {
      title: '项目类型',
      dataIndex: 'pTypeText',
      width: 140,
      ellipsis: true,
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevelText',
      width: 100,
      ellipsis: true,
    },
    {
      title: '项目性质',
      dataIndex: 'natureTexts',
      width: 180,
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
      title: '项目起止时间',
      dataIndex: 'projectTime',
      width: 190,
      ellipsis: true,
      render: (record: any) => {
        const { startTime, endTime } = record;
        if (startTime && endTime) {
          return `${moment(startTime).format('YYYY-MM-DD')} 至 ${moment(endTime).format(
            'YYYY-MM-DD',
          )}`;
        }
        if (startTime && !endTime) {
          return `开始时间: ${moment(startTime).format('YYYY-MM-DD')}`;
        }
        if (!startTime && endTime) {
          return `截止时间: ${moment(startTime).format('YYYY-MM-DD')}`;
        }
        return '未设置起止时间';
      },
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '建设建造目的',
      dataIndex: 'reformAimText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '所属市公司',
      dataIndex: 'cityCompany',
      width: 120,
      ellipsis: true,
    },
    {
      title: '所属县公司',
      dataIndex: 'countyCompany',
      width: 120,
      ellipsis: true,
    },
    {
      title: '建设类型',
      dataIndex: 'constructTypeText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目类别',
      dataIndex: 'pCategoryText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目属性',
      dataIndex: 'pAttributeText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '交底范围',
      dataIndex: 'disclosureRange',
      width: 120,
    },
    {
      title: '桩位范围',
      dataIndex: 'pileRange',
      width: 120,
    },
    {
      title: '现场数据来源',
      dataIndex: 'dataSourceTypeText',
      width: 120,
    },
    {
      title: '导出坐标权限',
      dataIndex: 'exportCoordinate',
      width: 120,
      render: (record: any) => {
        return record.exportCoordinate === true ? (
          <span className="colorPrimary">启用</span>
        ) : (
          <span className="colorRed">禁用</span>
        );
      },
    },
    {
      title: '勘察人',
      dataIndex: 'surveyUser',
      width: 120,
      ellipsis: true,
      render: (record: any) => {
        return record.surveyUser ? record.surveyUser.value : '无需安排';
      },
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
      width: 120,
      ellipsis: true,
      render: (record: any) => {
        return record.designUser ? record.designUser.value : '';
      },
    },
    {
      title: '项目批次',
      dataIndex: 'batchText',
      width: 120,
      ellipsis: true,
    },
    {
      title: '项目来源',
      dataIndex: 'sources',
      width: 120,
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
      width: 180,
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
      title: '项目状态',
      width: 120,
      dataIndex: 'status',
      render: (record: any) => {
        const { stateInfo, allot, identitys } = record;
        let arrangeType: any = null;
        let allotCompanyId: any = null;

        if (allot) {
          arrangeType = allot.allotType;
          allotCompanyId = allot.allotCompanyGroup;
        }
        // console.log(stateInfo)
        // console.log(stateInfo.status === 17 && stateInfo.auditStatus === 13)
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
                ) : identitys.findIndex((item: any) => item.value === 4) > -1 &&
                  stateInfo.status === 7 ? (
                  <span className="canClick">
                    <Popconfirm
                      title="确认对该项目进行“申请结项”?"
                      onConfirm={() => applyKnotEvent([record.id])}
                      okText="确认"
                      cancelText="取消"
                    >
                      {stateInfo?.statusText}
                    </Popconfirm>
                  </span>
                ) : identitys.findIndex((item: any) => item.value === 1) > -1 &&
                  stateInfo.status === 15 ? (
                  <span
                    className="canClick"
                    onClick={() => {
                      setCurrentClickProjectId(record.id);
                      setAuditKnotModalVisible(true);
                    }}
                  >
                    {stateInfo?.statusText}
                  </span>
                ) : stateInfo.statusText === '设计评审中' ? (
                  <span>设计中</span>
                ) : (
                  // : stateInfo.status === 4 &&
                  //   stateInfo.auditStatus === 0 &&
                  //   stateInfo.auditStatusText === null ? (
                  //   <span>{stateInfo?.statusText}</span>
                  // ) : stateInfo.status === 4 &&
                  //   stateInfo.auditStatus === 0 &&
                  //   stateInfo.auditStatusText != null ? (
                  //   <span>{stateInfo?.auditStatusText}</span>
                  // ) : stateInfo.status === 4 && stateInfo.auditStatus != 0 ? (
                  //   <span>{stateInfo?.auditStatusText}</span>
                  // ) : stateInfo.status === 17 && stateInfo.auditStatus === 0 ? (
                  //   <span>{stateInfo?.statusText}</span>
                  // ) : stateInfo.status === 17 && stateInfo.auditStatus === 10 ? (
                  //   <span
                  //     className="canClick"
                  //     onClick={() => externalArrange(record.id, record.name)}
                  //   >
                  //     {stateInfo?.auditStatusText}
                  //   </span>
                  // ) : stateInfo.status === 17 && stateInfo.auditStatus === 13 ? (
                  //   <span className="canClick" onClick={() => externalEdit(record.id)}>
                  //     {stateInfo?.auditStatusText}
                  //   </span>
                  // ) : stateInfo.status === 17 && stateInfo.auditStatus === 15 ? (
                  //   <span className="canClick" onClick={() => externalEdit(record.id)}>
                  //     {stateInfo?.auditStatusText}
                  //   </span>
                  // ) : stateInfo.status === 17 && stateInfo.auditStatus != 0 ? (
                  //   <span>{stateInfo?.auditStatusText}</span>
                  // ) : (
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
      title: '操作',
      dataIndex: 'action',
      width: 60,
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

  // 申请结项
  const applyKnotEvent = async (projectId: string[]) => {
    await applyKnot(projectId);
    message.success('申请结项成功');
    finishEvent?.();
  };

  const chooseColumns = useMemo(() => {
    if (columnsConfig) {
      return ['name', ...columnsConfig, 'sources', 'identitys', 'status', 'action'];
    }
    return [
      'categoryText',
      'kvLevelText',
      'natureTexts',
      'majorCategoryText',
      'constructTypeText',
      'stageText',
      'exportCoordinate',
      'surveyUser',
      'designUser',
      'identitys',
    ];
  }, [JSON.stringify(columnsConfig)]);

  const columnsInfo = useMemo(() => {
    const showColumns = completeConfig.filter((item) => chooseColumns.includes(item.dataIndex));
    const columnsWidth = showColumns.reduce((sum, item) => {
      return sum + (item.width ? item.width : 100);
    }, 0);
    const isOverflow = (tableContentSize.width ?? 0) - 50 - columnsWidth < 0;

    if (scrollbar && scrollbar.current) {
      // @ts-ignore
      scrollbar.current.view.scroll({
        left: 0,
        behavior: 'auto',
      });
    }

    return {
      isOverflow,
      columns: showColumns,
      columnsWidth: columnsWidth + 38,
    };
  }, [chooseColumns, JSON.stringify(tableContentSize.width)]);

  const tableResultData = useMemo(() => {
    if (tableData) {
      const { pagedData, statistics } = tableData;
      const { items, pageIndex: resPageIndex, pageSize: resPageSize, total } = pagedData;
      getStatisticsData?.(statistics);
      return {
        items: items ?? [],
        pageIndex: resPageIndex,
        pageSize: resPageSize,
        total,
        dataStartIndex: Math.floor((resPageIndex - 1) * pageSize + 1),
        dataEndIndex: Math.floor((resPageIndex - 1) * pageSize + (items ?? []).length),
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

  const pageSizeChange = (page: any, size: any) => {
    setPageIndex(1);
    setPageSize(size);

    run({
      ...extractParams,
      pageIndex: 1,
      pageSize: size,
    });
    setTableSelectData([]);
    onSelect?.([]);
  };

  // 列显示处理
  const currentPageChange = (page: any, size: any) => {
    // 判断当前page是否改变, 没有改变代表是change页面触发
    if (pageSize === size) {
      setPageIndex(page === 0 ? 1 : page);

      run({
        ...extractParams,
        pageIndex: page,
        pageSize,
      });
      setTableSelectData([]);
      onSelect?.([]);
    }
  };

  const addProjectEvent = (projectNeedValue: AddProjectValue) => {
    console.log(projectNeedValue);

    setAddProjectVisible(true);
    setProjectNeedInfo(projectNeedValue);
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

  const engineerTableElement = tableResultData?.items.map((item: any) => {
    return (
      <EngineerTableItem
        left={leftNumber}
        editEngineer={editEngineerEvent}
        addProject={addProjectEvent}
        getClickProjectId={projectNameClickEvent}
        onChange={tableItemSelectEvent}
        columns={columnsInfo.columns}
        key={item.id}
        projectInfo={item}
        isOverflow={columnsInfo.isOverflow}
        columnsWidth={columnsInfo.columnsWidth}
        contentWidth={tableContentSize.width!}
      />
    );
  });

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    refresh: () => {
      run({
        ...extractParams,
        pageIndex,
        pageSize,
      });
      setTableSelectData([]);
      onSelect?.([]);
    },
    search: () => {
      setPageIndex(1);
      run({
        ...extractParams,
        pageIndex: 1,
        pageSize,
      });
      if (scrollbar && scrollbar.current) {
        // @ts-ignore
        scrollbar.current.view.scroll({
          top: 0,
          behavior: 'smooth',
        });
      }
      setTableSelectData([]);
      onSelect?.([]);
    },
    searchByParams: (params: object) => {
      setPageIndex(1);
      run({
        ...params,
        pageIndex: 1,
        pageSize,
      });
      if (scrollbar && scrollbar.current) {
        scrollbar.current.view.scroll({
          top: 0,
          behavior: 'smooth',
        });
      }
      setTableSelectData([]);
      onSelect?.([]);
    },
    delayRefresh: async (ms: number) => {
      await delay(500);
      run({
        ...extractParams,
        pageIndex,
        pageSize,
      });
      setTableSelectData([]);
      onSelect?.([]);
    },
  }));

  const scrollEvent = (size) => {
    setLeftNumber(size.scrollLeft);
  };

  const scrollBarRenderView = (params: any) => {
    const { style, ...rest } = params;
    const viewStyle = {
      backgroundColor: `rgba(0, 0, 0, 0.2)`,
      borderRadius: '6px',
      cursor: 'pointer',
      zIndex: 100,
    };
    return <div style={{ ...style, ...viewStyle }} {...rest} />;
  };

  const refreshEvent = () => {
    run({
      ...extractParams,
      pageIndex,
      pageSize,
    });
    setTableSelectData([]);
    onSelect?.([]);
  };

  const delayRefresh = async () => {
    await delay(500);
    run({
      ...extractParams,
      pageIndex,
      pageSize,
    });
    setTableSelectData([]);
    onSelect?.([]);
  };

  return (
    <TableContext.Provider
      value={{
        tableSelectData,
        setTableSelectData,
      }}
    >
      <div className={styles.engineerTable}>
        <div className={styles.engineerTableContent} ref={tableContentRef}>
          <ScrollView
            ref={scrollbar}
            onUpdate={scrollEvent}
            renderThumbHorizontal={scrollBarRenderView}
            renderThumbVertical={scrollBarRenderView}
          >
            <Spin spinning={loading}>
              {tableResultData.items.length > 0 && engineerTableElement}
              {tableResultData.items.length === 0 && <EmptyTip className="pt20" />}
            </Spin>
          </ScrollView>
        </div>
        <div className={styles.engineerTablePaging}>
          <div className={styles.engineerTablePagingLeft}>
            <span>显示第</span>
            <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
            <span>到第</span>
            <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
            <span>条记录，总共</span>
            <span className={styles.importantTip}>{tableResultData.items.length}</span>
            <span>个工程，</span>
            <span className={styles.importantTip}>{tableResultData.projectLen}</span>个项目
          </div>
          <div className={styles.engineerTablePagingRight}>
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
            changeFinishEvent={refreshEvent}
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
            finishEvent={refreshEvent}
            visible={arrangeModalVisible}
            onChange={setArrangeModalVisible}
            projectIds={[currentArrageProjectId]}
            defaultSelectType={currentProjectArrangeType}
            dataSourceType={currentDataSourceType}
          />
        )}
        {editEngineerVisible && (
          <EditEnigneerModal
            engineerId={currentEditEngineerId}
            visible={editEngineerVisible}
            onChange={setEditEngineerVisible}
            changeFinishEvent={refreshEvent}
          />
        )}
        {editProjectVisible && (
          <EditProjectModal
            companyName={currentEditProjectInfo.companyName}
            projectId={currentEditProjectInfo.projectId}
            company={currentEditProjectInfo.company}
            areaId={currentEditProjectInfo.areaId}
            status={currentEditProjectInfo.status}
            startTime={currentEditProjectInfo.startTime}
            endTime={currentEditProjectInfo.endTime}
            visible={editProjectVisible}
            onChange={setEditProjectVisible}
            changeFinishEvent={refreshEvent}
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
            startTime={currentCopyProjectInfo.startTime}
            endTime={currentCopyProjectInfo.endTime}
            onChange={setCopyProjectVisible}
            changeFinishEvent={refreshEvent}
          />
        )}
        {addProjectVisible && (
          <AddProjectModal
            companyName={projectNeedInfo.companyName}
            changeFinishEvent={refreshEvent}
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
            onChange={setExternalArrangeModalVisible}
            visible={externalArrangeModalVisible}
            search={delayRefresh}
          />
        )}

        {externalListModalVisible && (
          <ExternalListModal
            projectId={currentClickProjectId}
            visible={externalListModalVisible}
            onChange={setExternalListModalVisible}
            stepData={externalStepData}
            refresh={delayRefresh}
          />
        )}

        {auditKnotModalVisible && (
          <AuditKnotModal
            visible={auditKnotModalVisible}
            onChange={setAuditKnotModalVisible}
            projectIds={[currentClickProjectId]}
            finishEvent={finishEvent}
          />
        )}
      </div>
    </TableContext.Provider>
  );
};

export default forwardRef(EngineerTable);
