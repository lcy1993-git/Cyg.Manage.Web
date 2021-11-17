import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Input, Button, Modal, Form, message, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import {
  getCableChannelDetail,
  deleteCableChannelItem,
  updateCableChannelItem,
  addCableChannelItem,
} from '@/services/resource-config/cable-channel'
import { isArray } from 'lodash'
import CableChannelForm from './components/add-edit-form'
import CableChannelDetail from './components/detail-table'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import ModalConfirm from '@/components/modal-confirm'

const { Search } = Input

interface CableDesignParams {
  libId: string
}

const CableChannel: React.FC<CableDesignParams> = (props) => {
  const { libId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [ids, setIds] = useState<string[]>([])

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [detailVisible, setDetailVisible] = useState<boolean>(false)

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getCableChannelDetail, {
    manual: true,
  })

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="258px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入电缆通道信息"
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

  const reset = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
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

  const searchByLib = (value: any) => {
    setResourceLibId(value)
    search()
  }

  useEffect(() => {
    searchByLib(libId)
  }, [libId])

  const columns = [
    {
      dataIndex: 'channelId',
      index: 'channelId',
      title: '模块编码',
      width: 180,
    },
    {
      dataIndex: 'channelName',
      index: 'channelName',
      title: '模块名称',
      width: 480,
    },
    {
      dataIndex: 'shortName',
      index: 'shortName',
      title: '模块简称',
      width: 260,
    },

    {
      dataIndex: 'channelCode',
      index: 'channelCode',
      title: '简号',
      width: 320,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 180,
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
      dataIndex: 'reservedWidth',
      index: 'reservedWidth',
      title: '通道预留宽度(mm)',
      width: 240,
    },

    {
      dataIndex: 'digDepth',
      index: 'digDepth',
      title: '挖深',
      width: 180,
    },
    {
      dataIndex: 'layingMode',
      index: 'layingMode',
      title: '敷设方式',
      width: 240,
    },
    {
      dataIndex: 'cableNumber',
      index: 'cableNumber',
      title: '可容纳电缆数',
      width: 180,
    },
    {
      dataIndex: 'bracketNumber',
      index: 'bracketNumber',
      title: '支架层数',
      width: 180,
    },

    {
      dataIndex: 'arrangement',
      index: 'arrangement',
      title: '排列方式',
      width: 180,
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
          libId: libId,
          channelId: '',
          channelName: '',
          shortName: '',
          typicalCode: '',
          channelCode: '',
          unit: '',
          reservedWidth: 0,
          digDepth: 0,
          layingMode: '',
          cableNumber: 0,
          pavement: '',
          protectionMode: '',
          ductMaterialId: '',
          arrangement: '',
          bracketNumber: 0,
          forProject: '',
          forDesign: '',
          remark: '',
          chartIds: '',
        },
        value
      )
      await addCableChannelItem(submitInfo)
      refresh()
      reset()
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

  const sureEditMaterial = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = {
        libId: libId,
        id: editData.id,
        ...values,
        channelName: values.channelName,
        shortName: values.shortName,
        typicalCode: values.typicalCode,
        channelCode: values.channelCode,
        unit: values.unit,
        digDepth: values.digDepth,
        layingMode: values.layingMode,
        cableNumber: values.cableNumber,
        pavement: values.pavement,
        protectionMode: values.protectionMode,
        ductMaterialId: values.ductMaterialId,
        arrangement: values.arrangement,
        bracketNumber: values.bracketNumber,
        forProject: values.forProject,
        forDesign: values.forDesign,
        remark: values.remark,
        chartIds: values.chartIds,
        reservedWidth: values.reservedWidth ? values.reservedWidth : 0,
      }

      await updateCableChannelItem(submitInfo)
      message.success('更新成功')
      editForm.resetFields()
      refresh()
      reset()
      setEditFormVisible(false)
    })
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('cable-channel-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-channel-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-channel-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}

        {buttonJurisdictionArray?.includes('cable-channel-detail') && (
          <Button className={styles.importBtn} onClick={() => openDetail()}>
            电缆通道明细
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
    tableSelectRows.map((item) => {
      ids.push(item.id)
    })

    await deleteCableChannelItem({ libId, ids })
    refresh()
    setTableSelectRows([])
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

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={tableElement}
        buttonLeftContentSlot={searchComponent}
        columns={columns}
        requestSource="resource"
        url="/CableChannel"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          libId: libId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-电缆通道"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '680px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CableChannelForm resourceLibId={resourceLibId} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-电缆通道"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditMaterial()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '680px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <CableChannelForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        footer=""
        title="电缆通道明细"
        width="92%"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <CableChannelDetail
            libId={libId}
            cableChannelId={tableSelectRows.map((item) => {
              return item.channelId
            })}
            selectId={tableSelectRows.map((item) => {
              return item.id
            })}
          />
        </Spin>
      </Modal>
    </>
  )
}

export default CableChannel
