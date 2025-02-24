import React, { useRef, useState } from 'react'
import { Button, Modal, Form, message, Switch, Input, Tooltip } from 'antd'
import {
  ApartmentOutlined,
  EditOutlined,
  PlusOutlined,
  ShareAltOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import PageCommonWrap from '@/components/page-common-wrap'
import {
  updateCompanyManageItem,
  addCompanyManageItem,
  getCompanyManageDetail,
  getTreeSelectData,
  changeCompanyStatus,
  setAdminUser,
} from '@/services/jurisdiction-config/company-manage'
import { isArray } from 'lodash'
import CompanyManageForm from './components/add-form'
import EditCompanyManageForm from './components/edit-form'
import TableStatus from '@/components/table-status'
import uuid from 'node-uuid'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import moment from 'moment'
import UnitConfig from './components/unit-config'
import GeneralTable from '@/components/general-table'
import CompanyShare from './components/company-share'
import TableSearch from '@/components/table-search'
import AddAdminForm from './components/add-admin'

const { Search } = Input

const mapColor = {
  无: 'gray',
  管理端: 'greenOne',
  勘察端: 'greenTwo',
  评审端: 'greenThree',
  技经端: 'greenFour',
  设计端: 'greenFive',
  '勘察端(手机版)': 'greenSix',
}

const CompanyManage: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<object | object[]>([])
  const [currentCompanyData, setCurrentCompanyData] = useState<object[]>([])
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [unitConfigVisible, setUnitConfigVisible] = useState<boolean>(false)
  const [companyShareVisible, setCompanyShareVisible] = useState<boolean>(false)
  const [addAdminVisible, setAddAdminVisible] = useState<boolean>(false)
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [companyId, setCompanyId] = useState<string>('')

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [adminForm] = Form.useForm()

  const { data: selectTreeData = [] } = useRequest(getTreeSelectData, {
    manual: true,
  })

  const { data, run } = useRequest(getCompanyManageDetail, {
    manual: true,
  })

  //数据修改，局部刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh()
    }
  }

  const companyTableColumns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      index: 'name',
      width: 320,
    },
    {
      title: '管理员账号',
      dataIndex: 'adminUserName',
      index: 'adminUserName',
      width: 180,
      render: (text: any, record: any) => {
        return record.adminUserName ? (
          record.adminUserName
        ) : (
          <>
            <Tooltip title="设置公司管理员" placement="left">
              <UserAddOutlined
                style={{ cursor: 'pointer', color: '#0e7b3b' }}
                onClick={() => {
                  setCompanyId(record.id)
                  setAddAdminVisible(true)
                }}
              />
            </Tooltip>
          </>
        )
      },
    },
    {
      title: '授权账户数',
      dataIndex: 'skus',
      index: 'skus',
      render: (text: any, record: any) => {
        const { skus } = record
        const element = (skus ?? []).map((item: any) => {
          return (
            <TableStatus className="mr7" color={mapColor[item.key.text] ?? 'gray'} key={uuid.v1()}>
              {item.key.text}（{item.value.totalQty}）
            </TableStatus>
          )
        })
        return <>{element}</>
      },
    },
    // onChange={() => updateStatus(record.id)}
    {
      title: '状态',
      dataIndex: 'isEnabled',
      index: 'isEnabled',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = !record.isEnabled
        return (
          <>
            {buttonJurisdictionArray?.includes('company-manage-state') &&
              (record.isEnabled === true ? (
                <>
                  <Switch
                    checked={!isChecked}
                    onChange={() => changeStateEvent(record.id, isChecked)}
                  />
                  <span className="formSwitchOpenTip">启用</span>
                </>
              ) : (
                <>
                  <Switch onChange={() => changeStateEvent(record.id, isChecked)} checked={false} />
                  <span className="formSwitchCloseTip">禁用</span>
                </>
              ))}
            {!buttonJurisdictionArray?.includes('company-manage-state') &&
              (!isChecked ? <span>启用</span> : <span>禁用</span>)}
          </>
        )
      },
    },
    {
      title: '授权期限',
      dataIndex: 'authorityExpireDate',
      index: 'authorityExpireDate',
      width: 140,
      render: (text: any) => {
        return text ? moment(text).format('YYYY-MM-DD') : '-'
      },
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      index: 'address',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
    },
  ]

  const changeStateEvent = async (id: string, isChecked: boolean) => {
    // 这里判断一下时间是否过期
    // 并且需要判断是否是从关闭到开启状态
    const clickData = await run(id)
    const nowDate = moment(new Date().getDate())

    if (nowDate.isAfter(moment(clickData?.authorityExpireDate))) {
      message.error('当前授权已超期，请修改授权期限')
    } else {
      await changeCompanyStatus(id, isChecked)
      tableFresh()
      message.success('状态修改成功')
    }
  }

  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const searchComponent = () => {
    return (
      <TableSearch width="263px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="请输入公司名称/管理员账号"
        />
      </TableSearch>
    )
  }

  const tableSearchEvent = () => {
    search()
  }

  const companyManageButton = () => {
    return (
      <>
        {buttonJurisdictionArray?.includes('company-manage-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-manage-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-manage-config') && (
          <Button className="mr7" onClick={() => unitConfigEvent()}>
            <ApartmentOutlined />
            协作单位配置
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-manage-share') && (
          <Button className="mr7" onClick={() => shareEvent()}>
            <ShareAltOutlined />
            共享一览表
          </Button>
        )}
      </>
    )
  }

  const unitConfigEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请勾选需要配置的公司')
      return
    }

    setUnitConfigVisible(true)
  }

  const shareEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请勾选需要配置的公司')
      return
    }

    setCompanyShareVisible(true)
  }

  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddAdminEvent = () => {
    adminForm.validateFields().then(async (values) => {
      const submitInfo = {
        companyId: companyId,
        userId: values.userId,
      }

      await setAdminUser(submitInfo)
      setAddAdminVisible(false)
      message.success('设置成功')
      adminForm.resetFields()
      tableFresh()
    })
  }

  const sureAddCompanyManageItem = () => {
    addForm.validateFields().then(async (value) => {
      const userSkuQtys = [
        { key: 4, value: value.prospect },
        { key: 8, value: value.design },
        { key: 32, value: value.skillBy },
        { key: 64, value: value.phone },
        { key: 16, value: value.review },
        { key: 2, value: value.manage },
      ]

      const submitInfo = {
        name: value.name,
        parentId: value.parentId,
        address: value.address,
        isEnabled: value.isEnabled,
        authorityExpireDate: value.authorityExpireDate,
        userSkuQtys,
        remark: value.remark,
      }

      await addCompanyManageItem(submitInfo)
      setAddFormVisible(false)
      message.success('添加成功')
      addForm.resetFields()
      tableFresh()
    })
  }

  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    const CompanyManageData = await run(editDataId)
    setCurrentCompanyData(CompanyManageData?.skus)
    setEditFormVisible(true)
    editForm.setFieldsValue({
      ...CompanyManageData,
      authorityExpireDate: CompanyManageData?.authorityExpireDate
        ? moment(CompanyManageData?.authorityExpireDate)
        : null,
    })
  }

  const sureEditCompanyManage = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请先选择一条数据进行编辑')
      return
    }
    const editData = data!

    editForm.validateFields().then(async (value) => {
      const userSkuQtys = [
        { key: 4, value: value.prospect },
        { key: 8, value: value.design },
        { key: 32, value: value.skillBy },
        { key: 64, value: value.phone },
        { key: 16, value: value.review },
        { key: 2, value: value.manage },
      ]
      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          address: editData.address,
          remark: editData.remark,
          isEnabled: editData.isEnabled,
          authorityExpireDate: editData.authorityExpireDate,
          userSkuQtys,
        },
        value
      )

      await updateCompanyManageItem(submitInfo)
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
      tableFresh()
    })
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        tableTitle="公司管理"
        columns={companyTableColumns}
        buttonRightContentSlot={companyManageButton}
        getSelectData={(data) => setTableSelectRows(data)}
        url="/Company/GetPagedList"
        buttonLeftContentSlot={searchComponent}
        extractParams={{ keyWord: searchKeyWord }}
      />
      <Modal
        maskClosable={false}
        title="添加-公司"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyManageItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CompanyManageForm treeData={selectTreeData} form={addForm} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-公司"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyManage()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <EditCompanyManageForm accreditNumber={currentCompanyData} form={editForm} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="设置-公司管理员"
        width="650px"
        visible={addAdminVisible}
        okText="确认"
        onOk={() => sureAddAdminEvent()}
        onCancel={() => setAddAdminVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={adminForm} preserve={false}>
          <AddAdminForm companyId={companyId} />
        </Form>
      </Modal>

      <UnitConfig
        visible={unitConfigVisible}
        onChange={setUnitConfigVisible}
        companyId={tableSelectRows[0]?.id}
      />
      <CompanyShare
        visible={companyShareVisible}
        onChange={setCompanyShareVisible}
        companyId={tableSelectRows[0]?.id}
      />
    </PageCommonWrap>
  )
}

export default CompanyManage
