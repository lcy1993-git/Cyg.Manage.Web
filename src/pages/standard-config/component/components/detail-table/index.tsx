import { getComponentDetaiList } from '@/services/resource-config/component'
import { useRequest } from 'ahooks'
import { Button, Input, Modal, Spin, Tabs } from 'antd'
// import styles from './index.less';
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

const { Search } = Input
const ComponentDetail: React.FC<ModuleDetailParams> = (props) => {
  const { libId, componentId, selectId, detailVisible, setDetailVisible } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tabKey, setTabKey] = useState<string>('')

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
  const {
    data: defaultResource,
    loading,
    run: getDetailList,
  } = useRequest(
    () => {
      return getComponentDetaiList(libId, selectId, '')
    },
    { manual: true }
  )
  useEffect(() => {
    detailVisible && getDetailList()
  }, [detailVisible])
  // console.log(defaultResource?.items, 'sss')
  const componentDetailRef = useRef<HTMLDivElement>(null)
  const componentlRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<HTMLDivElement>(null)

  const okHandle = () => {
    // console.log(componentDetailRef.current?.getSelectedData())
  }
  const addItemsHandle = () => {}
  const removeItemsHandle = () => {}
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
          <div className={styles.left}>
            <TableCanEditCell
              defaultColumns={columns}
              defaultResource={!!defaultResource ? defaultResource?.items : []}
              ref={componentDetailRef}
            />
          </div>
          <div className={styles.middleWrap}>
            <Button onClick={addItemsHandle}>左移</Button>
            <Button onClick={removeItemsHandle}>右移</Button>
          </div>
          <div className={styles.right}>
            <Tabs
              defaultActiveKey="material"
              onChange={(activeKey) => {
                setTabKey(activeKey)
              }}
            >
              <Tabs.TabPane tab="物料" key="material">
                <TableCanSearch
                  ref={componentlRef}
                  url="/Material/GetPageList"
                  columns={materialColumns}
                  extractParams={{
                    resourceLibId: libId,
                  }}
                  requestSource="resource"
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab="组件" key="component">
                <TableCanSearch
                  ref={componentlRef}
                  url="/Component/GetPageList"
                  columns={componentColumns}
                  requestSource="resource"
                  extractParams={{
                    resourceLibId: libId,
                    isElectricalEquipment: false,
                  }}
                />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </Spin>
    </Modal>
    // <div>
    //   <GeneralTable
    //     buttonLeftContentSlot={() => searchComponent()}
    //     buttonRightContentSlot={() => tableRightSlot}
    //     ref={tableRef}
    //     url="/ComponentDetail/GetPageList"
    //     columns={columns}
    //     requestSource="resource"
    //     getSelectData={(data) => setTableSelectRows(data)}
    //     extractParams={{
    //       libId: libId,
    //       componentIds: selectId,
    //       keyWord: searchKeyWord,
    //     }}
    //   />
    //   <Modal
    //     maskClosable={false}
    //     title="添加-组件明细"
    //     width="88%"
    //     visible={addFormVisible}
    //     okText="确认"
    //     onOk={() => sureAddComponentDetail()}
    //     onCancel={() => {
    //       setAddFormVisible(false)
    //       addForm.resetFields()
    //     }}
    //     cancelText="取消"
    //     centered
    //     destroyOnClose
    //   >
    //     <Form form={addForm}>
    //       <AddComponentDetail addForm={addForm} resourceLibId={libId} />
    //     </Form>
    //   </Modal>

    //   <Modal
    //     maskClosable={false}
    //     title="编辑-组件明细"
    //     width="50%"
    //     visible={editFormVisible}
    //     okText="保存"
    //     onOk={() => sureEditcomponentDetail()}
    //     onCancel={() => setEditFormVisible(false)}
    //     cancelText="取消"
    //     centered
    //     destroyOnClose
    //   >
    //     <Form form={editForm} preserve={false}>
    //       <EditComponentDetail resourceLibId={libId} formData={formData} editForm={editForm} />
    //     </Form>
    //   </Modal>
    // </div>
  )
}

export default ComponentDetail
