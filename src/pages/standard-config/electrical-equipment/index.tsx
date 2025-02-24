import ComponentDetailModal from '@/components/component-detail-modal'
import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import {
  addElectricalEquipmentItem,
  deleteElectricalEquipmentItem,
  getElectricalEquipmentDetail,
  updateElectricalEquipmentItem,
} from '@/services/resource-config/electrical-equipment'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useState } from 'react'
import ElectricalEquipmentForm from './components/add-edit-form'
import SaveImportElectrical from './components/import-form'
import ElectricProperty from './components/property-table'
import styles from './index.less'

const { Search } = Input

interface libParams {
  libId: string
}

const ElectricalEquipment: React.FC<libParams> = (props) => {
  const { libId } = props
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)

  const [attributeVisible, setAttributeVisible] = useState<boolean>(false)
  const [importElectricalVisible, setImportElectricalVisible] = useState<boolean>(false)
  const [detailVisible, setDetailVisible] = useState<boolean>(false)
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, loading } = useRequest(getElectricalEquipmentDetail, {
    manual: true,
  })

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="278px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入电气设备信息"
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
    searchByLib(resourceLibId)
  }, [resourceLibId])

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
      dataIndex: 'deviceCategory',
      index: 'deviceCategory',
      title: '设备分类',
      width: 180,
    },

    {
      dataIndex: 'componentType',
      index: 'componentType',
      title: '组件分类',
      width: 180,
    },
    {
      dataIndex: 'componentName',
      index: 'componentName',
      title: '组件名称',
      width: 240,
    },
    {
      dataIndex: 'componentSpec',
      index: 'componentName',
      title: '组件型号',
      width: 320,
    },
    {
      dataIndex: 'typicalCode',
      index: 'typicalCode',
      title: '典设编码',
      width: 220,
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
  ]

  //添加
  const addEvent = () => {
    // if (!resourceLibId) {
    //   message.warning('请先选择资源库！');
    //   return;
    // }
    setAddFormVisible(true)
  }

  const sureAddMaterial = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          componentId: '',
          componentName: '',
          componentSpec: '',
          typicalCode: '',
          unit: '',
          deviceCategory: '',
          componentType: '',
          kvLevel: '',
          forProject: '',
          forDesign: '',
          remark: '',
          chartIds: '',
          isElectricalEquipment: true,
        },
        value
      )
      await addElectricalEquipmentItem(submitInfo)
      refresh()
      setAddFormVisible(false)
      message.success('添加成功')
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
    const ElectricalEquipmentData = await run(libId, editDataId)

    editForm.setFieldsValue(ElectricalEquipmentData)
  }

  const sureEditMaterial = () => {
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
          componentName: editData.componentName,
          componentSpec: editData.componentSpec,
          typicalCode: editData.typicalCode,
          unit: editData.unit,
          deviceCategory: editData.deviceCategory,
          componentType: editData.componentType,
          kvLevel: editData.kvLevel,
          forProject: editData.forProject,
          forDesign: editData.forDesign,
          remark: editData.remark,
          chartIds: editData.chartIds,
          componentId: editData.componentId,
        },
        values
      )
      await updateElectricalEquipmentItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('electrical-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('electrical-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('electrical-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}

        {/* {buttonJurisdictionArray?.includes('electrical-import') && (
          <Button className="mr7" onClick={() => importElectricalEvent()}>
            <ImportOutlined />
            导入电气设备
          </Button>
        )} */}

        {buttonJurisdictionArray?.includes('electrical-detail') && (
          <Button className={styles.importBtn} onClick={() => openDetail()}>
            组件明细
          </Button>
        )}

        {buttonJurisdictionArray?.includes('electrical-property') && (
          <Button className={styles.importBtn} onClick={() => openProperty()}>
            组件属性
          </Button>
        )}
      </div>
    )
  }

  // const importElectricalEvent = () => {
  //   // if (!resourceLibId) {
  //   //   message.warning('请选择资源库');
  //   //   return;
  //   // }
  //   setImportElectricalVisible(true)
  // }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows
    const editDataId = editData.map((item) => {
      return item.id
    })

    await deleteElectricalEquipmentItem(libId, editDataId)
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  //展示组件明细
  const openDetail = () => {
    // if (!resourceLibId) {
    //   message.warning('请先选择资源库');
    //   return;
    // }
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择单条数据进行编辑')
      return
    }
    setDetailVisible(true)
  }

  //展示组件属性
  const openProperty = () => {
    // if (!resourceLibId) {
    //   message.warning('请先选择资源库');
    //   return;
    // }
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.warning('请选择单行数据查看')
      return
    }
    setAttributeVisible(true)
  }

  const uploadFinishEvent = () => {
    refresh()
  }
  const selctModelId = async (id: string) => {
    const ResourceLibData = await run(libId, id)
    addFormVisible && addForm.setFieldsValue(ResourceLibData)
    editFormVisible && editForm.setFieldsValue(ResourceLibData)
  }
  return (
    <div className={styles.electrical}>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/ElectricalEquipment"
        // tableTitle="电气设备列表"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
          isElectricalEquipment: true,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-电气设备"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <ElectricalEquipmentForm
            resourceLibId={libId}
            type="add"
            onSetDefaultForm={selctModelId}
          />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-电气设备"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditMaterial()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <ElectricalEquipmentForm resourceLibId={libId} onSetDefaultForm={selctModelId} />
          </Spin>
        </Form>
      </Modal>

      <ComponentDetailModal
        libId={libId}
        selectId={tableSelectRows.map((item) => {
          return item.id
        })}
        componentId={tableSelectRows.map((item) => {
          return item.componentId
        })}
        detailVisible={detailVisible}
        setDetailVisible={setDetailVisible}
        title="组件明细"
        type="component"
      />

      <Modal
        maskClosable={false}
        footer=""
        title="组件属性"
        width="60%"
        visible={attributeVisible}
        onCancel={() => setAttributeVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Spin spinning={loading}>
          <ElectricProperty
            libId={libId}
            componentId={tableSelectRows.map((item) => {
              return item.id
            })}
          />
        </Spin>
      </Modal>
      <SaveImportElectrical
        libId={libId}
        requestSource="resource"
        visible={importElectricalVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportElectricalVisible}
      />
    </div>
  )
}

export default ElectricalEquipment
