import React, {
  forwardRef,
  Ref,
  useMemo,
  useState,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
import { useMount, useRequest } from 'ahooks';
import { tableCommonRequest } from '@/services/table';
import { Table, Pagination, message, Tooltip, Menu, Dropdown, Checkbox } from 'antd';
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
    ...rest
  } = props;

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [lineConfigVisible, setLineConfigVisible] = useState(false);
  const [finallyColumns, setFinalyColumns] = useState<any[]>([]);

  const tableRef = useRef<HTMLDivElement>(null);

  const { data, run } = useRequest(tableCommonRequest, {
    ready: !!url,
    refreshDeps: [JSON.stringify(extractParams), currentPage, pageSize],
    manual: true,
  });

  const tableResultData = useMemo(() => {
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
  }, [JSON.stringify(data)]);

  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      getSelectData?.(selectedRows);
    },
  };

  // 改变视图
  const changeView = () => {};

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
    run({
      url: url,
      extraParams: extractParams,
      pageIndex: currentPage,
      pageSize,
    });
  }, [pageSize, currentPage]);

  useImperativeHandle(ref, () => ({
    // changeVal 就是暴露给父组件的方法
    refresh: () => {
      run({
        url: url,
        extraParams: extractParams,
        pageIndex: currentPage,
        pageSize,
      });
    },
    search: () => {
      run({
        url,
        pageSize,
        pageIndex: 1,
        extraParams: extractParams,
      });
    },
    searchByParams: (params: object) => {
      run({
        url,
        pageSize,
        pageIndex: 1,
        extraParams: params,
      });
    }
  }));

  useMount(() => {
    run({
      url: url,
      extraParams: extractParams,
      pageIndex: currentPage,
      pageSize,
    });
  });

  useEffect(() => {
    const newColumns = columns.map((item) => ({ ...item, checked: true }));
    setFinalyColumns(newColumns);
  }, [JSON.stringify(columns)]);

  return (
    <div className={styles.cyGeneralTable} ref={tableRef}>
      <div className={styles.cyGeneralTableButtonContent}>
        <div className={styles.cyGeneralTableButtonLeftContent}>{buttonLeftContentSlot?.()}</div>
        <div className={styles.cyGeneralTableButtonRightContent}>{buttonRightContentSlot?.()}</div>
      </div>
      <div className={styles.cyGeneralTableOtherSlot}>{otherSlot?.()}</div>
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
                <RedoOutlined onClick={() => refreshTable()} className={styles.tableCommonButton} />
              </Tooltip>
              <Dropdown overlay={columnsMenuElement} visible={lineConfigVisible}>
                <Tooltip title="列设置">
                  <UnorderedListOutlined
                    onClick={() => setLineConfigVisible(!lineConfigVisible)}
                    className={styles.tableCommonButton}
                  />
                </Tooltip>
              </Dropdown>
            </div>
          )}
        </div>
      </div>
      <div className={styles.cyGeneralTableConetnt}>
        <WrapperComponent
          bordered={true}
          dataSource={tableResultData.items}
          pagination={false}
          rowKey="id"
          columns={finallyColumns.filter((item) => item.checked)}
          locale={{
            emptyText: <EmptyTip className="pt20 pb20" />,
          }}
          rowSelection={{
            type: type,
            columnWidth: '38px',
            ...rowSelection,
          }}
          {...((rest as unknown) as P)}
        />
      </div>
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
            hideOnSinglePage={true}
            showSizeChanger
            showQuickJumper
            onShowSizeChange={pageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default forwardRef(withGeneralTable(Table));
