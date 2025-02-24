import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import TemplateLibImportModal from '@/components/template-lib-import'
import {
  addPoleTypeItem,
  deletePoleTypeItem,
  getPoleTypeDetail,
  updatePoleTypeItem,
} from '@/services/resource-config/pole-type'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest, useUpdateEffect } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useOverHeadStore } from '../../context'
import PoleTypeForm from './components/add-edit-form'
import styles from './index.less'

const { Search } = Input

interface CableDesignParams {
  libId: string
}

const PoleType: React.FC<CableDesignParams> = (props) => {
  const { libId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [templateLibImportModalVisible, setTemplateLibImportModalVisible] = useState<boolean>(false)
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const { isRefresh } = useOverHeadStore()
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getPoleTypeDetail, {
    manual: true,
  })

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入分类信息"
          />
        </TableSearch>
      </div>
    )
  }

  useUpdateEffect(() => {
    refresh()
  }, [isRefresh])

  //选择资源库传libId
  const searchByLib = (value: any) => {
    setResourceLibId(value)
    search()
  }

  useEffect(() => {
    searchByLib(libId)
  }, [libId])

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const reset = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.reset()
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
      dataIndex: 'poleTypeCode',
      index: 'poleTypeCode',
      title: '分类简号',
      width: 180,
    },
    {
      dataIndex: 'poleTypeName',
      index: 'poleTypeName',
      title: '分类名称',
      width: 280,
    },
    {
      dataIndex: 'category',
      index: 'category',
      title: '类型',
      width: 200,
    },
    {
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      title: '电压等级',
      width: 180,
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '分类类型',
      width: 180,
    },
    {
      dataIndex: 'corner',
      index: 'corner',
      title: '转角',
      width: 180,
    },
    {
      dataIndex: 'material',
      index: 'material',
      title: '分类材质',
      width: 180,
    },
    {
      dataIndex: 'loopNumber',
      index: 'loopNumber',
      title: '回路数',
      width: 180,
    },

    {
      dataIndex: 'isTension',
      index: 'isTension',
      title: '是否耐张',
      width: 180,
      render: (text: any, record: any) => {
        return record.isTension == true ? '是' : '否'
      },
    },
  ]
  //已有库导入
  const temlateLibImport = () => {
    setTemplateLibImportModalVisible(true)
  }
  //添加
  const addEvent = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库！')
      return
    }
    setAddFormVisible(true)
  }

  const sureAddPoleType = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          poleTypeCode: '',
          poleTypeName: '',
          category: '',
          kvLevel: '',
          type: '',
          corner: '',
          material: '',
          loopNumber: '',
          isTension: false,
          remark: '',
          chartIds: [],
        },
        value
      )
      await addPoleTypeItem(submitInfo)
      refresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  //编辑
  const editEvent = async () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    setEditFormVisible(true)
    const ResourceLibData = await run(resourceLibId, editDataId)

    editForm.setFieldsValue(ResourceLibData)
  }

  const sureEditPoleType = () => {
    // if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
    //   message.error('请选择一条数据进行编辑')
    //   return
    // }
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          id: editData.id,
          poleTypeName: editData.poleTypeName,
          category: editData.category,
          kvLevel: editData.kvLevel,
          type: editData.type,
          corner: editData.corner,
          material: editData.material,
          loopNumber: editData.loopNumber,
          isTension: editData.isTension,
          remark: editData.remark,
          chartIds: editData.chartIds,
        },
        values
      )
      await updatePoleTypeItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      reset()
      setEditFormVisible(false)
    })
  }
  const temlateLibImportFinishEvent = async (resourceLibId: string, id: string) => {
    const ResourceLibData = await run(resourceLibId, id)

    editForm.setFieldsValue(ResourceLibData)
    setEditFormVisible(true)
  }
  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('catogery-template-lib-import') && (
          <Button type="primary" className="mr7" onClick={() => temlateLibImport()}>
            <PlusOutlined />
            模板库导入
          </Button>
        )}
        {buttonJurisdictionArray?.includes('catogery-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('catogerye-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('catogerye-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
      </div>
    )
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows
    const editDataId = editData.map((item: any) => item.id)

    await deletePoleTypeItem({ libId: resourceLibId, poleTypeIds: editDataId })
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/PoleType/GetPageList"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
      />
      <TemplateLibImportModal
        visible={templateLibImportModalVisible}
        onChange={setTemplateLibImportModalVisible}
        requestUrl="/PoleType/GetPageList"
        changeFinishEvent={temlateLibImportFinishEvent}
        libId={libId}
        type="category"
        refeshTable={refresh}
      />
      <Modal
        maskClosable={false}
        title="添加-分类"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddPoleType()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <PoleTypeForm resourceLibId={resourceLibId} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-分类"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditPoleType()}
        onCancel={() => {
          setEditFormVisible(false)
          refresh()
        }}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <PoleTypeForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal>
    </>
  )
}

export default PoleType
