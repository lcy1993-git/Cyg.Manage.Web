import { useRequest } from "ahooks"
import React, { forwardRef, Ref, useImperativeHandle, useState } from "react"
import { AllProjectStatisticsParams, getProjectTableList } from "@/services/project-management/all-project"

import styles from "./index.less"
import { useMemo } from "react"
import { Dropdown, Menu, Pagination } from "antd"
import { useEffect } from "react"
import ProjectTableItem, { AddProjectValue, TableItemCheckedInfo } from "../engineer-table-item"

import uuid from 'node-uuid'
import TableStatus from "@/components/table-status"
import { BarsOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import EmptyTip from "@/components/empty-tip"
import EngineerDetailInfo from "../engineer-detail-info"
import ProjectDetailInfo from "../project-detail-info"
import CyTag from "@/components/cy-tag"
import AddProjectModal from "../add-project-modal"
import EditEnigneerModal from "../edit-engineer-modal"
import EditProjectModal from "../edit-project-modal"
import CopyProjectModal from "../copy-project-modal"

interface ExtractParams extends AllProjectStatisticsParams {
    statisticalCategory?: string
}

interface EngineerTableProps {
    extractParams: ExtractParams
    onSelect?: (checkedValue: TableItemCheckedInfo[]) => void
}

interface JurisdictionInfo {
    canEdit: boolean
    canCopy: boolean
}

const colorMap = {
    "立项": "green",
    "委托": "blue",
    "共享": "yellow",
    "执行": "yellow",
}

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
    const { extractParams, onSelect } = props;
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);

    const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([])

    const [currentClickEngineerId, setCurrentClickEngineerId] = useState<string>("");
    const [engineerModalVisible, setEngineerModalVisible] = useState<boolean>(false);

    const [currentClickProjectId, setCurrentClickProjectId] = useState("");
    const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);

    const [currentEditEngineerId, setCurrentEditEngineerId] = useState<string>("");
    const [currentEditProjectInfo, setCurrentEditProjectInfo] = useState<any>({});
    const [currentCopyProjectInfo, setCurrentCopyProjectInfo] = useState<any>({});
    const [copyProjectVisible, setCopyProjectVisible] = useState<boolean>(false);
    const [addProjectVisible, setAddProjectVisible] = useState<boolean>(false);
    const [editProjectVisible, setEditProjectVisible] = useState<boolean>(false);
    const [editEngineerVisible, setEditEngineerVisible] = useState<boolean>(false);
    const [projectNeedInfo, setProjectNeedInfo] = useState({
        engineerId: "",
        areaId: "",
        company: ""
    })



    const addProjectEvent = (projectNeedValue: AddProjectValue) => {
        setAddProjectVisible(true)
        setProjectNeedInfo(projectNeedValue)
    }

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

    const projectItemMenu = (jurisdictionInfo: JurisdictionInfo, tableItemData: any, engineerInfo: any) => {
        return (
            <Menu>
                {
                    jurisdictionInfo.canEdit &&
                    <Menu.Item onClick={() => editProjectEvent({
                        projectId: tableItemData.id,
                        areaId: engineerInfo.province,
                        company: engineerInfo.company
                    })}>
                        编辑
                    </Menu.Item>
                }
                {
                    jurisdictionInfo.canCopy &&
                    <Menu.Item onClick={() => copyProjectEvent({
                        projectId: tableItemData.id,
                        areaId: engineerInfo.province,
                        company: engineerInfo.company,
                        engineerId: engineerInfo.id
                    })}>
                        复制项目
                    </Menu.Item>
                }

            </Menu>
        )
    }

    const projectTableColumns = [
        {
            title: "项目名称",
            dataIndex: "name",
            render: (record: any) => {
                return (
                    <u className="canClick" onClick={() => {
                        setCurrentClickProjectId(record.id)
                        setProjectModalVisible(true)
                    }}>
                        {record.name}
                    </u>
                )
            }
        },
        {
            title: "项目分类",
            dataIndex: "categoryText",
            width: "6.15%",
        },
        {
            title: "电压等级",
            dataIndex: "kvLevelText",
            width: "6.15%",
        },
        {
            title: "项目性质",
            dataIndex: "natureTexts",
            width: "8%",
            render: (record: any) => {
                const { natureTexts = [] } = record;
                return natureTexts.map((item: any) => {
                    return (
                        <CyTag key={uuid.v1()} className="mr7">
                            {item}
                        </CyTag>
                    )
                })
            }
        },
        {
            title: "专业类别",
            dataIndex: "majorCategoryText",
            width: "6.15%",
        },
        {
            title: "建设类型",
            dataIndex: "dataSourceTypeText",
            width: "6.15%",
        },
        {
            title: "项目批次",
            dataIndex: "batchText",
            width: "6.15%",
        },
        {
            title: "项目阶段",
            dataIndex: "stageText",
            width: "6.15%",
        },
        {
            title: "现场数据来源",
            dataIndex: "dataSourceTypeText",
            width: "8%",
        },
        {
            title: "项目状态",
            width: "6.15%",
            dataIndex: "statusText",
            render: (record: any) => {
                const { stateInfo } = record;
                return (
                    <span>
                        {stateInfo?.statusText}
                    </span>
                )
            }
        },
        {
            title: "项目来源",
            dataIndex: "sources",
            width: "6.15%",
            render: (record: any) => {
                const { sources = [] } = record;
                return sources.map((item: any) => {
                    return (
                        <span key={uuid.v1()}>
                            <CyTag color={colorMap[item.text] ? colorMap[item.text] : "green"}>
                                <span>{item}</span>
                            </CyTag>
                        </span>
                    )
                })
            }
        },
        {
            title: "项目身份",
            dataIndex: "identitys",
            width: "8%",
            render: (record: any) => {
                const { identitys = [] } = record;
                return identitys.map((item: any) => {
                    return (
                        <span className="mr7" key={uuid.v1()}>
                            <CyTag color={colorMap[item.text] ? colorMap[item.text] : "green"}>
                                {item.text}
                            </CyTag>
                        </span>
                    )
                })
            }
        },
        {
            title: "操作",
            dataIndex: "operationAuthority",
            width: "60px",
            render: (record: any, engineerInfo: any) => {
                const {operationAuthority} = record;
        
                return (
                    <Dropdown overlay={() => projectItemMenu(operationAuthority, record, engineerInfo)} placement="bottomLeft" arrow>
                        <BarsOutlined />
                    </Dropdown>
                )
            }
        },
    ]

    const tableItemSelectEvent = (projectSelectInfo: TableItemCheckedInfo) => {
        // 监测现在数组是否含有此id的数据
        const hasData = tableSelectData.findIndex((item) => item.projectInfo.id === projectSelectInfo.projectInfo.id);
        const copyData: TableItemCheckedInfo[] = JSON.parse(JSON.stringify(tableSelectData));
        if (hasData > -1) {
            copyData.splice(hasData, 1, projectSelectInfo)
            setTableSelectData(copyData)
            onSelect?.(copyData)
        } else {
            // 代表没有数据，那就直接插进去
            setTableSelectData([...tableSelectData, projectSelectInfo])
            onSelect?.([...tableSelectData, projectSelectInfo])
        }
    }

    const projectNameClickEvent = (engineerId: string) => {
        setCurrentClickEngineerId(engineerId)
        setEngineerModalVisible(true)
    }

    const editProjectEvent = (projectNeedInfo: any) => {
        setEditProjectVisible(true)
        setCurrentEditProjectInfo(projectNeedInfo)
    }

    const copyProjectEvent = (projectNeedInfo: any) => {
        setCopyProjectVisible(true)
        setCurrentCopyProjectInfo(projectNeedInfo)
    }

    const editEngineerEvent = (data: AddProjectValue) => {
        setEditEngineerVisible(true)
        setCurrentEditEngineerId(data.engineerId);
    }

    const projectTableShow = tableResultData.items.map((item: any, index: number) => {
        return (
            <ProjectTableItem editEngineer={editEngineerEvent} addProject={addProjectEvent} getClickProjectId={projectNameClickEvent} onChange={tableItemSelectEvent} columns={projectTableColumns} key={item.id} projectInfo={item} />
        )
    })

    // 列显示处理
    const currentPageChange = (page: any, size: any) => {
        // 判断当前page是否改变, 没有改变代表是change页面触发
        if (pageSize === size) {
            setPageIndex(page === 0 ? 1 : page);
        }
    };

    const pageSizeChange = (page: any, size: any) => {
        setPageIndex(1);
        setPageSize(size);
    };

    useImperativeHandle(ref, () => ({
        // changeVal 就是暴露给父组件的方法
        refresh: () => {
            run({
                ...extractParams,
                pageIndex,
                pageSize
            });
            setTableSelectData([])
        },
        search: () => {
            setPageIndex(1);
            run({
                ...extractParams,
                pageIndex: 1,
                pageSize
            });
            setTableSelectData([])
        },
        searchByParams: (params: object) => {
            setPageIndex(1);
            run({
                ...params,
                pageIndex: 1,
                pageSize
            });
            setTableSelectData([])
        },
    }));

    const tableItemEventFinish = () => {
        run({
            ...extractParams,
            pageIndex,
            pageSize
        });
        setTableSelectData([])
    }

    // 页码发生变化，重新进行请求
    useEffect(() => {
        run({
            ...extractParams,
            pageIndex,
            pageSize
        })
        setTableSelectData([])
    }, [pageSize, pageIndex]);

    return (
        <div className={styles.projectTable}>

            <div className={styles.projectTableContent}>
                <Spin spinning={loading}>
                    {tableResultData.items.length > 0 && projectTableShow}
                    {tableResultData.items.length === 0 &&
                        <EmptyTip className="pt20" />
                    }
                </Spin>
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
            <EngineerDetailInfo engineerId={currentClickEngineerId} visible={engineerModalVisible} onChange={setEngineerModalVisible}  />
            <ProjectDetailInfo projectId={currentClickProjectId} visible={projectModalVisible} onChange={setProjectModalVisible} />
            <EditEnigneerModal engineerId={currentEditEngineerId} visible={editEngineerVisible} onChange={setEditEngineerVisible} changeFinishEvent={tableItemEventFinish} />
            <EditProjectModal projectId={currentEditProjectInfo.projectId} company={currentEditProjectInfo.company} areaId={currentEditProjectInfo.areaId} visible={editProjectVisible} onChange={setEditProjectVisible} changeFinishEvent={tableItemEventFinish} />
            <CopyProjectModal projectId={currentCopyProjectInfo.projectId} engineerId={currentCopyProjectInfo.engineerId} company={currentCopyProjectInfo.company} areaId={currentCopyProjectInfo.areaId} visible={copyProjectVisible} onChange={setCopyProjectVisible} changeFinishEvent={tableItemEventFinish} />
            <AddProjectModal changeFinishEvent={tableItemEventFinish} visible={addProjectVisible} onChange={setAddProjectVisible} engineerId={projectNeedInfo.engineerId} areaId={projectNeedInfo.areaId} company={projectNeedInfo.company} />
        </div>
    )
}

export default forwardRef(EngineerTable)