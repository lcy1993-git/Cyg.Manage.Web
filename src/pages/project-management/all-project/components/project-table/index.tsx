import { useMount, useRequest } from "ahooks"
import React, { useState } from "react"
import { AllProjectStatisticsParams, getProjectTableList } from "@/services/project-management/all-project"

import styles from "./index.less"
import { useMemo } from "react"
import { Pagination } from "antd"
import { useEffect } from "react"
import ProjectTableItem from "../project-table-item"

interface ExtractParams extends AllProjectStatisticsParams {
    statisticalCategory?: string
}

interface ProjectTableProps {
    extractParams: ExtractParams
    onSelect?: (checkedValue: any[]) => {}
}

const ProjectTable: React.FC<ProjectTableProps> = (props) => {
    const { extractParams, onSelect } = props;
    const [pageIndex, setParginIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const { data: tableData, loading, run } = useRequest(getProjectTableList, { manual: true });

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

    const projectTableColumns = [
        {
            title: "项目名称",
            dataIndex: "name",
            width: ""
        },
        {
            title: "项目分类",
            dataIndex: "categoryText",
            width: ""
        },
        {
            title: "电压等级",
            dataIndex: "kvLevelText",
            width: ""
        },
        {
            title: "项目性质",
            dataIndex: "natureTexts",
            width: "",
            render: (record) => {

            }
        },
        {
            title: "专业类别",
            dataIndex: "majorCategoryText",
            width: ""
        },
        {
            title: "建设类型",
            dataIndex: "dataSourceTypeText",
            width: ""
        },
        {
            title: "项目批次",
            dataIndex: "batchText",
            width: ""
        },
        {
            title: "项目阶段",
            dataIndex: "stageText",
            width: ""
        },
        {
            title: "现场数据来源",
            dataIndex: "dataSourceTypeText",
            width: ""
        },
        {
            title: "项目状态",
            dataIndex: "statusText",
            width: ""
        },
        {
            title: "项目来源",
            dataIndex: "sources",
            width: "",
            render: (record) => {

            }
        },
        {
            title: "项目身份",
            dataIndex: "identitys",
            width: "",
            render: (record) => {

            }
        },
        {
            title: "操作",
            dataIndex: "operationAuthority",
            width: "",
            render: (record) => {

            }
        },
    ]
    console.log(tableResultData)
    const projectTableShow = tableResultData.items.map((item: any) => {
        return (
            <ProjectTableItem columns={projectTableColumns} key={item.id} projectInfo={item} />
        )
    })

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

    return (
        <div className={styles.projectTable}>
            <div className={styles.projectTableContent}>
                {projectTableShow}
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