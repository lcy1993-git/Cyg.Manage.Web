import React, { useRef, useState } from 'react'
import { Button, Modal, Form, message, Input } from 'antd'
import { EditOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons'
import PageCommonWrap from '@/components/page-common-wrap'

import GeneralTable from '@/components/general-table'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import styles from './index.less'
import TableSearch from '@/components/table-search'
import ModalConfirm from '@/components/modal-confirm'
import MapSourceForm from './components/add-edit-form'
import ImportCustomMap from './components/import-modal'
import {
  addCustomMapItem,
  deleteCustomMap,
  getCustomMapDetail,
  updateCustomMapStatus,
} from '@/services/system-config/custom-map'
import { isArray } from 'lodash'

const { Search } = Input

const CustomMap: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false)

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

  const updateStatus = async (id: string, status: boolean) => {
    await updateCustomMapStatus({ id: id, isEnable: status })
    refresh()
    message.success('状态修改成功')
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'number',
      index: 'number',
      render: (text: any, record: any, index: number) => `${index + 1}`,
      width: 50,
    },
    {
      title: '地图源名称',
      dataIndex: 'name',
      index: 'name',
      width: 240,
    },
    {
      title: '地址',
      dataIndex: 'url',
      index: 'url',
    },
    {
      title: '主机编号',
      dataIndex: 'hostId',
      index: 'hostId',
      width: 200,
    },
    {
      title: '最小级别',
      dataIndex: 'minLevel',
      index: 'minLevel',
      width: 100,
    },
    {
      title: '最大级别',
      dataIndex: 'maxLevel',
      index: 'maxLevel',
      width: 100,
    },
    {
      title: '启用状态',
      dataIndex: 'processStatusText',
      index: 'processStatusText',
      width: 160,
      render: (text: any, record: any) => {
        const isChecked = !record.isEnable
        return (
          <>
            {buttonJurisdictionArray?.includes('update-custom-map') &&
              (isChecked ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                  onClick={() => updateStatus(record.id, isChecked)}
                >
                  禁用
                </span>
              ) : (
                <span
                  onClick={() => updateStatus(record.id, isChecked)}
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                >
                  启用
                </span>
              ))}
            {!buttonJurisdictionArray?.includes('update-custom-map') &&
              (isChecked ? <span>已禁用</span> : <span>已启用</span>)}
          </>
        )
      },
    },
  ]

  const sureDeleteData = async () => {
    const selectDataId = tableSelectRows[0].id
    await deleteCustomMap(selectDataId)
    refresh()
    message.success('删除成功')
    setTableSelectRows([])
  }

  const importEvent = () => {
    setImportModalVisible(true)
  }

  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择一条数据进行编辑')
      return
    }

    const editId = tableSelectRows[0].id
    setEditFormVisible(true)
    const CustomMapData = await getCustomMapDetail(editId)
    editForm.setFieldsValue(CustomMapData)
  }

  const customMapButtonSlot = () => {
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

  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddMapSource = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          url: '',
          hostId: '',
          maxLevel: '',
          minLevel: '',
        },
        value
      )
      await addCustomMapItem(submitInfo)
      tableFresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  const sureEditMapSource = () => {
    editForm.validateFields().then(async (values) => {
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const uploadFinishEvent = () => {
    refresh()
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        tableTitle="地图源配置"
        columns={columns}
        getSelectData={(data) => setTableSelectRows(data)}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={customMapButtonSlot}
        url="/MapSourceConfig/GetPageList"
        extractParams={{ keyWord: searchKeyWord }}
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
      <ImportCustomMap
        visible={importModalVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportModalVisible}
      />
    </PageCommonWrap>
  )
}

export default CustomMap
