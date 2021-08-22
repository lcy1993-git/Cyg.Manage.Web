import CommonTitle from '@/components/common-title';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import React, { useState } from 'react';
import AllStatistics from './components/all-statistics';
import SingleStatistics from './components/single-statistics';
import { Button, Input } from 'antd';
import styles from './index.less';
import EngineerTable from './components/engineer-table';
import { useRef } from 'react';
import { useLayoutStore } from '@/layouts/context';
import { useEffect } from 'react';
import ScreenModal from './components/screen-modal';
import AddEngineerModal from './components/add-engineer-modal';
import { Dropdown } from 'antd';
import { DeleteOutlined, DownOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { TableItemCheckedInfo } from './components/engineer-table/engineer-table-item';
import { Popconfirm } from 'antd';
import { message } from 'antd';
import {
  applyKnot,
  canEditArrange,
  checkCanArrange,
  deleteProject,
  getColumnsConfig,
  getProjectInfo,
  revokeAllot,
  revokeKnot,
} from '@/services/project-management/all-project';
import TableExportButton from '@/components/table-export-button';
import UploadAddProjectModal from './components/upload-batch-modal';
import ArrangeModal from './components/arrange-modal';
import EditArrangeModal from './components/edit-arrange-modal';
import EditExternalArrangeForm from './components/edit-external-modal';
import ExternalArrangeForm from './components/external-arrange-modal';
import ShareModal from './components/share-modal';
import ProjectRecallModal from './components/project-recall-modal';
import ResourceLibraryManageModal from './components/resource-library-manage-modal';
import ExportPowerModal from './components/export-power-modal';
import AuditKnotModal from './components/audit-knot-modal';
import ColumnsConfigModal from './components/columns-config-modal';
import { useMount, useRequest } from 'ahooks';
import AddFavoriteModal from './components/add-favorite-modal';
import FavoriteList from './components/favorite-list';

const { Search } = Input;

const statisticsObject = {
  '-1': '全部项目',
  '1': '待处理项目',
  '2': '进行中的项目',
  '3': '委托的项目',
  '4': '被共享的项目',
};

const AllProject: React.FC = () => {
  const [keyWord, setKeyWord] = useState<string>('');
  const [statisticalCategory, setStatisticalCategory] = useState<string>('-1');
  const [selectedFavoriteId, setSelectedFavoriteId] = useState<string>('');
  // 从列表返回的数据中获取 TODO设置search的参数
  const [searchParams, setSearchParams] = useState({
    category: [],
    stage: [],
    constructType: [],
    nature: [],
    kvLevel: [],
    status: [],
    majorCategory: [],
    pType: [],
    reformAim: [],
    classification: [],
    attribute: [],
    sourceType: [],
    identityType: [],
    areaType: '-1',
    areaId: '',
    dataSourceType: [],
    logicRelation: 2,
    startTime: '',
    endTime: '',
    designUser: '',
    surveyUser: '',
  });

  const [statisticsData, setStatisticsData] = useState({
    total: 0,
    awaitProcess: 0,
    inProgress: 0,
    delegation: 0,
    beShared: 0,
  });

  const imgSrc = require('../../../assets/icon-image/favorite.png');

  // 外审安排的时候用到
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');

  // 安排的时候需要用到
  const [currentArrangeProjectType, setCurrentArrangeProjectType] = useState<string>('2');
  const [currentArrangeProjectIsArrange, setCurrentArrangeProjectIsArrange] = useState<string>('');
  const [selectProjectIds, setSelectProjectIds] = useState<string[]>([]);
  const [dataSourceType, setDataSourceType] = useState<number>();

  // 编辑安排的时候需要用到的数据
  const [editCurrentAllotCompanyId, setEditCurrentAllotCompanyId] = useState<string>('');
  const [ifCanEdit, setIfCanEdit] = useState<any>([]);

  // 撤回共享的时候用到
  const [currentRecallProjectId, setCurrentRecallProjectId] = useState<string>('');
  // 被勾选中的数据
  const [tableSelectData, setTableSelectData] = useState<TableItemCheckedInfo[]>([]);
  const [chooseColumns, setChooseColumns] = useState<string[]>([]);

  //添加收藏夹modal
  const [addFavoriteModal, setAddFavoriteModal] = useState<boolean>(false);

  //收藏夹显示
  const [sideVisible, setSideVisible] = useState<boolean>(false);

  const [defaultPersonInfo, setDefaultPersonInfo] = useState({
    logicRelation: 2,
    survey: '',
    design: '',
  });

  const [addEngineerModalVisible, setAddEngineerModalVisible] = useState(false);
  const [batchAddEngineerModalVisible, setBatchAddEngineerModalVisible] = useState(false);
  const [screenModalVisible, setScreenModalVisible] = useState(false);
  const [arrangeModalVisible, setArrangeModalVisible] = useState(false);
  const [editArrangeModalVisible, setEditArrangeModalVisible] = useState<boolean>(false);
  const [editExternalArrangeModal, setEditExternalArrangeModal] = useState<boolean>(false);
  const [externalArrangeModal, setExternalArrangeModal] = useState<boolean>(false);
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [recallModalVisible, setRecallModalVisible] = useState(false);
  const [libVisible, setLibVisible] = useState(false);
  const [exportPowerModalVisible, setExportPowerModalVisible] = useState<boolean>(false);
  const [projectAuditKnotModal, setProjectAuditKnotModal] = useState<boolean>(false);
  const [chooseColumnsModal, setChooseColumnsModal] = useState<boolean>(false);
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const {
    setAllProjectSearchProjectId,
    setAllProjectSearchPerson,
    allProjectSearchPerson,
    allProjectSearchProjectId,
  } = useLayoutStore();

  const { data: columnsData } = useRequest(() => getColumnsConfig(), {
    onSuccess: () => {
      setChooseColumns(
        columnsData
          ? JSON.parse(columnsData)
          : [
              'categoryText',
              'kvLevelText',
              'natureTexts',
              'majorCategoryText',
              'constructTypeText',
              'stageText',
              'exportCoordinate',
              'surveyUser',
              'designUser',
              'identitys',
            ],
      );
    },
  });

  const tableRef = useRef<HTMLDivElement>(null);

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  const searchByParams = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams(params);
    }
  };

  const delayRefresh = async () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      await tableRef.current.delayRefresh();
    }
  };

  const handleStatisticsData = (statisticsDataItem?: number) => {
    if (statisticsDataItem) {
      if (statisticsDataItem < 10) {
        return `0${statisticsDataItem}`;
      }
      return statisticsDataItem;
    }
    return '0';
  };

  const statisticsClickEvent = (statisticsType: string) => {
    setStatisticalCategory(statisticsType);
    searchByParams({
      ...searchParams,
      statisticalCategory: statisticsType,
      keyWord,
    });
  };

  const favoriteClickEvent = (collectionId: string) => {
    console.log(collectionId, 111);

    setSelectedFavoriteId(collectionId);
    searchByParams({
      ...searchParams,
      engineerFavoritesId: selectedFavoriteId,
      keyWord,
    });
  };

  const addEngineerEvent = () => {
    setAddEngineerModalVisible(true);
  };

  const batchAddEngineerEvent = () => {
    setBatchAddEngineerModalVisible(true);
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

  const arrangeEvent = async () => {
    // setArrangeModalVisible(true);
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat(1);
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }

    await checkCanArrange(projectIds);

    console.log(tableSelectData?.[0].projectInfo);

    // 如果只有一个项目需要安排的时候，需要去检查他是不是被安排了部组
    if (projectIds.length === 1) {
      const thisProjectId = projectIds[0];
      const projectInfo = await getProjectInfo(thisProjectId);
      setDataSourceType(Number(projectInfo.dataSourceType));
      const { allots = [] } = projectInfo ?? {};
      if (allots.length > 0) {
        const latestAllot = allots[allots?.length - 1];
        const { allotType, allotCompanyGroup } = latestAllot;
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

    //根据现场数据来源数组 判断点击安排进入后的提示信息
    const typeArray = tableSelectData?.[0].projectInfo?.dataSourceType;
    if (typeArray?.length != 1 && !typeArray?.includes(0)) {
      setDataSourceType(-1);
    }
    if (typeArray?.every((item) => item === typeArray[0]) && typeArray?.includes(1)) {
      setDataSourceType(1);
    }
    if (typeArray?.every((item) => item === typeArray[0]) && typeArray?.includes(2)) {
      setDataSourceType(2);
    }

    setSelectProjectIds(projectIds);
    setArrangeModalVisible(true);
  };

  const editArrangeEvent = async () => {
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1);

    if (projectIds.length === 1) {
      const thisProjectId = projectIds[0];
      const projectInfo = await getProjectInfo(thisProjectId);
      setDataSourceType(Number(projectInfo.dataSourceType));
    }

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

  const shareEvent = async () => {
    const projectIds = tableSelectData.map((item) => item.checkedArray).flat();
    if (projectIds.length === 0) {
      message.error('请至少选择一个项目');
      return;
    }

    setSelectProjectIds(projectIds);
    setShareModalVisible(true);
  };

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
  };

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

  const searchEvent = () => {
    // TODO
    searchByParams({
      ...searchParams,
      statisticalCategory,
      keyWord,
    });
  };

  // 导出坐标权限
  const exportPowerEvent = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.warning('请至少选择一条数据');
      return;
    }
    const projectIds = tableSelectData?.map((item) => item.checkedArray).flat(1);
    setSelectProjectIds(projectIds);
    setExportPowerModalVisible(true);
  };

  const tableSelectEvent = (checkedValue: TableItemCheckedInfo[]) => {
    console.log(checkedValue, '33');

    setTableSelectData(checkedValue);
  };

  const addEngineerMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('all-project-project-approval') && (
        <Menu.Item onClick={() => addEngineerEvent()}>立项</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('all-project-batch-project') && (
        <Menu.Item onClick={() => batchAddEngineerEvent()}>批量立项</Menu.Item>
      )}
    </Menu>
  );

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

  //收藏夹操作
  const favoriteMenu = (
    <Menu>
      {/* {buttonJurisdictionArray?.includes('all-project-share') && ( */}
      <Menu.Item onClick={() => addFavEvent()}>添加至收藏夹</Menu.Item>
      {/* )} */}
      {/* {buttonJurisdictionArray?.includes('all-project-share-recall') && ( */}
      <Menu.Item onClick={() => removeFavEvent()}>移除当前收藏夹</Menu.Item>
      {/* )} */}
    </Menu>
  );

  const addFavEvent = () => {
    setAddFavoriteModal(true);
  };

  const removeFavEvent = () => {};

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

  useMount(() => {
    searchByParams({
      ...searchParams,
      keyWord,
      statisticalCategory,
    });
  });

  useEffect(() => {
    if (allProjectSearchProjectId) {
      // TODO 有projectName的时候设置projectName
      searchByParams({
        ...searchParams,
        projectId: allProjectSearchProjectId,
        keyWord,
        statisticalCategory,
      });
      setAllProjectSearchProjectId?.('');
    }
    if (allProjectSearchPerson) {
      setAllProjectSearchPerson?.('');

      setSearchParams({
        ...searchParams,
        surveyUser: String(allProjectSearchPerson),
        logicRelation: 1,
        designUser: String(allProjectSearchPerson),
      });

      // TODO 有人的时候设置人
      searchByParams({
        ...searchParams,
        keyWord,
        statisticalCategory,
        surveyUser: String(allProjectSearchPerson),
        logicRelation: 1,
        designUser: String(allProjectSearchPerson),
      });
    }
  }, [allProjectSearchPerson, allProjectSearchProjectId]);

  const configChangeEvent = (config: any) => {
    setChooseColumns(config);
  };

  const screenClickEvent = (params: any) => {
    setSearchParams({ ...params, keyWord, statisticalCategory });
    searchByParams({ ...params, keyWord, statisticalCategory });
  };

  return (
    <>
      <div
        className={styles.folderButton}
        onClick={() => setSideVisible(true)}
        style={{ display: sideVisible ? 'none' : 'block' }}
      >
        <img src={imgSrc} alt="" />
        <div>收藏</div>
      </div>
      <PageCommonWrap noPadding={true}>
        <div className={styles.allProjectPage}>
          <div className={styles.allProjectStatistics}>
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
          <div className={styles.projectsAndFavorite}>
            <div
              className={styles.allProjectsFavorite}
              // sideVisible ? 'block' : 'none'
              style={{ display: sideVisible ? 'block' : 'none' }}
            >
              <FavoriteList
                setVisible={setSideVisible}
                visible={sideVisible}
                onSelect={favoriteClickEvent}
              />
            </div>
            <div className={styles.allProjectTableContent}>
              <CommonTitle>{statisticsObject[statisticalCategory]}</CommonTitle>
              <div className={styles.allProjectSearch}>
                <div className={styles.allProjectSearchContent}>
                  <TableSearch className="mr22" label="" width="300px">
                    <Search
                      placeholder="请输入工程/项目名称"
                      enterButton
                      value={keyWord}
                      onChange={(e) => setKeyWord(e.target.value)}
                      onSearch={() => searchEvent()}
                    />
                  </TableSearch>
                  <Button onClick={() => setScreenModalVisible(true)}>筛选</Button>
                </div>
                <div className={styles.allProjectFunctionButtonContent}>
                  {(buttonJurisdictionArray?.includes('all-project-project-approval') ||
                    buttonJurisdictionArray?.includes('all-project-batch-project')) && (
                    <Dropdown overlay={addEngineerMenu}>
                      <Button className="mr7" type="primary">
                        立项 <DownOutlined />
                      </Button>
                    </Dropdown>
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
                  <Dropdown overlay={favoriteMenu}>
                    <Button className="mr7">
                      收藏 <DownOutlined />
                    </Button>
                  </Dropdown>

                  {buttonJurisdictionArray?.includes('all-project-export') && (
                    <div className="mr7">
                      <TableExportButton
                        exportUrl="/Porject/Export"
                        selectIds={tableSelectData.map((item) => item.checkedArray).flat(1)}
                        selectSlot={() => {
                          return <span onClick={() => exportPowerEvent()}>导出坐标权限设置</span>;
                        }}
                        // TODO 待添加参数
                        extraParams={{
                          ...searchParams,
                          keyWord,
                          statisticalCategory,
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
                    <Button className="mr7" onClick={() => setLibVisible(true)}>
                      资源库迭代
                    </Button>
                  )}
                  <Button onClick={() => setChooseColumnsModal(true)}>自定义表头</Button>
                </div>
              </div>
              <div className={styles.engineerTableContent}>
                <EngineerTable
                  getStatisticsData={(value: any) => setStatisticsData(value)}
                  ref={tableRef}
                  extractParams={{ keyWord, statisticalCategory, ...searchParams }}
                  onSelect={tableSelectEvent}
                  columnsConfig={chooseColumns}
                  finishEvent={refresh}
                />
              </div>
            </div>
          </div>
        </div>

        <ScreenModal
          visible={screenModalVisible}
          onChange={setScreenModalVisible}
          finishEvent={screenClickEvent}
          searchParams={searchParams}
        />

        {addEngineerModalVisible && (
          <AddEngineerModal
            finishEvent={searchEvent}
            visible={addEngineerModalVisible}
            onChange={setAddEngineerModalVisible}
          />
        )}

        <UploadAddProjectModal
          visible={batchAddEngineerModalVisible}
          onChange={setBatchAddEngineerModalVisible}
          refreshEvent={searchEvent}
        />

        {arrangeModalVisible && (
          <ArrangeModal
            finishEvent={refresh}
            visible={arrangeModalVisible}
            onChange={setArrangeModalVisible}
            defaultSelectType={currentArrangeProjectType}
            allotCompanyId={currentArrangeProjectIsArrange}
            projectIds={selectProjectIds}
            dataSourceType={dataSourceType}
            setSourceTypeEvent={setDataSourceType}
          />
        )}

        {editArrangeModalVisible && (
          <EditArrangeModal
            allotCompanyId={editCurrentAllotCompanyId}
            changeFinishEvent={refresh}
            visible={editArrangeModalVisible}
            onChange={setEditArrangeModalVisible}
            projectIds={selectProjectIds}
            canEdit={ifCanEdit}
            dataSourceType={dataSourceType}
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

        {shareModalVisible && (
          <ShareModal
            finishEvent={refresh}
            visible={shareModalVisible}
            onChange={setShareModalVisible}
            projectIds={selectProjectIds}
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
        {libVisible && (
          <ResourceLibraryManageModal
            visible={libVisible}
            onChange={setLibVisible}
            changeFinishEvent={refresh}
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
        {chooseColumnsModal && (
          <ColumnsConfigModal
            hasCheckColumns={chooseColumns}
            visible={chooseColumnsModal}
            onChange={setChooseColumnsModal}
            finishEvent={configChangeEvent}
          />
        )}
        {addFavoriteModal && (
          <AddFavoriteModal
            visible={addFavoriteModal}
            onChange={setAddFavoriteModal}
            projectIds={selectProjectIds}
            finishEvent={refresh}
            checkedData={tableSelectData}
          />
        )}
      </PageCommonWrap>
    </>
  );
};

export default AllProject;
