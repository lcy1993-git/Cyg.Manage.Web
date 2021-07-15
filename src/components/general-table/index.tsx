import React, {
  forwardRef,
  Ref,
  useMemo,
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { useRequest } from 'ahooks';
import { tableCommonRequest, TableRequestResult } from '@/services/table';
import { Table, Pagination, message, Tooltip, Menu, Popover, Checkbox } from 'antd';
import styles from './index.less';
import CommonTitle from '../common-title';
import { FullscreenOutlined, RedoOutlined, UnorderedListOutlined } from '@ant-design/icons';
import EmptyTip from '../empty-tip';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';


interface GeneralTableProps {
  // 列表请求的url
  url: string;
  // 请求所需要附带的额外参数
  extractParams?: object;
  // Button 区域左边插入
  buttonLeftContentSlot?: () => React.ReactNode;
  // Button 区域右边插入
  buttonRightContentSlot?: () => React.ReactNode;
  // 在标题上方插入一行
  otherSlot?: () => React.ReactNode;
  // 列表的名称
  tableTitle?: string | React.ReactNode;
  // 需要展示common的按钮
  needCommonButton?: boolean;
  // 外部获取被选中的数据
  getSelectData?: (value: object[]) => void;
  // 在title旁边插入东西
  titleSlot?: () => React.ReactNode;
  // columns
  columns: any[];

  type?: TableSelectType;

  rowKey?: string;

  requestSource?: 'project' | 'common' | 'resource' | 'tecEco' | 'tecEco1';

  noPaging?: boolean;

  needTitleLine?: boolean;

  defaultPageSize?: number;

  postType?: 'body' | 'query';

  getTableRequestData?: (data: TableRequestResult) => void;

  hasFooter?: boolean;

  // 获取id时候的bug,针对技经端拿不到行ID时的情况
  cruxKey?: string;

  // 当表格需要id传参时，判断当前id是否为空，若为空则限制请求
  requestConditions?: string;
}

type TableSelectType = 'radio' | 'checkbox';

const withGeneralTable = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & GeneralTableProps,
  ref: Ref<any>,
) => {
  const {
    url,
    columns = [],
    tableTitle,
    needCommonButton = false,
    getSelectData,
    titleSlot,
    extractParams,
    buttonLeftContentSlot,
    buttonRightContentSlot,
    otherSlot,
    type = 'radio',
    rowKey = 'id',
    requestSource = 'project',
    noPaging = false,
    needTitleLine = true,
    defaultPageSize = 10,
    postType = 'body',
    getTableRequestData,
    hasFooter = true,
    cruxKey = "",
    requestConditions = true,
    ...rest
  } = props;

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [finallyColumns, setFinalyColumns] = useState<any[]>([]);

  const tableRef = useRef<HTMLDivElement>(null);

  const { data, run, loading } = useRequest(tableCommonRequest, {
    manual: true,
    onSuccess: () => {
      getTableRequestData?.(data!);
    },
  });

  const tableResultData = useMemo(() => {
    if (!noPaging) {
      if (data) {
        const { items, pageIndex, pageSize, total } = data;
        return {
          items: items ?? [],
          pageIndex,
          pageSize,
          total,
          dataStartIndex: Math.floor((pageIndex - 1) * pageSize + 1),
          dataEndIndex: Math.floor((pageIndex - 1) * pageSize + (items ?? []).length),
        };
      }
      return {
        items: [],
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        dataStartIndex: 0,
        dataEndIndex: 0,
      };
    } else {
      if (data) {
        return {
          items: data ?? [],
        };
      }
      return {
        items: [],
      };
    }
  }, [JSON.stringify(data)]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setSelectedRowKeys(selectedRows.map((item) => cruxKey ? item[cruxKey]["id"] : item[rowKey]));
      getSelectData?.(selectedRows);
    },
  };

  const columnChangeEvent = (value: boolean, dataIndex: string) => {
    const copyColumns = [...finallyColumns];
    const changeIndex = copyColumns.findIndex((item) => item.dataIndex === dataIndex);
    if (changeIndex > -1) {
      copyColumns.splice(changeIndex, 1, { ...copyColumns[changeIndex], checked: value });
      setFinalyColumns(copyColumns);
    }
  };

  // 菜单
  const columnsMenu = finallyColumns.map((item) => {
    return (
      <Menu.Item key={item.dataIndex}>
        <Checkbox
          checked={item.checked}
          onChange={(e: CheckboxChangeEvent) => columnChangeEvent(e.target.checked, item.dataIndex)}
        >
          {item.title}
        </Checkbox>
      </Menu.Item>
    );
  });

  const columnsMenuElement = <Menu>{columnsMenu}</Menu>;

  // 刷新列表
  const refreshTable = () => {
    run({
      url: url,
      extraParams: extractParams,
      pageIndex: currentPage,
      pageSize,
      requestSource,
      postType,
    });
    message.success('刷新成功');
  };
  // 全屏
  const fullScreen = () => {
    if (!tableRef.current || !document.fullscreenEnabled) {
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      tableRef.current.requestFullscreen();
    }
  };

  // 列显示处理
  const currentPageChange = (page: any, size: any) => {
    // 判断当前page是否改变, 没有改变代表是change页面触发
    if (pageSize === size) {
      setCurrentPage(page === 0 ? 1 : page);
    }
  };

  const pageSizeChange = (page: any, size: any) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  useEffect(() => {
    requestConditions && run({
      url: url,
      extraParams: extractParams,
      pageIndex: currentPage,
      pageSize,
      requestSource,
      postType,
    });
  }, [pageSize, currentPage, requestConditions]);

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    refresh: () => {
      run({
        url: url,
        extraParams: extractParams,
        pageIndex: currentPage,
        pageSize,
        requestSource,
        postType,
      });
    },
    search: () => {
      setCurrentPage(1);
      run({
        url,
        pageSize,
        pageIndex: 1,
        extraParams: extractParams,
        requestSource,
        postType,
      });
      setSelectedRowKeys([]);
      getSelectData?.([]);
    },
    searchByParams: (params: object) => {
      setCurrentPage(1);
      run({
        url,
        pageSize,
        pageIndex: 1,
        extraParams: params,
        requestSource,
        postType,
      });
      setSelectedRowKeys([]);
      getSelectData?.([]);
    },
    reset: () => {
      setCurrentPage(1);
      setSelectedRowKeys([]);
      getSelectData?.([]);
    },
    resetSelectedRows: () => {
      setSelectedRowKeys([]);
      getSelectData?.([]);
    },
  }));

  useEffect(() => {
    const newColumns = columns.map((item) => ({ ...item, checked: true }));
    setFinalyColumns(newColumns);
  }, [JSON.stringify(columns)]);

  useEffect(() => {
    if (defaultPageSize) {
      setPageSize(defaultPageSize);
    }
  }, [defaultPageSize]);

  return (
    <div className={styles.cyGeneralTable} ref={tableRef}>
      <div className={styles.cyGeneralTableButtonContent}>
        <div className={styles.cyGeneralTableButtonLeftContent}>{buttonLeftContentSlot?.()}</div>
        <div className={styles.cyGeneralTableButtonRightContent}>{buttonRightContentSlot?.()}</div>
      </div>
      <div className={styles.cyGeneralTableOtherSlot}>{otherSlot?.()}</div>
      {needTitleLine && (
        <div className={styles.cyGeneralTableTitleContnet}>
          <div className={styles.cyGeneralTableTitleShowContent}>
            {tableTitle && <CommonTitle>{tableTitle}</CommonTitle>}
          </div>
          <div className={styles.cyGeneralTableTitleSlot}>{titleSlot?.()}</div>
          <div className={styles.cyGeneralTableCommonButton}>
            {needCommonButton && (
              <div>
                <Tooltip title="全屏">
                  <FullscreenOutlined
                    onClick={() => fullScreen()}
                    className={styles.tableCommonButton}
                  />
                </Tooltip>
                <Tooltip title="刷新">
                  <RedoOutlined
                    onClick={() => refreshTable()}
                    className={styles.tableCommonButton}
                  />
                </Tooltip>
                <Popover
                  content={columnsMenuElement}
                  placement="bottomLeft"
                  title={null}
                  trigger="click"
                >
                  <Tooltip title="列设置">
                    <UnorderedListOutlined className={styles.tableCommonButton} />
                  </Tooltip>
                </Popover>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.cyGeneralTableConetnt}>
        <WrapperComponent
          bordered={true}
          dataSource={tableResultData.items}
          pagination={false}
          rowKey={rowKey}
          columns={finallyColumns.filter((item) => item.checked)}
          loading={loading}
          locale={{
            emptyText: <EmptyTip className="pt20 pb20" />,
          }}
          rowSelection={{
            type: type,
            columnWidth: '38px',
            selectedRowKeys: selectedRowKeys,
            ...rowSelection,
          }}
          {...((rest as unknown) as P)}
        />
      </div>

      {!noPaging && (
        <div className={styles.cyGeneralTablePaging}>
          <div className={styles.cyGeneralTablePagingLeft}>
            <span>显示第</span>
            <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
            <span>到第</span>
            <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
            <span>条记录,总共</span>
            <span className={styles.importantTip}>{tableResultData.total}</span>
            <span>条记录</span>
          </div>
          <div className={styles.cyGeneralTablePagingRight}>
            <Pagination
              pageSize={pageSize}
              onChange={currentPageChange}
              size="small"
              total={tableResultData.total}
              current={currentPage}
              // hideOnSinglePage={true}
              showSizeChanger
              showQuickJumper
              onShowSizeChange={pageSizeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default forwardRef(withGeneralTable(Table));
