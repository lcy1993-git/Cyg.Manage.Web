import PageCommonWrap from "@/components/page-common-wrap";
import TableSearch from "@/components/table-search";
import React, { useRef } from "react";

import { Button, Input, message, Modal, } from "antd";

import styles from "./index.less";
import EnumSelect from "@/components/enum-select";
import { addEngineer, AllProjectStatisticsParams, applyKnot, auditKnot, BuildType, canEditArrange, checkCanArrange, deleteProject, getProjectTableStatistics, noAuditKnot, ProjectStatus, recallShare, revokeAllot, revokeKnot } from "@/services/project-management/all-project";
import AllStatistics from "./components/all-statistics";
import SingleStatistics from "./components/single-statistics";
import CommonTitle from "@/components/common-title";
import { DeleteOutlined, DownOutlined, FileAddOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Dropdown } from "antd";
import TableExportButton from "@/components/table-export-button";
import { useState } from "react";
import { useMount, useRequest } from "ahooks";
import EnigneerTable from "./components/enigneer-table";
import { Form } from "antd";
import CreateEngineer from "./components/create-engineer";
import { TableItemCheckedInfo } from "./components/engineer-table-item";
import { Popconfirm } from "antd";
import ArrangeModal from "./components/arrange-modal";
import ShareModal from "./components/share-modal";
import EditArrangeModal from "./components/edit-arrange-modal";
import { useGetProjectEnum } from "@/utils/hooks";
import UrlSelect from "@/components/url-select"
import ResourceLibraryManageModal from "./components/resource-library-manage-modal";


const { Search } = Input;

const statisticsObject = {
    '-1': '全部项目',
    '1': '待处理项目',
    '2': '进行中的项目',
    '3': '委托的项目',
    '4': '被共享的项目',
};

