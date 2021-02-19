import PageCommonWrap from "@/components/page-common-wrap";
import TableSearch from "@/components/table-search";
import React from "react";

import { Button, Input, } from "antd";

import styles from "./index.less";
import EnumSelect from "@/components/enum-select";
import { BuildType, getProjectTableStatistics, ProjectCategory, ProjectNature, ProjectStage, ProjectStatus, ProjectType, ProjectVoltageClasses } from "@/services/project-management/all-project";
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

const { Search } = Input;

const ProjectManagement: React.FC = () => {

    const [keyWord, setKeyWord] = useState<string>("");
    const [category, setCategory] = useState<string>();
    const [pCategory, setPCategory] = useState<string>();
    const [stage, setStage] = useState<string>();
    const [constructType, setConstructType] = useState<string>();
    const [nature, setNature] = useState<string>();
    const [kvLevel, setKvLevel] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [statisticalCategory, setStatisticalCategory] = useState<string>();

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
            <Menu.Item>
                删除
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
                            <Button className="mr7" type="primary">
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
                            <AllStatistics>
                                {handleStatisticsData(statisticsData?.total)}
                            </AllStatistics>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <SingleStatistics label="待处理" icon="awaitProcess">
                                {handleStatisticsData(statisticsData?.awaitProcess)}
                            </SingleStatistics>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <SingleStatistics label="进行中" icon="inProgress">
                                {handleStatisticsData(statisticsData?.inProgress)}
                            </SingleStatistics>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <SingleStatistics label="委托" icon="delegation">
                                {handleStatisticsData(statisticsData?.delegation)}
                            </SingleStatistics>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <SingleStatistics label="被共享" icon="beShared">
                                {handleStatisticsData(statisticsData?.beShared)}
                            </SingleStatistics>
                        </div>
                    </div>
                </div>
                <div className={styles.projectManagementTable}>
                    <div className={styles.projectManagementTableButtonContent}>
                        <div className="flex">
                            <div className="flex1">
                                <CommonTitle>
                                    全部项目
                            </CommonTitle>
                            </div>
                            <div className="flex">
                                <Button className="mr7" type="primary">
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
                        <ProjectTable extractParams={{
                            keyWord,
                            category,
                            pCategory,
                            stage,
                            constructType,
                            nature,
                            kvLevel,
                            status,
                            statisticalCategory,
                        }} />
                    </div>
                </div>
            </div>
        </PageCommonWrap>
    )
}

export default ProjectManagement