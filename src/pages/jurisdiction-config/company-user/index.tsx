import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import {
  EditOutlined,
  LoginOutlined,
  PlusOutlined,
  ReloadOutlined,
  SwapOutlined,
} from '@ant-design/icons'
import { Button, Modal, Form, message, Input, Spin } from 'antd'
import React, { useMemo, useRef, useState } from 'react'
import CompanyUserForm from './components/add-edit-form'
import { isArray } from 'lodash'
import {
  getCompanyUserDetail,
  addCompanyUserItem,
  updateCompanyUserItem,
  updateItemStatus,
  resetItemPwd,
  // batchAddCompanyUserItem,
  getCurrentCompanyInfo,
  verifyPwd,
  companyUserDelete,
} from '@/services/personnel-config/company-user'
import { getTreeSelectData } from '@/services/operation-config/company-group'
import { useRequest } from 'ahooks'
import EnumSelect from '@/components/enum-select'
import { BelongManageEnum } from '@/services/personnel-config/manage-user'
import ResetPasswordForm from './components/reset-form'
import moment from 'moment'
import TableSearch from '@/components/table-search'
import styles from './index.less'
// import BatchAddCompanyUser from './components/batch-add-form';
import TableStatus from '@/components/table-status'
import uuid from 'node-uuid'
import CyTag from '@/components/cy-tag'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import CommonTitle from '@/components/common-title'
import AccreditStatistic from './components/accredit-statistic'
import { history } from 'umi'
import { useLayoutStore } from '@/layouts/context'
import { handleSM2Crypto, uploadAuditLog } from '@/utils/utils'
import { baseUrl } from '@/services/common'

const { Search } = Input

const mapColor = {
  无: 'gray',
  管理端: 'greenOne',
  勘察端: 'greenTwo',
  评审端: 'greenThree',
  技经端: 'greenFour',
  设计端: 'greenFive',
}

const CompanyUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<object | object[]>([])

  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [status, setStatus] = useState<number>(0)

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [unableVisible, setUnableVisible] = useState<boolean>(false)
  const [noticeVisible, setNoticeVisible] = useState<boolean>(false)
  const [passwordConfirmation, setPasswordConfirmation] = useState<boolean>(false)
  const [noticeMessage, setNoticeMessage] = useState<string>('账号注销后将无法恢复，请谨慎操作')
  const [passwordValue, setPasswordValue] = useState<string>('')
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false)
  const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

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
        return item.value
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
        {buttonJurisdictionArray?.includes('company-user-cancellation') && (
          <Button className="mr7" onClick={() => cancellation()} disabled={isCurrentUser}>
            <LoginOutlined />
            注销
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
    const name = tableSelectRows[0].name
    const userName = tableSelectRows[0].userName
    history.push({
      pathname: `/jurisdiction-config/work-handover?id=${userId}&&name=${name}&&userName=${userName}`,
    })
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
              record.userStatus === 1 ? (
                <>
                  {/* <Switch key={status} defaultChecked onChange={() => updateStatus(record.id)} /> */}
                  <span
                    style={{ cursor: 'pointer' }}
                    className="colorPrimary"
                    onClick={() => updateStatus(record)}
                  >
                    启用
                  </span>
                </>
              ) : record.userStatus === 2 ? (
                <>
                  {/* <Switch key={status} defaultChecked onChange={() => updateStatus(record.id)} /> */}
                  <span
                    style={{ cursor: 'pointer' }}
                    className="colorPrimary"
                    onClick={() => updateStatus(record)}
                  >
                    休眠
                  </span>
                </>
              ) : (
                <>
                  {/* <Switch
                    checked={false}
                    onChange={() => {
                      updateStatus(record.id);
                    }}
                  /> */}
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => updateStatus(record)}
                    className="colorRed"
                  >
                    注销
                  </span>
                </>
              )
            ) : record.userStatus === 1 ? (
              <span>已启用</span>
            ) : (
              <span>已禁用</span>
            )}
            {/* {!buttonJurisdictionArray?.includes('company-user-start-using') &&
              (record.userStatus === 1 ? <span>启用</span> : <span>禁用</span>)} */}
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
  // 注销按钮
  const cancellation = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择需要注销的用户')
      return
    }
    // TODO
    const user = tableSelectRows[0]
    if (user.userStatus === 3) {
      message.warning('该用户已经被注销')
      return
    }
    if (user.id === id) {
      setIsCurrentUser(true)
      message.error('没有对当前登录账号执行此操作的权限')
      return
    }
    setNoticeVisible(true)
  }
  // 弹窗注销按钮
  const toCancellation = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      return
    }
    const obj = { pwd: passwordValue }
    const res = await verifyPwd(obj)
    if (res) {
      const id = tableSelectRows[0].id
      await companyUserDelete(id)
      uploadAuditLog([
        {
          auditType: 1,
          eventType: 3,
          eventDetailType: '注销',
          executionResult: '成功',

          auditLevel: 2,
          serviceAdress: `${baseUrl.project}/CompanyUser/Delete`,
        },
      ])
      setPasswordConfirmation(false)
      message.success('注销成功')
      refresh()
    } else {
      setPasswordValue('')
      setNoticeMessage('密码输入有误，请重新输入')
    }
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
                <AccreditStatistic label="勘察端" icon="prospect" accreditData={handleData?.[1]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="设计端" icon="design" accreditData={handleData?.[2]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="技经端" icon="skillBy" accreditData={handleData?.[4]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="评审端" icon="review" accreditData={handleData?.[3]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="管理端" icon="manage" accreditData={handleData?.[0]} />
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
      <Modal
        maskClosable={false}
        title="提示"
        width="680px"
        visible={unableVisible}
        footer={false}
        onOk={() => resetPwd()}
        onCancel={() => setUnableVisible(false)}
        destroyOnClose
      >
        <div>!当前账号有未完成工作，无法注销</div>
      </Modal>
      <Modal
        maskClosable={false}
        title="提示"
        width="680px"
        visible={noticeVisible}
        footer={false}
        onOk={() => resetPwd()}
        onCancel={() => setUnableVisible(false)}
        destroyOnClose
      >
        <div>
          <div>注销账号前，请确认已完成工作交接</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <Button key="cancle" onClick={() => setNoticeVisible(false)}>
              取消
            </Button>
            <Button
              key="save"
              type="primary"
              onClick={() => {
                setNoticeVisible(false)
                setPasswordConfirmation(true)
              }}
              style={{ marginLeft: '16px' }}
            >
              下一步
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        maskClosable={false}
        title="密码确认"
        width="450px"
        visible={passwordConfirmation}
        footer={false}
        onOk={() => resetPwd()}
        onCancel={() => setPasswordConfirmation(false)}
        destroyOnClose
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100px', fontSize: '14px' }}>请输入密码</div>
            <Input
              style={{ width: '300px' }}
              value={passwordValue}
              type="password"
              onChange={(e) => {
                setPasswordValue(e.target.value)
              }}
            />
          </div>
          <div
            style={{
              marginLeft: '100px',
              marginTop: '16px',
              fontSize: '12px',
              color: '#e51515',
            }}
          >
            {noticeMessage}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
            <Button key="cancle" onClick={() => setPasswordConfirmation(false)}>
              取消
            </Button>
            <Button
              key="save"
              type="primary"
              onClick={() => toCancellation()}
              style={{ marginLeft: '16px' }}
            >
              注销
            </Button>
          </div>
        </div>
      </Modal>
    </PageCommonWrap>
  )
}

export default CompanyUser
