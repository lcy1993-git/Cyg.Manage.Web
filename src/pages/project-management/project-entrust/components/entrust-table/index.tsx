/* eslint-disable no-nested-ternary */
import EmptyTip from '@/components/empty-tip';
import { getEntrustProjectList } from '@/services/project-management/project-entrust';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { delay } from '@/utils/utils';
import { useRequest, useSize } from 'ahooks';
import { Menu, message, Modal, Popconfirm, Tooltip } from 'antd';
import { Spin } from 'antd';
import { Pagination } from 'antd';
import { forwardRef, useImperativeHandle, Ref, useRef, useMemo, useState } from 'react';

import EngineerTableItem, {
  AddProjectValue,
  TableItemCheckedInfo,
} from '@/pages/project-management/all-project-new/components/engineer-table/engineer-table-item';
import ScrollView from 'react-custom-scrollbars';
import styles from './index.less';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';
import { TableContext } from '@/pages/project-management/all-project-new/components/engineer-table/table-store';
import EngineerDetailInfo from '@/pages/project-management/all-project-new/components/engineer-detail-info';
import ProjectDetailInfo from '@/pages/project-management/all-project-new/components/project-detail-info';
import moment from 'moment';

interface EntrustTableProps {
  extractParams: any;
  onSelect?: (checkedValue: TableItemCheckedInfo[]) => void;
  getStatisticsData?: (value: any) => void;
  columnsConfig: string[];
  finishEvent: () => void;
  configFinishEvent?: (checkedValue: any) => void;
}

const EntrustTable = (props: EntrustTableProps, ref: Ref<any>) => {
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

  const [projectNeedInfo, setProjectNeedInfo] = useState({
    engineerId: '',
    areaId: '',
    company: '',
    companyName: '',
  });

  const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false);
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);

  const { data: tableData, loading, run } = useRequest(() => getEntrustProjectList(extractParams));

  const scrollbar = useRef<any>(null);
  const tableContentRef = useRef<HTMLDivElement>(null);

  const tableContentSize = useSize(tableContentRef);
  console.log(tableContentSize, '213');

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const projectNameClickEvent = (engineerId: string) => {
    setCurrentClickEngineerId(engineerId);
    setEngineerModalVisible(true);
  };

  // const refreshEvent = () => {
  //   run({
  //     ...extractParams,
  //     pageIndex,
  //     pageSize,
  //   });
  //   setTableSelectData([]);
  //   onSelect?.([]);
  // };

  // const refreshByParams = (params: any) => {
  //   run({
  //     ...params,
  //   });
  //   setTableSelectData([]);
  //   onSelect?.([]);
  // };

  // const delayRefresh = async () => {
  //   await delay(500);
  //   run({
  //     ...extractParams,
  //     pageIndex,
  //     pageSize,
  //   });
  //   setTableSelectData([]);
  //   onSelect?.([]);
  // };

  const completeConfig = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 300,
      //   render: projectNameRender,
      ellipsis: true,
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
      title: '项目批次',
      dataIndex: 'batchText',
      width: 120,
      ellipsis: true,
    },
  ];

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
    // const showColumns = completeConfig.filter((item) => chooseColumns.includes(item.dataIndex));

    const columnsWidth = completeConfig.reduce((sum, item) => {
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
      columns: completeConfig,
      columnsWidth: columnsWidth + 38,
    };
  }, [chooseColumns, JSON.stringify(tableContentSize.width)]);

  console.log(columnsInfo, '2233');

  const tableResultData = useMemo(() => {
    if (tableData) {
      // const { pagedData, statistics } = tableData;
      const { items, pageIndex: resPageIndex, pageSize: resPageSize, total } = tableData;
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

    // run({
    //   ...extractParams,
    //   pageIndex: 1,
    //   pageSize: size,
    // });
    setTableSelectData([]);
    onSelect?.([]);
  };

  // 列显示处理
  const currentPageChange = (page: any, size: any) => {
    // 判断当前page是否改变, 没有改变代表是change页面触发
    // if (pageSize === size) {
    //   setPageIndex(page === 0 ? 1 : page);
    //   run({
    //     ...extractParams,
    //     pageIndex: page,
    //     pageSize,
    //   });
    //   setTableSelectData([]);
    //   onSelect?.([]);
    // }
  };

  const tableItemSelectEvent = (projectSelectInfo: TableItemCheckedInfo) => {
    console.log(projectSelectInfo);
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
        noPadding={true}
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
    // refresh: () => {
    //   run({
    //     ...extractParams,
    //     pageIndex,
    //     pageSize,
    //   });
    //   setTableSelectData([]);
    //   onSelect?.([]);
    // },
    // search: () => {
    //   setPageIndex(1);
    //   run({
    //     ...extractParams,
    //     pageIndex: 1,
    //     pageSize,
    //   });
    //   if (scrollbar && scrollbar.current) {
    //     // @ts-ignore
    //     scrollbar.current.view.scroll({
    //       top: 0,
    //       behavior: 'smooth',
    //     });
    //   }
    //   setTableSelectData([]);
    //   onSelect?.([]);
    // },
    // searchByParams: (params: object) => {
    //   setPageIndex(1);
    //   run({
    //     ...params,
    //     pageIndex: 1,
    //     pageSize,
    //   });
    //   if (scrollbar && scrollbar.current) {
    //     scrollbar.current.view.scroll({
    //       top: 0,
    //       behavior: 'smooth',
    //     });
    //   }
    //   setTableSelectData([]);
    //   onSelect?.([]);
    // },
    // delayRefresh: async (ms: number) => {
    //   await delay(500);
    //   run({
    //     ...extractParams,
    //     pageIndex,
    //     pageSize,
    //   });
    //   setTableSelectData([]);
    //   onSelect?.([]);
    // },
  }));

  const scrollEvent = (size: any) => {
    console.log(size, '666');

    if (size) {
      const tableTitle = document.getElementsByClassName('tableTitleContent');
      const tableCheckbox = document.getElementsByClassName('checkboxContent');
      const tableNameTd = document.getElementsByClassName('nameTdContent');

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
          </div>
        </div>
      </div>
      {projectModalVisible && (
        <ProjectDetailInfo
          projectId={currentClickProjectId}
          visible={projectModalVisible}
          onChange={setProjectModalVisible}
        />
      )}

      {engineerModalVisible && (
        <EngineerDetailInfo
          engineerId={currentClickEngineerId}
          visible={engineerModalVisible}
          onChange={setEngineerModalVisible}
        />
      )}
    </TableContext.Provider>
  );
};

export default forwardRef(EntrustTable);
