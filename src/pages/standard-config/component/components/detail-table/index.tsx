import { getComponentDetaiList } from '@/services/resource-config/component'
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { message, Modal, Spin, Tabs } from 'antd'

import TableCanEditCell from '@/components/table-can-edit-cell'
import TableCanSearch from '@/components/table-can-search'
import React, { useEffect, useRef, useState } from 'react'
import styles from './index.less'

interface ModuleDetailParams {
  libId: string
  componentId: string[]
  selectId: string[]
  detailVisible: boolean
  setDetailVisible: (state: boolean) => void
}

const MATERIAL = 'material'
const COMPONENT = 'component'

const ComponentDetail: React.FC<ModuleDetailParams> = (props) => {
  const { libId, componentId, selectId, detailVisible, setDetailVisible } = props

  const [tabKey, setTabKey] = useState<string>(MATERIAL)
  const [resource, setResource] = useState<any[]>([])

  const columns = [
    {
      dataIndex: 'itemId',
      index: 'itemId',
      title: '物料/组件编码',
      width: 180,
    },
    {
      dataIndex: 'componentName',
      index: 'componentName',
      title: '物料/组件名称',
      width: 450,
    },

    {
      dataIndex: 'spec',
      index: 'spec',
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

  // 明细列表数据
  const { loading, run: getDetailList } = useRequest(
    () => {
      return getComponentDetaiList(libId, selectId, '')
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
    // console.log(resource, 're')
  }
  const addItemsHandle = () => {
    //@ts-ignore
    const selectData =
      tabKey === MATERIAL
        ? materialRef.current?.getCheckedList()
        : componentRef.current?.getCheckedList()
    for (let i = 0; i < selectData.length; i++) {
      for (let j = 0; j < resource.length; j++) {
        if (resource[j].id === selectData[i].id) {
          message.error(
            `明细列表中包含${
              tabKey === MATERIAL ? selectData[i].materialName : selectData[i].componentName
            }请勿重复添加`
          )
          return
        }
      }
    }
    const addItems = selectData.map((item: any) => {
      if (tabKey === MATERIAL) {
        return {
          itemId: item.materialId,
          componentName: item.materialName,
          spec: item.spec,
          itemNumber: 1,
          isComponent: 0,
          // unit:item.unit
        }
      } else {
        return {
          itemId: item.componentId,
          componentName: item.componentName,
          spec: item.componentSpec,
          itemNumber: 1,
          isComponent: 1,
          // unit:item.unit
        }
      }
    })
    setResource([...resource, ...addItems])
  }
  const removeItemsHandle = () => {
    //@ts-ignore
    const selectData = componentDetailRef.current?.getSelectedData()
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
  }
  const componentColumns = [
    {
      dataIndex: 'componentId',
      index: 'componentId',
      title: '组件编码',
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
      dataIndex: 'code',
      index: 'code',
      title: '物资编号',
      width: 220,
    },
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
      title="组件明细"
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
              defaultResource={resource}
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
          <div className={styles.leftWrap}>
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

export default ComponentDetail
