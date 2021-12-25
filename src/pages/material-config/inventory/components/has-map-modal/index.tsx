import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import { verifyPwd } from '@/services/user/user-info'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { ImportOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Button, Input, message, Modal } from 'antd'
import moment from 'moment'
import React, {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import CheckMapping from '../check-mapping-form'
import EditMap from '../edit-map'
import MapLibModal from '../map-lib-modal'
import styles from './index.less'

interface HasMapModalProps {
  inventoryId: string
  name: string
}

const HasMapModal = (props: HasMapModalProps, ref: Ref<any>) => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  // const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  // const [companyWord, setCompanyWord] = useState<string>('');
  const [mapLibModalVisible, setMapLibModalVisible] = useState<boolean>(false)
  const [mappingListModalVisible, setMappingListModalVisible] = useState<boolean>(false)
  const [editMapListModalVisible, setEditMapListModalVisible] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [mappingId, setMappingId] = useState<string>('')
  // const [inventoryId, setInventoryId] = useState<string>('')
  const [libId, setLibId] = useState<string>('')
  const [inventoryName, setInventoryName] = useState<string>('')
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const { inventoryId, name } = props

  const deleteSlot = () => {
    return (
      <>
        <div>删除映射将会导致调用该映射的项目相关成果数据被清空，确认删除选中项目？</div>
        <div>
          <Input
            placeholder="请输入密码执行此操作"
            type="password"
            // value={password}
            onChange={(e: any) => setPassword(e.target.value)}
            style={{ marginTop: 10, width: '250px' }}
          />
        </div>
      </>
    )
  }
  const passwordOnchange = (value: any) => {
    setPassword(value)
  }

  const deleteMapEvent = async () => {
    // console.log(password, 'pwd')
    // Promise.resolve().then((value) => {
    //   console.log(value)
    // })
    return password

    // const res = await verifyPwd({ pwd: password })

    // await deleteResourceInventoryMap({ mappingId: tableSelectRows[0].id })
    // message.success('删除映射成功')
    // setTableSelectRows([])
    // refresh()
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('new-mapping') && (
          <Button className="mr7" type="primary" onClick={() => createMapEvent()}>
            <ImportOutlined />
            新建映射
          </Button>
        )}
        {buttonJurisdictionArray?.includes('edit-mapping') && (
          <Button className="mr7" onClick={() => editMapEvent()}>
            编辑映射
          </Button>
        )}
        {buttonJurisdictionArray?.includes('delete-mapping') && (
          <ModalConfirm
            changeEvent={deleteMapEvent}
            selectData={tableSelectRows}
            contentSlot={deleteSlot}
            title="删除映射"
          />
        )}
      </div>
    )
  }

  useUpdateEffect(() => {
    refresh()
  }, [inventoryId])

  //映射操作
  const createMapEvent = () => {
    setMapLibModalVisible(true)
  }

  const editMapEvent = () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择要编辑的映射')
      return
    }
    setMappingId(tableSelectRows[0].id)
    // setInventoryId(tableSelectRows[0].inventoryOverviewId)
    setLibId(tableSelectRows[0].resourceLibId)
    setEditMapListModalVisible(true)
  }

  const checkMapEvent = (inventoryOverviewId: string, name: string, mappingId: string) => {
    // setInventoryId(inventoryOverviewId)
    setInventoryName(name)
    setMappingId(mappingId)
    setMappingListModalVisible(true)
  }

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const resetEvent = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.reset()
    }
  }

  useImperativeHandle(ref, () => ({
    resetEvent,
  }))

  const columns = [
    {
      dataIndex: 'resourceLibName',
      index: 'resourceLibName',
      title: '资源库名称',
      width: 240,
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('check-inventory-mapping') && (
              <span
                onClick={() => checkMapEvent(record.inventoryOverviewId, record.name, record.id)}
                className={styles.checkHasMap}
              >
                {record.resourceLibName}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('check-inventory-mapping') && (
              <span>{record.resourceLibName}</span>
            )}
          </>
        )
      },
    },
    {
      dataIndex: 'howToCreateText',
      index: 'howToCreateText',
      title: '状态',
      width: 240,
    },
    {
      dataIndex: 'lastUpdateDate',
      index: 'lastUpdateDate',
      title: '上一次编辑',
      width: 280,
      render: (text: any) => moment(text).format('YYYY-MM-DD'),
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
    },
  ]

  const titleSlotElement = () => {
    return <div style={{ paddingTop: '1px', fontSize: '13px' }}>{`-${name}`}</div>
  }

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={tableElement}
        titleSlot={titleSlotElement}
        columns={columns}
        requestSource="resource"
        url="/Inventory/GetMappingInventoryOverviewPageList"
        getSelectData={(data) => setTableSelectRows(data)}
        tableTitle="已映射列表"
        type="radio"
        extractParams={{ inventoryOverviewId: inventoryId }}
      />

      <MapLibModal
        visible={mapLibModalVisible}
        onChange={setMapLibModalVisible}
        changeFinishEvent={refresh}
        inventoryId={inventoryId}
        name={name}
      />

      <Modal
        bodyStyle={{ height: 820, overflowY: 'auto' }}
        footer=""
        centered
        width="96%"
        title="查看映射关系"
        visible={mappingListModalVisible}
        onCancel={() => setMappingListModalVisible(false)}
        destroyOnClose
      >
        <CheckMapping
          mappingId={mappingId}
          inventoryOverviewId={inventoryId}
          invName={inventoryName}
        />
      </Modal>

      <EditMap
        visible={editMapListModalVisible}
        onChange={setEditMapListModalVisible}
        mappingId={mappingId}
        inventoryOverviewId={inventoryId}
        changeFinishEvent={refresh}
        libId={libId}
      />
    </>
  )
}

export default forwardRef(HasMapModal)
