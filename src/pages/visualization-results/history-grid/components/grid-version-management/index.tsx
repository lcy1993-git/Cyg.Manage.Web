import { HistoryGridVersion } from '@/pages/visualization-results/components/history-version-management'
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined'

import { useMount } from 'ahooks'
import { Button, Checkbox, Input, Modal, Space, Table } from 'antd'
import moment, { Moment } from 'moment'
import { ChangeEventHandler, FC, useEffect, useState } from 'react'
import { DeleteGridVersions, getAllGridVersions } from '../../service'
import styles from './index.less'
interface Props {
  onClose: () => void
}
const GridVersionManagement: FC<Props> = (props) => {
  const { onClose } = props
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [showDelete, isShowDelete] = useState<boolean>(true)
  const [list, setList] = useState<HistoryGridVersion[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [password, setPassword] = useState<string>('')
  const [row, setRow] = useState<HistoryGridVersion>({} as HistoryGridVersion)
  const passWordChange = (e: ChangeEventHandler<HTMLInputElement>) => {
    // @ts-ignore
    setPassword(e?.target?.value)
  }
  const confirmDelete = async () => {
    await DeleteGridVersions(row?.id, password)
    setPasswordVisible(false)
    setRow({})
    await getHistoryList(showDelete)
  }
  const onDelete = (row: HistoryGridVersion) => {
    setRow(row)
    setPasswordVisible(true)
  }
  const columns = [
    {
      title: '序号',
      width: 50,
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      fixed: 'left',
      render: (text: any, record: any, idx: number) => {
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
              <Button type={'text'} onClick={() => onDelete(row)} danger>
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
      <Modal title="版本管理" visible={true} width={800} onCancel={onClose} onOk={onClose}>
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
      <Modal
        visible={passwordVisible}
        closeIcon={<></>}
        width={400}
        footer={null}
        onCancel={() => setPasswordVisible(false)}
        onOk={confirmDelete}
      >
        <div style={{ display: 'flex' }}>
          <ExclamationCircleOutlined style={{ color: '#FFC400', fontSize: '20px' }} />
          <div style={{ marginLeft: '6px' }}>
            此操作将会删除该条历史版本记录相关网架数据,删除后将不可恢复,请输入密码确认删除。
            <Input
              placeholder={'请输入密码'}
              onChange={passWordChange}
              style={{ marginTop: 10, width: '250px' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '16px' }}>
          <Space>
            <Button onClick={() => setPasswordVisible(false)}>取消</Button>
            <Button onClick={confirmDelete} type={'primary'}>
              确认
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  )
}

export default GridVersionManagement
