/* eslint-disable no-nested-ternary */
import EmptyTip from '@/components/empty-tip';
import {
  AllProjectStatisticsParams,
  applyKnot,
  auditKnot,
  getExternalArrangeStep,
  getProjectInfo,
  getProjectTableList,
  getEngineerInfo,
  againInherit,
  deleteProject,
} from '@/services/project-management/all-project';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { delay } from '@/utils/utils';
import { useRequest, useSize } from 'ahooks';
import { Menu, message, Modal, Popconfirm, Tooltip } from 'antd';
import { Spin } from 'antd';
import { Pagination } from 'antd';
import { forwardRef, useImperativeHandle, Ref, useRef, useMemo, useState } from 'react';

import EngineerTableItem, { AddProjectValue, TableItemCheckedInfo } from './engineer-table-item';
import ScrollView from 'react-custom-scrollbars';
import styles from './index.less';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';
import { Dropdown } from 'antd';
import { BarsOutlined, ExclamationCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { TableContext } from './table-store';
import EngineerDetailInfo from '../engineer-detail-info';
import ProjectDetailInfo from '../project-detail-info';
import ArrangeModal from '../arrange-modal';
import EditEnigneerModal from '../edit-engineer-modal';
import EditProjectModal from '../edit-project-modal';
import CopyProjectModal from '../copy-project-modal';
import AddProjectModal from '../add-project-modal';
import ApprovalProjectModal from '../approval-project-modal';
import ExternalArrangeModal from '../external-arrange-modal';
import ExternalListModal from '../external-list-modal';
import AuditKnotModal from '../audit-knot-modal';
import moment from 'moment';
import { modifyExportPowerState } from '@/services/project-management/all-project';
import ProjectInheritModal from '../project-inherit-modal';
import ImageIcon from '@/components/image-icon';
import ColumnsConfigModal from '../columns-config-modal';

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
  canInherit: boolean;
}

