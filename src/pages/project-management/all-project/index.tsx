import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import React, { useEffect, useRef } from 'react';

import { Button, Input, message, Modal } from 'antd';

import styles from './index.less';
import EnumSelect from '@/components/enum-select';
import {
  addEngineer,
  // AllProjectStatisticsParams,
  applyKnot,
  auditKnot,
  canEditArrange,
  checkCanArrange,
  deleteProject,
  // getAllotUsers,
  // getExternalArrangeStep,
  getProjectInfo,
  // getProjectTableStatistics,
  ProjectIdentityType,
  ProjectSourceType,
  ProjectStatus,
  revokeAllot,
  revokeKnot,
} from '@/services/project-management/all-project';
import AllStatistics from './components/all-statistics';
import SingleStatistics from './components/single-statistics';
import CommonTitle from '@/components/common-title';
import { CopyOutlined, DeleteOutlined, DownOutlined, FileAddOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Dropdown } from 'antd';
import TableExportButton from '@/components/table-export-button';
import { useState } from 'react';
import { useMount } from 'ahooks';
import EnigneerTable from './components/enigneer-table';
import { Form } from 'antd';
import CreateEngineer from './components/create-engineer';
import { TableItemCheckedInfo } from './components/engineer-table-item';
import { Popconfirm } from 'antd';
import ArrangeModal from './components/arrange-modal';
import ShareModal from './components/share-modal';
import EditArrangeModal from './components/edit-arrange-modal';
import { useGetButtonJurisdictionArray, useGetProjectEnum } from '@/utils/hooks';
import UrlSelect from '@/components/url-select';
import ResourceLibraryManageModal from './components/resource-library-manage-modal';
import ProjectRecallModal from './components/project-recall-modal';
import UploadAddProjectModal from './components/upload-batch-modal';
import OverFlowHiddenComponent from '@/components/over-flow-hidden-component';
import AreaSelect from '@/components/area-select';
import EditExternalArrangeForm from './components/edit-external-modal';
import ExternalArrangeForm from './components/external-arrange-modal';
import ChooseDesignAndSurvey from '@/pages/project-management/all-project/components/choose-design-and-survey';
import { useLayoutStore } from '@/layouts/context';
import ExportPowerModal from './components/export-power-modal';
import AuditKnotModal from './components/audit-knot-modal';

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
  const [category, setCategory] = useState<number[]>();
  const [pCategory, setPCategory] = useState<number[]>();
  const [stage, setStage] = useState<number[]>();
  const [constructType, setConstructType] = useState<number[]>();
  const [nature, setNature] = useState<number[]>();
  const [kvLevel, setKvLevel] = useState<number[]>();
  const [status, setStatus] = useState<number[]>();
  const [sourceType, setSourceType] = useState<number[]>();
  const [identityType, setIdentityType] = useState<number[]>();
  const [areaInfo, setAreaInfo] = useState({ areaType: '-1', areaId: '' });
  const [dataSourceType, setDataSourceType] = useState<number>();

  const [statisticsData, setStatisticsData] = useState({
    total: 0,
    awaitProcess: 0,
    inProgress: 0,
    delegation: 0,
    beShared: 0,
  });

  const {
    setAllProjectSearchProjectId: setAllProjectSearchProjectId,
    setAllProjectSearchPerson,
    allProjectSearchPerson,
    allProjectSearchProjectName,
  } = useLayoutStore();

  const [statisticalCategory, setStatisticalCategory] = useState<string>('-1');
  // 被勾选中的数据
  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);

  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);

  const [editExternalArrangeModal, setEditExternalArrangeModal] = useState<boolean>(false);

  const [externalArrangeModal, setExternalArrangeModal] = useState<boolean>(false);

  const [arrangeModalVisible, setArrangeModalVisible] = useState<boolean>(false);

  const [editArrangeModalVisible, setEditArrangeModalVisible] = useState<boolean>(false);

  const [addEngineerModalFlag, setAddEngineerModalFlag] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false);

  const [libVisible, setLibVisible] = useState(false);

  const [selectProjectIds, setSelectProjectIds] = useState<string[]>([]);

  const [projectName, setProjectName] = useState<string>('');

  const [currentArrangeProjectType, setCurrentArrangeProjectType] = useState<string>('2');
  const [currentArrangeProjectIsArrange, setCurrentArrangeProjectIsArrange] = useState<string>('');

  const [editCurrentAllotCompanyId, setEditCurrentAllotCompanyId] = useState<string>('');

  const [currentRecallProjectId, setCurrentRecallProjectId] = useState<string>('');
  const [recallModalVisible, setRecallModalVisible] = useState(false);

  const [exportPowerModalVisible, setExportPowerModalVisible] = useState<boolean>(false);

  const [projectAuditKnotModal, setProjectAuditKnotModal] = useState<boolean>(false);

  const [upLoadAddProjectModalVisible, setUploadAddProjectModalVisible] = useState<boolean>(false);

  const [selectDefaultData, setSelectDefaultData] = useState({
    logicRelation: 2,
    survey: '',
    design: '',
  });

  //获取上传立项模板后的List数据
  //获取当前选择数据
  const [currentProjectId, setCurrentProjectId] = useState<string>('');

  const [ifCanEdit, setIfCanEdit] = useState<any>([]);

  //获取筛选人员数据
  const [personInfo, setPersonInfo] = useState<any>({});

  // const [notBeginUsers, setNotBeginUsers] = useState<any>();

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const tableRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);

  const [form] = Form.useForm();

  // const { run: getExternalStep } = useRequest(getExternalArrangeStep, {
  //   manual: true,
  // });

  const {
    projectCategory,
    projectClassification,
    projectNature,
    projectConstructType,
    projectStage,
    projectKvLevel,
  } = useGetProjectEnum();

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
      // scrollRef.current?.scrollToTop();
    }
  };

  const searchByParams = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams(params);
    }
  };

  const revokeAllotEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }
    await revokeAllot(projectIds);
    message.success('撤回安排成功');
    refresh();
  };

  const arrangeEvent = async () => {
    // setArrangeModalVisible(true);
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat(1);
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }

    await checkCanArrange(projectIds);

    // 如果只有一个项目需要安排的时候，需要去检查他是不是被安排了部组
    if (projectIds.length === 1) {
      const thisProjectId = projectIds[0];
      const projectInfo = await getProjectInfo(thisProjectId);
      setDataSourceType(Number(projectInfo.dataSourceType));
      // console.log(projectInfo);

      const { allots = [] } = projectInfo ?? {};
      if (allots.length > 0) {
        const latestAllot = allots[allots?.length - 1];
        const allotType = latestAllot.allotType;
        const allotCompanyGroup = latestAllot.allotCompanyGroup;
        if (allotType) {
          setCurrentArrangeProjectType(String(allotType));
        } else {
          setCurrentArrangeProjectType('2');
        }
        if (allotCompanyGroup) {
          setCurrentArrangeProjectIsArrange(allotCompanyGroup);
        } else {
          setCurrentArrangeProjectIsArrange('');
        }
      } else {
        setCurrentArrangeProjectType('2');
        setCurrentArrangeProjectIsArrange('');
      }
    }

    setSelectProjectIds(projectIds);
    setArrangeModalVisible(true);
  };

  const editArrangeEvent = async () => {
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1);

    if (projectIds && projectIds.length === 0) {
      message.error('请选择修改安排的项目！');
      return;
    }
    if (tableSelectData[0]?.projectInfo?.status[0]?.status === 7) {
      message.error('当前处于设计完成，不可修改安排！');
      return;
    }
    if (
      (tableSelectData[0]?.projectInfo?.status[0]?.status === 17 &&
        tableSelectData[0]?.projectInfo?.status[0]?.auditStatus === 13) ||
      (tableSelectData[0]?.projectInfo?.status[0]?.status === 17 &&
        tableSelectData[0]?.projectInfo?.status[0]?.auditStatus === 15)
    ) {
      setCurrentProjectId(tableSelectData[0]?.checkedArray[0]);

      setEditExternalArrangeModal(true);
      return;
    }
    if (
      tableSelectData[0]?.projectInfo?.status[0]?.status === 17 &&
      tableSelectData[0]?.projectInfo?.status[0]?.auditStatus === 10
    ) {
      setCurrentProjectId(tableSelectData[0]?.checkedArray[0]);
      setProjectName(tableSelectData[0]?.projectInfo?.name[0]);

      setExternalArrangeModal(true);
      return;
    }
    const resData = await canEditArrange(projectIds);

    const { allotCompanyGroup = '' } = resData;

    setIfCanEdit(resData);

    setEditCurrentAllotCompanyId(allotCompanyGroup);
    setSelectProjectIds(projectIds);
    setEditArrangeModalVisible(true);
  };

  const arrangeMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-arrange-project') && (
        <Menu.Item onClick={() => arrangeEvent()}>安排</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-edit-arrange') && (
        <Menu.Item onClick={() => editArrangeEvent()}>修改安排</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-recall-project') && (
        <Menu.Item onClick={() => revokeAllotEvent()}>撤回安排</Menu.Item>
      )}
    </Menu>
  );

  const recallShareEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat();
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }

    if (projectIds.length > 1) {
      message.error('只能对一个项目进行撤回共享操作');
      return;
    }

    setCurrentRecallProjectId(projectIds[0]);
    setRecallModalVisible(true);

    //await recallShare(projectIds);
    //message.success('撤回共享成功');
  };

  const shareEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat();
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }

    setSelectProjectIds(projectIds);
    setShareModalVisible(true);
  };

  const shareMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-share') && (
        <Menu.Item onClick={() => shareEvent()}>共享</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-share-recall') && (
        <Menu.Item onClick={() => recallShareEvent()}>撤回共享</Menu.Item>
      )}
    </Menu>
  );

  const importMenu = (
    <Menu>
      <Menu.Item>下载模板</Menu.Item>
      <Menu.Item>导入项目</Menu.Item>
    </Menu>
  );

  const applyKnotEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat();
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }

    await applyKnot(projectIds);
    message.success('申请结项成功');
    refresh();
  };

  const revokeKnotEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat();
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }

    await revokeKnot(projectIds);
    message.success('撤回结项成功');
    refresh();
  };

  const auditKnotEvent = async () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.warning('请至少选择一条数据');
      return;
    }
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1);
    setSelectProjectIds(projectIds);
    setProjectAuditKnotModal(true);
  };

  // const noAuditKnotEvent = async () => {
  //   const projectIds = tableSelectData.map((item) => item.checkedArray).flat();

  //   if (projectIds.length === 0) {
  //     message.error('请至少选择一个项目');
  //     return;
  //   }

  //   await noAuditKnot(projectIds);
  //   message.success('结项退回成功');
  //   refresh();
  // };

  const postProjectMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-apply-knot') && (
        <Menu.Item>
          <Popconfirm
            title="确认对该项目进行“申请结项”?"
            onConfirm={applyKnotEvent}
            okText="确认"
            cancelText="取消"
          >
            申请结项
          </Popconfirm>
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-recall-apply-knot') && (
        <Menu.Item>
          <Popconfirm
            title="确认对该项目进行“撤回结项”?"
            onConfirm={revokeKnotEvent}
            okText="确认"
            cancelText="取消"
          >
            撤回结项
          </Popconfirm>
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-kont-pass') && (
        <Menu.Item onClick={() => auditKnotEvent()}>结项审批</Menu.Item>
      )}
      {/* {buttonJurisdictionArray?.includes('all-project-kont-no-pass') && (
        <Menu.Item onClick={() => noAuditKnotEvent()}>结项退回</Menu.Item>
      )} */}
    </Menu>
  );

  const resetSearch = () => {
    setKeyWord('');
    setCategory(undefined);
    setPCategory(undefined);
    setStage(undefined);
    setConstructType(undefined);
    setNature(undefined);
    setKvLevel(undefined);
    setStatus(undefined);
    setIdentityType(undefined);
    setSourceType(undefined);
    setAreaInfo({
      areaType: '-1',
      areaId: '',
    });
    setPersonInfo({
      logicRelation: 2,
      design: '',
      survey: '',
    });
    setSelectDefaultData({
      survey: '',
      logicRelation: 2,
      design: '',
    });

    areaSelectReset();
    personSelectReset();
    // TODO 重置完是否进行查询
    searchByParams({
      keyWord: '',
      category: [],
      pCategory: [],
      stage: [],
      constructType: [],
      nature: [],
      kvLevel: [],
      status: [],
      statisticalCategory: statisticalCategory,
      sourceType: [],
      identityType: [],
      areaType: '-1',
      areaId: '',
      logicRelation: 2,
      designUser: '',
      surveyUser: '',
    });
  };

  const statisticsClickEvent = (statisticsType: string) => {
    setStatisticalCategory(statisticsType);
    searchByParams({
      keyWord,
      category: category ?? [],
      pCategory: pCategory ?? [],
      stage: stage ?? [],
      constructType: constructType ?? [],
      nature: nature ?? [],
      kvLevel: kvLevel ?? [],
      status: status ?? [],
      statisticalCategory: statisticsType,
      sourceType: sourceType ?? [],
      identityType: identityType ?? [],
      logicRelation: personInfo.logicRelation ?? 2,
      designUser: personInfo.design,
      surveyUser: personInfo.survey,
      ...areaInfo,
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

        const [provinceNumber, city, area] = province;

        await addEngineer({
          projects,
          engineer: {
            name,
            province: !isNaN(provinceNumber) ? provinceNumber : '',
            city: !isNaN(city) ? city : '',
            area: !isNaN(area) ? area : '',
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
        search();
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
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat();
    if (projectIds.length === 0) {
      message.error('请至少勾选一条数据');
      return;
    }
    await deleteProject(projectIds);
    message.success('删除成功');
    // search();
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
    setAddEngineerModalFlag(true);
    form.resetFields();
    form.setFieldsValue({ projects: [{ name: '' }] });
  };

  //打开上传批量模板
  const openBatchAddEngineerModal = () => {
    setUploadAddProjectModalVisible(true);
  };

  //上传模板后跳转
  const searchChildrenList = [
    {
      width: 300,
    },
    {
      width: 188,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
    {
      width: 111,
    },
  ];

  const areaChangeEvent = (params: any) => {
    const { provinceId, cityId, areaId } = params;
    if (areaId) {
      setAreaInfo({
        areaType: '3',
        areaId: areaId,
      });
      return;
    }
    if (cityId) {
      setAreaInfo({
        areaType: '2',
        areaId: cityId,
      });
      return;
    }
    if (provinceId) {
      setAreaInfo({
        areaType: '1',
        areaId: provinceId,
      });
      return;
    }
    if (!provinceId && !cityId && !areaId) {
      setAreaInfo({
        areaType: '-1',
        areaId: '',
      });
    }
  };

  const areaSelectReset = () => {
    if (areaRef && areaRef.current) {
      //@ts-ignore
      areaRef.current.reset();
    }
  };

  const personSelectReset = () => {
    if (personRef && personRef.current) {
      //@ts-ignore
      personRef.current.reset();
    }
  };

  const delayRefresh = async () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      await tableRef.current.delayRefresh();
    }
  };

  useMount(() => {
    search();
  });

  useEffect(() => {
    if (allProjectSearchProjectName) {
      setAllProjectSearchProjectId?.('');

      searchByParams({
        projectId: allProjectSearchProjectName,
        category: category ?? [],
        pCategory: pCategory ?? [],
        stage: stage ?? [],
        constructType: constructType ?? [],
        nature: nature ?? [],
        kvLevel: kvLevel ?? [],
        status: status ?? [],
        statisticalCategory: statisticalCategory,
        sourceType: sourceType ?? [],
        identityType: identityType ?? [],
        logicRelation: personInfo.logicRelation ?? 2,
        designUser: personInfo.design,
        surveyUser: personInfo.survey,
        ...areaInfo,
      });
    }
    if (allProjectSearchPerson) {
      setPersonInfo({
        survey: String(allProjectSearchPerson),
        logicRelation: 1,
        desgin: String(allProjectSearchPerson),
      });

      setSelectDefaultData({
        survey: String(allProjectSearchPerson),
        logicRelation: 1,
        design: String(allProjectSearchPerson),
      });

      setAllProjectSearchPerson?.('');

      searchByParams({
        keyWord,
        category: category ?? [],
        pCategory: pCategory ?? [],
        stage: stage ?? [],
        constructType: constructType ?? [],
        nature: nature ?? [],
        kvLevel: kvLevel ?? [],
        status: status ?? [],
        statisticalCategory: statisticalCategory,
        sourceType: sourceType ?? [],
        identityType: identityType ?? [],
        logicRelation: 1,
        designUser: String(allProjectSearchPerson),
        surveyUser: String(allProjectSearchPerson),
        ...areaInfo,
      });
    }
  }, [allProjectSearchPerson, allProjectSearchProjectName]);

  //导出坐标权限
  const exportPowerEvent = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.warning('请至少选择一条数据');
      return;
    }
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1);
    setSelectProjectIds(projectIds);
    setExportPowerModalVisible(true);
  };

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.projectManagement}>
        <div className={styles.projectManagemnetSearch}>
          <div className="flex">
            <div className="flex1 flex" style={{ overflow: 'hidden' }}>
              <OverFlowHiddenComponent childrenList={searchChildrenList}>
                <TableSearch className="mr22" label="项目名称" width="300px">
                  <Search
                    placeholder="请输入项目名称"
                    enterButton
                    value={keyWord}
                    onChange={(e) => setKeyWord(e.target.value)}
                    onSearch={() => search()}
                  />
                </TableSearch>
                <TableSearch className="ml10 mb10" label="全部状态" width="178px">
                  <UrlSelect
                    valueKey="value"
                    titleKey="text"
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    defaultData={projectCategory}
                    className="widthAll"
                    value={category}
                    onChange={(value) => setCategory(value as number[])}
                    placeholder="项目分类"
                  />
                </TableSearch>
                <TableSearch className="mr2" width="111px">
                  <UrlSelect
                    valueKey="value"
                    titleKey="text"
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    defaultData={projectClassification}
                    value={pCategory}
                    dropdownMatchSelectWidth={168}
                    onChange={(value) => setPCategory(value as number[])}
                    className="widthAll"
                    placeholder="项目类别"
                  />
                </TableSearch>
                <TableSearch className="mr2" width="111px">
                  <UrlSelect
                    valueKey="value"
                    titleKey="text"
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    defaultData={projectStage}
                    value={stage}
                    className="widthAll"
                    onChange={(value) => setStage(value as number[])}
                    placeholder="项目阶段"
                  />
                </TableSearch>

                <TableSearch className="mr2" width="111px">
                  <UrlSelect
                    valueKey="value"
                    titleKey="text"
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    defaultData={projectConstructType}
                    value={constructType}
                    className="widthAll"
                    placeholder="建设类型"
                    onChange={(value) => setConstructType(value as number[])}
                  />
                </TableSearch>
                <TableSearch className="mr2" width="111px">
                  <UrlSelect
                    valueKey="value"
                    titleKey="text"
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    defaultData={projectKvLevel}
                    value={kvLevel}
                    onChange={(value) => setKvLevel(value as number[])}
                    className="widthAll"
                    placeholder="电压等级"
                  />
                </TableSearch>
                <TableSearch className="mr2" width="111px">
                  <UrlSelect
                    valueKey="value"
                    titleKey="text"
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    defaultData={projectNature}
                    value={nature}
                    dropdownMatchSelectWidth={168}
                    onChange={(value) => setNature(value as number[])}
                    className="widthAll"
                    placeholder="项目性质"
                  />
                </TableSearch>
                <TableSearch className="mb10" width="111px">
                  <EnumSelect
                    enumList={ProjectStatus}
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    value={status}
                    onChange={(value) => setStatus(value as number[])}
                    className="widthAll"
                    placeholder="项目状态"
                  />
                </TableSearch>
                <TableSearch className="mb10" width="111px">
                  <AreaSelect ref={areaRef} onChange={areaChangeEvent} />
                </TableSearch>
                <TableSearch width="111px" className="mb10">
                  <EnumSelect
                    enumList={ProjectSourceType}
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    value={sourceType}
                    onChange={(value) => setSourceType(value as number[])}
                    className="widthAll"
                    placeholder="项目来源"
                  />
                </TableSearch>
                <TableSearch width="111px" className="mb10">
                  <EnumSelect
                    enumList={ProjectIdentityType}
                    mode="multiple"
                    allowClear
                    maxTagCount={0}
                    maxTagTextLength={3}
                    value={identityType}
                    onChange={(value) => setIdentityType(value as number[])}
                    className="widthAll"
                    placeholder="项目身份"
                  />
                </TableSearch>
                <TableSearch width="121px">
                  <ChooseDesignAndSurvey
                    ref={personRef}
                    defaultValue={selectDefaultData}
                    onChange={setPersonInfo}
                  />
                </TableSearch>
              </OverFlowHiddenComponent>
            </div>
            <div className={styles.projectManagemnetSearchButtonContent}>
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
                {buttonJurisdictionArray?.includes('all-project-project-approval') && (
                  <Button className="mr7" type="primary" onClick={() => openAddEngineerModal()}>
                    <FileAddOutlined />
                    立项
                  </Button>
                )}
                {buttonJurisdictionArray?.includes('all-project-batch-project') && (
                  <Button className="mr7" onClick={() => openBatchAddEngineerModal()}>
                    <CopyOutlined />
                    批量立项
                  </Button>
                )}
                {buttonJurisdictionArray?.includes('all-project-delete-project') && (
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
                )}
                {(buttonJurisdictionArray?.includes('all-project-arrange-project') ||
                  buttonJurisdictionArray?.includes('all-project-edit-arrange') ||
                  buttonJurisdictionArray?.includes('all-project-recall-project')) && (
                  <Dropdown overlay={arrangeMenu}>
                    <Button className="mr7">
                      安排 <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
                {(buttonJurisdictionArray?.includes('all-project-share') ||
                  buttonJurisdictionArray?.includes('all-project-share-recall')) && (
                  <Dropdown overlay={shareMenu}>
                    <Button className="mr7">
                      共享 <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
                {buttonJurisdictionArray?.includes('all-project-export') && (
                  <div className="mr7">
                    <TableExportButton
                      exportUrl="/Porject/Export"
                      selectIds={tableSelectData.map((item) => item.checkedArray).flat(1)}
                      selectSlot={() => {
                        return <span onClick={() => exportPowerEvent()}>导出坐标权限设置</span>;
                      }}
                      extraParams={{
                        keyWord,
                        category: category,
                        pCategory: pCategory,
                        stage: stage,
                        constructType: constructType,
                        nature: nature,
                        kvLevel: kvLevel,
                        status: status,
                        statisticalCategory: statisticalCategory,
                        sourceType: sourceType,
                        identityType: identityType,
                        logicRelation: 2,
                        ...areaInfo,
                      }}
                    />
                  </div>
                )}
                {(buttonJurisdictionArray?.includes('all-project-apply-knot') ||
                  buttonJurisdictionArray?.includes('all-project-recall-apply-knot') ||
                  buttonJurisdictionArray?.includes('all-project-kont-pass') ||
                  buttonJurisdictionArray?.includes('all-project-kont-no-pass')) && (
                  <Dropdown overlay={postProjectMenu}>
                    <Button className="mr7">
                      结项 <DownOutlined />
                    </Button>
                  </Dropdown>
                )}
                {buttonJurisdictionArray?.includes('all-project-resource') && (
                  <Button onClick={() => setLibVisible(true)}>资源库迭代</Button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.projectManagementTableContent}>
            <EnigneerTable
              ref={tableRef}
              afterSearch={refresh}
              delayRefresh={delayRefresh}
              onSelect={tableSelectEvent}
              extractParams={{
                keyWord,
                category: category,
                pCategory: pCategory,
                stage: stage,
                constructType: constructType,
                nature: nature,
                kvLevel: kvLevel,
                status: status,
                statisticalCategory: statisticalCategory,
                sourceType: sourceType,
                identityType: identityType,
                logicRelation: personInfo.logicRelation ?? 2,
                designUser: personInfo.design,
                surveyUser: personInfo.survey,
                ...areaInfo,
              }}
              getStatisticsData={(value: any) => setStatisticsData(value)}
            />
          </div>
        </div>
      </div>

      <UploadAddProjectModal
        visible={upLoadAddProjectModalVisible}
        onChange={setUploadAddProjectModalVisible}
        refreshEvent={search}
      />

      {addEngineerModalFlag && (
        <Modal
          maskClosable={false}
          centered
          visible={addEngineerModalFlag}
          bodyStyle={{ height: 800, overflowY: 'auto' }}
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
          destroyOnClose
        >
          <Form form={form} preserve={false}>
            <CreateEngineer form={form} />
          </Form>
        </Modal>
      )}
      {arrangeModalVisible && (
        <ArrangeModal
          finishEvent={arrangeFinishEvent}
          visible={arrangeModalVisible}
          onChange={setArrangeModalVisible}
          defaultSelectType={currentArrangeProjectType}
          allotCompanyId={currentArrangeProjectIsArrange}
          projectIds={selectProjectIds}
          dataSourceType={dataSourceType}
        />
      )}
      {editArrangeModalVisible && (
        <EditArrangeModal
          allotCompanyId={editCurrentAllotCompanyId}
          changeFinishEvent={changeArrangeFinishEvent}
          visible={editArrangeModalVisible}
          onChange={setEditArrangeModalVisible}
          projectIds={selectProjectIds}
          canEdit={ifCanEdit}
        />
      )}
      {recallModalVisible && (
        <ProjectRecallModal
          changeFinishEvent={refresh}
          visible={recallModalVisible}
          projectId={currentRecallProjectId}
          onChange={setRecallModalVisible}
        />
      )}
      {shareModalVisible && (
        <ShareModal
          finishEvent={refresh}
          visible={shareModalVisible}
          onChange={setShareModalVisible}
          projectIds={selectProjectIds}
        />
      )}
      {libVisible && (
        <ResourceLibraryManageModal
          visible={libVisible}
          onChange={setLibVisible}
          changeFinishEvent={refresh}
        />
      )}
      {editExternalArrangeModal && (
        <EditExternalArrangeForm
          projectId={currentProjectId}
          visible={editExternalArrangeModal}
          onChange={setEditExternalArrangeModal}
          closeModalEvent={delayRefresh}
        />
      )}
      {externalArrangeModal && (
        <ExternalArrangeForm
          visible={externalArrangeModal}
          onChange={setExternalArrangeModal}
          projectId={currentProjectId}
          proName={projectName}
          search={delayRefresh}
        />
      )}
      {exportPowerModalVisible && (
        <ExportPowerModal
          visible={exportPowerModalVisible}
          onChange={setExportPowerModalVisible}
          projectIds={selectProjectIds}
          finishEvent={refresh}
        />
      )}

      {projectAuditKnotModal && (
        <AuditKnotModal
          visible={projectAuditKnotModal}
          onChange={setProjectAuditKnotModal}
          projectIds={selectProjectIds}
          finishEvent={refresh}
        />
      )}
    </PageCommonWrap>
  );
};

export default ProjectManagement;
