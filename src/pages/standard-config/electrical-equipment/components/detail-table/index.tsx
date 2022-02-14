import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import {
  addComponentDetailItem,
  deleteComponentDetailItem,
  getComponentDetailItem,
  updateComponentDetailItem,
} from '@/services/resource-config/component'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
// import styles from './index.less';
import { isArray } from 'lodash'
import React, { useState } from 'react'
import AddComponentDetail from './add-form'
import EditComponentDetail from './edit-form'
interface ModuleDetailParams {
  libId: string
  componentId: string[]
  selectId: string[]
}

const { Search } = Input

const ElectricDetail: React.FC<ModuleDetailParams> = (props) => {
  const { libId, componentId, selectId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const { data, run } = useRequest(getComponentDetailItem, {
    manual: true,
  })

  // useEffect(() => {
  //   search();
  // }, [componentId]);

  const searchComponent = () => {
    return (
      <div>
        <TableSearch width="278px">
          <Search
            allowClear
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入组件明细信息"
          />
        </TableSearch>
      </div>
    )
  }

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const columns = [
    {
      dataIndex: 'itemId',
      index: 'itemId',
      title: '物料/组件编码',
      width: 180,
    },
    {
      dataIndex: 'itemName',
      index: 'itemName',
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

  //添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddComponentDetail = () => {
    addForm.validateFields().then(async (value) => {
      const saveInfo = Object.assign(
        {
          libId: libId,
          belongComponentId: componentId[0],
        },
        value
      )

      await addComponentDetailItem(saveInfo)
      message.success('添加成功')
      refresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    setEditFormVisible(true)
    const ComponentDetailData = await run(libId, editDataId)
    const formData = {
      componentId: ComponentDetailData.itemName,
      itemId: ComponentDetailData.itemId,
      itemNumber: ComponentDetailData.itemNumber,
      // spec: ComponentDetailData.spec,
      itemType: ComponentDetailData.isComponent === 1 ? '1' : '0',
      unit: ComponentDetailData.unit,
    }
    setFormData(formData)
    editForm.setFieldsValue(formData)
  }

  const sureEditcomponentDetail = () => {
    const editData = data!
    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libId: libId,
          itemId: editData.itemId,
          itemNumber: editData.itemNumber,
          itemType: editData.itemType,
        },
        values
      )
      await updateComponentDetailItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条模块明细删除！')
      return
    }
    const selectDataId = tableSelectRows[0].id
    await deleteComponentDetailItem(libId, selectDataId)
    refresh()
    message.success('删除成功')
    setTableSelectRows([])
  }

  const tableRightSlot = (
    <>
      {buttonJurisdictionArray?.includes('add-electric-detail') && (
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
      )}
      {buttonJurisdictionArray?.includes('edit-electric-detail') && (
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
      )}
      {buttonJurisdictionArray?.includes('delete-electric-detail') && (
        <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
      )}
    </>
  )

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => searchComponent()}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/ComponentDetail/GetPageList"
        columns={columns}
        requestSource="resource"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          componentIds: selectId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-组件明细"
        width="88%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddComponentDetail()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        centered
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <AddComponentDetail addForm={addForm} resourceLibId={libId} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-组件明细"
        width="50%"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditcomponentDetail()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        centered
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <EditComponentDetail resourceLibId={libId} formData={formData} editForm={editForm} />
        </Form>
      </Modal>
    </div>
  )
}

export default ElectricDetail
