import ComponentDetailModal from '@/components/component-detail-modal'
import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import {
  addCableWellItem,
  deleteCableWellItem,
  getCableWellDetail,
  updateCableWellItem,
} from '@/services/resource-config/cable-well'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react'
import CableWellForm from './components/add-edit-form'
import styles from './index.less'

const { Search } = Input

interface CableDesignParams {
  libId: string
}

const CableWell = (props: CableDesignParams, ref: Ref<any>) => {
  const { libId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const [detailVisible, setDetailVisible] = useState<boolean>(false)

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getCableWellDetail, {
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
            placeholder="请输入电缆井信息"
          />
        </TableSearch>
      </div>
    )
  }

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

  useImperativeHandle(ref, () => ({
    refresh,
  }))

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const columns = [
    {
      dataIndex: 'type',
      index: 'type',
      title: '类型',
      width: 140,
    },
    {
      dataIndex: 'cableWellName',
      index: 'cableWellName',
      title: '模块名称',
      width: 420,
    },
    {
      dataIndex: 'shortName',
      index: 'shortName',
      title: '模块简称',
      width: 200,
    },

    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 140,
    },
    {
      dataIndex: 'forProject',
      index: 'forProject',
      title: '所属工程',
      width: 240,
    },
    {
      dataIndex: 'forDesign',
      index: 'forDesign',
      title: '所属设计',
      width: 240,
    },
    {
      dataIndex: 'width',
      index: 'width',
      title: '宽度(mm)',
      width: 180,
    },

    {
      dataIndex: 'depth',
      index: 'depth',
      title: '井深(mm)',
      width: 180,
    },
    {
      dataIndex: 'isConfined',
      index: 'isConfined',
      title: '是否封闭',
      width: 140,
      render: (text: any, record: any) => {
        return record.isConfined === 0 ? '否' : '是'
      },
    },
    {
      dataIndex: 'isSwitchingPipe',
      index: 'isSwitchingPipe',
      title: '是否转接孔管',
      width: 200,
      render: (text: any, record: any) => {
        return record.isSwitchingPipe === 0 ? '否' : '是'
      },
    },
    {
      dataIndex: 'feature',
      index: 'feature',
      title: '特征',
      width: 180,
    },
    {
      dataIndex: 'pavement',
      index: 'pavement',
      title: '路面环境',
      width: 200,
    },
    {
      dataIndex: 'size',
      index: 'size',
      title: '尺寸',
      width: 180,
    },
    {
      dataIndex: 'coverMode',
      index: 'coverMode',
      title: '盖板模式',
      width: 200,
    },
    {
      dataIndex: 'grooveStructure',
      index: 'grooveStructure',
      title: '沟体结构',
      width: 200,
    },
  ]

  //添加
  const addEvent = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库！')
      return
    }
    setAddFormVisible(true)
  }

  const sureAddMaterial = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          cableWellId: '',
          cableWellName: '',
          shortName: '',
          typicalCode: '',
          type: '',
          unit: '',
          width: 0,
          depth: 0,
          isConfined: 0,
          isSwitchingPipe: 0,
          feature: '',
          pavement: '',
          size: '',
          coverMode: '',
          grooveStructure: '',
          forProject: '',
          forDesign: '',
          remark: '',
          chartIds: [],
        },
        value
      )
      await addCableWellItem(submitInfo)
      refresh()
      message.success('添加成功')
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

  const sureEditCableWell = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          id: editData.id,
          cableWellName: editData.cableWellName,
          shortName: editData.shortName,
          typicalCode: editData.typicalCode,
          type: editData.type,
          unit: editData.unit,
          width: editData.width,
          depth: editData.depth,
          isConfined: editData.isConfined,
          isSwitchingPipe: editData.isSwitchingPipe,
          feature: editData.feature,
          pavement: editData.pavement,
          size: editData.size,
          coverMode: editData.coverMode,
          grooveStructure: editData.grooveStructure,
          forProject: editData.forProject,
          forDesign: editData.forDesign,
          remark: editData.remark,
          chartIds: editData.chartIds,
          cableWellId: editData.cableWellId,
        },
        values
      )
      await updateCableWellItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('cable-well-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-well-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-well-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}

        {buttonJurisdictionArray?.includes('cable-well-detail') && (
          <Button className={styles.importBtn} onClick={() => openDetail()}>
            电缆井明细
          </Button>
        )}
      </div>
    )
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }

    const ids = tableSelectRows.map((item: any) => item.id)
    await deleteCableWellItem({ libId, ids })
    refresh()
    message.success('删除成功')
  }

  //展示组件明细
  const openDetail = () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.warning('请选择单行数据查看')
      return
    }
    setDetailVisible(true)
  }
  const selctModelId = async (id: string) => {
    const ResourceLibData = await run(libId, id)
    addFormVisible && addForm.setFieldsValue(ResourceLibData)
    editFormVisible && editForm.setFieldsValue(ResourceLibData)
  }

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/CableWell/GetPageList"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
      />

      <Modal
        maskClosable={false}
        title="添加-电缆井"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ maxHeight: '680px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CableWellForm resourceLibId={resourceLibId} type="add" onSetDefaultForm={selctModelId} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-电缆井"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCableWell()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ maxHeight: '680px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <CableWellForm resourceLibId={resourceLibId} onSetDefaultForm={selctModelId} />
          </Spin>
        </Form>
      </Modal>

      <ComponentDetailModal
        libId={libId}
        selectId={tableSelectRows.map((item) => {
          return item.id
        })}
        componentId={tableSelectRows.map((item) => {
          return item.cableWellId
        })}
        detailVisible={detailVisible}
        setDetailVisible={setDetailVisible}
        title="电缆通道明细"
        type="cable-well"
      />
    </>
  )
}

export default forwardRef(CableWell)
