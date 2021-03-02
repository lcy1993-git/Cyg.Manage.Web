import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import moment from "moment";
import React from "react"
import styles from "./index.less"

import uuid from 'node-uuid'
import { Button, Checkbox } from "antd";
import { useMemo } from "react";
import { CheckboxValueType } from "antd/lib/checkbox/Group";
import EmptyTip from "@/components/empty-tip";

interface TableCheckedItemProjectInfo {
    id: string
    isAllChecked: boolean
}

export interface TableItemCheckedInfo {
    projectInfo: TableCheckedItemProjectInfo,
    checkedArray: string[]
}

export interface AddProjectValue {
    engineerId: string
    areaId: string
    company: string
}

interface ProjectTableItemProps {
    // TODO 完善信息
    projectInfo: any
    columns: any[]
    onChange?: (checkedValue: TableItemCheckedInfo) => void
    getClickProjectId: (clickProjectId: string) => void
    addProject?: (needValue: AddProjectValue) => void
    editEngineer?: (needValue: AddProjectValue) => void
}

const ProjectTableItem: React.FC<ProjectTableItemProps> = (props) => {
    const [isFold, { toggle: foldEvent }] = useBoolean(false)

    const [checkedList, setCheckedList] = React.useState<CheckboxValueType[]>([]);
    const [indeterminate, setIndeterminate] = React.useState(false);
    const [checkAll, setCheckAll] = React.useState(false);

    const { projectInfo = {}, columns = [], onChange, getClickProjectId, addProject,editEngineer} = props;

    const theadElement = columns.map((item) => {
        return (
            <th key={uuid.v1()} style={item.width ? { width: `${item.width}px` } : undefined}>
                {item.title}
            </th>
        )
    })

    const valueList = useMemo(() => {
        if (projectInfo.projects) {
            return projectInfo.projects.map((item: any) => item.id);
        }
        return []
    }, [JSON.stringify(projectInfo.projects)])

    const checkboxChange = (list: CheckboxValueType[]) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < valueList.length);
        setCheckAll(list.length === valueList.length);

        onChange?.({
            projectInfo: {
                id: projectInfo.id,
                isAllChecked: list.length === valueList.length
            },
            checkedArray: checkedList as string[]
        })
    };

    const checkAllEvent = (e: any) => {
        setCheckedList(e.target.checked ? valueList : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);

        onChange?.({
            projectInfo: {
                id: projectInfo.id,
                isAllChecked: e.target.checked
            },
            checkedArray: e.target.checked ? valueList : []
        })
    };

    const tbodyElement = (projectInfo.projects ?? []).map((item: any) => {
        return (
            <tr key={uuid.v1()}>
                <td>
                    <Checkbox style={{ marginLeft: "4px" }} value={item.id} />
                </td>
                {
                    columns.map((ite) => {
                        return (
                            <td key={uuid.v1()}>
                                {ite.render ? ite.render(item,projectInfo) : item[ite.dataIndex]}
                            </td>
                        )
                    })
                }
            </tr>
        )
    })

    const projectNameClickEvent = (projectId: string) => {
        getClickProjectId?.(projectId)
    }

    const addProjectEvent = () => {
        addProject?.({
            engineerId: projectInfo.id,
            areaId: projectInfo.province,
            company: projectInfo.company
        })
    }

    const editEngineerEvent = () => {
        editEngineer?.({
            engineerId: projectInfo.id,
            areaId: projectInfo.province,
            company: projectInfo.company
        })
    }

    return (
        <div className={`${styles.projectTableItem}`}>
            <div className={styles.ProjectTitle}>
                <div className={styles.foldButton}>
                    <span onClick={() => foldEvent()}>
                        {isFold ? <CaretUpOutlined /> : <CaretDownOutlined />}
                    </span>
                </div>
                <div className={styles.projectName}>
                    <Checkbox onChange={checkAllEvent} style={{ marginRight: "7px" }} indeterminate={indeterminate} checked={checkAll} />
                    <u className="canClick" onClick={() => projectNameClickEvent(projectInfo.id)}>
                        {
                            projectInfo.name
                        }
                    </u>
                </div>
                <div className={styles.projectTime}>
                    <span className={styles.label}>
                        工程日期:
                    </span>
                    <span>
                        {
                            projectInfo.startTime ? moment(projectInfo.startTime).format("YYYY/MM/DD") : ""
                        }
                    </span>
                    <span>
                        -
                        {
                            projectInfo.startTime ? moment(projectInfo.endTime).format("YYYY/MM/DD") : ""
                        }
                    </span>
                </div>
                <div className={styles.createTime}>
                    <span className={styles.label}>
                        编制日期:
                    </span>
                    <span>
                        {
                            projectInfo.compileTime ? moment(projectInfo.compileTime).format("YYYY/MM/DD") : ""
                        }
                    </span>
                </div>
                <div className={styles.projectButtons}>
                    <Button className="mr10" ghost type="primary" onClick={() => addProjectEvent()}>
                        新增项目
                    </Button>
                    <Button onClick={() => editEngineerEvent()}>
                        编辑
                    </Button>
                </div>
            </div>
            {
                !isFold && projectInfo.projects.length > 0 &&
                <Checkbox.Group value={checkedList} onChange={checkboxChange}>
                    <div className={styles.engineerTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th className={styles.checkboxTh}>

                                    </th>
                                    {
                                        theadElement
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tbodyElement
                                }
                            </tbody>
                        </table>

                    </div>
                </Checkbox.Group>
            }
            {
                !isFold && projectInfo.projects.length === 0 &&
                <div className={styles.noEngineerData}>
                    <EmptyTip className="pt20" />
                </div>
            }
        </div>
    )
}

export default ProjectTableItem