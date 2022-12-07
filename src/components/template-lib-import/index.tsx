import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import { getResourceLibLists } from '@/services/resource-config/resource-lib'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useControllableValue } from 'ahooks'
import { Button, Input, message, Modal, Select } from 'antd'
import { isArray } from 'lodash'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './index.less'

const { Search } = Input

interface UploadAllProps {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: (resourceLibId: string, id: string) => void
  libId: string
  requestSource?: 'resource'
  requestUrl: string
  type: string
}

const TemplateLibImportModal: React.FC<UploadAllProps> = (props) => {
  const { libId = '', requestSource = 'resource', changeFinishEvent, requestUrl, type } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [keyWord, setKeyWord] = useState('')
  const [resourceLibId, setResourceLibId] = useState(libId)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [libOptions, setLibOptions] = useState<any[]>([])
  const [defaultValue, setDefaultValue] = useState('')
  const [columns, setColumns] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const tableRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // 初始化获取资源库列表
    getResourceLibLists().then((res) => {
      if (res && res.items) {
        let libs = res.items?.map((item: any) => {
          return { label: item['libName'], value: item['id'] }
        })
        setLibOptions(libs)
      }
    })
  }, [])
  useEffect(() => {
    // 第一次打开弹窗时默认选中下拉列表当前资源库
    state && setDefaultValue(resourceLibId)
    // 根据不同的type设置不同的columns
    switch (type) {
      case 'material':
        setColumns([
          {
            dataIndex: 'materialName',
            index: 'materialName',
            title: '物料名称',
            width: 320,
          },
          {
            dataIndex: 'spec',
            index: 'spec',
            title: '规格型号',
            width: 320,
          },
        ])
        break
      case 'component':
        break
    }
  }, [state])
  useEffect(() => {
    // 选择不同资源库刷新列表
    !!resourceLibId && search()
  }, [resourceLibId])

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search()
    }
  }
  const handleChangeLib = (val: string) => {
    setResourceLibId(val)
    setDefaultValue(val)
  }
  const onSave = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    // console.log(libId,tableSelectRows[0].id)
    setLoading(true)
    setLoading(false)
    Modal.confirm({
      title: '编辑数据',
      icon: <ExclamationCircleOutlined />,
      content: '模板导入成功，是否编辑该条数据',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        changeFinishEvent(resourceLibId, tableSelectRows[0].id)
        setState(false)
      },
    })
  }
  const tableButton = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
          <Search
            placeholder="请输入资源库名称"
            enterButton
            value={keyWord}
            onChange={(e) => setKeyWord(e.target.value)}
            onSearch={() => search()}
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="资源库" width="230px">
          <Select
            allowClear
            showSearch
            placeholder="请选择资源库"
            onChange={(value: any) => {
              handleChangeLib(value)
            }}
            value={defaultValue}
            options={libOptions}
          />
        </TableSearch>
      </div>
    )
  }

  return (
    <>
      <Modal
        maskClosable={false}
        title="模板库导入"
        visible={state as boolean}
        footer={[
          <Button key="cancle" onClick={() => setState(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" onClick={onSave} loading={loading}>
            保存
          </Button>,
        ]}
        onCancel={() => setState(false)}
        width={750}
      >
        <GeneralTable
          ref={tableRef}
          type="radio"
          getSelectData={(data) => setTableSelectRows(data)}
          buttonLeftContentSlot={tableButton}
          columns={columns}
          extractParams={{ keyWord, resourceLibId }}
          needTitleLine={false}
          requestSource={requestSource}
          url={requestUrl}
        />
      </Modal>
    </>
  )
}

export default TemplateLibImportModal
