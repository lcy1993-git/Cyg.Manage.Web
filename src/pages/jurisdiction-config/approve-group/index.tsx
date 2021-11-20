import '@/assets/icon/iconfont.css'
import CyTag from '@/components/cy-tag'
import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { getUsersIds } from '@/pages/standard-config/info-manage/utils'
import {
  createApproveGroup,
  deleteApproveGroup,
  getApproveGroupById,
  modifyApproveGroup,
  updateApproveState,
} from '@/services/jurisdiction-config/approve-group'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin } from 'antd'
import { isArray } from 'lodash'
import uuid from 'node-uuid'
import React, { useState } from 'react'
import ApproveGroupForm from './components/add-edit-form'

const { Search } = Input

const ApproveGroup: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [addPersonArray, setAddPersonArray] = useState([])
  const [editPersonArray, setEditPersonArray] = useState([])
  const [editPersonUserIds, setEditPersonUserIds] = useState<any>([])
  const [groupId, setGroupId] = useState<string>('')
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()
  const { data, run, loading } = useRequest(getApproveGroupById, {
    manual: true,
  })

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      index: 'status',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = record.status
        return (
          <>
            {buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked === 2 ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                  onClick={async () => {
                    await updateApproveState({ id: record.id, isEnable: true })
                    tableFresh()
                  }}
                >
                  禁用
                </span>
              ) : (
                <span
                  onClick={async () => {
                    await updateApproveState({ id: record.id, isEnable: false })
                    tableFresh()
                  }}
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                >
                  启用
                </span>
              ))}
            {!buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked === 2 ? (
                <span style={{ cursor: 'pointer' }} className="colorRed">
                  禁用
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }} className="colorPrimary">
                  启用
                </span>
              ))}
          </>
        )
      },
    },
    {
      title: '审批责任人',
      dataIndex: 'userName',
      index: 'userName',
      width: 180,
    },
    {
      title: '成员',
      dataIndex: 'users',
      index: 'users',
      render: (text: any, record: any) => {
        const roles = record.users?.map((item: any) => {
          return (
            <CyTag className="mr7" key={uuid.v1()}>
              {item.text}
            </CyTag>
          )
        })

        return roles
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
      width: '30%',
    },
  ]

  const searchElement = () => {
    return (
      <div>
        <TableSearch width="248px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="请输入组别/人员名称"
            enterButton
          />
        </TableSearch>
      </div>
    )
  }

  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh()
    }
  }

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search()
    }
  }

  const sureDeleteData = async () => {
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    await deleteApproveGroup(editDataId)
    tableFresh()

    message.success('删除成功')
    setTableSelectRows([])
  }

  //添加
  const addEvent = async () => {
    setAddFormVisible(true)
  }

  const sureAddApproveGroup = () => {
    addForm.validateFields().then(async (value) => {
      const { userIds } = value
      const handleIds = addPersonArray.filter((item: any) => userIds?.includes(item.value))
      const finallyIds = getUsersIds(handleIds)
      const submitInfo = {
        ...value,
        userIds: finallyIds,
      }

      await createApproveGroup(submitInfo)
      tableFresh()
      message.success('添加成功')
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
    setGroupId(editDataId)
    const ApproveGroupData = await run(editDataId)

    const users = ApproveGroupData.users?.map((item: any) => item.value)
    setEditFormVisible(true)
    setEditPersonUserIds(users)
    editForm.setFieldsValue({
      name: ApproveGroupData.name,
      userId: ApproveGroupData.userId,
      remark: ApproveGroupData.remark,
    })
  }

  const sureEditApproveGroup = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const { userIds } = values
      const handleIds = editPersonArray.filter((item: any) => userIds?.includes(item.value))
      const finallyIds = getUsersIds(handleIds)

      const submitInfo = {
        id: editData.id,
        name: editData.name,
        remark: editData.remark,
        userId: editData.userId,
        ...values,
        userIds: finallyIds,
      }
      console.log(submitInfo, '555')

      await modifyApproveGroup(submitInfo)
      tableFresh()
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  const buttonElement = () => {
    return (
      <div>
        {buttonJurisdictionArray?.includes('approve-group-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('approve-group-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('approve-group-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
      </div>
    )
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchElement}
        buttonRightContentSlot={buttonElement}
        getSelectData={(data) => setTableSelectRows(data)}
        url="/ProjectApproveGroup/GetPagedList"
        columns={columns}
        tableTitle="立项审批管理"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-模板"
        width="40%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddApproveGroup()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={loading}>
          <Form form={addForm} preserve={false}>
            <ApproveGroupForm getPersonArray={(array) => setAddPersonArray(array)} />
          </Form>
        </Spin>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-模板"
        width="40%"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditApproveGroup()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <ApproveGroupForm
            groupId={groupId}
            editForm={editForm}
            personDefaultValue={editPersonUserIds}
            getPersonArray={(array) => setEditPersonArray(array)}
          />
        </Form>
      </Modal>
    </PageCommonWrap>
  )
}

export default ApproveGroup
