import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { EditOutlined, PlusOutlined, PoweroffOutlined, ImportOutlined } from '@ant-design/icons'
import { Input, Button, Modal, Form, message, Spin } from 'antd'
import React, { useMemo, useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import {
  getWareHouseDetail,
  addWareHouseItem,
  updateWareHouseItem,
  deleteWareHouseItem,
  restartWareHouse,
} from '@/services/material-config/ware-house'
import { isArray } from 'lodash'
import WareHouseForm from './components/add-edit-form'
import WareHouseDetail from './components/detail-table'
import ImportWareHouse from './components/import-form'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import ModalConfirm from '@/components/modal-confirm'
import { getCityAreas } from '@/services/project-management/all-project'

const { Search } = Input

const WareHouse: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [currentSelectedId, setCurrentSelectedId] = useState<string>('')
  // const [selectedData, setSelectedData] = useState<object>({});
  const [checkDetailVisible, setCheckDetailVisible] = useState<boolean>(false)
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false)
  const [city, setCity] = useState<any>([])
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getWareHouseDetail, {
    manual: true,
  })

  const { data: cityData, run: getAreaData, loading: areaLoading } = useRequest(getCityAreas, {
    manual: true,
    onSuccess: () => {
      if (cityData) {
        setCity(cityData.data)
      }
    },
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
            placeholder="请输入物料利库信息"
            allowClear
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
      dataIndex: 'name',
      index: 'name',
      title: '名称',
      width: 220,
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('ware-house-check') && (
              <span onClick={() => checkDetail(record.id)} className={styles.checkWareHouse}>
                {record.name}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('ware-house-check') && <span>{record.name}</span>}
          </>
        )
      },
    },
    {
      dataIndex: 'provinceName',
      index: 'provinceName',
      title: '所在区域',
      width: 200,
    },

    {
      dataIndex: 'version',
      index: 'version',
      title: '版本',
      width: 140,
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 200,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
    },
  ]

  //添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddResourceLib = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          companyId: '',
          province: '',
          name: '',
          version: '',
          remark: '',
        },
        value
      )
      await addWareHouseItem(submitInfo)
      refresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  const reset = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.reset()
    }
  }

  const provinceData = useMemo(() => {
    const newProvinceData = city.map((item: any) => {
      return {
        label: item.shortName,
        value: item.id,
        children: item.children,
      }
    })
    return newProvinceData
  }, [JSON.stringify(city)])

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id
    setEditFormVisible(true)
    const ResourceLibData = await run(editDataId)
    await getAreaData()
    editForm.setFieldsValue(ResourceLibData)
  }

  const sureEditResourceLib = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          province: editData.province,
          name: editData.name,
          version: editData.version,
          remark: editData.remark,
        },
        values
      )
      await updateWareHouseItem(submitInfo)
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
      refresh()
      reset()
    })
  }

  //重启资源服务
  const restartLib = async () => {
    await restartWareHouse()
    message.success('操作成功')
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    await deleteWareHouseItem(editDataId)
    refresh()
    message.success('删除成功')
    setTableSelectRows([])
  }

  //查看详情
  const checkDetail = (id: string) => {
    setCurrentSelectedId(id)
    setCheckDetailVisible(true)
  }

  const importWareHouseEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行')
      return
    }
    setImportFormVisible(true)
  }

  const uploadFinishEvent = () => {
    refresh()
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('ware-house-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            创建
          </Button>
        )}

        {buttonJurisdictionArray?.includes('ware-house-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('ware-house-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}

        {buttonJurisdictionArray?.includes('ware-house-import') && (
          <Button className="mr7" onClick={() => importWareHouseEvent()}>
            <ImportOutlined />
            导入
          </Button>
        )}

        {buttonJurisdictionArray?.includes('ware-house-restart') && (
          <Button className="mr7" onClick={() => restartLib()}>
            <PoweroffOutlined />
            重启服务
          </Button>
        )}
      </div>
    )
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/WareHouse/GetPageList"
        tableTitle="物料利库管理"
        getSelectData={(data) => setTableSelectRows(data)}
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="创建-利库"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddResourceLib()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <WareHouseForm />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-利库"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditResourceLib()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={areaLoading}>
            <WareHouseForm provinceData={provinceData} />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        destroyOnClose
        title="查看利库物料详情"
        width="1500px"
        visible={checkDetailVisible}
        okText="确认"
        onCancel={() => setCheckDetailVisible(false)}
        cancelText="取消"
        bodyStyle={{ padding: '8px 24px 24px 24px' }}
      >
        <Spin spinning={loading}>
          <WareHouseDetail overviewId={currentSelectedId} />
        </Spin>
      </Modal>
      <ImportWareHouse
        province={tableSelectRows[0]?.province}
        provinceName={tableSelectRows[0]?.provinceName}
        overviewId={tableSelectRows[0]?.id}
        requestSource="resource"
        visible={importFormVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportFormVisible}
      />
    </PageCommonWrap>
  )
}

export default WareHouse
