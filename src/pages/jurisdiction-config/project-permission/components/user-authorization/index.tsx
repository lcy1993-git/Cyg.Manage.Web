import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { Input, Button, message } from 'antd'
import React, { useRef, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { addAuthorize, removeAuthorize } from '@/services/jurisdiction-config/project-permission'
import ModalConfirm from '@/components/modal-confirm'

interface ExtractParams {
  groupId: string
}

interface UserAuthorizationProps {
  extractParams: ExtractParams
  onChange: () => void
}

const { Search } = Input

const UserPermissionAccredit: React.FC<UserAuthorizationProps> = (props) => {
  const tableRef = useRef<HTMLDivElement>(null)

  const { extractParams, onChange } = props

  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [selectRows, setSelectRows] = useState<any[]>([])

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      index: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      index: 'phone',
      width: 160,
    },

    {
      title: '姓名',
      dataIndex: 'name',
      index: 'namec',
      width: 220,
    },

    {
      title: '授权状态',
      dataIndex: 'isAuthorized',
      index: 'isAuthorized',
      width: 120,
      render: (text: string, record: any) => {
        if (record.isAuthorized) {
          return <span className="colorPrimary">已授权</span>
        } else {
          return <span className="colorRed">未授权</span>
        }
      },
    },
  ]

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh()
    }
  }

  const tableLeftSlot = (
    <TableSearch width="248px">
      <Search
        value={searchKeyWord}
        onChange={(e) => setSearchKeyWord(e.target.value)}
        onSearch={() => search()}
        enterButton
        placeholder="请输入用户信息"
      />
    </TableSearch>
  )

  const batchRemoveAuthorizationEvent = async () => {
    if (selectRows.length === 0) {
      message.error('请至少选中一条数据')
      return
    }

    if (selectRows.find((item) => item.isAuthorized === true)) {
      const batchObjectIds = selectRows.map((item) => item.id)
      const { groupId } = extractParams

      await removeAuthorize({
        groupId,
        objectIds: batchObjectIds,
      })
      message.success('授权移除成功')
      reset()
      refresh()
      onChange?.()
    } else {
      message.error('选中的用户尚未授权')
      return
    }
  }

  const tableRightSlot = (
    <>
      <Button className="mr7" type="primary" onClick={() => batchAddAuthorizationEvent()}>
        <PlusOutlined />
        授权
      </Button>

      <ModalConfirm
        changeEvent={batchRemoveAuthorizationEvent}
        selectData={selectRows}
        title="移除"
        content="请选择要移除授权的数据"
      />
    </>
  )

  const reset = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.reset()
    }
  }

  const batchAddAuthorizationEvent = async () => {
    if (selectRows && selectRows.length === 0) {
      message.error('请至少选中一条数据')
      return
    }
    const batchObjectIds = selectRows.map((item) => item.id)

    const { groupId } = extractParams

    await addAuthorize({
      groupId,
      objectIds: batchObjectIds,
    })
    message.success('授权成功')
    reset()
    refresh()
    onChange?.()
  }

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/ProjectAuthorityGroup/GetUsers"
        columns={columns}
        type="checkbox"
        getSelectData={(data) => setSelectRows(data)}
        extractParams={{ ...extractParams, keyWord: searchKeyWord }}
      />
    </div>
  )
}

export default UserPermissionAccredit
