import PageCommonWrap from "@/components/page-common-wrap";
import TableSearch from "@/components/table-search";
import React, { useRef } from "react";

import { Button, Input, message, Modal, } from "antd";

import styles from "./index.less";
import EnumSelect from "@/components/enum-select";
import { addEngineer, AllProjectStatisticsParams, BuildType, getProjectTableStatistics, ProjectCategory, ProjectNature, ProjectStage, ProjectStatus, ProjectType, ProjectVoltageClasses } from "@/services/project-management/all-project";
import AllStatistics from "./components/all-statistics";
import SingleStatistics from "./components/single-statistics";
import CommonTitle from "@/components/common-title";
import { DeleteOutlined, DownOutlined, FileAddOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Dropdown } from "antd";
import TableExportButton from "@/components/table-export-button";
import { useState } from "react";
import { useMount, useRequest } from "ahooks";
import ProjectTable from "./components/project-table";
import { Form } from "antd";
import CreateEngineer from "./components/create-engineer";
import { TableItemCheckedInfo } from "./components/project-table-item";

const { Search } = Input;

const statisticsObject = {
    "-1": "全部项目",
    "1": "待处理项目",
    "2": "进行中的项目",
    "3": "委托的项目",
    "4": "被共享的项目",
}

const ProjectManagement: React.FC = () => {

    const [keyWord, setKeyWord] = useState<string>("");
    const [category, setCategory] = useState<string>();
    const [pCategory, setPCategory] = useState<string>();
    const [stage, setStage] = useState<string>();
    const [constructType, setConstructType] = useState<string>();
    const [nature, setNature] = useState<string>();
    const [kvLevel, setKvLevel] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [statisticalCategory, setStatisticalCategory] = useState<string>("-1");
    // 被勾选中的数据
    const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

    const [addEngineerModalFlag, setAddEngineerModalFlag] = useState(false);

    const [saveLoading, setSaveLoading] = useState(false)

    const tableRef = useRef<HTMLDivElement>(null)

    const [form] = Form.useForm();

    const { data: statisticsData, run: getStatisticsData } = useRequest(getProjectTableStatistics, { manual: true });

    const handleStatisticsData = (statisticsDataItem?: number) => {
        if (statisticsDataItem) {
            if (statisticsDataItem < 10) {
                return `0${statisticsDataItem}`
            }
            return statisticsDataItem
        }
        return "0"
    }

    const refresh = () => {
        if (tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current.refresh();
        }
    }

    const search = () => {
        if (tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current.search();
            getStatisticsData({
                keyWord,
                category: category ?? "-1",
                pCategory: pCategory ?? "-1",
                stage: stage ?? "-1",
                constructType: constructType ?? "-1",
                nature: nature ?? "-1",
                kvLevel: kvLevel ?? "-1",
                status: status ?? "-1",
            })
        }
    }

    const searchByParams = (params: any) => {
        if (tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current.searchByParams(params);
            getStatisticsData({ ...params as AllProjectStatisticsParams })
        }
    }

    const arrangeMenu = (
        <Menu>
            <Menu.Item>
                安排
            </Menu.Item>
            <Menu.Item>
                修改安排
            </Menu.Item>
            <Menu.Item>
                撤回安排
            </Menu.Item>
        </Menu>
    )

    const shareMenu = (
        <Menu>
            <Menu.Item>
                共享
            </Menu.Item>
            <Menu.Item>
                撤回共享
            </Menu.Item>
        </Menu>
    )

    const importMenu = (
        <Menu>
            <Menu.Item>
                下载模板
            </Menu.Item>
            <Menu.Item>
                导入项目
            </Menu.Item>
        </Menu>
    )

    const postProjectMenu = (
        <Menu>
            <Menu.Item>
                申请结项
            </Menu.Item>
            <Menu.Item>
                撤回结项
            </Menu.Item>
            <Menu.Item>
                结项通过
            </Menu.Item>
            <Menu.Item>
                结项退回
            </Menu.Item>
        </Menu>
    )

    useMount(() => {
        getStatisticsData({
            keyWord: "",
            category: "-1",
            pCategory: "-1",
            stage: "-1",
            constructType: "-1",
            nature: "-1",
            kvLevel: "-1",
            status: "-1"
        })
    })

    const resetSearch = () => {
        setKeyWord("");
        setCategory(undefined);
        setPCategory(undefined);
        setStage(undefined);
        setConstructType(undefined);
        setNature(undefined);
        setKvLevel(undefined);
        setStatus(undefined);
        // TODO 重置完是否进行查询
        searchByParams({
            keyWord,
            category: category ?? "-1",
            pCategory: pCategory ?? "-1",
            stage: stage ?? "-1",
            constructType: constructType ?? "-1",
            nature: nature ?? "-1",
            kvLevel: kvLevel ?? "-1",
            status: status ?? "-1",
            statisticalCategory: statisticalCategory ?? "-1",
        })
    }

    const statisticsClickEvent = (statisticsType: string) => {
        setStatisticalCategory(statisticsType)
        searchByParams({
            keyWord,
            category: category ?? "-1",
            pCategory: pCategory ?? "-1",
            stage: stage ?? "-1",
            constructType: constructType ?? "-1",
            nature: nature ?? "-1",
            kvLevel: kvLevel ?? "-1",
            status: status ?? "-1",
            statisticalCategory: statisticsType,
        })
    }

    const sureAddEngineerEvent = () => {
        form.validateFields().then(async (values) => {
            setSaveLoading(true)
            const { project, name, province, libId, inventoryOverviewId, warehouseId, compiler, compileTime, organization, startTime, endTime, company, plannedYear, importance, grade } = values;
            await addEngineer({ project, engineer: { name, province, libId, inventoryOverviewId, warehouseId, compiler, compileTime, organization, startTime, endTime, company, plannedYear, importance, grade } });
            setSaveLoading(false)
            message.success("立项成功");
            modalCloseEvent();
            refresh();
        })
    }

    const modalCloseEvent = () => {
        setAddEngineerModalFlag(false)
        form.resetFields();
        form.setFieldsValue({"project": [{name: ""}]})
    }

    const tableSelectEvent = (checkedValue: TableItemCheckedInfo[]) => {
        setTableSelectData(checkedValue)
    }

    return (
        <PageCommonWrap noPadding={true}>
            <div className={styles.projectManagement}>
                <div className={styles.projectManagemnetSearch}>
                    <div className="flex">
                        <div className="flex1 flex">
                            <TableSearch className="mr22" label="项目名称" width="208px">
                                <Search
                                    placeholder="请输入"
                                    enterButton
                                    value={keyWord}
                                    onChange={(e) => setKeyWord(e.target.value)}
                                />
                            </TableSearch>
                            <TableSearch className="mr2" label="全部状态" width="178px">
                                <EnumSelect
                                    enumList={ProjectCategory}
                                    className="widthAll"
                                    value={category}
                                    onChange={(value) => setCategory(String(value))}
                                    placeholder="项目分类"
                                    needAll={true}
                                    allValue="-1" />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <EnumSelect
                                    enumList={ProjectType}
                                    value={pCategory}
                                    dropdownMatchSelectWidth={168}
                                    onChange={(value) => setPCategory(String(value))}
                                    className="widthAll"
                                    placeholder="项目类别"
                                    needAll={true}
                                    allValue="-1" />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <EnumSelect
                                    enumList={ProjectStage}
                                    value={stage}
                                    className="widthAll"
                                    onChange={(value) => setStage(String(value))}
                                    placeholder="项目阶段"
                                    needAll={true}
                                    allValue="-1" />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <EnumSelect
                                    enumList={BuildType}
                                    value={constructType}
                                    className="widthAll"
                                    placeholder="建设类型"
                                    onChange={(value) => setConstructType(String(value))}
                                    needAll={true}
                                    allValue="-1" />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <EnumSelect
                                    enumList={ProjectVoltageClasses}
                                    value={kvLevel}
                                    onChange={(value) => setKvLevel(String(value))}
                                    className="widthAll"
                                    placeholder="电压等级"
                                    needAll={true}
                                    allValue="-1" />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <EnumSelect
                                    enumList={ProjectNature}
                                    value={nature}
                                    dropdownMatchSelectWidth={168}
                                    onChange={(value) => setNature(String(value))}
                                    className="widthAll"
                                    placeholder="项目性质"
                                    needAll={true}
                                    allValue="-1" />
                            </TableSearch>
                            <TableSearch width="111px">
                                <EnumSelect
                                    enumList={ProjectStatus}
                                    value={status}
                                    onChange={(value) => setStatus(String(value))}
                                    className="widthAll"
                                    placeholder="项目状态"
                                    needAll={true}
                                    allValue="-1" />
                            </TableSearch>
                        </div>
                        <div>
                            <Button className="mr7" type="primary" onClick={() => search()}>
                                查询
                            </Button>
                            <Button className="mr7" onClick={() => resetSearch()}>
                                重置
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={styles.projectManagementStatistic}>
                    <div className="flex">
                        <div className="flex1">
                            <div onClick={() => statisticsClickEvent("-1")}>
                                <AllStatistics>
                                    {handleStatisticsData(statisticsData?.total)}
                                </AllStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent("1")}>
                                <SingleStatistics label="待处理" icon="awaitProcess">
                                    {handleStatisticsData(statisticsData?.awaitProcess)}
                                </SingleStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent("2")}>
                                <SingleStatistics label="进行中" icon="inProgress">
                                    {handleStatisticsData(statisticsData?.inProgress)}
                                </SingleStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent("3")}>
                                <SingleStatistics label="委托" icon="delegation">
                                    {handleStatisticsData(statisticsData?.delegation)}
                                </SingleStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent("4")}>
                                <SingleStatistics label="被共享" icon="beShared">
                                    {handleStatisticsData(statisticsData?.beShared)}
                                </SingleStatistics>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.projectManagementTable}>
                    <div className={styles.projectManagementTableButtonContent}>
                        <div className="flex">
                            <div className="flex1">
                                <CommonTitle>
                                    {statisticsObject[statisticalCategory]}
                                </CommonTitle>
                            </div>
                            <div className="flex">
                                <Button className="mr7" type="primary" onClick={() => setAddEngineerModalFlag(true)}>
                                    <FileAddOutlined />
                                    立项
                                </Button>
                                <Button className="mr7">
                                    <DeleteOutlined />
                                    删除
                                </Button>
                                <Dropdown overlay={arrangeMenu}>
                                    <Button className="mr7">
                                        安排管理 <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <Dropdown overlay={shareMenu}>
                                    <Button className="mr7">
                                        安排共享 <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <Dropdown overlay={importMenu}>
                                    <Button className="mr7">
                                        导入 <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <div className="mr7">
                                    <TableExportButton exportUrl="" />
                                </div>
                                <Dropdown overlay={postProjectMenu}>
                                    <Button>
                                        结项 <DownOutlined />
                                    </Button>
                                </Dropdown>

                            </div>
                        </div>
                    </div>
                    <div className={styles.projectManagementTableContent}>
                        <ProjectTable ref={tableRef} onSelect={tableSelectEvent} extractParams={{
                            keyWord,
                            category: category ?? "-1",
                            pCategory: pCategory ?? "-1",
                            stage: stage ?? "-1",
                            constructType: constructType ?? "-1",
                            nature: nature ?? "-1",
                            kvLevel: kvLevel ?? "-1",
                            status: status ?? "-1",
                            statisticalCategory: statisticalCategory ?? "-1",
                        }} />
                    </div>
                </div>
            </div>
            <Modal
                visible={addEngineerModalFlag}
                footer={[
                    <Button key="cancle" onClick={() => modalCloseEvent()}>
                        取消
                    </Button>,
                    <Button key="save" type="primary" loading={saveLoading} onClick={() => sureAddEngineerEvent()}>
                        保存
                    </Button>,
                ]}
                width={820}
                onCancel={() => modalCloseEvent()}
                title="项目立项">
                <Form form={form}>
                    <CreateEngineer form={form} />
                </Form>
            </Modal>
        </PageCommonWrap>
    )
}

export default ProjectManagement