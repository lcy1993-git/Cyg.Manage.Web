import styles from './index.less'
import { useState } from 'react'
import { Button, Checkbox, Input, Modal, Table } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons/lib/icons'

const GridVersionManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(true)
  const [showDelete, isShowDelete] = useState<boolean>(false)
  const dataSource = Array.from({ length: 27 }, (index) => {
    return {
      key: index,
      name: '胡彦斌',
      age: index,
      address: '西湖区湖底公园1号',
    }
  })
  const passWordBlur = () => {}
  const handleDelete = (row) => {
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          此操作将会删除该条历史版本记录相关网架数据,删除后将不可恢复,请输入密码确认删除。
          <Input placeholder={'请输入密码'} onBlur={passWordBlur} />
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
    })
  }
  const columns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '时间',
      dataIndex: 'age',
      key: 'age',
      className: styles.column,
    },
    {
      title: '创建人',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '备注',
      dataIndex: 'address',
      key: 'address',
    },
    {
      dataIndex: 'address',
      key: 'address',
      title: '',
      align: 'center',
      render: (row) => {
        return (
          <Button type={'text'} onClick={() => handleDelete(row)} danger>
            <span style={{ textDecoration: 'underline' }}>删除</span>
          </Button>
        )
      },
    },
  ]
  return (
    <div className={styles.versionManageBox}>
      <Modal
        title="版本管理"
        visible={isModalVisible}
        width={700}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
      >
        <div style={{ marginBottom: '10px' }}>
          <Checkbox onChange={() => isShowDelete(!showDelete)} checked={showDelete}>
            显示已删除
          </Checkbox>
        </div>
        <Table
          dataSource={dataSource}
          size={'small'}
          bordered
          pagination={{
            pageSize: 10,
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