interface EngineerTableProps {
  extractParams: ExtractParams;
  onSelect?: (checkedValue: TableItemCheckedInfo[]) => void;
  getStatisticsData?: (value: any) => void;
  columnsConfig: string[];
  finishEvent: () => void;
  configFinishEvent?: (checkedValue: any) => void;
}

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
  const {
    extractParams,
    onSelect,
    getStatisticsData,
    columnsConfig = [],
    finishEvent,
    configFinishEvent,
  } = props;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

  const [currentClickEngineerId, setCurrentClickEngineerId] = useState<string>('');

  const [currentClickProjectId, setCurrentClickProjectId] = useState<string>('');
  const [currentArrageProjectId, setCurrentArrageProjectId] = useState<string>('');
  const [currentProjectArrangeType, setCurrentProjectArrageType] = useState<string>();
  const [arrangeAllotCompanyId, setArrangeAllotCompanyId] = useState<string>();
  const [currentDataSourceType, setCurrentDataSourceType] = useState<number>();
  const [currentEditEngineerId, setCurrentEditEngineerId] = useState<string>('');
  const [currentAppEngineerId, setCurrentAppEngineerId] = useState<string>('');
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

  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false);
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);
  const [externalArrangeModalVisible, setExternalArrangeModalVisible] = useState<boolean>(false);
  const [externalListModalVisible, setExternalListModalVisible] = useState<boolean>(false);
  const [copyProjectVisible, setCopyProjectVisible] = useState<boolean>(false);
  const [addProjectVisible, setAddProjectVisible] = useState<boolean>(false);
  const [editProjectVisible, setEditProjectVisible] = useState<boolean>(false);
  const [editEngineerVisible, setEditEngineerVisible] = useState<boolean>(false);
  const [approvalEngineerVisible, setApprovalEngineerVisible] = useState<boolean>(false);
  const [arrangeModalVisible, setArrangeModalVisible] = useState<boolean>(false);

  const [projectInheritVisible, setProjectInheritVisible] = useState<boolean>(false);
  const [inheritProjectNeedParams, setInheritProjectNeedParams] = useState<any>({});

  const [chooseColumnsModal, setChooseColumnsModal] = useState<boolean>(false);
  // 项目时间阈值state
  const [minStartTime, setMinStartTime] = useState<number>();
  const [maxEndTime, setMaxEndTime] = useState<number>();

  const [auditKnotModalVisible, setAuditKnotModalVisible] = useState<boolean>(false);

  // 项目继承状态判断
  const [inheritState, setInheritState] = useState<boolean>(false);

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
    if (info.inheritState === 2) {
      setInheritState(true);
    }
    setEditProjectVisible(true);
    setCurrentEditProjectInfo(info);
  };

  const copyProjectEvent = (info: any) => {
    setCopyProjectVisible(true);
    setCurrentCopyProjectInfo(info);
  };

  const editEngineerEvent = async (data: AddProjectValue) => {
    // 编辑工程前获取工程下项目日期阈值
    const currentEditEngineer = tableData?.pagedData?.items
      .map((item: any) => {
        if (item.id === data.engineerId) {
          return item;
        }
      })
      .filter(Boolean);
    const minStartTime = Math.min(
      ...currentEditEngineer?.[0].projects.map((item: any) => {
        return item.startTime;
      }),
    );
    const maxEndTime = Math.max(
      ...currentEditEngineer?.[0].projects.map((item: any) => {
        return item.endTime;
      }),
    );

    setMinStartTime(minStartTime);
    setMaxEndTime(maxEndTime);
    setEditEngineerVisible(true);
    setCurrentEditEngineerId(data.engineerId);
  };

  const approvalEngineerEvent = (data: AddProjectValue) => {
    setCurrentAppEngineerId(data.engineerId);
    setApprovalEngineerVisible(true);
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

  const refreshByParams = (params: any) => {
    run({
      ...params,
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

  const { run: getExternalStep } = useRequest(getExternalArrangeStep, {
    manual: true,
  });

  const projectInherit = (projectInfo: any) => {
    setProjectInheritVisible(true);
    setInheritProjectNeedParams(projectInfo);
  };

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
            onClick={() => {
              editProjectEvent({
                projectId: tableItemData.id,
                areaId: engineerInfo.province,
                company: engineerInfo.company,
                companyName: engineerInfo.company,
                startTime: engineerInfo.startTime,
                endTime: engineerInfo.endTime,
                status: tableItemData.stateInfo.status,
                inheritState: tableItemData.stateInfo.inheritStatus,
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
        {/* {buttonJurisdictionArray?.includes('all-project-check-result') && (
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
        )} */}
        {jurisdictionInfo.canInherit && buttonJurisdictionArray?.includes('all-project-inherit') && (
          // all-project-inherit
          <Menu.Item
            onClick={() =>
              projectInherit({
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
            项目继承
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

  // 申请结项
  const applyKnotEvent = async (projectId: string[]) => {
    await applyKnot(projectId);
    message.success('申请结项成功');

    finishEvent?.();
  };

  // 重新继承
  const againInheritEvent = async (projectId: string) => {
    await againInherit(projectId);
    message.success('重新继承申请成功');

    finishEvent?.();
  };

  // 外审列表
  const externalEdit = async (projectId: string) => {
    setCurrentClickProjectId(projectId);
    setExternalListModalVisible(true);
  };

  const projectNameRender = (record: any) => {
    // 代表未继承
    if (!record.stateInfo.inheritStatus) {
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
    }
    if (record.stateInfo.inheritStatus) {
      if (record.stateInfo.inheritStatus === 1) {
        return <span className={styles.disabled}>[继承中...]{record.name}</span>;
      }
      if (record.stateInfo.inheritStatus === 2) {
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
      }
      if (record.stateInfo.inheritStatus === 3) {
        return <span className={styles.disabled}>{record.name}</span>;
      }
    }
  };

  const deleteFailProject = async (projectId: string) => {
    await deleteProject([projectId]);
    message.success('已取消项目继承');
    finishEvent?.();
  };

  const completeConfig = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 300,
      render: projectNameRender,
      ellipsis: true,
      iconSlot: (record: any, projects: any) => {
        const parentData = projects.filter((item: any) => item.id === record.inheritId);

        if (record.stateInfo.inheritStatus && parentData && parentData.length > 0) {
          if (record.stateInfo.inheritStatus === 3) {
            return (
              <>
                <Tooltip title={`继承自${record.inheritName}`}>
                  <span className={styles.inheritIcon}>
                    <LinkOutlined />
                  </span>
                </Tooltip>
                <span>
                  <Popconfirm
                    title="项目继承失败，请重试"
                    onConfirm={() => againInheritEvent(record.id)}
                    onCancel={() => deleteFailProject(record.id)}
                    okText="确认"
                    cancelText="取消"
                  >
                    <span className={styles.dangerColor}>[继承失败]</span>
                  </Popconfirm>
                </span>
              </>
            );
          }
          return (
            <Tooltip title={`继承自${record.inheritName}`}>
              <span className={styles.inheritIcon}>
                <LinkOutlined />
              </span>
            </Tooltip>
          );
        }
      },
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
      title: '建设改造目的',
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
        const status = record.exportCoordinate;
        return record.exportCoordinate === true ? (
          <span
            style={{ cursor: 'pointer' }}
            className="colorRed"
            onClick={() => {
              modifyExportPowerState({
                isEnable: !status,
                projectIds: [record.id],
              });
              finishEvent?.();
            }}
          >
            启用
          </span>
        ) : (
          <span
            style={{ cursor: 'pointer' }}
            className="colorPrimary"
            onClick={() => {
              modifyExportPowerState({
                isEnable: !status,
                projectIds: [record.id],
              });
              finishEvent?.();
            }}
          >
            禁用
          </span>
        );
      },
    },
    {
      title: '勘察人',
      dataIndex: 'surveyUser',
      width: 120,
      ellipsis: true,
      render: (record: any) => {
        return record.surveyUser ? `${record.surveyUser.value}` : '无需安排';
      },
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
      width: 120,
      ellipsis: true,
      render: (record: any) => {
        return record.designUser ? `${record.designUser.value}` : '';
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
        return sources?.map((item: any) => {
          return (
            <span key={uuid.v1()}>
              <CyTag color={colorMap[item] ? colorMap[item] : 'green'}>
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

        // 如果是继承失败 和 继承中，直接返回状态，不用做下面的判断了。
        if (
          record.stateInfo.inheritStatus &&
          (record.stateInfo.inheritStatus === 1 || record.stateInfo.inheritStatus === 3)
        ) {
          return <span>{stateInfo?.statusText}</span>;
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
                ) : identitys.findIndex((item: any) => item.value === 4) > -1 &&
                  stateInfo.status === 7 ? (
                  <span className="canClick" onClick={() => applyConfirm([record.id])}>
                    {stateInfo?.statusText}
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
                ) : stateInfo.status === 8 && stateInfo.outsideStatus === 95 ? (
                  <span
                    className="canClick"
                    onClick={() => externalArrange(record.id, record.name)}
                  >
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : stateInfo.status === 8 && stateInfo.outsideStatus === 100 ? (
                  <span className="canClick" onClick={() => externalEdit(record.id)}>
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : stateInfo.status === 8 && stateInfo.outsideStatus === 105 ? (
                  <span className="canClick" onClick={() => externalEdit(record.id)}>
                    {stateInfo?.outsideStatusText}
                  </span>
                ) : (
                  <span>{stateInfo?.showStatusText}</span>
                )}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('all-project-copy-project') && (
              <span>{stateInfo?.showStatusText}</span>
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
        const { operationAuthority, stateInfo } = record;

        if (
          stateInfo.inheritStatus &&
          (stateInfo.inheritStatus === 1 || stateInfo.inheritStatus === 3)
        ) {
          return (
            <Tooltip title="项目继承中，不能进行任何操作" placement="topRight">
              <BarsOutlined />
            </Tooltip>
          );
        }
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

  const applyConfirm = (id: string[]) => {
    Modal.confirm({
      title: '申请结项',
      icon: <ExclamationCircleOutlined />,
      content: ' 确定对该项目进行“申请结项”?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => applyKnotEvent(id),
    });
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
    const isOverflow = (tableContentSize.width ?? 0) - 40 - columnsWidth < 0;

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
    setAddProjectVisible(true);
    setProjectNeedInfo(projectNeedValue);
  };

  const tableItemSelectEvent = (projectSelectInfo: TableItemCheckedInfo) => {
    console.log(projectSelectInfo)
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
        editEngineer={editEngineerEvent}
        addProject={addProjectEvent}
        approvalEngineer={approvalEngineerEvent}
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

  const scrollEvent = (size: any) => {
    if (size) {
      const tableTitle = document.getElementsByClassName('tableTitleContent');
      const tableCheckbox = document.getElementsByClassName('checkboxContent');
      const tableNameTd = document.getElementsByClassName('nameTdContent');
      const tableActionTd = document.getElementsByClassName('actionTdContent');
      const tableStatusTd = document.getElementsByClassName('statusTdContent');
      if (tableTitle && tableTitle.length > 0) {
        for (let i = 0; i < tableTitle.length; i += 1) {
          // @ts-ignore
          tableTitle[i].style.left = `${size.scrollLeft}px`;
        }
      }
      if (tableCheckbox && tableCheckbox.length > 0) {
        for (let i = 0; i < tableCheckbox.length; i += 1) {
          // @ts-ignore
          tableCheckbox[i].style.left = `${size.scrollLeft}px`;
        }
      }
      if (tableNameTd && tableNameTd.length > 0) {
        for (let i = 0; i < tableNameTd.length; i += 1) {
          // @ts-ignore
          tableNameTd[i].style.left = `${size.scrollLeft + 38}px`;
        }
      }
      if (tableActionTd && tableActionTd.length > 0) {
        for (let i = 0; i < tableActionTd.length; i += 1) {
          // @ts-ignore
          tableActionTd[i].style.left = `${size.scrollLeft + tableContentSize.width - 60}px`;
        }
      }
      if (tableStatusTd && tableStatusTd.length > 0) {
        for (let i = 0; i < tableStatusTd.length; i += 1) {
          // @ts-ignore
          tableStatusTd[i].style.left = `${size.scrollLeft + tableContentSize.width - 180}px`;
        }
      }
    }
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
              style={{ display: 'inline-flex', paddingRight: '25px' }}
            />
            <span style={{ cursor: 'pointer' }} onClick={() => setChooseColumnsModal(true)}>
              <ImageIcon width={18} height={18} imgUrl="setting.png" />
            </span>
          </div>
        </div>

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
            minStart={minStartTime}
            maxEnd={maxEndTime}
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
            pointVisible={inheritState}
            setInheritState={setInheritState}
            onChange={setEditProjectVisible}
            changeFinishEvent={refreshEvent}
          />
        )}
        {approvalEngineerVisible && (
          <ApprovalProjectModal
            engineerId={currentAppEngineerId}
            // companyName={currentEditProjectInfo.companyName}
            // projectId={currentEditProjectInfo.projectId}
            // company={currentEditProjectInfo.company}
            // areaId={currentEditProjectInfo.areaId}
            // status={currentEditProjectInfo.status}
            // startTime={currentEditProjectInfo.startTime}
            // endTime={currentEditProjectInfo.endTime}
            visible={approvalEngineerVisible}
            onChange={setApprovalEngineerVisible}
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
            finishEvent={refreshEvent}
          />
        )}
        {projectInheritVisible && (
          <ProjectInheritModal
            companyName={inheritProjectNeedParams.companyName}
            projectId={inheritProjectNeedParams.projectId}
            company={inheritProjectNeedParams.company}
            areaId={inheritProjectNeedParams.areaId}
            status={inheritProjectNeedParams.status}
            startTime={inheritProjectNeedParams.startTime}
            endTime={inheritProjectNeedParams.endTime}
            engineerId={inheritProjectNeedParams.engineerId}
            visible={projectInheritVisible}
            onChange={setProjectInheritVisible}
            changeFinishEvent={refreshEvent}
          />
        )}
        {chooseColumnsModal && (
          <ColumnsConfigModal
            hasCheckColumns={chooseColumns}
            visible={chooseColumnsModal}
            onChange={setChooseColumnsModal}
            finishEvent={configFinishEvent}
          />
        )}
      </div>
    </TableContext.Provider>
  );
};

export default forwardRef(EngineerTable);
