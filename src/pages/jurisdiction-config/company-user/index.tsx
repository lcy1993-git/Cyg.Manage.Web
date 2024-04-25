import CommonTitle from '@/components/common-title'
import CyTag from '@/components/cy-tag'
import EnumSelect from '@/components/enum-select'
import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
// import BatchAddCompanyUser from './components/batch-add-form';
import TableStatus from '@/components/table-status'
import { useLayoutStore } from '@/layouts/context'
import { baseUrl } from '@/services/common'
import { getTreeSelectData } from '@/services/operation-config/company-group'
import {
  addCompanyUserItem,
  getCompanyUserDetail,
  // batchAddCompanyUserItem,
  getCurrentCompanyInfo,
  resetItemPwd,
  updateCompanyUserItem,
  updateItemStatus,
} from '@/services/personnel-config/company-user'
import { BelongManageEnum } from '@/services/personnel-config/manage-user'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { handleSM2Crypto, uploadAuditLog } from '@/utils/utils'
import { EditOutlined, PlusOutlined, ReloadOutlined, SwapOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import moment from 'moment'
import uuid from 'node-uuid'
import React, { useMemo, useRef, useState } from 'react'
import { history } from 'umi'
import AccreditStatistic from './components/accredit-statistic'
import CompanyUserForm from './components/add-edit-form'
import ResetPasswordForm from './components/reset-form'
import styles from './index.less'

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

const CompanyUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<object | object[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [status, setStatus] = useState<number>(0)
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)

  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false)
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const isOpenReview = localStorage.getItem('isOpenReview')

  const { data, run, loading } = useRequest(getCompanyUserDetail, {
    manual: true,
  })

  const { data: selectTreeData = [], run: getSelectTreeData } = useRequest(getTreeSelectData, {
    manual: true,
  })

  const { data: accreditData, run: getAccreditData } = useRequest(() => getCurrentCompanyInfo())

  const handleData = useMemo(() => {
    if (accreditData) {
      return accreditData.skus.map((item: any) => {
        return { key: item.key.value, value: item.value }
      })
    }
    return
  }, [accreditData])

  const buttonJurisdictionArray: string | any[] = useGetButtonJurisdictionArray()
  //@ts-ignore
  const { id } = JSON.parse(window.localStorage.getItem('userInfo'))

  const { workHandoverFlag } = useLayoutStore()

  const rightButton = () => {
    return (
      <div>
        {/* {buttonJurisdictionArray?.includes('company-user-batch-add') && (
          <Button type="primary" className="mr7" onClick={() => batchAddEvent()}>
            <PlusOutlined />
            批量添加
          </Button>
        )} */}
        {buttonJurisdictionArray?.includes('company-user-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-user-edit') && (
          <Button className="mr7" onClick={() => editEvent()} disabled={isCurrentUser}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('company-user-reset-password') && (
          <Button className="mr7" onClick={() => resetEvent()} disabled={isCurrentUser}>
            <ReloadOutlined />
            重置密码
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-user-work-handover') && (
          <Button
            onClick={() => {
              !workHandoverFlag
                ? handoverEvent()
                : message.error('当前已打开“工作交接”界面，是否关闭并打开新的工作交接界面')
            }}
          >
            <SwapOutlined />
            工作交接
          </Button>
        )}
      </div>
    )
  }

  //工作交接跳转
  const handoverEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择需要工作交接的用户')
      return
    }
    const userId = tableSelectRows[0].id
    const name = encodeURI(tableSelectRows[0].name) //中文转码处理
    const userName = tableSelectRows[0].userName
    history.push(
      `/jurisdiction-config/work-handover?id=${userId}&name=${name}&userName=${userName}`
    )
  }

  //数据修改刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
      getAccreditData()
    }
  }

  const resetEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择需要重置密码的用户')
      return
    }

    const userId = tableSelectRows[0].id
    if (userId === id) {
      setIsCurrentUser(true)
      message.error('没有对当前登录账号执行此操作的权限')
      return
    }
    setResetFormVisible(true)
  }

  //重置密码
  const resetPwd = async () => {
    editForm.validateFields().then(async (values) => {
      const editData = tableSelectRows[0]
      const editDataId = editData.id
      const newPassword = Object.assign({ id: editDataId, pwd: handleSM2Crypto(values.pwd) })
      await resetItemPwd(newPassword)

      uploadAuditLog(
        [
          {
            auditType: 1,
            eventType: 4,
            operationDataId: editData.userName,
            operationDataName: editData.name,
            eventDetailType: '账号密码修改',
            executionResult: '成功',

            auditLevel: 2,
            serviceAdress: `${baseUrl.project}/CompanyUser/ResetPwd`,
          },
        ],
        true
      )
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      setResetFormVisible(false)
    })
  }

  const addEvent = async () => {
    await getSelectTreeData()
    setAddFormVisible(true)
  }

  const sureAddCompanyUserItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          pwd: '',
          groupIds: [],
          email: '',
          name: '',
          idNumber: '',
        },
        value
      )
      await addCompanyUserItem(submitInfo)

      uploadAuditLog([
        {
          auditType: 1,
          eventType: 3,
          eventDetailType: '新建',
          executionResult: '成功',

          auditLevel: 2,
          serviceAdress: `${baseUrl.project}/CompanyUser/Create`,
        },
      ])
      refresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  // const batchAddEvent = async () => {
  //   await getSelectTreeData();
  //   setBatchAddFormVisible(true);
  // };
  // const sureBatchAddCompanyUser = () => {
  //   batchAddForm.validateFields().then(async (values) => {
  //     await batchAddCompanyUserItem({ ...values });
  //     message.success('批量增加成功');
  //     refresh();
  //     setBatchAddFormVisible(false);
  //   });
  // };
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const selectId = tableSelectRows[0].id

    if (selectId === id) {
      setIsCurrentUser(true)
      message.error('没有对当前登录账号执行此操作的权限')
      return
    }

    const editData = tableSelectRows[0]
    const editDataId = editData.id

    await getSelectTreeData()
    setEditFormVisible(true)

    const ManageUserData = await run(editDataId)

    editForm.setFieldsValue({
      ...ManageUserData,
      groupIds: (ManageUserData.comapnyGroups ?? []).map((item: any) => item.value),
      userStatus: String(ManageUserData.userStatus),
      clientCategorys: (ManageUserData.authorizeClientList ?? [])
        .map((item: any) => item.value)
        .filter((item: any) => item > 1),
      // IsCompanyAdmin: ManageUserData.IsCompanyAdmin ? ManageUserData.IsCompanyAdmin : false,
    })
  }

  const sureEditCompanyUser = () => {
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          email: editData.email,
          idNumber: editData.idNumber,
        },
        values
      )
      await updateCompanyUserItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  //数据改变状态
  const updateStatus = async (record: any) => {
    await updateItemStatus(record.id)
    if (record.userStatusText === '启用') {
      uploadAuditLog([
        {
          auditType: 1,
          eventType: 3,
          eventDetailType: '休眠',
          executionResult: '成功',
          auditLevel: 2,
          serviceAdress: `${baseUrl.project}/CompanyUser/ChangeState`,
        },
      ])
    } else if (record.userStatusText === '休眠') {
      uploadAuditLog([
        {
          auditType: 1,
          eventType: 3,
          eventDetailType: '启用',
          executionResult: '成功',
          auditLevel: 2,
          serviceAdress: `${baseUrl.project}/CompanyUser/ChangeState`,
        },
      ])
    }

    refresh()
    message.success('状态修改成功')
  }

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      index: 'userName',
      width: '7%',
    },

    {
      title: '姓名',
      dataIndex: 'name',
      index: 'name',
      width: '10%',
      onCell: () => {
        return {
          style: {
            whiteSpace: 'nowrap' as 'nowrap',
          },
        }
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      index: 'phone',
      width: '8%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      index: 'email',
      width: '9%',
    },
    {
      title: '部组',
      dataIndex: 'comapnyGroups',
      index: 'comapnyGroups',
      render: (text: any, record: any) => {
        const { comapnyGroups } = record
        return (comapnyGroups ?? []).map((item: any) => {
          return (
            <CyTag key={uuid.v1()} className="mr7">
              {item.text}
            </CyTag>
          )
        })
      },
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      index: 'userStatus',
      width: '6%',
      // align: 'center',
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('company-user-start-using') &&
            !record.isCurrentUser ? (
              <>
                <span
                  style={{ cursor: 'pointer' }}
                  className={record.userStatus === 1 ? 'colorPrimary' : 'colorGray'}
                  onClick={() => updateStatus(record)}
                >
                  {record.userStatusText}
                </span>
              </>
            ) : (
              <span>{record.userStatusText}</span>
            )}
          </>
        )
      },
    },
    {
      title: '授权端口',
      dataIndex: 'authorizeClient',
      index: 'authorizeClient',
      width: '18%',
      render: (text: any, record: any) => {
        const { authorizeClientTexts } = record

        const element = (authorizeClientTexts ?? []).map((item: string) => {
          return (
            <TableStatus
              className="mr7"
              color={record.userStatus === 1 ? mapColor[item] ?? 'gray' : 'gray'}
              key={uuid.v1()}
            >
              {item}
            </TableStatus>
          )
        })
        return <>{element}</>
      },
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      index: 'lastLoginIp',
      width: '6%',
    },
    {
      title: '最后登录日期',
      dataIndex: 'lastLoginDate',
      index: 'lastLoginDate',
      width: '7%',
      render: (text: any, record: any) => {
        return record.lastLoginDate ? moment(record.lastLoginDate).format('YYYY-MM-DD') : null
      },
    },
  ]

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const searchByStatus = (value: any) => {
    setStatus(value)
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        userStatus: value,
      })
    }
  }

  const leftSearch = () => {
    return (
      <div className={styles.search}>
        <TableSearch width="248px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="请输入用户信息"
            enterButton
          />
        </TableSearch>
        <TableSearch label="状态" width="200px" marginLeft="20px">
          <EnumSelect
            enumList={BelongManageEnum}
            onChange={(value: any) => searchByStatus(value)}
            placeholder="-全部-"
          />
        </TableSearch>
      </div>
    )
  }

  const addModalCloseEvent = () => {
    setAddFormVisible(false)
    addForm.resetFields()
  }

  // const batchAddCloseEvent = () => {
  //   setBatchAddFormVisible(false)
  //   batchAddForm.resetFields()
  // }

  //判断当前数据
  const singleValues = (value: number) => {
    return handleData && handleData.filter((item: any) => item.key === value)[0]?.value
  }

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.companyUser}>
        <div className={styles.accreditNumber}>
          <div className="flex1">
            <div className={styles.accreditTitle}>
              <CommonTitle noPadding={true}>授权数</CommonTitle>
            </div>
            <div className="flex">
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="勘察端" icon="prospect" accreditData={singleValues(4)} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="设计端" icon="design" accreditData={singleValues(8)} />
              </div>
              {Number(isOpenReview) === 1 && (
                <>
                  <div className={styles.accreditStatisticItem}>
                    <AccreditStatistic
                      label="技经端"
                      icon="skillBy"
                      accreditData={singleValues(32)}
                    />
                  </div>
                  <div className={styles.accreditStatisticItem}>
                    <AccreditStatistic
                      label="评审端"
                      icon="review"
                      accreditData={singleValues(16)}
                    />
                  </div>
                </>
              )}

              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="管理端" icon="manage" accreditData={singleValues(2)} />
              </div>

              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic
                  label="勘察端(手机版)"
                  icon="prospect"
                  accreditData={singleValues(64)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.userTable}>
          <GeneralTable
            ref={tableRef}
            buttonRightContentSlot={rightButton}
            buttonLeftContentSlot={leftSearch}
            getSelectData={(data) => {
              setIsCurrentUser(false)
              setTableSelectRows(data)
            }}
            tableTitle="用户账号"
            url="/CompanyUser/GetPagedList"
            columns={columns}
            extractParams={{
              keyWord: searchKeyWord,
              userStatus: status,
            }}
          />
        </div>
      </div>

      <Modal
        maskClosable={false}
        title="添加-用户账号"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyUserItem()}
        onCancel={() => addModalCloseEvent()}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CompanyUserForm treeData={selectTreeData} type="add" />
        </Form>
      </Modal>
      {/* <Modal
        maskClosable={false}
        title="批量添加-用户账号"
        width="680px"
        visible={batchAddFormVisible}
        okText="确认"
        onOk={() => sureBatchAddCompanyUser()}
        onCancel={() => batchAddCloseEvent()}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={batchAddForm} preserve={false}>
          <BatchAddCompanyUser treeData={selectTreeData} />
        </Form>
      </Modal> */}
      <Modal
        maskClosable={false}
        title="编辑-用户账号"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyUser()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <CompanyUserForm treeData={selectTreeData} />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="重置密码"
        width="680px"
        visible={resetFormVisible}
        okText="确认"
        onOk={() => resetPwd()}
        onCancel={() => setResetFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <ResetPasswordForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  )
}

export default CompanyUser
