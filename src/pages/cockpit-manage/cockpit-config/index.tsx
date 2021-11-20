import PageCommonWrap from '@/components/page-common-wrap'
import React, { useState } from 'react'
import { WidthProvider, Responsive } from 'react-grid-layout'
import bgSrc from '@/assets/image/index/bg.png'
import CommonTitle from '@/components/common-title'
import { Form, Button, message, Spin, Modal } from 'antd'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import styles from './index.less'
import uuid from 'node-uuid'
import { useRef } from 'react'
import { useRequest, useSize } from 'ahooks'
import { divide, multiply, subtract } from 'lodash'
import {
  DeleteOutlined,
  ReloadOutlined,
  SaveOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import CockpitMenuItem from './components/cockpit-menu-item'

import { getChartConfig, saveChartConfig } from '@/services/operation-config/cockpit'
import EmptyTip from '@/components/empty-tip'

import ConfigWindow from './components/config-window'

import MapComponent from '../cockpit-config/components/cockpit-map-component'
import PersonnelLoad from '../cockpit-config/components/cockpit-personnel-load-component'
import ToDo from '../cockpit-config/components/cockpit-todo-component'
import DeliveryManage from '../cockpit-config/components/cockpit-delivery-component'
import ProjectSchedule from '../cockpit-config/components/cockpit-case-component'
import ProjectType from '../cockpit-config/components/cockpit-project-type-component'
import ProjectProgress from '../cockpit-config/components/cockpit-progress-component'

import { CockpitConfigContext } from './context'
import CockpitProjectInfoFreshList from './components/cockpit-project-info-refresh-list'
import { cockpitMenuItemData, CockpitProps } from './utils'
// import EditRefreshDataModal from './components/add-engineer-project-modal/edit-refresh-data-form';
import EditFormItem from './components/edit-form-item'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import ProjectNumber from '@/pages/index/components/project-number'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const getComponentByType = (type: string, componentProps: any, currentAreaInfo) => {
  switch (type) {
    case 'toDo':
      return <ToDo componentProps={componentProps} />
      break
    case 'mapComponent':
      return <MapComponent componentProps={componentProps} />
      break
    case 'deliveryManage':
      return <DeliveryManage componentProps={componentProps} />
      break
    case 'personLoad':
      return <PersonnelLoad componentProps={componentProps} />
      break
    case 'projectSchedule':
      return <ProjectSchedule componentProps={componentProps} />
      break
    case 'projectType':
      return <ProjectType componentProps={componentProps} />
      break
    case 'projectProgress':
      return <ProjectProgress />
      break
    case 'projectRefreshData':
      return <CockpitProjectInfoFreshList componentProps={componentProps} />
      break
    case 'projectNumber':
      return <ProjectNumber componentProps={componentProps} currentAreaInfo={currentAreaInfo} />
      break

    default:
      return undefined
  }
}

const CockpitManage: React.FC = () => {
  const [configArray, setConfigArray] = useState<CockpitProps[]>([])
  // 1.默认配置开发
  // a. 根据useSize获取框框大小
  // b. 默认配置的宽度是可以写死的，高度根据目前已有高度需要做一个百分比适配
  // c. 默认一格的高度都是18 的高度
  const configDivRef = useRef<HTMLDivElement>(null)
  const size = useSize(configDivRef)

  const [activeModal, setActiveModal] = useState<string>('')

  const [projectControlVisible, setProjectControlVisible] = useState<boolean>(false)
  const [projectTypeVisible, setProjectTypeVisible] = useState<boolean>(false)
  const [deliveryVisible, setDeliveryVisible] = useState<boolean>(false)
  const [otherVisible, setOtherVisible] = useState<boolean>(false)

  const [commonForm] = Form.useForm()

  const [saveConfigLoading, setSaveConfigLoading] = useState<boolean>(false)
  const [layoutConfigData, setLayoutConfigData] = useState<any[]>([])
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [currentAreaInfo, setCurrentAreaInfo] = useState({
    areaId: '',
    areaLevel: '1',
  })

  const dontNeedEditComponent = ['mapComponent', 'projectRefreshData']
  const { data, loading } = useRequest(() => getChartConfig(), {
    onSuccess: () => {
      if (data) {
        const hasSaveConfig = JSON.parse(data)
        if (hasSaveConfig.config && hasSaveConfig.configWindowHeight) {
          const windowPercent = (size.height ?? 828) / hasSaveConfig.configWindowHeight
          const afterHanldeData = hasSaveConfig.config.map((item: any) => {
            const actualHeight = windowPercent ? multiply(item.h, windowPercent) : item.h
            const actualY = windowPercent ? multiply(item.y, windowPercent) : item.y

            return getEditConfig(item, actualHeight, actualY)
          })

          setConfigArray(afterHanldeData)
        } else {
          initCockpit()
        }
      }
    },
  })

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
        }

  const initCockpit = () => {
    const thisBoxHeight = (size.height ?? 828) - 70
    const totalHeight = divide(thisBoxHeight, 18)
    setConfigArray([
      {
        name: 'toDo',
        x: 0,
        y: 0,
        w: 3,
        h: 11,
        edit: true,
        key: uuid.v1(),
        componentProps: ['awaitProcess', 'inProgress', 'delegation', 'beShared'],
      },
      {
        name: 'mapComponent',
        x: 3,
        y: 0,
        w: 6,

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
        edit: true,
        key: uuid.v1(),
        componentProps: ['classify', 'category', 'stage', 'buildType', 'level'],
      },
      {
        name: 'deliveryManage',
        x: 0,
        y: divide(totalHeight - 11, 2) + 10,
        w: 6,
        edit: true,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
        componentProps: ['person', 'department', 'company'],
      },
      {
        name: 'projectNumber',
        x: 0,
        y: 10,
        w: 3,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
        componentProps: ['projectNumber'],
      },
      {
        name: 'personLoad',
        x: 9,
        y: 10,
        w: 3,
        edit: true,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
        componentProps: ['person', 'department', 'company'],
      },

      {
        name: 'projectProgress',
        x: 8,
        y: divide(totalHeight - 11, 2) + 10,
        w: 6,
        edit: true,
        h: divide(totalHeight - 11, 2),
        key: uuid.v1(),
        componentProps: ['gantt'],
      },
    ])
  }

  const clearConfigEvent = () => {
    setConfigArray([])
  }

  const layoutChangeEvent = (currentLayout: any) => {
    setLayoutConfigData(currentLayout)
  }

  const getFormValue = (type: string) => {
    // projectControl

    const nameArray = cockpitMenuItemData
      .find((item) => item.type === type)
      ?.childrenData.map((item) => item.name)

    let res = {}
    nameArray?.forEach((name) => {
      res[name] = []
    })
    configArray.forEach((item) => {
      if (nameArray?.includes(item.name)) {
        res[item.name] = item.componentProps ?? []
      }
    })

    return res
  }

  // 删除事件
  const deleteEvent = (record: any) => {
    const copyConfigArray: CockpitProps[] = JSON.parse(JSON.stringify(configArray))
    const dataIndex = copyConfigArray.findIndex((item) => item.key === record.key)
    copyConfigArray.splice(dataIndex, 1)
    setConfigArray(copyConfigArray)
  }

  //编辑弹出事件
  const editEvent = (record: any) => {
    switch (record.name) {
      case 'mapComponent':
      case 'personLoad':
      case 'projectRefreshData':
      case 'projectProgress':
      case 'projectNumber':
        setActiveModal(record.name)
        commonForm.setFieldsValue(getFormValue('projectControl'))
        setProjectControlVisible(true)
        break
      case 'projectType':
      case 'projectSchedule':
        setActiveModal(record.name)
        commonForm.setFieldsValue(getFormValue('projectType'))
        setProjectTypeVisible(true)
        break
      case 'deliveryManage':
        setActiveModal(record.name)

        commonForm.setFieldsValue(getFormValue('delivery'))
        setDeliveryVisible(true)
        break
      case 'toDo':
        setActiveModal(record.name)
        commonForm.setFieldsValue(getFormValue('other'))
        setOtherVisible(true)
        break
    }
  }

  const configComponentElement = configArray.map((item) => {
    return (
      <div key={item.key} data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h }}>
        <ConfigWindow deleteEvent={deleteEvent} editEvent={editEvent} record={item}>
          {getComponentByType(item.name, item.componentProps, currentAreaInfo)}
        </ConfigWindow>
      </div>
    )
  })

  const saveConfig = async () => {
    try {
      if (configArray && configArray.length === 0) {
        message.error('配置不能为空')
        return
      }
      setSaveConfigLoading(true)

      const saveConfigArray = configArray.map((item) => {
        const dataIndex = layoutConfigData.findIndex((ite) => ite.i === item.key)
        return {
          ...item,
          x: layoutConfigData[dataIndex].x,
          y: layoutConfigData[dataIndex].y,
          w: layoutConfigData[dataIndex].w,
          h: layoutConfigData[dataIndex].h,
        }
      })

      await saveChartConfig(
        JSON.stringify({
          configWindowHeight: size.height,
          config: saveConfigArray,
        })
      )
      message.success('配置保存成功')
    } catch (msg) {
      console.error(msg)
    } finally {
      setSaveConfigLoading(false)
    }
  }

  const addConfig = (newItem: any) => {
    setConfigArray([...configArray, newItem])
  }
  /**
   * 根据现有Res修改当前ConfigArray
   *
   * @data 现有表单数据
   * @type 模态框类型
   * @hide 隐藏模态框
   */
  const changeComponentByRes = (
    data: any,
    type: string,
    hide: {
      (value: React.SetStateAction<boolean>): void
      (value: React.SetStateAction<boolean>): void
      (value: React.SetStateAction<boolean>): void
      (value: React.SetStateAction<boolean>): void
      (arg0: boolean): void
    }
  ) => {
    const copyConfigArray: CockpitProps[] = JSON.parse(JSON.stringify(configArray))
    const index = copyConfigArray.findIndex((item: { name: string }) => item.name === activeModal)
    if (data.length === 0) {
      // 当表单没有数据时，删除该组件
      index >= 0 && copyConfigArray.splice(index, 1)
    } else {
      if (index < 0) {
        let w: number = 3
        if (activeModal === 'mapComponent' || activeModal === 'projectProgress') {
          w = 6
        }
        copyConfigArray.push({
          name: activeModal,
          key: uuid.v1(),
          x: 0,
          y: 0,
          w,
          h: 11,
          componentProps: data,
        })
      } else {
        copyConfigArray[index].componentProps = data
      }
    }
    setConfigArray(copyConfigArray)
    hide(false)
  }

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
              {cockpitMenuItemData.map((itemProps) => {
                return (
                  <CockpitMenuItem configArray={configArray} addConfig={addConfig} {...itemProps} />
                )
              })}
            </div>
          </div>
          <div className={styles.cockpitConfigPageContent}>
            <div className={styles.cockpitConfigPageTitle}>
              <div className={styles.cockpitConfigPageTitleLeft}>
                <CommonTitle noPadding={true}>首页自定义配置窗口</CommonTitle>
              </div>
              <div className={styles.cockpitConfigPageTitleRight}>
                {buttonJurisdictionArray?.includes('save-cockpit-settings') && (
                  <Button
                    className="mr7"
                    type="primary"
                    loading={saveConfigLoading}
                    onClick={saveConfig}
                  >
                    <SaveOutlined />
                    保存配置
                  </Button>
                )}
                {buttonJurisdictionArray?.includes('default-cockpit-settings') && (
                  <Button className="mr7" onClick={initCockpit}>
                    <ReloadOutlined />
                    恢复默认配置
                  </Button>
                )}
                {buttonJurisdictionArray?.includes('clear-cockpit-settings') && (
                  <Button onClick={clearConfigEvent}>
                    <DeleteOutlined />
                    清空当前配置
                  </Button>
                )}
              </div>
            </div>

            <div
              className={styles.cockpitConfigPageContent}
              style={{ backgroundImage: `url(${bgSrc})` }}
              ref={configDivRef}
            >
              {!loading && configArray.length > 0 && (
                <ResponsiveReactGridLayout
                  draggableCancel=".noDraggable"
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
        {projectControlVisible && (
          <Modal
            destroyOnClose={true}
            visible={projectControlVisible}
            onCancel={() => setProjectControlVisible(false)}
            onOk={() =>
              commonForm
                .validateFields()
                .then((d) =>
                  changeComponentByRes(d[activeModal], 'projectControl', setProjectControlVisible)
                )
            }
            title="配置-项目管控"
          >
            <Form form={commonForm}>
              <EditFormItem
                configArray={configArray}
                childrenData={cockpitMenuItemData[0].childrenData}
                activeModal={activeModal}
              />
            </Form>
          </Modal>
        )}
        {projectTypeVisible && (
          <Modal
            destroyOnClose={true}
            visible={projectTypeVisible}
            onCancel={() => setProjectTypeVisible(false)}
            onOk={() =>
              commonForm
                .validateFields()
                .then((d) =>
                  changeComponentByRes(d[activeModal], 'projectType', setProjectTypeVisible)
                )
            }
            title="配置-工程类型统计"
          >
            <Form form={commonForm}>
              <EditFormItem
                configArray={configArray}
                childrenData={cockpitMenuItemData[1].childrenData}
                activeModal={activeModal}
              />
            </Form>
          </Modal>
        )}
        {deliveryVisible && (
          <Modal
            destroyOnClose={true}
            visible={deliveryVisible}
            onCancel={() => setDeliveryVisible(false)}
            // onOk={() => projectControlForm.validateFields().then(d => changeComponentByRes(d, 'delivery', setDeliveryVisible))}
            onOk={() =>
              commonForm.validateFields().then((d) => {
                changeComponentByRes(d[activeModal], 'delivery', setDeliveryVisible)
              })
            }
            title="配置-交付统计"
          >
            <Form form={commonForm}>
              <EditFormItem
                configArray={configArray}
                childrenData={cockpitMenuItemData[2].childrenData}
                activeModal={activeModal}
              />
            </Form>
          </Modal>
        )}
        {otherVisible && (
          <Modal
            destroyOnClose={true}
            visible={otherVisible}
            onCancel={() => setOtherVisible(false)}
            onOk={() =>
              commonForm
                .validateFields()
                .then((d) => changeComponentByRes(d[activeModal], 'other', setOtherVisible))
            }
            title="配置-其他"
          >
            <Form form={commonForm}>
              <EditFormItem
                configArray={configArray}
                childrenData={cockpitMenuItemData[3].childrenData}
                activeModal={activeModal}
              />
            </Form>
          </Modal>
        )}
      </PageCommonWrap>
    </CockpitConfigContext.Provider>
  )
}

export default CockpitManage
