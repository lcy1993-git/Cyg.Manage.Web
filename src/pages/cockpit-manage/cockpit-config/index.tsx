import PageCommonWrap from '@/components/page-common-wrap';
import React, { useState } from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import bgSrc from '@/assets/image/index/bg.png';
import CommonTitle from '@/components/common-title';
import { Button, message, Spin } from 'antd';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './index.less';
import uuid from 'node-uuid';
import { useRef } from 'react';
import { useRequest, useSize } from 'ahooks';
import lodash, { divide, multiply, subtract } from 'lodash';
import {
  DeleteOutlined,
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
import { getChartConfig, saveChartConfig } from '@/services/operation-config/cockpit';
import EmptyTip from '@/components/empty-tip';

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

import MapComponent from '../cockpit-config/components/cockpit-map-component';
import PersonnelLoad from '../cockpit-config/components/cockpit-personnel-load-component';
import ToDo from '../cockpit-config/components/cockpit-todo-component';
import DeliveryManage from '../cockpit-config/components/cockpit-delivery-component';
import ProjectSchedule from '../cockpit-config/components/cockpit-case-component';
import ProjectType from '../cockpit-config/components/cockpit-project-type-component';
import ProjectProgress from '../cockpit-config/components/cockpit-progress-component';

import { CockpitConfigContext } from './context';
import CockpitProjectInfoFreshList from './components/cockpit-project-info-refresh-list';

export interface CockpitProps {
  name: string;
  w: number;
  key: string;
  h: number;
  x: number;
  y: number;
  edit?: boolean;
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
    case 'projectRefreshData':
      return <CockpitProjectInfoFreshList componentProps={componentProps} />;
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

  const [saveConfigLoading, setSaveConfigLoading] = useState<boolean>(false);
  const [layoutConfigData, setLayoutConfigData] = useState<any[]>([]);

  const [currentAreaInfo, setCurrentAreaInfo] = useState({
    areaId: '',
    areaLevel: '1',
  });

  const [currentRecord, setCurrentRecord] = useState<any>({});
  const dontNeedEditComponent = ['mapComponent', 'projectRefreshData'];
  const { data, loading } = useRequest(() => getChartConfig(), {
    onSuccess: () => {
      if (data) {
        const hasSaveConfig = JSON.parse(data);
        if (hasSaveConfig.config && hasSaveConfig.configWindowHeight) {
          const windowPercent = (size.height ?? 828) / hasSaveConfig.configWindowHeight;
          const afterHanldeData = hasSaveConfig.config.map((item: any) => {
            const actualHeight = windowPercent ? multiply(item.h, windowPercent) : item.h;
            const actualY = windowPercent ? multiply(item.y, windowPercent) : item.y;

            return getEditConfig(item, actualHeight, actualY);
          });

          setConfigArray(afterHanldeData);
        } else {
          initCockpit();
        }
      }
    },
  });

  const getEditConfig = (item: CockpitProps, actualHeight: number, actualY: number) =>
    dontNeedEditComponent.indexOf(item.name) !== -1
      ? {
          ...item,
          y: actualY,
          edit: false,
          h: actualHeight,
        }
      : {
          ...item,
          y: actualY,
          edit: true,
          h: actualHeight,
        };

  const initCockpit = () => {
    const thisBoxHeight = (size.height ?? 828) - 70;
    const totalHeight = divide(thisBoxHeight, 18);
    setConfigArray([
      {
        name: 'toDo',
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        key: uuid.v1(),
        componentProps: ['wait', 'arrange', 'other'],
      },
      {
        name: 'mapComponent',
        x: 3,
        y: 0,
        w: 6,
        edit: true,
        h: subtract(totalHeight, divide(totalHeight - 11, 2)),
        key: uuid.v1(),
        componentProps: ['province'],
      },
      {
        name: 'projectType',
        x: 9,
        y: 0,
        w: 3,
        h: 11,
        key: uuid.v1(),
        componentProps: ['classify', 'category', 'stage', 'buildType', 'level'],
      },
      {
        name: 'projectRefreshData',
        x: 0,
        y: divide(totalHeight - 11, 2) + 10,
        w: 6,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
        componentProps: [],
      },
      {
        name: 'projectRefreshData',
        x: 0,
        y: 10,
        w: 3,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
      },
      {
        name: 'personLoad',
        x: 9,
        y: 10,
        w: 3,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
        componentProps: ['person', 'department', 'company'],
      },

      {
        name: 'projectProgress',
        x: 8,
        y: divide(totalHeight - 11, 2) + 10,
        w: 6,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
        componentProps: ['gantt'],
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
        <ConfigWindow
          edit={item.edit}
          deleteEvent={deleteEvent}
          editEvent={editEvent}
          record={item}
        >
          {getComponentByType(item.name, item.componentProps)}
        </ConfigWindow>
      </div>
    );
  });

  const engineerProjectArray = [
    { name: '项目数量(地图)', value: 'province' },
    { name: '生产负荷(员工)', value: 'person' },
    { name: '生产负荷(部组)', value: 'department' },
    { name: '生产负荷(公司)', value: 'company' },
    { name: '实时数据', value: 'projectRefreshData' },
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
    { name: '项目交付数量(员工)', value: 'person' },
    { name: '项目交付数量(部组)', value: 'department' },
    { name: '项目交付数量(公司)', value: 'company' },
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
    <CockpitConfigContext.Provider
      value={{
        currentAreaInfo,
        setCurrentAreaInfo,
      }}
    >
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
              {!loading && configArray.length > 0 && (
                <ResponsiveReactGridLayout
                  breakpoints={{ lg: 120 }}
                  cols={{ lg: 12 }}
                  rowHeight={9}
                  onLayoutChange={layoutChangeEvent}
                >
                  {configComponentElement}
                </ResponsiveReactGridLayout>
              )}
              {!loading && configArray.length === 0 && (
                <div className={styles.noConfigTip} style={{ height: `${size.height}px` }}>
                  <EmptyTip
                    description="当前暂无配置，请点击左侧添加按钮进行配置"
                    className={styles.emptyTip}
                  />
                </div>
              )}
              {loading && (
                <div style={{ width: '100%', height: '100%' }}>
                  <Spin spinning={loading}></Spin>
                </div>
              )}
            </div>
          </div>
        </div>
        <AddEngineerAndProjectModule
          visible={addMapModuleVisible}
          configArray={configArray}
          onChange={setAddMapModuleVisible}
          changeFinishEvent={addComponentEvent}
        />
        <AddEngineerTypeModal
          visible={addEngineerTypeVisible}
          configArray={configArray}
          onChange={setAddEngineerTypeVisible}
          changeFinishEvent={addComponentEvent}
        />
        <AddDeliveryStatisticModal
          visible={addDeliveryStatisticVisible}
          configArray={configArray}
          onChange={setAddDeliveryStatisticVisible}
          changeFinishEvent={addComponentEvent}
        />
        <AddEngineerProcessModal
          visible={addEngineerProcessVisible}
          configArray={configArray}
          onChange={setAddEngineerProcessVisible}
          changeFinishEvent={addComponentEvent}
        />

        <AddOtherStatisticModal
          visible={addOtherStatisticVisible}
          configArray={configArray}
          onChange={setAddOtherStatisticVisible}
          changeFinishEvent={addComponentEvent}
        />
        {editDeliveryStatisticVisible && (
          <EditDeliveryStatisticModal
            visible={editDeliveryStatisticVisible}
            onChange={setEditDeliveryStatisticVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
            configArray={configArray}
          />
        )}
        {editEngineerProcessVisible && (
          <EditEngineerProcessModal
            visible={editEngineerProcessVisible}
            onChange={setEditEngineerProcessVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
          />
        )}
        {editOtherStatisticVisible && (
          <EditOtherStatisticModal
            visible={editOtherStatisticVisible}
            onChange={setEditOtherStatisticVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
            configArray={configArray}
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
            configArray={configArray}
          />
        )}

        {editProjectTypeVisible && (
          <EditProjectTypeModal
            visible={editProjectTypeVisible}
            onChange={setEditProjectTypeVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
            configArray={configArray}
          />
        )}

        {editProjectCaseVisible && (
          <EditProjectCaseModal
            visible={editProjectCaseVisible}
            onChange={setEditProjectCaseVisible}
            changeFinishEvent={editComponentEvent}
            currentRecord={currentRecord}
            configArray={configArray}
          />
        )}
      </PageCommonWrap>
    </CockpitConfigContext.Provider>
  );
};

export default CockpitManage;
