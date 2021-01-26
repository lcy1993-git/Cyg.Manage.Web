import React, { forwardRef, Ref, useMemo, useState,useImperativeHandle } from "react";
import { useRequest } from "ahooks";
import { tableCommonRequest } from "@/services/table"
import { Table, Pagination, message } from "antd"
import styles from "./index.less";
import CommonTitle from "../common-title";

interface GeneralTableProps {
    // 列表请求的url
    url: string,
    // 请求所需要附带的额外参数
    extractParams?: object
    // Button 区域左边插入
    buttonLeftContentSlot?: () => React.ReactNode
    // Button 区域右边插入
    buttonRightContentSlot?: () => React.ReactNode
    // 在标题上方插入一行
    otherSlot?: () => React.ReactNode
    // 列表的名称
    tableTitle?: string | React.ReactNode
    // 需要展示common的按钮
    needCommonButton?: boolean
    // 外部获取被选中的数据
    getSelectData?: (value: object[]) => void
}

const withGeneralTable = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (props: P & GeneralTableProps, ref: Ref<any>) => {
    const { url, tableTitle, needCommonButton = false, getSelectData, extractParams, buttonLeftContentSlot, buttonRightContentSlot, otherSlot, ...rest } = props;
    
    const [pageSize, setPageSize] = useState<number>(10);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const { data, run } = useRequest(() => tableCommonRequest({ url: url, extraParams: extractParams, pageIndex: currentPage, pageSize}), {
        ready: !!url,
        refreshDeps: [JSON.stringify(extractParams),currentPage,pageSize]
    });

    const tableResultData = useMemo(() => {
        if (data) {
            const { items, pageIndex, pageSize, total } = data;
            return {
                items,
                pageIndex,
                pageSize,
                total,
                dataStartIndex: Math.floor(((pageIndex - 1) * pageSize) + 1),
                dataEndIndex: Math.floor(((pageIndex - 1) * pageSize) + items.length),
            }
        }
        return {
            items: [],
            pageIndex: 1,
            pageSize: 20,
            total: 0,
            dataStartIndex: 0,
            dataEndIndex: 0
        }
    }, [JSON.stringify(data)])

    const rowSelection = {
        onChange: (values: any[], selectedRows: any[]) => {
            getSelectData?.(selectedRows);
        },
    };

    // 改变视图
    const changeView = () => {

    }
    // 刷新列表
    const refreshTable = () => {
        run();
        message.success("刷新成功");
    }
    // 全屏
    const fullScreen = () => {

    }
    // 列显示处理

    const currentPageChange = (page: any, pageSize: any) => {
        setCurrentPage(page)
        setPageSize(pageSize)
    }

    useImperativeHandle(ref, () => ({
        // changeVal 就是暴露给父组件的方法
        refresh: () => {
            run()
        }
    }));

    return (
        <div className={styles.cyGeneralTable}>
            <div className={styles.cyGeneralTableButtonContent}>
                <div className={styles.cyGeneralTableButtonLeftContent}>
                    {buttonLeftContentSlot?.()}
                </div>
                <div className={styles.cyGeneralTableButtonRightContent}>
                    {buttonRightContentSlot?.()}
                </div>
            </div>
            <div className={styles.cyGeneralTableOtherSlot}>
                {
                    otherSlot?.()
                }
            </div>
            <div className={styles.cyGeneralTableTitleContnet}>
                <div className={styles.cyGeneralTableTitleShowContent}>
                    {
                        tableTitle &&
                        <CommonTitle>{tableTitle}</CommonTitle>
                    }
                </div>
                <div className={styles.cyGeneralTableCommonButton}>
                    {
                        needCommonButton &&
                        <div>
                            公用
                        </div>
                    }
                </div>
            </div>
            <div className={styles.cyGeneralTableConetnt}>
                <WrapperComponent
                    bordered={true}
                    dataSource={tableResultData.items}
                    pagination={false}
                    rowKey="id"
                    rowSelection={
                        {
                            type: 'radio',
                            columnWidth: '38px',
                            ...rowSelection,
                        }
                    }
                    {...rest as unknown as P} />
            </div>
            <div className={styles.cyGeneralTablePaging}>
                <div className={styles.cyGeneralTablePagingLeft}>
                    <span>显示第</span>
                    <span className={styles.importantTip}>
                        {tableResultData.dataStartIndex}
                    </span>
                    <span>到第</span>
                    <span className={styles.importantTip}>
                        {tableResultData.dataEndIndex}
                    </span>
                    <span>条记录,总共</span>
                    <span className={styles.importantTip}>{
                        tableResultData.total
                    }</span>
                    <span>条记录</span>
                </div>
                <div className={styles.cyGeneralTablePagingRight}>
                    <Pagination pageSize={pageSize} onChange={currentPageChange} defaultCurrent={1} size="small" total={tableResultData.total} showSizeChanger showQuickJumper />
                </div>
            </div>
        </div>
    )
}

export default forwardRef(withGeneralTable(Table));