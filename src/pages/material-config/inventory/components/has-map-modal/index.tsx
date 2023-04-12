import GeneralTable from '@/components/general-table'
import { deleteResourceInventoryMap } from '@/services/material-config/inventory'
import { verifyPwd } from '@/services/user/user-info'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { ExclamationCircleOutlined, ImportOutlined } from '@ant-design/icons'
import { useUpdateEffect } from 'ahooks'
import { Button, Input, message, Modal, Space } from 'antd'
import moment from 'moment'
import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react'
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
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [mappingId, setMappingId] = useState<string>('')
  // const [inventoryId, setInventoryId] = useState<string>('')
  const [libId, setLibId] = useState<string>('')
  const [inventoryName, setInventoryName] = useState<string>('')
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const { inventoryId, name } = props

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
          <Button className="mr7" onClick={() => deleteEvent()}>
            删除映射
          </Button>
        )}
      </div>
    )
  }

  const deleteEvent = () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择要删除的数据')
      return
    }
    setPasswordVisible(true)
  }

  const deleteMapEvent = async () => {
    // console.log(password, 'pwd')
    if (password) {
      await verifyPwd({ pwd: password })
        .then(async (res) => {
          if (res.content) {
            await deleteResourceInventoryMap({ mappingId: tableSelectRows[0].id })
            message.success('删除映射成功')
            setTableSelectRows([])
            setPassword('')
            setPasswordVisible(false)
            refresh()
            return
          }
          message.error('密码验证错误')
          return
        })
        .catch((err) => {
          message.warning(err)
        })
    } else {
      message.warning('请输入密码验证')
      return
    }
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
      <Modal
        bodyStyle={{ padding: '46px 24px 20px' }}
        width={400}
        footer=""
        visible={passwordVisible}
        onCancel={() => {
          setPassword('')
          setPasswordVisible(false)
        }}
        destroyOnClose
      >
        <div style={{ display: 'flex' }}>
          <ExclamationCircleOutlined style={{ color: '#FFC400', fontSize: '20px' }} />
          <div style={{ marginLeft: '6px' }}>
            删除映射将会导致调用该映射的项目相关成果数据被清空，确认删除选中项目？
            <Input
              placeholder={'请输入密码'}
              type={'password'}
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              style={{ marginTop: 10, width: '100%' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '16px' }}>
          <Space>
            <Button
              onClick={() => {
                setPassword('')
                setPasswordVisible(false)
              }}
            >
              取消
            </Button>
            <Button onClick={deleteMapEvent} type={'primary'}>
              确认
            </Button>
          </Space>
        </div>
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
