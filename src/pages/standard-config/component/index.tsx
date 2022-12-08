import ComponentDetailModal from '@/components/component-detail-modal'
import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import TemplateLibImportModal from '@/components/template-lib-import'
import UrlSelect from '@/components/url-select'
import {
  addComponentItem,
  deleteComponentItem,
  getComponentDetail,
  updateComponentItem,
} from '@/services/resource-config/component'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useState } from 'react'
import ComponentForm from './components/add-edit-form'
import ElectricProperty from './components/component-property'
import SaveImportComponent from './components/import-form'
import styles from './index.less'

const { Search } = Input

interface libParams {
  libId: string
}

const Component: React.FC<libParams> = (props) => {
  const { libId } = props
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [templateLibImportModalVisible, setTemplateLibImportModalVisible] = useState<boolean>(false)
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [importComponentVisible, setImportComponentVisible] = useState<boolean>(false)
  const [deviceCategory, setDeviceCategory] = useState<string>('')

  const [attributeVisible, setAttributeVisible] = useState<boolean>(false)
  const [detailVisible, setDetailVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({})

  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getComponentDetail, {
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
            placeholder="请输入组件信息"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="设备分类" width="220px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/Component/GetDeviceCategory"
            titlekey="key"
            valuekey="value"
            placeholder="请选择"
            onChange={(value: any) => searchByCategory(value)}
          />
        </TableSearch>
      </div>
    )
  }

  //选择设备类别搜索
  const searchByCategory = (value: any) => {
    setDeviceCategory(value)
    search()
  }

  useEffect(() => {
    searchByCategory(deviceCategory)
  }, [deviceCategory])

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
      width: 120,
    },
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
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      title: '电压等级',
      width: 180,
    },
    // {
    //   dataIndex: 'forProject',
    //   index: 'forProject',
    //   title: '所属工程',
    //   width: 150,
    // },
    // {
    //   dataIndex: 'forDesign',
    //   index: 'forDesign',
    //   title: '所属设计',
    //   width: 150,
    // },
  ]
  //已有库导入
  const temlateLibImport = () => {
    setTemplateLibImportModalVisible(true)
  }
  //添加
  const addEvent = () => {
    // if (!resourceLibId) {
    //   message.warning('请先选择资源库！');
    //   return;
    // }
    setAddFormVisible(true)
  }

  const reset = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.reset()
    }
  }

  const sureAddComponent = () => {
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
          // forProject: '',
          // forDesign: '',
          remark: '',
          chartIds: '',
        },
        value
      )
      await addComponentItem(submitInfo)
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

    const ResourceLibData = await run(libId, editDataId)
    // 电气设备若为空字符串，给默认枚举值不限
    ResourceLibData.kvLevel = !!ResourceLibData.kvLevel ? ResourceLibData.kvLevel : '不限'
    editForm.setFieldsValue(ResourceLibData)
    setEditFormVisible(true)
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
          // forProject: editData.forProject,
          // forDesign: editData.forDesign,
          remark: editData.remark,
          processChartIds: editData.processChartIds,
          componentId: editData.componentId,
        },
        values
      )
      await updateComponentItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      reset()
      setEditFormVisible(false)
    })
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('component-template-lib-import') && (
          <Button type="primary" className="mr7" onClick={() => temlateLibImport()}>
            <PlusOutlined />
            模板库导入
          </Button>
        )}
        {buttonJurisdictionArray?.includes('component-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('component-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('component-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}

        {/* {buttonJurisdictionArray?.includes('component-import') && (
          <Button className="mr7" onClick={() => importComponentEvent()}>
            <ImportOutlined />
            导入组件
          </Button>
        )} */}

        {buttonJurisdictionArray?.includes('component-detail') && (
          <Button className={styles.importBtn} onClick={() => openDetail()}>
            组件明细
          </Button>
        )}

        {buttonJurisdictionArray?.includes('component-property') && (
          <Button className={styles.importBtn} onClick={() => openProperty()}>
            组件属性
          </Button>
        )}
      </div>
    )
  }

  const importComponentEvent = () => {
    // if (!resourceLibId) {
    //   message.warning('请选择资源库');
    //   return;
    // }
    setImportComponentVisible(true)
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要删除的行')
      return
    }
    const selectedDataId = tableSelectRows.map((item) => {
      return item.id
    })

    await deleteComponentItem(libId, selectedDataId)
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

  //展示组件属性
  const openProperty = () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.warning('请选择单行数据查看')
      return
    }
    // 仅电气设备可打开弹窗
    if (tableSelectRows[0].deviceCategory !== '电气设备') {
      message.warning('请选择电气设备数据进行查看')
      return
    }
    setAttributeVisible(true)
  }

  const uploadFinishEvent = () => {
    refresh()
  }
  const temlateLibImportFinishEvent = async (resourceLibId: string, id: string) => {
    const ResourceLibData = await run(resourceLibId, id)
    editForm.setFieldsValue(ResourceLibData)
    setEditFormVisible(true)
  }
  const selctModelId = async (id: string) => {
    const ResourceLibData = await run(libId, id)
    addFormVisible && addForm.setFieldsValue(ResourceLibData)
    editFormVisible && editForm.setFieldsValue(ResourceLibData)
    setFormData(ResourceLibData)
  }

  return (
    // <PageCommonWrap>
    <div className={styles.component}>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/Component/GetPageList"
        // tableTitle="组件列表"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          isElectricalEquipment: true,
          deviceCategory: deviceCategory,
          keyWord: searchKeyWord,
        }}
      />
      <TemplateLibImportModal
        visible={templateLibImportModalVisible}
        onChange={setTemplateLibImportModalVisible}
        requestUrl="/Component/GetPageList"
        changeFinishEvent={temlateLibImportFinishEvent}
        libId={libId}
        type="component"
        extractParams={{
          isElectricalEquipment: true,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-组件"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddComponent()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <ComponentForm
            resourceLibId={libId}
            type="add"
            onSetDefaultForm={selctModelId}
            form={addForm}
            formData={formData}
          />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-组件"
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
            <ComponentForm
              resourceLibId={libId}
              onSetDefaultForm={selctModelId}
              form={editForm}
              formData={formData}
            />
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
      <SaveImportComponent
        libId={libId}
        requestSource="resource"
        visible={importComponentVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportComponentVisible}
      />
      {/* </PageCommonWrap> */}
    </div>
  )
}

export default Component