const ProjectManagement: React.FC = () => {
    const [keyWord, setKeyWord] = useState<string>('');
    const [category, setCategory] = useState<string>();
    const [pCategory, setPCategory] = useState<string>();
    const [stage, setStage] = useState<string>();
    const [constructType, setConstructType] = useState<string>();
    const [nature, setNature] = useState<string>();
    const [kvLevel, setKvLevel] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [statisticalCategory, setStatisticalCategory] = useState<string>('-1');
    // 被勾选中的数据
    const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

    const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);

    const [arrangeModalVisible, setArrangeModalVisible] = useState<boolean>(false);

    const [editArrangeModalVisible, setEditArrangeModalVisible] = useState<boolean>(false);

    const [addEngineerModalFlag, setAddEngineerModalFlag] = useState(false);

    const [saveLoading, setSaveLoading] = useState(false);

    const [libVisible, setLibVisible] = useState(false);

    const [selectProjectIds, setSelectProjectIds] = useState<string[]>([]);

    const tableRef = useRef<HTMLDivElement>(null);

    const [form] = Form.useForm();

    const { data: statisticsData, run: getStatisticsData } = useRequest(getProjectTableStatistics, {
        manual: true,
    });

    const { projectCategory, projectPType, projectNature, projectConstructType, projectStage, projectKvLevel } = useGetProjectEnum();

    const handleStatisticsData = (statisticsDataItem?: number) => {
        if (statisticsDataItem) {
            if (statisticsDataItem < 10) {
                return `0${statisticsDataItem}`;
            }
            return statisticsDataItem;
        }
        return '0';
    };

    const refresh = () => {
        if (tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current.refresh();
        }
    };

    const search = () => {
        if (tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current.search();
            getStatisticsData({
                keyWord,
                category: category ?? '-1',
                pCategory: pCategory ?? '-1',
                stage: stage ?? '-1',
                constructType: constructType ?? '-1',
                nature: nature ?? '-1',
                kvLevel: kvLevel ?? '-1',
                status: status ?? '-1',
            });
        }
    };

    const searchByParams = (params: any) => {
        if (tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current.searchByParams(params);
            getStatisticsData({ ...(params as AllProjectStatisticsParams) });
        }
    };

    const revokeAllotEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }

        const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

        await revokeAllot(projectIds);
        message.success('撤回安排成功');
        refresh();
    };

    const arrangeEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }

        const projectIds = tableSelectData.map((item) => item.checkedArray).flat(1);

        await checkCanArrange(projectIds);
        setSelectProjectIds(projectIds);
        setArrangeModalVisible(true);
    };

    const editArrangeEvent = async () => {
        if (tableSelectData && tableSelectData.length === 0) {
            message.error('请选择修改安排的项目！');
            return;
        }
        const projectIds = tableSelectData.map((item) => item.checkedArray).flat(1);
        await canEditArrange(projectIds)
        setSelectProjectIds(projectIds);
        setEditArrangeModalVisible(true);
    };

    const arrangeMenu = (
        <Menu>
            <Menu.Item onClick={() => arrangeEvent()}>安排</Menu.Item>
            <Menu.Item onClick={() => editArrangeEvent()}>修改安排</Menu.Item>
            <Menu.Item onClick={() => revokeAllotEvent()}>撤回安排</Menu.Item>
        </Menu>
    );

    const recallShareEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }

        const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

        await recallShare(projectIds);
        message.success('申请结项成功');
        refresh();
    };

    const shareEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }

        setSelectProjectIds(tableSelectData.map((item) => item.checkedArray).flat());
        setShareModalVisible(true);
    };

    const shareMenu = (
        <Menu>
            <Menu.Item onClick={() => shareEvent()}>共享</Menu.Item>
            <Menu.Item onClick={() => recallShareEvent()}>撤回共享</Menu.Item>
        </Menu>
    );

    const importMenu = (
        <Menu>
            <Menu.Item>下载模板</Menu.Item>
            <Menu.Item>导入项目</Menu.Item>
        </Menu>
    );

    const applyKnotEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }

        const projectIds = tableSelectData.map((item) => item.checkedArray).flat();
        await applyKnot(projectIds);
        message.success('申请结项成功');
        refresh();
    };

    const revokeKnotEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }
        const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

        await revokeKnot(projectIds);
        message.success('撤回结项成功');
        refresh();
    };

    const auditKnotEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }
        const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

        await auditKnot(projectIds);
        message.success('结项通过成功');
        refresh();
    };

    const noAuditKnotEvent = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少选择一个项目');
            return;
        }
        const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

        await noAuditKnot(projectIds);
        message.success('结项退回成功');
        refresh();
    };

    const postProjectMenu = (
        <Menu>
            <Menu.Item onClick={() => applyKnotEvent()}>申请结项</Menu.Item>
            <Menu.Item onClick={() => revokeKnotEvent()}>撤回结项</Menu.Item>
            <Menu.Item onClick={() => auditKnotEvent()}>结项通过</Menu.Item>
            <Menu.Item onClick={() => noAuditKnotEvent()}>结项退回</Menu.Item>
        </Menu>
    );

    useMount(() => {
        getStatisticsData({
            keyWord: '',
            category: '-1',
            pCategory: '-1',
            stage: '-1',
            constructType: '-1',
            nature: '-1',
            kvLevel: '-1',
            status: '-1',
        });
    });

    const resetSearch = () => {
        setKeyWord('');
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
            category: category ?? '-1',
            pCategory: pCategory ?? '-1',
            stage: stage ?? '-1',
            constructType: constructType ?? '-1',
            nature: nature ?? '-1',
            kvLevel: kvLevel ?? '-1',
            status: status ?? '-1',
            statisticalCategory: statisticalCategory ?? '-1',
        });
    };

    const statisticsClickEvent = (statisticsType: string) => {
        setStatisticalCategory(statisticsType);
        searchByParams({
            keyWord,
            category: category ?? '-1',
            pCategory: pCategory ?? '-1',
            stage: stage ?? '-1',
            constructType: constructType ?? '-1',
            nature: nature ?? '-1',
            kvLevel: kvLevel ?? '-1',
            status: status ?? '-1',
            statisticalCategory: statisticsType,
        });
    };

    const sureAddEngineerEvent = () => {
        form.validateFields().then(async (values) => {
            try {
                setSaveLoading(true);
                const {
                    projects,
                    name,
                    province,
                    libId,
                    inventoryOverviewId,
                    warehouseId,
                    compiler,
                    compileTime,
                    organization,
                    startTime,
                    endTime,
                    company,
                    plannedYear,
                    importance,
                    grade,
                } = values;
                await addEngineer({
                    projects,
                    engineer: {
                        name,
                        province,
                        libId,
                        inventoryOverviewId,
                        warehouseId,
                        compiler,
                        compileTime,
                        organization,
                        startTime,
                        endTime,
                        company,
                        plannedYear,
                        importance,
                        grade,
                    },
                });
                message.success('立项成功');
                modalCloseEvent();
                refresh();
            } catch (msg) {
            } finally {
                setSaveLoading(false);
            }
        });
    };

    const modalCloseEvent = () => {
        setAddEngineerModalFlag(false);
       
    };

    const tableSelectEvent = (checkedValue: TableItemCheckedInfo[]) => {
        setTableSelectData(checkedValue);
    };

    const sureDeleteProject = async () => {
        if (tableSelectData.length === 0) {
            message.error('请至少勾选一条数据');
            return;
        }
        const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

        await deleteProject(projectIds);
        message.success('删除成功');
        refresh();
    };

    const arrangeFinishEvent = () => {
        setArrangeModalVisible(false);
        refresh();
    };

    const changeArrangeFinishEvent = () => {
        setEditArrangeModalVisible(false);
        refresh();
    };

    const openAddEngineerModal = () => {
        setAddEngineerModalFlag(true)
        form.resetFields();
        form.setFieldsValue({ projects: [{ name: '' }] });
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
                                    onSearch={() => search()}
                                />
                            </TableSearch>
                            <TableSearch className="mr2" label="全部状态" width="178px">
                                <UrlSelect
                                    valueKey="value"
                                    titleKey="text"
                                    defaultData={projectCategory}
                                    className="widthAll"
                                    value={category}
                                    onChange={(value) => setCategory(value as string)}
                                    placeholder="项目分类"
                                    needAll={true}
                                    allValue="-1"
                                />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <UrlSelect
                                    valueKey="value"
                                    titleKey="text"
                                    defaultData={projectPType}
                                    value={pCategory}
                                    dropdownMatchSelectWidth={168}
                                    onChange={(value) => setPCategory(value as string)}
                                    className="widthAll"
                                    placeholder="项目类别"
                                    needAll={true}
                                    allValue="-1"
                                />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <UrlSelect
                                    valueKey="value"
                                    titleKey="text"
                                    defaultData={projectStage}
                                    value={stage}
                                    className="widthAll"
                                    onChange={(value) => setStage(value as string)}
                                    placeholder="项目阶段"
                                    needAll={true}
                                    allValue="-1"
                                />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <UrlSelect
                                    valueKey="value"
                                    titleKey="text"
                                    defaultData={projectConstructType}
                                    value={constructType}
                                    className="widthAll"
                                    placeholder="建设类型"
                                    onChange={(value) => setConstructType(value as string)}
                                    needAll={true}
                                    allValue="-1"
                                />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <UrlSelect
                                    valueKey="value"
                                    titleKey="text"
                                    defaultData={projectKvLevel}
                                    value={kvLevel}
                                    onChange={(value) => setKvLevel(value as string)}
                                    className="widthAll"
                                    placeholder="电压等级"
                                    needAll={true}
                                    allValue="-1"
                                />
                            </TableSearch>
                            <TableSearch className="mr2" width="111px">
                                <UrlSelect
                                    valueKey="value"
                                    titleKey="text"
                                    defaultData={projectNature}
                                    value={nature}
                                    dropdownMatchSelectWidth={168}
                                    onChange={(value) => setNature(value as string)}
                                    className="widthAll"
                                    placeholder="项目性质"
                                    needAll={true}
                                    allValue="-1"
                                />
                            </TableSearch>
                            <TableSearch width="111px">
                                <EnumSelect
                                    enumList={ProjectStatus}
                                    value={status}
                                    onChange={(value) => setStatus(String(value))}
                                    className="widthAll"
                                    placeholder="项目状态"
                                    needAll={true}
                                    allValue="-1"
                                />
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
                            <div onClick={() => statisticsClickEvent('-1')}>
                                <AllStatistics>{handleStatisticsData(statisticsData?.total)}</AllStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent('1')}>
                                <SingleStatistics label="待处理" icon="awaitProcess">
                                    {handleStatisticsData(statisticsData?.awaitProcess)}
                                </SingleStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent('2')}>
                                <SingleStatistics label="进行中" icon="inProgress">
                                    {handleStatisticsData(statisticsData?.inProgress)}
                                </SingleStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent('3')}>
                                <SingleStatistics label="委托" icon="delegation">
                                    {handleStatisticsData(statisticsData?.delegation)}
                                </SingleStatistics>
                            </div>
                        </div>
                        <div className={styles.projectManagementStatisticItem}>
                            <div onClick={() => statisticsClickEvent('4')}>
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
                                <CommonTitle>{statisticsObject[statisticalCategory]}</CommonTitle>
                            </div>
                            <div className="flex">
                                <Button
                                    className="mr7"
                                    type="primary"
                                    onClick={() => openAddEngineerModal()}
                                >
                                    <FileAddOutlined />
                                    立项
                                    </Button>
                                <Popconfirm
                                    title="确认对勾选的项目进行删除吗?"
                                    okText="确认"
                                    cancelText="取消"
                                    onConfirm={sureDeleteProject}
                                >
                                    <Button className="mr7">
                                        <DeleteOutlined />
                                    删除
                                </Button>
                                </Popconfirm>
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
                                <div className="mr7">
                                    <TableExportButton
                                        exportUrl="/Porject/Export"
                                        selectIds={tableSelectData.map((item) => item.checkedArray).flat()}
                                        extraParams={{
                                            keyWord,
                                            category: category ?? '-1',
                                            pCategory: pCategory ?? '-1',
                                            stage: stage ?? '-1',
                                            constructType: constructType ?? '-1',
                                            nature: nature ?? '-1',
                                            kvLevel: kvLevel ?? '-1',
                                            status: status ?? '-1',
                                            statisticalCategory: statisticalCategory ?? '-1',
                                        }}
                                    />
                                </div>
                                <Dropdown overlay={postProjectMenu}>
                                    <Button className="mr7">
                                        结项 <DownOutlined />
                                    </Button>
                                </Dropdown>
                                <Button onClick={() => setLibVisible(true)}>
                                    资源库迭代
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.projectManagementTableContent}>
                        <EnigneerTable
                            ref={tableRef}
                            onSelect={tableSelectEvent}
                            extractParams={{
                                keyWord,
                                category: category ?? '-1',
                                pCategory: pCategory ?? '-1',
                                stage: stage ?? '-1',
                                constructType: constructType ?? '-1',
                                nature: nature ?? '-1',
                                kvLevel: kvLevel ?? '-1',
                                status: status ?? '-1',
                                statisticalCategory: statisticalCategory ?? '-1',
                            }}
                        />
                    </div>
                </div>

            </div>
            <Modal
                visible={addEngineerModalFlag}
                footer={[
                    <Button key="cancle" onClick={() => modalCloseEvent()}>
                        取消
                            </Button>,
                    <Button
                        key="save"
                        type="primary"
                        loading={saveLoading}
                        onClick={() => sureAddEngineerEvent()}
                    >
                        保存
                            </Button>,
                ]}
                width={820}
                onCancel={() => modalCloseEvent()}
                title="项目立项"
            >
                <Form form={form}>
                    <CreateEngineer form={form} />
                </Form>
            </Modal>
            <ArrangeModal
                finishEvent={arrangeFinishEvent}
                visible={arrangeModalVisible}
                onChange={setArrangeModalVisible}
                projectIds={selectProjectIds}
            />
            <EditArrangeModal
                changeFinishEvent={changeArrangeFinishEvent}
                visible={editArrangeModalVisible}
                onChange={setEditArrangeModalVisible}
                projectIds={selectProjectIds}
            />
            <ShareModal finishEvent={arrangeFinishEvent} visible={shareModalVisible} onChange={setShareModalVisible} projectIds={selectProjectIds} />
            <ResourceLibraryManageModal visible={libVisible} onChange={setLibVisible} changeFinishEvent={arrangeFinishEvent} />
        </PageCommonWrap>
    );
};

export default ProjectManagement;

