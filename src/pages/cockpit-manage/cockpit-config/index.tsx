import PageCommonWrap from '@/components/page-common-wrap';
import React, { useMemo, useState } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import Loadable from 'react-loadable';
import Loading from '@ant-design/pro-layout/es/PageLoading';
import bgSrc from '@/assets/image/index/bg.png';
import CommonTitle from '@/components/common-title';
import { Button, message } from 'antd';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './index.less';
import uuid from 'node-uuid';
import { useRef } from 'react';
import { useRequest, useSize } from 'ahooks';
import { divide, subtract } from 'lodash';
import {
  DeleteOutlined,
  ImportOutlined,
  PlusOutlined,
  ReloadOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import CockpitMenuItem from './components/menu-item';

import AddEngineerAndProjectModule from './components/add-engineer-project-modal';
import AddEngineerTypeModal from './components/add-engineer-type-modal';
import AddDeliveryStatisticModal from './components/add-delivery-statistic-modal';
import AddOtherStatisticModal from './components/add-other-statistic-modal';
import {
  exportHomeStatisticData,
  getChartConfig,
  saveChartConfig,
} from '@/services/operation-config/cockpit';
import EmptyTip from '@/components/empty-tip';

import { mapInfo } from '../../../../public/config/request';

import ConfigWindow from './components/config-window';
import EditEngineerAndMapModal from './components/add-engineer-project-modal/edit-map-form';
import EditEngineerAndProductionModal from './components/add-engineer-project-modal/edit-production-form';
import EditProjectTypeModal from './components/add-engineer-type-modal/edit-project-type';
import EditProjectCaseModal from './components/add-engineer-type-modal/edit-project-case';
import EditDeliveryStatisticModal from './components/add-delivery-statistic-modal/edit-delivery-statistic';
import EditOtherStatisticModal from './components/add-other-statistic-modal/edit-other-statistic';
import AddEngineerProcessModal from './components/add-engineer-progress-modal';
import EditEngineerProcessModal from './components/add-engineer-progress-modal/edit-process-form';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

import MapComponent from '@/pages/index/components/map-chart';
import PersonnelLoad from '@/pages/index/components/personnel-load';
import ToDo from '@/pages/index/components/to-do';
import DeliveryManage from '@/pages/index/components/delivery-manage';
import ProjectSchedule from '@/pages/index/components/project-schedule-status';
import ProjectType from '@/pages/index/components/project-type';
import ProjectProgress from '@/pages/index/components/project-progress';

import { CockpitConfigContext } from "./context"

interface CockpitProps {
  name: string;
  w: number;
  key: string;
  h: number;
  x: number;
  y: number;
  componentProps?: any;
  // 是否需要固定宽度
  fixHeight?: boolean;
}

const getComponentByType = (type: string, componentProps: any) => {
  switch (type) {
    case 'toDo':
      return <ToDo componentProps={componentProps} />;
      break;
    case 'mapComponent':
      return <MapComponent componentProps={componentProps} />;
      break;
    case 'deliveryManage':
      return <DeliveryManage componentProps={componentProps} />;
      break;
    case 'personLoad':
      return <PersonnelLoad componentProps={componentProps} />;
      break;
    case 'projectSchedule':
      return <ProjectSchedule componentProps={componentProps} />;
      break;
    case 'projectType':
      return <ProjectType componentProps={componentProps} />;
      break;
    case 'projectProgress':
      return <ProjectProgress />;
      break;
    default:
      return undefined;
  }
};

const CockpitManage: React.FC = () => {
  const [configArray, setConfigArray] = useState<CockpitProps[]>([]);
  // 1.默认配置开发
  // a. 根据useSize获取框框大小
  // b. 默认配置的宽度是可以写死的，高度根据目前已有高度需要做一个百分比适配
  // c. 默认一格的高度都是18 的高度
  const configDivRef = useRef<HTMLDivElement>(null);
  const size = useSize(configDivRef);

  const [addMapModuleVisible, setAddMapModuleVisible] = useState<boolean>(false);
  const [addEngineerTypeVisible, setAddEngineerTypeVisible] = useState<boolean>(false);
  const [addDeliveryStatisticVisible, setAddDeliveryStatisticVisible] = useState<boolean>(false);
  const [addOtherStatisticVisible, setAddOtherStatisticVisible] = useState<boolean>(false);
  const [addEngineerProcessVisible, setAddEngineerProcessVisible] = useState<boolean>(false);

  const [editEngineerAndMapVisible, setEditEngineerAndMapVisible] = useState<boolean>(false);
  const [editEngineerAndProductionVisible, setEditEngineerAndProductionVisible] = useState<boolean>(
    false,
  );

  const [editProjectTypeVisible, setEditProjectTypeVisible] = useState<boolean>(false);
  const [editProjectCaseVisible, setEditProjectCaseVisible] = useState<boolean>(false);
  const [editDeliveryStatisticVisible, setEditDeliveryStatisticVisible] = useState<boolean>(false);
  const [editOtherStatisticVisible, setEditOtherStatisticVisible] = useState<boolean>(false);
  const [editEngineerProcessVisible, setEditEngineerProcessVisible] = useState<boolean>(false);

  const [requestExportLoading, setRequestExportLoading] = useState<boolean>(false);
  const [saveConfigLoading, setSaveConfigLoading] = useState<boolean>(false);
  const [layoutConfigData, setLayoutConfigData] = useState<any[]>([]);

  const [currentAreaId, setCurrentAreaId] = useState<string>();
  const [currentAreaLevel, setCurrentAreaLevel] = useState<"1" | "2" | "3">("1");

  const [currentRecord, setCurrentRecord] = useState<any>({});

  const { data } = useRequest(() => getChartConfig(), {
    onSuccess: () => {
      setConfigArray(handleData.config);
    },
  });

  const handleData = useMemo(() => {
    if (data) {
      return JSON.parse(data);
    }
    return {
      configWindowHeight: 828,
      config: [],
    };
  }, [data]);

  const initCockpit = () => {
    const thisBoxHeight = (size.height ?? 828) - 70;
    const totalHeight = divide(thisBoxHeight, 18);
    setConfigArray([
      { name: 'toDo', x: 0, y: 0, w: 3, h: 11, key: uuid.v1() },
      {
        name: 'mapComponent',
        x: 3,
        y: 0,
        w: 6,
        h: subtract(totalHeight, divide(totalHeight - 11, 2)),
        key: uuid.v1(),
      },
      { name: 'projectType', x: 9, y: 0, w: 3, h: 11, key: uuid.v1() },
      { name: 'deliveryManage', x: 0, y: 10, w: 3, h: divide(totalHeight - 11, 2), key: uuid.v1() },
      { name: 'personLoad', x: 9, y: 10, w: 3, h: divide(totalHeight - 11, 2), key: uuid.v1() },
      {
        name: 'projectSchedule',
        x: 0,
        y: divide(totalHeight - 11, 2) + 10,
        w: 6,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
      },
      {
        name: 'projectProgress',
        x: 6,
        y: divide(totalHeight - 11, 2) + 10,
        w: 6,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
      },
    ]);
  };

  const clearConfigEvent = () => {
    setConfigArray([]);
  };

  const layoutChangeEvent = (currentLayout: any) => {
    setLayoutConfigData(currentLayout);
  };

  // 删除事件
  const deleteEvent = (record: any) => {
    const copyConfigArray: CockpitProps[] = JSON.parse(JSON.stringify(configArray));
    const dataIndex = copyConfigArray.findIndex((item) => item.key === record.key);
    copyConfigArray.splice(dataIndex, 1);
    setConfigArray(copyConfigArray);
  };

  //编辑弹出事件
  const editEvent = (record: any) => {
    switch (record.name) {
      case 'mapComponent':
        setCurrentRecord(record);
        setEditEngineerAndMapVisible(true);
        break;
      case 'personLoad':
        setCurrentRecord(record);
        setEditEngineerAndProductionVisible(true);
        break;
      case 'projectType':
        setCurrentRecord(record);
        setEditProjectTypeVisible(true);
        break;
      case 'projectSchedule':
        setCurrentRecord(record);
        setEditProjectCaseVisible(true);
        break;
      case 'projectProgress':
        setCurrentRecord(record);
        setEditEngineerProcessVisible(true);
        break;
      case 'deliveryManage':
        setCurrentRecord(record);
        setEditDeliveryStatisticVisible(true);
        break;
      case 'toDo':
        setCurrentRecord(record);
        setEditOtherStatisticVisible(true);
        break;
    }
  };

  //编辑事件
  const editComponentEvent = (componentProps: any) => {
    const copyConfigArray: CockpitProps[] = JSON.parse(JSON.stringify(configArray));

    const dataIndex = copyConfigArray.findIndex((item) => item.key === currentRecord.key);
    copyConfigArray[dataIndex] = { ...componentProps };
    setConfigArray([...copyConfigArray]);
  };

  const configComponentElement = configArray.map((item) => {
    return (
      <div key={item.key} data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h }}>
        <ConfigWindow deleteEvent={deleteEvent} editEvent={editEvent} record={item}>
          {getComponentByType(item.name, item.componentProps)}
        </ConfigWindow>
      </div>
    );
  });

  const engineerProjectArray = [
    { name: '地图可视化统计(省)', value: 'province' },
    { name: '地图可视化统计(市)', value: 'city' },
    { name: '人员负荷(员工)', value: 'person' },
    { name: '人员负荷(部组)', value: 'department' },
    { name: '人员负荷(公司)', value: 'company' },
  ];

  const engineerTypeStatistic = [
    { name: '项目分类', value: 'classify' },
    { name: '项目类别', value: 'category' },
    { name: '项目阶段', value: 'stage' },
    { name: '建设类型', value: 'buildType' },
    { name: '电压等级', value: 'level' },
    { name: '项目状态', value: 'status' },
    { name: '项目性质', value: 'nature' },
  ];

  const engineerProgressStatistic = [{ name: '甘特图', value: 'gantt' }];

  const deliveryStatistic = [
    { name: '项目交付数量/设计费(员工)', value: 'person' },
    { name: '项目交付数量/设计费(部组)', value: 'department' },
    { name: '项目交付数量/设计费(公司)', value: 'company' },
  ];

  const otherStatistic = [
    { name: '通知栏/已结项', value: 'wait' },
    { name: '通知栏/待安排', value: 'arrange' },
    { name: '通知栏/其他消息', value: 'other' },
  ];

  const addComponentEvent = (componentProps: any) => {
    const copyConfigArray: CockpitProps[] = JSON.parse(JSON.stringify(configArray));
    setConfigArray([...copyConfigArray, ...componentProps]);
  };

  // 导出配置数据
  const exportHomeStatisticEvent = async () => {
    try {
      setRequestExportLoading(true);
      const res = await exportHomeStatisticData({
        mapProvince: mapInfo.areaId,
        ganttChartLimit: 0,
      });
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      });
      let finalyFileName = `驾驶舱配置表.xlsx`;
      // for IE
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob, finalyFileName);
      } else {
        // for Non-IE
        let objectUrl = URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = objectUrl;
        link.setAttribute('download', finalyFileName);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(link.href);
      }
      message.success('导出成功');
    } catch (msg) {
      console.error(msg);
    } finally {
      setRequestExportLoading(false);
    }
  };

  const saveConfig = async () => {
    try {
      if (configArray && configArray.length === 0) {
        message.error('配置不能为空');
        return;
      }
      setSaveConfigLoading(true);

      const saveConfigArray = configArray.map((item) => {
        const dataIndex = layoutConfigData.findIndex((ite) => ite.i === item.key);
        return {
          ...item,
          x: layoutConfigData[dataIndex].x,
          y: layoutConfigData[dataIndex].y,
          w: layoutConfigData[dataIndex].w,
          h: layoutConfigData[dataIndex].h,
        };
      });

      await saveChartConfig(
        JSON.stringify({
          configWindowHeight: size.height,
          config: saveConfigArray,
        }),
      );
      message.success('配置保存成功');
    } catch (msg) {
      console.error(msg);
    } finally {
      setSaveConfigLoading(false);
    }
  };

  return (
    <CockpitConfigContext.Provider value={{
      currentAreaId,
      setCurrentAreaId,
      currentAreaLevel,
      setCurrentAreaLevel
    }}>
      <PageCommonWrap noPadding={true}>
        <div className={styles.cockpitConfigPage}>
          <div className={styles.cockpitConfigPageMenu}>
            <div className={styles.cockpitConfigPageMenuTitle}>
              <UnorderedListOutlined />
              <span className="ml10">所有统计图表</span>
            </div>
            <div className={styles.cockpitConfigPageMenuContent}>
              <CockpitMenuItem
                childrenData={engineerProjectArray}
                name="工程项目"
                buttonSlot={
                  <Button type="text" onClick={() => setAddMapModuleVisible(true)}>
                    <PlusOutlined />
                  添加
                </Button>
                }
              />
              <CockpitMenuItem
                childrenData={engineerTypeStatistic}
                name="工程类型统计"
                buttonSlot={
                  <Button type="text" onClick={() => setAddEngineerTypeVisible(true)}>
                    <PlusOutlined />
                  添加
                </Button>
                }
              />
              <CockpitMenuItem
                childrenData={engineerProgressStatistic}
                name="工程进度统计"
                buttonSlot={
                  <Button type="text" onClick={() => setAddEngineerProcessVisible(true)}>
                    <PlusOutlined />
                  添加
                </Button>
                }
              />
              <CockpitMenuItem
                childrenData={deliveryStatistic}
                name="交付统计"
                buttonSlot={
                  <Button type="text" onClick={() => setAddDeliveryStatisticVisible(true)}>
                    <PlusOutlined />
                  添加
                </Button>
                }
              />
              <CockpitMenuItem
                childrenData={otherStatistic}
                name="其他"
                buttonSlot={
                  <Button type="text" onClick={() => setAddOtherStatisticVisible(true)}>
                    <PlusOutlined />
                  添加
                </Button>
                }
              />
            </div>
          </div>
          <div className={styles.cockpitConfigPageContent}>
            <div className={styles.cockpitConfigPageTitle}>
              <div className={styles.cockpitConfigPageTitleLeft}>
                <CommonTitle noPadding={true}>统计图表自定义窗口</CommonTitle>
              </div>
              <div className={styles.cockpitConfigPageTitleRight}>
                <Button
                  className="mr7"
                  loading={requestExportLoading}
                  onClick={() => exportHomeStatisticEvent()}
                >
                  <ImportOutlined />
                导出数据
              </Button>
                <Button className="mr7" onClick={initCockpit}>
                  <ReloadOutlined />
                恢复默认配置
              </Button>
                <Button className="mr7" onClick={clearConfigEvent}>
                  <DeleteOutlined />
                清空当前配置
              </Button>
                <Button type="primary" loading={saveConfigLoading} onClick={saveConfig}>
                  <SaveOutlined />
                保存配置
              </Button>
              </div>
            </div>

            <div
              className={styles.cockpitConfigPageContent}
              style={{ backgroundImage: `url(${bgSrc})` }}
              ref={configDivRef}
            >
              {configArray.length > 0 && (
                <ResponsiveReactGridLayout
                  breakpoints={{ lg: 120 }}
                  cols={{ lg: 12 }}
                  rowHeight={9}
                  onLayoutChange={layoutChangeEvent}
                >
                  {configComponentElement}
                </ResponsiveReactGridLayout>
              )}
              {configArray.length === 0 && (
                <div className={styles.noConfigTip}>
                  <EmptyTip
                    description="当前暂无配置，请点击左侧添加按钮进行配置"
                    className={styles.emptyTip}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <AddEngineerAndProjectModule
          visible={addMapModuleVisible}
          onChange={setAddMapModuleVisible}
          changeFinishEvent={addComponentEvent}
        />
        <AddEngineerTypeModal
          visible={addEngineerTypeVisible}
          onChange={setAddEngineerTypeVisible}
          changeFinishEvent={addComponentEvent}
        />
        <AddDeliveryStatisticModal
          visible={addDeliveryStatisticVisible}
          onChange={setAddDeliveryStatisticVisible}
          changeFinishEvent={addComponentEvent}
        />

        {editDeliveryStatisticVisible && (
          <EditDeliveryStatisticModal
            visible={editDeliveryStatisticVisible}
            onChange={setEditDeliveryStatisticVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}

        <AddEngineerProcessModal
          visible={addEngineerProcessVisible}
          onChange={setAddEngineerProcessVisible}
          changeFinishEvent={addComponentEvent}
        />
        {editEngineerProcessVisible && (
          <EditEngineerProcessModal
            visible={editEngineerProcessVisible}
            onChange={setEditEngineerProcessVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}

        <AddOtherStatisticModal
          visible={addOtherStatisticVisible}
          onChange={setAddOtherStatisticVisible}
          changeFinishEvent={addComponentEvent}
        />
        {editOtherStatisticVisible && (
          <EditOtherStatisticModal
            visible={editOtherStatisticVisible}
            onChange={setEditOtherStatisticVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}

        {editEngineerAndMapVisible && (
          <EditEngineerAndMapModal
            visible={editEngineerAndMapVisible}
            onChange={setEditEngineerAndMapVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}

        {editEngineerAndProductionVisible && (
          <EditEngineerAndProductionModal
            visible={editEngineerAndProductionVisible}
            onChange={setEditEngineerAndProductionVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}

        {editProjectTypeVisible && (
          <EditProjectTypeModal
            visible={editProjectTypeVisible}
            onChange={setEditProjectTypeVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}

        {editProjectCaseVisible && (
          <EditProjectCaseModal
            visible={editProjectCaseVisible}
            onChange={setEditProjectCaseVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}
      </PageCommonWrap>
    </CockpitConfigContext.Provider>
  );
};

export default CockpitManage;
