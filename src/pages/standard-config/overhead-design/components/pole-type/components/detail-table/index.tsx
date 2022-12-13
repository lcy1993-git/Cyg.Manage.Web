import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import UrlSelect from '@/components/url-select'
import {
  addModuleDetailItem,
  deleteModulesDetailItem,
  getModuleDetailItem,
  updateModulesDetailItem,
} from '@/services/resource-config/modules-property'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useState } from 'react'
import AddModuleDetailTable from './add-form'
import EditModuleDetail from './edit-form'
import styles from './index.less'
interface ModuleDetailParams {
  libId: string
  moduleId: string[]
  selectId: string[]
}

const { Search } = Input

const ModuleDetailTable: React.FC<ModuleDetailParams> = (props) => {
  const { libId, moduleId, selectId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [modulePart, setModulePart] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run } = useRequest(getModuleDetailItem, {
    manual: true,
  })
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="278px">
          <Search
            allowClear
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入模块明细信息"
          />
        </TableSearch>
        <TableSearch width="230px" marginLeft="12px">
          <UrlSelect
            requestSource="resource"
            url="/ModulesDetails/GetParts"
            valuekey="value"
            titlekey="key"
            allowClear
            onChange={(value: any) => searchByPart(value)}
            placeholder="--所属部件--"
          />
        </TableSearch>
      </div>
    )
  }

  //选择资源库传libId
  const searchByPart = (value: any) => {
    setModulePart(value)
    search()
  }

  useEffect(() => {
    searchByPart(modulePart)
  }, [modulePart])

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
      dataIndex: 'part',
      index: 'part',
      title: '所属部件',
      width: 180,
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

  const sureAddModuleDetail = () => {
    addForm.validateFields().then(async (value) => {
      const saveInfo = Object.assign(
        {
          libId: libId,
          moduleId: selectId[0],
        },
        value
      )

      await addModuleDetailItem(saveInfo)
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
    const ModuleDetailData = await run(libId, editDataId)
    const formData = {
      componentId: ModuleDetailData.itemName,
      itemId: ModuleDetailData.itemId,
      itemNumber: ModuleDetailData.itemNumber,
      part: ModuleDetailData.part,
      // spec: ComponentDetailData.spec,
      itemType: ModuleDetailData.isComponent === 1 ? '1' : '0',
      unit: ModuleDetailData.unit,
    }
    setFormData(formData)
    editForm.setFieldsValue(formData)
  }

  const sureEditModuleDetail = () => {
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
      await updateModulesDetailItem(submitInfo)
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
    await deleteModulesDetailItem(libId, selectDataId)
    refresh()
    message.success('删除成功')
    setTableSelectRows([])
  }

  const tableRightSlot = (
    <>
      {buttonJurisdictionArray?.includes('add-poleType-detail') && (
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
      )}
      {buttonJurisdictionArray?.includes('edit-poleType-detail') && (
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
      )}
      {buttonJurisdictionArray?.includes('delete-poleType-detail') && (
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
        url="/ModulesDetails/GetPageList"
        columns={columns}
        type="radio"
        requestSource="resource"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          moduleIds: selectId,
          part: modulePart,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-模块明细"
        width="88%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddModuleDetail()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
        centered
      >
        <Form form={addForm} preserve={false}>
          <AddModuleDetailTable addForm={addForm} resourceLibId={libId} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-模块明细"
        width="50%"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditModuleDetail()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <EditModuleDetail resourceLibId={libId} formData={formData} editForm={editForm} />
        </Form>
      </Modal>
    </div>
  )
}

export default ModuleDetailTable
