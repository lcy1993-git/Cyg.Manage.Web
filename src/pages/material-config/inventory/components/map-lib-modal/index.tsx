import { useControllableValue } from 'ahooks'
import { Modal, Input, Button, message, Spin } from 'antd'
import React, { useRef, useState } from 'react'
import { SetStateAction } from 'react'
import { Dispatch } from 'react'
import styles from './index.less'
import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import MapRemarkModal from '../map-remark-modal'

interface MapLibModalParams {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent?: () => void
  inventoryId: string
  name: string
}

const { Search } = Input

const MapLibModal: React.FC<MapLibModalParams> = (props) => {
  const { changeFinishEvent, inventoryId, name } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [libTableSelectRows, setLibTableSelectRow] = useState<any[]>([])
  const [invTableSelectRows, setInvTableSelectRow] = useState<any[]>([])
  const [remarkModalVisible, setRemarkModalVisible] = useState<boolean>(false)
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [searchInvKeyWord, setSearchInvKeyWord] = useState<string>('')

  const resourceTableRef = useRef<HTMLDivElement>(null)
  const inventoryTableRef = useRef<HTMLDivElement>(null)

  const resourceLibColumns = [
    {
      dataIndex: 'id',
      index: 'id',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'libName',
      index: 'libName',
      title: '名称',
    },
    {
      dataIndex: 'version',
      index: 'version',
      title: '版本',
      width: 140,
    },
  ]

  //搜索
  const resourceTableSearch = () => {
    if (resourceTableRef && resourceTableRef.current) {
      //@ts-ignore

      resourceTableRef.current.search()
    }
  }
  const InventoryTableSearch = () => {
    if (resourceTableRef && resourceTableRef.current) {
      //@ts-ignore

      inventoryTableRef.current.search()
    }
  }

  const resourceLibSearch = () => {
    return (
      <TableSearch width="208px">
        <Search
          value={searchKeyWord}
          placeholder="搜索/资源库名称"
          enterButton
          onSearch={() => resourceTableSearch()}
          onChange={(e) => setSearchKeyWord(e.target.value)}
        />
      </TableSearch>
    )
  }

  const mapLibEvent = async () => {
    if (libTableSelectRows && libTableSelectRows.length === 0) {
      message.warning('未选择资源库')
      return
    }

    setRemarkModalVisible(true)
  }

  const titleSlotElement = () => {
    return <div style={{ paddingTop: '1px', fontSize: '13px' }}>{`-${name}`}</div>
  }

  return (
    <>
      <Modal
        maskClosable={false}
        title="映射资源库"
        visible={state as boolean}
        bodyStyle={{
          padding: '12px 24px',
          height: '700px',
          overflowY: 'auto',
          // backgroundColor: '#F7F7F7',
        }}
        width="86%"
        destroyOnClose
        centered
        footer={[
          <Button
            key="cancle"
            onClick={() => {
              setState(false)
              setLibTableSelectRow([])
              setInvTableSelectRow([])
            }}
          >
            关闭
          </Button>,
          <Button key="save" type="primary" onClick={() => mapLibEvent()}>
            映射
          </Button>,
        ]}
        onCancel={() => {
          setState(false)
          setLibTableSelectRow([])
          setInvTableSelectRow([])
        }}
      >
        <GeneralTable
          ref={resourceTableRef}
          defaultPageSize={20}
          columns={resourceLibColumns}
          extractParams={{
            keyWord: searchKeyWord,
          }}
          getSelectData={(data) => setLibTableSelectRow(data)}
          buttonLeftContentSlot={resourceLibSearch}
          url="/ResourceLib/GetPageList"
          requestSource="resource"
          tableTitle="新建映射"
          titleSlot={titleSlotElement}
        />
      </Modal>
      <MapRemarkModal
        refreshEvent={changeFinishEvent}
        visible={remarkModalVisible}
        onChange={setRemarkModalVisible}
        libId={libTableSelectRows[0]?.id}
        invId={inventoryId}
      />
    </>
  )
}

export default MapLibModal
