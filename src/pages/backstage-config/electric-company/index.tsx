import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { Input, Button, Modal, Form, Popconfirm, message, Spin } from 'antd'
import React, { useMemo, useState } from 'react'
import ElectricCompanyForm from './components/add-edit-form'
import styles from './index.less'
import { useRequest } from 'ahooks'
import {
  getElectricCompanyDetail,
  addElectricCompanyItem,
  updateElectricityCompanyItem,
  deleteElectricityCompanyItem,
} from '@/services/system-config/electric-company'
import { isArray } from 'lodash'
import UrlSelect from '@/components/url-select'
import TableImportButton from '@/components/table-import-button'
import TableExportButton from '@/components/table-export-button'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { getCityAreas } from '@/services/project-management/all-project'

const { Search } = Input

const ElectricCompany: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [ids] = useState<string[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [city, setCity] = useState<any>([])
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getElectricCompanyDetail, {
    manual: true,
  })

  const { data: cityData } = useRequest(() => getCityAreas(), {
    onSuccess: () => {
      if (cityData) {
        setCity(cityData.data)
      }
    },
  })

  const provinceData = useMemo(() => {
    const newProvinceData = city.map((item: any) => {
      return {
        label: item.text,
        value: item.id,
        children: item.children,
      }
    })
    return [{ label: '-全部-', value: '', children: [] }, ...newProvinceData]
  }, [JSON.stringify(city)])

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入公司信息"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="选择区域" width="260px">
          <UrlSelect
            style={{ width: '200px' }}
            showSearch
            titlekey="label"
            defaultData={provinceData}
            valuekey="value"
            placeholder="请选择"
            onChange={(value: any) => searchBySelectProvince(value)}
          />
        </TableSearch>
      </div>
    )
  }

  //选择省份onChange事件
  const searchBySelectProvince = (value: any) => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        provinceId: value,
      })
    }
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    await deleteElectricityCompanyItem(editDataId)
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
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
      dataIndex: 'id',
      index: 'id',
      title: '公司编号',
      width: 150,
    },
    {
      dataIndex: 'provinceName',
      index: 'provinceName',
      title: '区域',
      width: 150,
    },
    {
      dataIndex: 'companyName',
      index: 'companyName',
      title: '所属公司',
      width: 200,
    },
    {
      dataIndex: 'countyCompany',
      index: 'countyCompany',
      title: '所属县公司',
      width: 200,
    },
    {
      dataIndex: 'powerSupply',
      index: 'powerSupply',
      title: '供电所/班组',
      width: 200,
    },
  ]

  //添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddElectricCompany = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          province: '',
          companyName: '',
          countyCompany: '',
          powerSupply: '',
        },
        value
      )
      await addElectricCompanyItem(submitInfo)
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
    const ElectricCompanyData = await run(editDataId)

    editForm.setFieldsValue(ElectricCompanyData)
  }

  const sureEditAuthorization = () => {
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
          companyName: editData.companyName,
          countyCompany: editData.countyCompany,
          powerSupply: editData.powerSupply,
        },
        values
      )
      await updateElectricityCompanyItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  tableSelectRows.map((item: any) => {
    ids.push(item.id)
  })

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('add-electric-company') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('edit-electric-company') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        <Popconfirm
          title="您确定要删除该条数据?"
          onConfirm={sureDeleteData}
          okText="确认"
          cancelText="取消"
          // disabled
        >
          {buttonJurisdictionArray?.includes('delete-electric-company') && (
            <Button className="mr7">
              <DeleteOutlined />
              删除
            </Button>
          )}
        </Popconfirm>
        {buttonJurisdictionArray?.includes('import-electric-company') && (
          <TableImportButton className={styles.importBtn} importUrl="/ElectricityCompany/Import" />
        )}
        {buttonJurisdictionArray?.includes('export-electric-company') && (
          <TableExportButton selectIds={ids} exportUrl="/ElectricityCompany/Export" />
        )}
      </div>
    )
  }

  const titleSlotElement = () => {
    return <div className={styles.routeComponent}></div>
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        titleSlot={titleSlotElement}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        url="/ElectricityCompany/GetPagedList"
        tableTitle="电力公司"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-公司"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddElectricCompany()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <ElectricCompanyForm province={provinceData} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-公司"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        destroyOnClose
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <ElectricCompanyForm province={provinceData} />
          </Spin>
        </Form>
      </Modal>
    </PageCommonWrap>
  )
}

export default ElectricCompany
