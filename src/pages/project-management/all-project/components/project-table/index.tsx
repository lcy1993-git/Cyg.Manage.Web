import { useMount, useRequest } from "ahooks"
import React, { useState } from "react"
import { AllProjectStatisticsParams, getProjectTableList } from "@/services/project-management/all-project"

import styles from "./index.less"
import { useMemo } from "react"
import { Pagination } from "antd"
import { useEffect } from "react"

interface ExtractParams extends AllProjectStatisticsParams {
    statisticalCategory?: string
}

interface ProjectTableProps {
    extractParams: ExtractParams
    onSelect: (checkedValue: any[]) => {}
}

const ProjectTable: React.FC<ProjectTableProps> = (props) => {
    const { extractParams, onSelect } = props;
    const [pageIndex, setParginIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const { data: tableData, loading, run } = useRequest(getProjectTableList, { manual: true });

    console.log(tableData)

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

    }, [JSON.stringify(tableData)]);

    // 列显示处理
    const currentPageChange = (page: any, size: any) => {
        // 判断当前page是否改变, 没有改变代表是change页面触发
        if (pageSize === size) {
            setParginIndex(page === 0 ? 1 : page);
        }
    };

    const pageSizeChange = (page: any, size: any) => {
        setParginIndex(1);
        setPageSize(size);
    };
    // 页码发生变化，重新进行请求
    useEffect(() => {
        run({
            ...extractParams,
            pageIndex,
            pageSize
        })
      }, [pageSize, pageIndex]);

    useMount(() => {
        run({
            ...extractParams,
            pageIndex,
            pageSize
        })
    })

    return (
        <div className={styles.projectTable}>
            <div className={styles.projectTableContent}>

            </div>
            <div className={styles.projectTablePaging}>
                <div className={styles.projectTablePagingLeft}>
                    <span>显示第</span>
                    <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
                    <span>到第</span>
                    <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
                    <span>条记录,总共</span>
                    <span className={styles.importantTip}>{tableResultData.total}</span>
                    <span>条记录</span>
                </div>
                <div className={styles.projectTablePagingRight}>
                    <Pagination
                        pageSize={pageSize}
                        onChange={currentPageChange}
                        size="small"
                        total={tableResultData.total}
                        current={pageIndex}
                        hideOnSinglePage={true}
                        showSizeChanger
                        showQuickJumper
                        onShowSizeChange={pageSizeChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProjectTable