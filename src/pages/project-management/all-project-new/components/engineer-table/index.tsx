import EmptyTip from '@/components/empty-tip';
import {
  AllProjectStatisticsParams,
  getProjectTableList,
} from '@/services/project-management/all-project';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { delay } from '@/utils/utils';
import { useRequest } from 'ahooks';
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

interface ExtractParams extends AllProjectStatisticsParams {
  statisticalCategory?: string;
}

interface EngineerTableProps {
  extractParams: ExtractParams;
  onSelect?: (checkedValue: TableItemCheckedInfo[]) => void;
  afterSearch?: () => void;
  delayRefresh?: () => void;
}

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
  const { extractParams, onSelect, afterSearch, delayRefresh, getStatisticsData } = props;
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

  const { data: tableData, loading, run } = useRequest(getProjectTableList, { manual: true });

  const tableContentRef = useRef<HTMLDivElement>(null);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const projectNameClickEvent = (engineerId: string) => {};

  const editProjectEvent = (projectNeedInfo: any) => {};

  const copyProjectEvent = (projectNeedInfo: any) => {};

  const editEngineerEvent = (data: AddProjectValue) => {};

  const [leftNumber , setLeftNumber] = useState<number>(0);

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

  const pageSizeChange = () => {};

  const currentPageChange = () => {};

  const addProjectEvent = (data: any) => {};

  const tableItemSelectEvent = (data: any) => {};

  const projectTableColumns = [];

  const engineerTableElement = tableResultData?.items.map((item: any) => {
    return (
      <EngineerTableItem
        left={leftNumber}
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
    console.log(size)
    setLeftNumber(size.scrollLeft)
  }

  return (
    <div className={styles.engineerTable}>
      <div className={styles.engineerTableContent} ref={tableContentRef}>
        <ScrollView onUpdate={scrollEvent}>
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
