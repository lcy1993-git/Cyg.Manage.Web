import React, { useMemo, useRef, useState } from "react";
import { Table, Tooltip, Pagination, Button } from "antd"
import EmptyTip from '@/components/empty-tip'
import { FolderOutlined, FolderOpenOutlined, FullscreenOutlined, RedoOutlined, UpOutlined, DownOutlined, FileOutlined } from '@ant-design/icons';
import CommonTitle from "@/components/common-title"

import styles from './index.less';

interface Props {
  dataSource: any[];
  columns: any[];
  refreshTable: () => void;
  tableTitle?: string | JSX.Element;
  openIcon?: JSX.Element;
  closeIcon?: JSX.Element;
  noPaging?: boolean;
  needTitleLine?: boolean;
  pageIndex: number;
  total?: number;
  // 外部获取被选中的数据
  getSelectData?: (value: object[]) => void;
  rowKey?: string;
  buttonLeftContentSlot?: ()=>JSX.Element;
  buttonRightContentSlot?: ()=>JSX.Element;
  otherSlot?: ()=>JSX.Element;
  expKeysAll?: string[];
}

const FileTreeTable: React.FC<Props> = ({
  dataSource,
  columns,
  refreshTable,
  pageIndex,
  total,
  noPaging = true,
  tableTitle = "",
  needTitleLine = true,
  rowKey = "id",
  expKeysAll = [],
  getSelectData,
  buttonLeftContentSlot,
  buttonRightContentSlot,
  otherSlot,
  openIcon = (<span className={styles.folder}><FolderOpenOutlined />&nbsp;</span>),
  closeIcon = (<span className={styles.folder}><FolderOutlined />&nbsp;</span>),
  ...rest
}) => {

  const tableRef = useRef<HTMLDivElement>(null);

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [expKeys, setExpKeys] = useState<string[]>([]);

  const page = useMemo(() => {
    return {
      pageSize,
      pageIndex,
      total,
      dataStartIndex: Math.floor((pageIndex - 1) * pageSize + 1),
      dataEndIndex: Math.floor((pageIndex - 1) * pageSize + (dataSource ?? []).length),
    }
  }, [pageSize, pageIndex, total]);

  const pageSizeChange = (page: any, size: any) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  // 刷新列表
  // const refreshTable = () => {
  //   run({
  //     url: url,
  //     extraParams: extractParams,
  //     pageIndex: currentPage,
  //     pageSize,
  //     requestSource,
  //     postType,
  //   });
  //   message.success('刷新成功');
  // };

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

  return (
    <div className={styles.cyGeneralTable} ref={tableRef}>
      <div className={styles.cyGeneralTableButtonContent}>
        <div className={styles.cyGeneralTableButtonLeftContent}>{buttonLeftContentSlot?.()}</div>
        <div className={styles.cyGeneralTableButtonRightContent}>{buttonRightContentSlot?.()}
          <Button className="mr7" onClick={()=>setExpKeys(expKeysAll)}>
            <DownOutlined />
            全部展开
          </Button>
          <Button className="mr7" onClick={()=>setExpKeys([])}>
            <UpOutlined />
            全部折叠
          </Button>
        </div>
      </div>
      <div className={styles.cyGeneralTableOtherSlot}>{otherSlot?.()}</div>
      {needTitleLine && (
        <div className={styles.cyGeneralTableTitleContnet}>
          <div className={styles.cyGeneralTableTitleShowContent}>
            {tableTitle && <CommonTitle>{tableTitle}</CommonTitle>}
          </div>
          <div className={styles.cyGeneralTableCommonButton}>

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
              </div>
          </div>
        </div>
      )}
      <div className={styles.cyGeneralTableConetnt}>
        <Table
          dataSource={dataSource}
          columns={columns}
          rowKey={e => e.id}
          bordered={true}
          expandedRowKeys={expKeys}
          onExpand={(b, r) => {
            const newExp: any = b ? [...expKeys, r.id] : expKeys.filter(i => i !== r.id);
            setExpKeys(newExp);
          }}
          expandable={{
            rowExpandable: r => true,
            expandRowByClick: true,
            defaultExpandAllRows: true,
            expandIcon: (r) => {
              if(!r.record.children || r.record.children?.length === 0) {
                return (
                  <span className={styles.folder}>
                    <FileOutlined />&nbsp;
                  </span>
                );
              }
              if (r.expanded) {
                return (
                  <span className={styles.folder}>
                    <FolderOpenOutlined />&nbsp;
                  </span>
                );
              } else {
                return (
                  <span className={styles.folder}>
                    <FolderOutlined />&nbsp;
                  </span>
                );
              }

            }
          }}
          rowSelection={{
            type: "radio",
            columnWidth: '38px',
            // selectedRowKeys: selectedRowKeys,
            // ...rowSelection,
          }}
          pagination={false}
          locale={{
            emptyText: <EmptyTip className="pt20 pb20" />,
          }}
          {...rest}
        />
        {/* <WrapperComponent
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
      /> */}
      </div>
      {!noPaging && (
        <div className={styles.cyGeneralTablePaging}>
          <div className={styles.cyGeneralTablePagingLeft}>
            <span>显示第</span>
            <span className={styles.importantTip}>{page.dataStartIndex}</span>
            <span>到第</span>
            <span className={styles.importantTip}>{page.dataEndIndex}</span>
            <span>条记录,总共</span>
            <span className={styles.importantTip}>{page.total}</span>
            <span>条记录</span>
          </div>
          <div className={styles.cyGeneralTablePagingRight}>
            <Pagination
              pageSize={pageSize}
              onChange={currentPageChange}
              size="small"
              total={page.total}
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
}

export default FileTreeTable;