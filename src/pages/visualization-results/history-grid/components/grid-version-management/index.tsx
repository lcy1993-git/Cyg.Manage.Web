import { HistoryGridVersion } from '@/pages/visualization-results/components/history-version-management'
import { ExclamationCircleOutlined } from '@ant-design/icons/lib/icons'
import { useMount } from 'ahooks'
import { Button, Checkbox, Input, Modal, Table } from 'antd'
import moment, { Moment } from 'moment'
import { FocusEventHandler, useEffect, useState } from 'react'
import { DeleteGridVersions, getAllGridVersions } from '../../service'
import styles from './index.less'

const GridVersionManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const [showDelete, isShowDelete] = useState<boolean>(true)
  const [list, setList] = useState<HistoryGridVersion[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [password, setPassword] = useState<string>('')
  const passWordBlur = (e: FocusEventHandler<HTMLInputElement>) => {
    e?.target?.value && setPassword(e?.target?.value)
  }
  const confirmDelete = async (id: string) => {
    await DeleteGridVersions(id, password)
  }
  const handleDelete = (row: HistoryGridVersion) => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          此操作将会删除该条历史版本记录相关网架数据,删除后将不可恢复,请输入密码确认删除。
          <Input placeholder={'请输入密码'} onBlur={passWordBlur} style={{ marginTop: 10 }} />
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      onOk: () => confirmDelete(row.id),
    })
  }
  const columns = [
    {
      title: '序号',
      width: 50,
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      fixed: 'left',
      render: (text, record, idx: number) => {
        return <>{idx + 1}</>
      },
    },
    {
      title: '时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text: Moment) => {
        return moment(text).format('YYYY.MM.DD HH:mm:ss')
      },
    },
    {
      title: '创建人',
      width: 70,
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      dataIndex: 'address',
      key: 'address',
      title: '',
      align: 'center',
      render: (index: number, row: HistoryGridVersion) => {
        return (
          <div>
            {row?.isDeleted ? (
              <span style={{ color: '#777777' }}>已删除</span>
            ) : (
              <Button type={'text'} onClick={() => handleDelete(row)} danger>
                <span style={{ textDecoration: 'underline' }}>删除</span>
              </Button>
            )}
          </div>
        )
      },
    },
  ]
  const getHistoryList = async (del: boolean) => {
    const res = await getAllGridVersions(del)
    res?.content && setList(res.content)
  }
  const pageChange = (val: any) => {
    setPageSize(val.pageSize)
  }
  useMount(async () => {
    await getHistoryList(showDelete)
  })
  useEffect(() => {
    getHistoryList(showDelete)
  }, [showDelete])
  return (
    <div className={styles.versionManageBox}>
      <Modal
        title="版本管理"
        visible={isModalVisible}
        width={800}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
      >
        <div style={{ marginBottom: '10px' }}>
          <Checkbox onChange={() => isShowDelete(!showDelete)} checked={showDelete}>
            显示已删除
          </Checkbox>
        </div>
        <Table
          dataSource={list}
          size={'small'}
          bordered
          onChange={pageChange}
          pagination={{
            pageSize: pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
          columns={columns}
        />
      </Modal>
    </div>
  )
}

export default GridVersionManagement
