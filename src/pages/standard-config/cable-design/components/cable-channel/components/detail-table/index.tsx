import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import AddComponentDetail from '@/pages/standard-config/component/components/detail-table/add-form'
import EditComponentDetail from '@/pages/standard-config/component/components/detail-table/edit-form'
import {
  addCableChannelDetailItem,
  deleteCableChannelDetailItem,
  getCableChannelDetailItem,
  updateCableChannelDetailItem,
} from '@/services/resource-config/cable-channel'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
// import styles from './index.less';
import { isArray } from 'lodash'
import React, { useState } from 'react'

interface ModuleDetailParams {
  libId: string
  cableChannelId: string[]
  selectId: string[]
}

const { Search } = Input

const CableChannelDetail: React.FC<ModuleDetailParams> = (props) => {
  const { libId, cableChannelId, selectId } = props
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [formData, setFormData] = useState<any>()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run } = useRequest(getCableChannelDetailItem, {
    manual: true,
  })

  // useEffect(() => {
  //   search();
  // }, [cableChannelId]);

  const searchComponent = () => {
    return (
      <div>
        <TableSearch width="328px">
          <Search
            allowClear
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入电缆通道明细信息"
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
      dataIndex: 'itemSpec',
      index: 'itemSpec',
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

  const sureAddcableChannelDetail = () => {
    addForm.validateFields().then(async (value) => {
      const saveInfo = Object.assign(
        {
          libId: libId,
          cableChannelId: cableChannelId[0],
        },
        value
      )

      await addCableChannelDetailItem(saveInfo)
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

  const sureEditcableChannelDetail = () => {
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          componentId: editData.itemName,
          libId: libId,
          itemId: editData.itemId,
          itemNumber: editData.itemNumber,
          itemType: editData.itemType,
        },
        values
      )
      await updateCableChannelDetailItem(submitInfo)
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
    await deleteCableChannelDetailItem(libId, selectDataId)
    refresh()
    message.success('删除成功')
    setTableSelectRows([])
  }

  const tableRightSlot = (
    <>
      {buttonJurisdictionArray?.includes('add-cableChan-detail') && (
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
      )}
      {buttonJurisdictionArray?.includes('edit-cableChan-detail') && (
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
      )}
      {buttonJurisdictionArray?.includes('delete-cableChan-detail') && (
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
        url="/cableChannelDetails/GetPageList"
        columns={columns}
        type="radio"
        requestSource="resource"
        // getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          cableChannelIds: selectId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-电缆通道明细"
        width="88%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddcableChannelDetail()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        centered
        destroyOnClose
      >
        <Form form={addForm}>
          <AddComponentDetail addForm={addForm} resourceLibId={libId} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-电缆通道明细"
        width="50%"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditcableChannelDetail()}
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

export default CableChannelDetail
