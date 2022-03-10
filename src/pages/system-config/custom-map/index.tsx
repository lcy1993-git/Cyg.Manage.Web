import React, { useRef, useState } from 'react'
import { Button, Modal, Form, message, Input } from 'antd'
import { EditOutlined, EyeOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import PageCommonWrap from '@/components/page-common-wrap'
import {
  getUserFeedBackDetail,
  addUserFeedBackItem,
  replyTheFeedback,
} from '@/services/personnel-config/feedback'
import GeneralTable from '@/components/general-table'
import moment from 'moment'
import { Spin } from 'antd'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import styles from './index.less'
import TableSearch from '@/components/table-search'
import ModalConfirm from '@/components/modal-confirm'
import MapSourceForm from './components/add-edit-form'
import { isArray } from '@umijs/deps/compiled/lodash'

const { Search } = Input

const CustomMap: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [clickId, setClickId] = useState<string>('')
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  //数据修改，局部刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh()
    }
  }

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="258px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入地图源名称"
          />
        </TableSearch>
      </div>
    )
  }

  const feedBackColumns = [
    {
      title: '序号',
      dataIndex: 'categoryText',
      index: 'categoryText',
      width: 120,
    },
    {
      title: '地图源名称',
      dataIndex: 'title',
      index: 'title',
      width: 140,
    },
    {
      title: '地址',
      dataIndex: 'lastProcessDate',
      index: 'lastProcessDate',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      },
    },
    {
      title: '最小级别',
      dataIndex: 'processStatusText',
      index: 'processStatusText',
      width: 170,
    },
    {
      title: '最大级别',
      dataIndex: 'createdOn',
      index: 'createdOn',
      render: (text: string) => {
        return <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : ''}</span>
      },
    },
    {
      title: '启用状态',
      dataIndex: 'processStatusText',
      index: 'processStatusText',
      width: 170,
    },
  ]

  const sureDeleteData = () => {}

  const importEvent = () => {}

  const editEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }

    const editData = tableSelectRows[0]
    const editDataId = editData.id
    // const ApproveGroupData = await run(editDataId)
    setEditFormVisible(true)
    // const users = ApproveGroupData.users?.map((item: any) => item.value)
    // setEditFormVisible(true)
    // // setEditPersonUserIds(users)
    // editForm.setFieldsValue({
    //   name: ApproveGroupData.name,
    //   userId: ApproveGroupData.userId,
    //   userIds: users,
    //   remark: ApproveGroupData.remark,
    // })
  }

  const userFeedBackButton = () => {
    return (
      <>
        {buttonJurisdictionArray?.includes('add-custom-map') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('edit-custom-map') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('delete-custom-map') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
        {buttonJurisdictionArray?.includes('import-custom-map') && (
          <Button className="mr7" onClick={() => importEvent()}>
            <ImportOutlined />
            导入
          </Button>
        )}
      </>
    )
  }

  const addEvent = async () => {
    setAddFormVisible(true)
  }

  const sureAddMapSource = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          SourceType: 1,
          category: '',
          title: '',
          phone: '',
          describe: '',
        },
        value
      )
      await addUserFeedBackItem(submitInfo)
      tableFresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  const sureEditMapSource = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }

    editForm.validateFields().then(async (values) => {
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        noPaging={true}
        requestSource="common"
        ref={tableRef}
        tableTitle="地图源配置"
        columns={feedBackColumns}
        getSelectData={(data) => setTableSelectRows(data)}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={userFeedBackButton}
        url="/Feedback/GetList"
      />
      <Modal
        maskClosable={false}
        title="添加地图源"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMapSource()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <MapSourceForm addForm={addForm} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑地图源"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditMapSource()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <MapSourceForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  )
}

export default CustomMap
