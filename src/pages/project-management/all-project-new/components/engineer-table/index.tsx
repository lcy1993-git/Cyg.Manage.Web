import EmptyTip from '@/components/empty-tip';
import {
  AllProjectStatisticsParams,
  getProjectTableList,
} from '@/services/project-management/all-project';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { delay } from '@/utils/utils';
import { useRequest, useSize } from 'ahooks';
import { Menu } from 'antd';
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

const colorMap = {
  立项: 'green',
  委托: 'blue',
  共享: 'yellow',
  执行: 'yellow',
};

interface ExtractParams extends AllProjectStatisticsParams {
  statisticalCategory?: string;
}

interface EngineerTableProps {
  extractParams: ExtractParams;
  onSelect?: (checkedValue: TableItemCheckedInfo[]) => void;
  afterSearch?: () => void;
  delayRefresh?: () => void;
  getStatisticsData?: (value: any) => void;
}

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
  const { extractParams, onSelect, afterSearch, delayRefresh, getStatisticsData } = props;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

  const { data: tableData, loading, run } = useRequest(getProjectTableList, { manual: true });

  const tableContentRef = useRef<HTMLDivElement>(null);

  const tableContentSize = useSize(tableContentRef);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const projectNameClickEvent = (engineerId: string) => {};

  const editProjectEvent = (projectNeedInfo: any) => {};

  const copyProjectEvent = (projectNeedInfo: any) => {};

  const editEngineerEvent = (data: AddProjectValue) => {};

  const [leftNumber, setLeftNumber] = useState<number>(0);

  const projectItemMenu = (
    jurisdictionInfo: JurisdictionInfo,
    tableItemData: any,
    engineerInfo: any,
  ) => {
    return (
      <Menu>
        {jurisdictionInfo.canEdit && buttonJurisdictionArray?.includes('all-project-edit-project') && (
          <Menu.Item
          // onClick={() => {
          //   editProjectEvent({
          //     projectId: tableItemData.id,
          //     areaId: engineerInfo.province,
          //     company: engineerInfo.company,
          //     companyName: engineerInfo.company,
          //     status: tableItemData.stateInfo.status,
          //   });
          // }}
          >
            编辑
          </Menu.Item>
        )}
        {jurisdictionInfo.canCopy && buttonJurisdictionArray?.includes('all-project-copy-project') && (
          <Menu.Item
          // onClick={() =>
          //   copyProjectEvent({
          //     projectId: tableItemData.id,
          //     areaId: engineerInfo.province,
          //     company: engineerInfo.company,
          //     engineerId: engineerInfo.id,
          //     companyName: engineerInfo.company,
          //   })
          // }
          >
            复制项目
          </Menu.Item>
        )}
        {buttonJurisdictionArray?.includes('all-project-check-result') && (
          <Menu.Item
          // onClick={() =>
          //   checkResult({
          //     projectId: tableItemData.id,
          //     projectName: tableItemData.name,
          //     projectStatus: tableItemData.stateInfo.statusText,
          //     projectStage: tableItemData.stageText,
          //   })
          // }
          >
            查看成果
          </Menu.Item>
        )}
      </Menu>
    );
  };

  const completeConfig = [
    {
      title: '项目名称',
      dataIndex: 'name',
      width: 120,
      render: (record: any) => {
        return (
          <u
            className="canClick"
            // onClick={() => {
            //   setCurrentClickProjectId(record.id);
            //   setProjectModalVisible(true);
            // }}
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
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevelText',
      width: 100,
    },
    {
      title: '项目性质',
      dataIndex: 'natureTexts',
      width: 120,
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
      width: 120,
    },
    {
      title: '建设建造目的',
      dataIndex: 'majorCategoryText',
      width: 120,
    },
    {
      title: '所属市公司',
      dataIndex: 'majorCategoryText',
      width: 120,
    },
    {
      title: '所属县公司',
      dataIndex: 'majorCategoryText',
      width: 120,
    },
    {
      title: '建设类型',
      dataIndex: 'constructTypeText',
      width: 120,
    },
    {
      title: '项目类别',
      dataIndex: 'constructTypeText',
      width: 120,
    },
    {
      title: '项目阶段',
      dataIndex: 'stageText',
      width: 120,
    },
    {
      title: '项目属性',
      dataIndex: 'batchText',
      width: 120,
    },
    {
      title: '交底范围',
      dataIndex: 'batchText',
      width: 120,
    },
    {
      title: '桩位范围',
      dataIndex: 'batchText',
      width: 120,
    },
    {
      title: '现场数据来源',
      dataIndex: 'batchText',
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
      render: (record: any) => {
        return record.surveyUser.value;
      },
    },
    {
      title: '设计人',
      dataIndex: 'designUser',
      width: 120,
      render: (record: any) => {
        return record.designUser.value;
      },
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
      width: 140,
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
      render: (record: any) => {},
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

  const chooseColumns = [
    'name',
    'categoryText',
    'kvLevelText',
    'natureTexts',
    'majorCategoryText',
    'constructTypeText',
    'stageText',
    'batchText',
    'status',
    'action',
  ];

  const columnsInfo = useMemo(() => {
    const showColumns = completeConfig.filter((item) => chooseColumns.includes(item.dataIndex));
    const columnsWidth = showColumns.reduce((sum, item) => {
      return sum + (item.width ? item.width : 100);
    }, 0);
    const isOverflow = (tableContentSize.width ?? 0) - 50 - columnsWidth < 0;
    return {
      isOverflow,
      columns: showColumns,
      columnsWidth: columnsWidth + 38,
    };
  }, [chooseColumns, JSON.stringify(tableContentSize)]);

  const tableResultData = useMemo(() => {
    if (tableData) {
      const { pagedData, statistics } = tableData;
      const { items, pageIndex, pageSize, total } = pagedData;
      getStatisticsData?.(statistics);
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

  const pageSizeChange = () => {};

  const currentPageChange = () => {};

  const addProjectEvent = (data: any) => {};

  const tableItemSelectEvent = (data: any) => {};

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
      if (tableContentRef && tableContentRef.current) {
        //@ts-ignore
        tableContentRef.current.scrollTop = 0;
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
    const {style,...rest} = params;
    const viewStyle = {
      backgroundColor: `rgba(0, 0, 0, 0.2)`,
      borderRadius: "6px",
      cursor: "pointer",
      zIndex: 100
    };
    return (
      <div style={{ ...style,...viewStyle }} {...rest} />
    );
  }
  return (
    <div className={styles.engineerTable}>
      <div className={styles.engineerTableContent} ref={tableContentRef}>
        <ScrollView onUpdate={scrollEvent} renderThumbHorizontal={scrollBarRenderView} renderThumbVertical={scrollBarRenderView}>
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
    </div>
  );
};

export default forwardRef(EngineerTable);
