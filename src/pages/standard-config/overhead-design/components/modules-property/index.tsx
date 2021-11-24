import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import TableSearch from '@/components/table-search'
import {
  addModulesPropertyItem,
  deleteModulesPropertyItem,
  getModuleAttribute,
  getModulesPropertyDetail,
  saveModuleAttributeItem,
  updateModulesPropertyItem,
} from '@/services/resource-config/modules-property'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, FileTextOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useState } from 'react'
import ModulesPropertyForm from './components/add-edit-form'
import ModuleDetailTable from './components/detail-table'
import styles from './index.less'

const { Search } = Input

interface CableDesignParams {
  libId: string
}

const ModulesProperty: React.FC<CableDesignParams> = (props) => {
  const { libId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [resourceLibId, setResourceLibId] = useState<string>('')
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [editAttributeVisible, setEditAttributeVisible] = useState<boolean>(false)
  const [detailVisible, setDetailVisible] = useState<boolean>(false)
  const [moduleDetailVisible, setModuleDetailVisible] = useState<boolean>(false)
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [editAttributeForm] = Form.useForm()

  const { data, run, loading } = useRequest(getModulesPropertyDetail, {
    manual: true,
  })

  const { data: AttributeData, run: getAttribute } = useRequest(getModuleAttribute, {
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
            placeholder="请输入模块信息"
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

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const reset = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.reset()
    }
  }

  const columns = [
    {
      dataIndex: 'moduleId',
      index: 'moduleId',
      title: '模块编码',
      width: 180,
    },
    {
      dataIndex: 'moduleName',
      index: 'moduleName',
      title: '模块名称',
      width: 500,
    },
    {
      dataIndex: 'poleTypeCode',
      index: 'poleTypeCode',
      title: '杆型简号',
      width: 280,
    },
    {
      dataIndex: 'typicalCode',
      index: 'typicalCode',
      title: '典设编码',
      width: 180,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 100,
    },

    {
      dataIndex: 'forProject',
      index: 'forProject',
      title: '所属工程',
      width: 200,
    },
    {
      dataIndex: 'forDesign',
      index: 'forDesign',
      title: '所属设计',
      width: 200,
    },
    {
      dataIndex: 'height',
      index: 'height',
      title: '高度（m）',
      width: 200,
    },
    {
      dataIndex: 'depth',
      index: 'depth',
      title: '埋深（m）',
      width: 200,
    },
    {
      dataIndex: 'nominalHeight',
      index: 'nominalHeight',
      title: '呼称高（m）',
      width: 200,
    },
    {
      dataIndex: 'rodDiameter',
      index: 'rodDiameter',
      title: '杆梢径（mm）',
      width: 200,
    },
    {
      dataIndex: 'segmentMode',
      index: 'segmentMode',
      title: '分段方式',
      width: 200,
    },
    {
      dataIndex: 'arrangement',
      index: 'arrangement',
      title: '导线排列方式',
      width: 240,
    },
    {
      dataIndex: 'meteorologic',
      index: 'meteorologic',
      title: '气象区',
      width: 200,
    },
    {
      dataIndex: 'loopNumber',
      index: 'loopNumber',
      title: '回路数',
      width: 200,
    },
    {
      dataIndex: 'lineNumber',
      index: 'lineNumber',
      title: '线数',
      width: 140,
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

  const sureAddModuleProperty = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          moduleId: '',
          moduleName: '',
          shortName: '',
          typicalCode: '',
          poleTypeCode: '',
          unit: '',
          moduleType: '',
          forProject: '',
          forDesign: '',
          remark: '',
          processChartIds: [],
          designChartIds: [],
          towerModelChartIds: [],
        },
        value
      )
      await addModulesPropertyItem(submitInfo)
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

  const sureEditModuleProperty = () => {
    const editData = data!

    editForm.validateFields().then(async (values) => {
      console.log(values)

      const submitInfo = Object.assign(
        {
          id: editData.id,
          libId: libId,
          moduleName: editData.moduleName,
          shortName: editData.shortName,
          unit: editData.unit,
          moduleType: editData.moduleType,
          forProject: editData.forProject,
          forDesign: editData.forDesign,
          remark: editData.remark,
          processChartIds: editData.processChartIds,
          designChartIds: editData.designChartIds,
          towerModelChartIds: editData.towerModelChartIds,
          rodDiameter: editData.rodDiameter,
        },

        {
          ...values,
          rodDiameter: values.rodDiameter ? values.rodDiameter : 0,
          nominalHeight: values.nominalHeight ? values.nominalHeight : 0,
        }
      )

      await updateModulesPropertyItem(submitInfo)
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
        {buttonJurisdictionArray?.includes('modules-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('modules-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {/* {buttonJurisdictionArray?.includes('modules-property') && (
          <Button className="mr7" onClick={() => editAttributeEvent()}>
            编辑属性
          </Button>
        )} */}

        {buttonJurisdictionArray?.includes('modules-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}

        {/* {buttonJurisdictionArray?.includes('modules-check') && (
          <Button className="mr7" onClick={() => checkDetailEvent()}>
            <FileOutlined />
            详情
          </Button>
        )} */}

        {buttonJurisdictionArray?.includes('modules-detail') && (
          <Button className="mr7" onClick={() => openModuleDetail()}>
            <FileTextOutlined />
            模块明细
          </Button>
        )}
      </div>
    )
  }

  //详情
  const checkDetailEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据查看详情')
      return
    }
    setDetailVisible(true)

    await run(resourceLibId, tableSelectRows[0].id)
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除')
      return
    }
    const ids = tableSelectRows.map((item: any) => item.id)

    await deleteModulesPropertyItem({ libId: libId, ids: ids })
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  //展示模块明细
  const openModuleDetail = () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.warning('请选择单行数据查看')
      return
    }
    setModuleDetailVisible(true)
  }

  //编辑模块属性
  const editAttributeEvent = async () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库')
      return
    }
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择一条数据进行编辑')
      return
    }
    setEditAttributeVisible(true)
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    setEditAttributeVisible(true)
    const AttributeData = await getAttribute(resourceLibId, editDataId)

    editAttributeForm.setFieldsValue(AttributeData)
  }

  //保存修改的模块属性
  const sureEditAttribute = () => {
    const editData = AttributeData!
    console.log(AttributeData)
    editAttributeForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          moduleId: editData.moduleId,
          height: editData.height,
          depth: editData.depth,
          nominalHeight: editData.nominalHeight,
          steelStrength: editData.steelStrength,
          poleStrength: editData.poleStrength,
          rodDimaeter: editData.rodDiameter,
          baseWeight: editData.baseWeight,
          segmentMode: editData.segmentMode,
          earthwork: editData.earthwork,
          arrangement: editData.arrangement,
          meteorologic: editData.meteorologic,
          loopNumber: editData.loopNumber,
          lineNumber: editData.lineNumber,
          conductorType: editData.conductorType,
          conductorSpec: editData.conductorSpec,
        },
        values
      )

      await saveModuleAttributeItem(submitInfo)
      refresh()
      message.success('更新成功')
      editAttributeForm.resetFields()
      setEditAttributeVisible(false)
    })
  }

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={tableElement}
        buttonLeftContentSlot={searchComponent}
        columns={columns}
        requestSource="resource"
        url="/Modules/GetPageList"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-模块"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        centered
        bodyStyle={{ overflowY: 'auto', height: 750 }}
        onOk={() => sureAddModuleProperty()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <ModulesPropertyForm resourceLibId={resourceLibId} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-模块"
        width="680px"
        visible={editFormVisible}
        okText="保存"
        bodyStyle={{ overflowY: 'auto', height: 750 }}
        centered
        onOk={() => sureEditModuleProperty()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <ModulesPropertyForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal>

      {/* <Modal
        maskClosable={false}
        title="编辑-模块属性"
        width="680px"
        visible={editAttributeVisible}
        onCancel={() => setEditAttributeVisible(false)}
        onOk={() => sureEditAttribute()}
        okText="保存"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={editAttributeForm} preserve={false}>
          <Spin spinning={loading}>
            <ModuleAttributeForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal> */}
      {/* <Modal
        maskClosable={false}
        footer=""
        title="详情"
        width="980px"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <ModuleDetailTab detailData={data} />
        </Spin>
      </Modal> */}
      <Modal
        maskClosable={false}
        footer=""
        title="模块明细"
        width="90%"
        visible={moduleDetailVisible}
        onCancel={() => setModuleDetailVisible(false)}
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <ModuleDetailTable
            libId={libId}
            moduleId={tableSelectRows.map((item) => {
              return item.moduleId
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

export default ModulesProperty
