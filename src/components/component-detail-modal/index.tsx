import TableCanEditCell from '@/components/table-can-edit-cell'
import TableCanSearch from '@/components/table-can-search'

import UrlSelect from '@/components/url-select'
import {
  getCableChannelDetaiList,
  updateCableChannelDetaiList,
} from '@/services/resource-config/cable-channel'
import {
  getCableWelDetaiList,
  updateCableWellDetaiList,
} from '@/services/resource-config/cable-well'
import {
  getComponentDetaiList,
  updateComponentDetaiList,
} from '@/services/resource-config/component'
import {
  getModuleDetaiList,
  updateModulelDetaiList,
} from '@/services/resource-config/modules-property'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { message, Modal, Spin, Tabs } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'

interface ModuleDetailParams {
  libId: string
  componentId: string[]
  selectId: string[]
  detailVisible: boolean
  setDetailVisible: (state: boolean) => void
  title: string
  type: 'component' | 'cable-channel' | 'cable-well' | 'module'
}

const MATERIAL = 'material'
const COMPONENT = 'component'
const getSpecKey = (type: string) => {
  if (type === 'component') {
    return 'spec'
  }
  return 'itemSpec'
}

const ComponentDetailModal: React.FC<ModuleDetailParams> = (props) => {
  const { libId, componentId, selectId, detailVisible, setDetailVisible, title, type } = props

  const [tabKey, setTabKey] = useState<string>(MATERIAL)
  const [resource, setResource] = useState<any[]>([])

  const columns = [
    {
      dataIndex: 'itemName',
      index: 'itemName',
      title: '物料/组件名称',
      width: 450,
    },

    {
      dataIndex: getSpecKey(type),
      index: getSpecKey(type),
      title: '物料/组件型号',
      width: 350,
    },

    {
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      title: '数量',
      width: 150,
      editable: true,
    },
    {
      dataIndex: 'isComponent',
      index: 'isComponent',
      title: '是否组件',
      width: 220,
      render: (text: any, record: any) => {
        return record.isComponent === 1 ? '是' : '否'
      },
    },
  ]
  const handlerPartChange = (value: string, record: any) => {
    const copyData = [...resource].map((item: any) => {
      if (item.id === record.id) {
        return {
          ...item,
          part: value,
        }
      }
      return item
    })
    setResource(copyData)
  }
  if (type === 'module') {
    columns.splice(3, 0, {
      dataIndex: 'part',
      index: 'part',
      title: '所属部件',
      width: 180,
      // @ts-ignore
      render: (text: any, record: any) => {
        return (
          <UrlSelect
            titlekey="key"
            valuekey="value"
            url="/ModulesDetails/GetParts"
            placeholder="应用"
            requestSource="resource"
            value={record.part}
            // @ts-ignore
            placeholder="请选择"
            // @ts-ignore
            onChange={(val: string) => {
              handlerPartChange(val, record)
            }}
            allowClear
          />
        )
      },
    })
  }

  // 明细列表数据
  const { loading, run: getDetailList } = useRequest(
    () => {
      if (type === 'cable-channel') {
        return getCableChannelDetaiList(libId, selectId, '')
      } else if (type === 'cable-well') {
        return getCableWelDetaiList(libId, selectId, '')
      } else if (type === 'module') {
        return getModuleDetaiList(libId, selectId, '')
      } else {
        // type === 'component
        return getComponentDetaiList(libId, selectId, '')
      }
    },
    {
      manual: true,
      onSuccess: (res) => {
        setResource(res.items)
      },
    }
  )
  useEffect(() => {
    detailVisible && getDetailList()
  }, [detailVisible])
  const componentDetailRef = useRef<HTMLDivElement>(null)
  const componentRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<HTMLDivElement>(null)

  const okHandle = () => {
    // 在这里简单校验数量
    for (let i = 0; i < resource.length; i++) {
      if (!Number(resource[i].itemNumber)) {
        message.error(`请填写第${i + 1}行的数量`)
        return
      }
    }
    if (type === 'cable-channel') {
      updateCableChannelDetaiList(
        libId,
        componentId[0],
        resource.map((item: any) => {
          return {
            ...item,
            itemType: String(item.isComponent),
          }
        })
      ).then(() => {
        message.success('操作成功')
      })
    } else if (type === 'cable-well') {
      updateCableWellDetaiList(
        libId,
        componentId[0],
        resource.map((item: any) => {
          return {
            ...item,
            itemType: String(item.isComponent),
          }
        })
      ).then(() => {
        message.success('操作成功')
      })
    } else if (type === 'module') {
      updateModulelDetaiList(
        libId,
        selectId[0],
        resource.map((item: any) => {
          return {
            ...item,
            itemType: String(item.isComponent),
          }
        })
      ).then(() => {
        message.success('操作成功')
      })
    } else {
      // type === 'component
      updateComponentDetaiList(
        libId,
        componentId[0],
        resource.map((item: any) => {
          return {
            ...item,
            itemType: String(item.isComponent),
          }
        })
      ).then(() => {
        message.success('操作成功')
      })
    }
  }
  const addItemsHandle = () => {
    const selectData =
      tabKey === MATERIAL
        ? //@ts-ignore
          materialRef.current?.getCheckedList()
        : //@ts-ignore
          componentRef.current?.getCheckedList()
    if (selectData.length === 0) {
      message.warning('请选择要添加的物料/组件')
      return
    }
    for (let i = 0; i < selectData.length; i++) {
      for (let j = 0; j < resource.length; j++) {
        if (
          resource[j].itemId === selectData[i].materialId ||
          resource[j].itemId === selectData[i].componentId
        ) {
          message.error(
            `明细列表中包含${
              tabKey === MATERIAL ? selectData[i].materialName : selectData[i].componentName
            }请勿重复添加`
          )
          return
        }
      }
    }
    //@ts-ignore
    tabKey === MATERIAL
      ? //@ts-ignore
        materialRef.current?.clearSelectedRows()
      : //@ts-ignore
        componentRef.current?.clearSelectedRows()
    const addItems = selectData.map((item: any) => {
      if (tabKey === MATERIAL) {
        return {
          id: item.id,
          itemId: item.materialId,
          // componentName: item.materialName,:
          spec: item.spec, // 组件用的型号数据
          itemNumber: 1,
          isComponent: 0,
          itemName: item.materialName,
          itemSpec: item.spec, // 电缆通道用的型号数据
        }
      } else {
        return {
          id: item.id,
          itemId: item.componentId,
          // componentName: item.componentName,
          spec: item.componentSpec, // 组件用的型号数据
          itemNumber: 1,
          isComponent: 1,
          itemName: item.componentName,
          itemSpec: item.componentSpec, // 电缆通道用的型号数据
        }
      }
    })
    setResource([...resource, ...addItems])
  }
  const removeItemsHandle = () => {
    //@ts-ignore
    const selectData = componentDetailRef.current?.getSelectedData()
    if (selectData.length === 0) {
      message.warning('请选择要删除的物料/组件')
      return
    }
    const copyData = [...resource]
    for (let i = 0; i < selectData.length; i++) {
      for (let j = 0; j < copyData.length; j++) {
        if (selectData[i].id === copyData[j].id) {
          copyData.splice(j, 1)
          break
        }
      }
    }
    setResource([...copyData])
    //@ts-ignore
    componentDetailRef.current?.clearSelectedRows()
  }
  const componentColumns = [
    {
      dataIndex: 'deviceCategory',
      index: 'deviceCategory',
      title: '设备分类',
      width: 180,
    },
    {
      dataIndex: 'componentName',
      index: 'componentName',
      title: '组件名称',
      width: 380,
    },
    {
      dataIndex: 'componentSpec',
      index: 'componentName',
      title: '组件型号',
      width: 380,
    },
  ]
  const materialColumns = [
    {
      dataIndex: 'category',
      index: 'category',
      title: '物料类型',
      width: 180,
    },
    {
      dataIndex: 'materialName',
      index: 'materialName',
      title: '物料名称',
      width: 320,
    },
    {
      dataIndex: 'spec',
      index: 'spec',
      title: '规格型号',
      width: 320,
    },
  ]
  return (
    <Modal
      maskClosable={false}
      title={title}
      width="92%"
      visible={detailVisible}
      onCancel={() => setDetailVisible(false)}
      onOk={() => {
        okHandle()
      }}
      okText="确认"
      cancelText="取消"
      bodyStyle={{ maxHeight: '650px', overflowY: 'auto' }}
      destroyOnClose
    >
      <Spin spinning={loading}>
        <div className={styles.wrap}>
          <div className={styles.leftWrap}>
            <TableCanEditCell
              defaultColumns={columns}
              dataSource={resource}
              setDataSource={setResource}
              ref={componentDetailRef}
            />
          </div>
          <div className={styles.middleWrap}>
            <div className={styles.btns}>
              <DoubleLeftOutlined
                onClick={addItemsHandle}
                style={{ fontSize: '24px', display: 'block', color: '#999' }}
              />
              <DoubleRightOutlined
                onClick={removeItemsHandle}
                style={{ fontSize: '24px', display: 'block', marginTop: '10px', color: '#999' }}
              />
            </div>
          </div>
          <div className={styles.rightWrap}>
            <Tabs
              defaultActiveKey={MATERIAL}
              onChange={(activeKey) => {
                setTabKey(activeKey)
              }}
            >
              <Tabs.TabPane tab="物料" key={MATERIAL}>
                <TableCanSearch
                  ref={materialRef}
                  url="/Material/GetPageList"
                  columns={materialColumns}
                  extractParams={{
                    resourceLibId: libId,
                  }}
                  requestSource="resource"
                  libId={libId}
                  categoryKey="materialType"
                  name="物料"
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="组件" key={COMPONENT}>
                <TableCanSearch
                  ref={componentRef}
                  url="/Component/GetPageList"
                  columns={componentColumns}
                  requestSource="resource"
                  extractParams={{
                    resourceLibId: libId,
                    isElectricalEquipment: false,
                  }}
                  libId={libId}
                  categoryKey="deviceCategory"
                  name="组件"
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </Spin>
    </Modal>
  )
}

export default ComponentDetailModal
