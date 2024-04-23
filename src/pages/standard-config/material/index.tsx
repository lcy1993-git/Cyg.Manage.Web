import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import TemplateLibImportModal from '@/components/template-lib-import'
import UrlSelect from '@/components/url-select'
import {
  addMaterialItem,
  deleteMaterialItem,
  getMaterialDetail,
  updateMaterialItem,
} from '@/services/resource-config/material'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useState } from 'react'
import MaterialForm from './component/add-edit-form'
import CableMapping from './component/cable-mapping'
import ClampMap from './component/clamp-map'
import SaveImportMaterial from './component/import-form'
import LineProperty from './component/line-property'
import styles from './index.less'

const { Search } = Input

interface libParams {
  libId: string
}

const Material: React.FC<libParams> = (props) => {
  const { libId } = props
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [templateLibImportModalVisible, setTemplateLibImportModalVisible] = useState<boolean>(false)
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [formData, setFormData] = useState<any>({})

  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const [importMaterialVisible, setImportMaterialVisible] = useState<boolean>(false)

  const [attributeVisible, setAttributeVisible] = useState<boolean>(false)
  const [cableTerminalVisible, setCableTerminalVisible] = useState<boolean>(false)
  const [materialCategory, setMaterialCategory] = useState<string>('')
  const [chacheEditData, setChacheEditData] = useState<any>({})
  const [updateFlag, setUpdateFlag] = useState<boolean>(false)

  //线夹映射模态框
  const [clampMap, setClampMap] = useState<boolean>(false)

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { run, loading } = useRequest(getMaterialDetail, {
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
            placeholder="请输入物料信息"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="类别" width="220px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/Material/GetMaterialTypeList"
            titlekey="key"
            valuekey="value"
            placeholder="请选择"
            onChange={(value: any) => setMaterialCategory(value)}
            extraParams={{ libId: libId }}
            postType="query"
            requestType="post"
            updateFlag={updateFlag}
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
    search()
  }, [materialCategory])
  useEffect(() => {
    searchByLib(resourceLibId)
  }, [resourceLibId])

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
      setUpdateFlag(!updateFlag)
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
    {
      dataIndex: 'materialType',
      index: 'materialType',
      title: '类别',
      width: 180,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 140,
    },
    {
      dataIndex: 'pieceWeight',
      index: 'pieceWeight',
      title: '单重(kg)',
      width: 180,
    },
    // {
    //   dataIndex: 'unitPrice',
    //   index: 'unitPrice',
    //   title: '单价(元)',
    //   width: 180,
    // },
    // {
    //   dataIndex: 'usage',
    //   index: 'usage',
    //   title: '用途',
    //   width: 320,
    // },
    // {
    //   dataIndex: 'inspection',
    //   index: 'inspection',
    //   title: '物料(运检)',
    //   width: 240,
    // },
    {
      dataIndex: 'technicalID',
      index: 'technicalID',
      title: '技术规范编号',
      width: 150,
    },
    {
      dataIndex: 'figureNum',
      index: 'figureNum',
      title: '图号',
      width: 150,
    },
    {
      dataIndex: 'supplySide',
      index: 'supplySide',
      title: '供给方',
      width: 150,
    },
    {
      dataIndex: 'transportationType',
      index: 'transportationType',
      title: '运输类型',
      width: 240,
    },
    // {
    //   dataIndex: 'statisticType',
    //   index: 'statisticType',
    //   title: '统计类型',
    //   width: 240,
    // },
    {
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      title: '电压等级',
      width: 160,
    },
    // {
    //   dataIndex: 'forProject',
    //   index: 'forProject',
    //   title: '所属工程',
    //   width: 160,
    // },
    // {
    //   dataIndex: 'forDesign',
    //   index: 'forDesign',
    //   title: '所属设计',
    //   width: 160,
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

  const sureAddMaterial = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          materialId: '',
          category: '',
          materialName: '',
          spec: '',
          unit: '',
          pieceWeight: 0,
          unitPrice: 0,
          materialType: '',
          usage: '',
          inspection: '',
          description: '',
          code: '',
          supplySide: '',
          transportationType: '',
          statisticType: '',
          kvLevel: '',
          // forProject: '',
          // forDesign: '',
          remark: '',
          chartIds: '',
          technicalID: '',
          figureNum: '',
        },
        value
      )
      await addMaterialItem(submitInfo)
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

    // setEditFormVisible(true)
    const ResourceLibData = await run(libId, editDataId)
    setChacheEditData(ResourceLibData)

    editForm.setFieldsValue(ResourceLibData)
    setEditFormVisible(true)
  }

  const reset = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.reset()
    }
  }

  const sureEditMaterial = () => {
    // if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
    //   message.error('请选择一条数据进行编辑')
    //   return
    // }
    const editData = chacheEditData!

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libId: libId,
          materialId: editData.materialId,
          category: editData.category,
          materialName: editData.materialName,
          spec: editData.spec,
          unit: editData.unit,
          pieceWeight: editData.pieceWeight,
          unitPrice: editData.unitPrice,
          materialType: editData.materialType,
          usage: editData.usage,
          inspection: editData.inspection,
          description: editData.description,
          code: editData.code,
          supplySide: editData.supplySide,
          transportationType: editData.transportationType,
          statisticType: editData.statisticType,
          kvLevel: editData.kvLevel,
          // forProject: editData.forProject,
          // forDesign: editData.forDesign,
          remark: editData.remark,
          chartIds: editData.chartIds,
        },
        { ...values, pieceWeight: values.pieceWeight ? values.pieceWeight : 0 }
      )
      await updateMaterialItem(submitInfo)
      refresh()
      message.success('更新成功')
      reset()
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('material-template-lib-import') && (
          <Button type="primary" className="mr7" onClick={() => temlateLibImport()}>
            <PlusOutlined />
            模板库导入
          </Button>
        )}
        {buttonJurisdictionArray?.includes('material-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('material-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('material-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}

        {/* {buttonJurisdictionArray?.includes('material-import') && (
          <Button className="mr7" onClick={() => importMaterialEvent()}>
            <ImportOutlined />
            导入物料
          </Button>
        )} */}

        {buttonJurisdictionArray?.includes('material-property') && (
          <Button className={styles.importBtn} onClick={() => openWireAttribute()}>
            导线属性
          </Button>
        )}

        {buttonJurisdictionArray?.includes('material-cable-mapping') && (
          <Button className={styles.importBtn} onClick={() => openCableTerminal()}>
            电缆终端头映射
          </Button>
        )}
        <Button className={styles.importBtn} onClick={() => setClampMap(true)}>
          线夹映射
        </Button>
      </div>
    )
  }

  // const importMaterialEvent = () => {
  //   // if (!resourceLibId) {
  //   //   message.warning('请选择资源库');
  //   //   return;
  //   // }
  //   setImportMaterialVisible(true)
  // }

  const sureDeleteData = async () => {
    // if (!resourceLibId) {
    //   message.warning('请先选择资源库');
    //   return;
    // }
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择需要删除的行')
      return
    }
    const deleteIds = tableSelectRows?.map((item) => item.id)

    await deleteMaterialItem({ libId: libId, ids: deleteIds })
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  //展示导线属性
  const openWireAttribute = () => {
    // if (!resourceLibId) {
    //   message.warning('请先选择资源库');
    //   return;
    // }
    setAttributeVisible(true)
  }

  //展示电缆终端头映射
  const openCableTerminal = () => {
    setCableTerminalVisible(true)
  }

  const uploadFinishEvent = () => {
    refresh()
  }
  const temlateLibImportFinishEvent = async (resourceLibId: string, id: string) => {
    const ResourceLibData = await run(resourceLibId, id)
    setChacheEditData(ResourceLibData)

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
    <div className={styles.material}>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/Material/GetPageList"
        // tableTitle="物料列表"
        size="small"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
          materialType: materialCategory,
        }}
      />
      <TemplateLibImportModal
        visible={templateLibImportModalVisible}
        onChange={setTemplateLibImportModalVisible}
        requestUrl="/Material/GetPageList"
        changeFinishEvent={temlateLibImportFinishEvent}
        libId={libId}
        type="material"
        refeshTable={refresh}
      />
      <Modal
        maskClosable={false}
        title="添加-物料"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ maxHeight: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <MaterialForm
            onSetDefaultForm={selctModelId}
            resourceLibId={libId}
            form={addForm}
            formData={formData}
          />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-物料"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditMaterial()}
        onCancel={() => {
          setEditFormVisible(false)
          refresh()
        }}
        cancelText="取消"
        bodyStyle={{ maxHeight: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <MaterialForm
              resourceLibId={libId}
              onSetDefaultForm={selctModelId}
              form={editForm}
              formData={formData}
            />
          </Spin>
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        footer=""
        title="导线属性"
        width="880px"
        visible={attributeVisible}
        onCancel={() => setAttributeVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <LineProperty
          libId={libId}
          materialIds={tableSelectRows.map((item: any) => {
            return item.id
          })}
        />
      </Modal>

      <Modal
        maskClosable={false}
        footer=""
        title="电缆终端头映射"
        width="92%"
        visible={cableTerminalVisible}
        onCancel={() => setCableTerminalVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <CableMapping
          libId={libId}
          materialIds={tableSelectRows.map((item: any) => {
            return item.id
          })}
        />
      </Modal>

      <ClampMap libId={libId} requestSource="resource" visible={clampMap} onChange={setClampMap} />

      <SaveImportMaterial
        libId={libId}
        requestSource="resource"
        visible={importMaterialVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportMaterialVisible}
      />
    </div>
  )
}

export default Material
