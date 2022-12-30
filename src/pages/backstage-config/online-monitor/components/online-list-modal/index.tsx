import EmptyTip from '@/components/empty-tip'
import { intervalTime } from '@/utils/utils'
import { useControllableValue } from 'ahooks'
import { Button, Modal, Table } from 'antd'
import moment from 'moment'
import { Dispatch, SetStateAction } from 'react'

interface OnlineListProps {
  type?: 'all' | 'admin' | 'survey' | 'design' | 'manage'
  visible?: boolean
  onChange?: Dispatch<SetStateAction<boolean>>
  data?: any
}

const OnlineListModal = (props: OnlineListProps) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { data, type } = props

  const currentType = () => {
    switch (type) {
      case 'all':
        return '全部用户'
      case 'admin':
        return '公司管理员'
      case 'survey':
        return '勘察端'
      case 'design':
        return '设计端'
      case 'manage':
        return '管理端'
      default:
        return
    }
  }
  const columns = [
    {
      dataIndex: 'userName',
      index: 'userName',
      title: '用户账号',
    },
    {
      dataIndex: 'companyName',
      index: 'companyName',
      title: '所属公司',
    },
    {
      dataIndex: 'onlineTime',
      index: 'onlineTime',
      title: '在线时长',
      render: (text: any, record: any) => {
        const { days, hours, minutes } = intervalTime(
          moment(record.onlineTime).format('YYYY/MM/DD HH:mm')
        )
        return `${days}天${hours}小时${minutes}分`
      },
      width: 180,
    },
  ]

  return (
    <Modal
      maskClosable={false}
      title={`查看在线人数[${currentType()}]`}
      width={1024}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          关闭
        </Button>,
      ]}
      onCancel={() => setState(false)}
    >
      <Table
        size="middle"
        locale={{
          emptyText: <EmptyTip className="pt20 pb20" description="暂无数据" />,
        }}
        dataSource={data}
        bordered={true}
        pagination={false}
        columns={columns}
      />
    </Modal>
  )
}

export default OnlineListModal
