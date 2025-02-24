import { HistoryGridVersion } from '@/pages/visualization-results/components/history-version-management'
import { handleDecrypto } from '@/utils/utils'
import ExclamationCircleOutlined from '@ant-design/icons/lib/icons/ExclamationCircleOutlined'
import { useMount } from 'ahooks'
import { Button, Checkbox, Input, Modal, Space, Table } from 'antd'
import { message } from 'antd/es'
import { FC, useEffect, useState } from 'react'
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
  const passWordChange = (e: any) => {
    // @ts-ignore
    setPassword(e?.target?.value)
  }
  const confirmDelete = () => {
    DeleteGridVersions(row?.id, password).then((res) => {
      const decryRes = handleDecrypto(res)
      if (decryRes?.code === 200 && decryRes?.isSuccess) {
        setPasswordVisible(false)
        setRow({} as HistoryGridVersion)
        getHistoryList(showDelete)
        message.success('删除成功')
        setPassword('')
      } else if (decryRes?.code === 5000 && !decryRes?.isSuccess) {
        message.warning(decryRes?.message)
      } else if (typeof decryRes === 'string') {
        message.warning(decryRes)
      }
    })
  }
  const onDelete = (row: HistoryGridVersion) => {
    setPassword('')
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
      dataIndex: 'versionCode',
      key: 'versionCode',
      width: 150,
      // render: (text: Moment) => {
      //   return moment(text).format('YYYY.MM.DD HH:mm:ss')
      // },
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'creatorName',
      key: 'creatorName',
      render: (text: string | null, row: HistoryGridVersion) => {
        return row.creatorName || row.createdBy
      },
    },
    {
      title: '备注',
      width: 320,
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      dataIndex: 'address',
      key: 'address',
      title: '',
      width: 100,
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
    res && setList(res?.filter((item) => !item.isTemplate))
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
      <Modal title="版本管理" visible={true} width={900} onCancel={onClose} onOk={onClose}>
        <div style={{ marginBottom: '10px' }}>
          <Checkbox onChange={() => isShowDelete(!showDelete)} checked={showDelete}>
            <span style={{ color: '#8C8C8C' }}>显示已删除</span>
          </Checkbox>
        </div>
        <Table
          dataSource={list}
          size={'small'}
          bordered
          scroll={{
            y: 600,
          }}
          onChange={pageChange}
          pagination={{
            pageSize: pageSize,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
          // @ts-ignore
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
            此操作将会删除该条历史版本记录及相关网架数据，删除后将不可恢复，请输入密码确认删除。
            <Input
              placeholder={'请输入密码'}
              type={'password'}
              value={password}
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
