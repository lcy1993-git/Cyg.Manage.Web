import GeneralTable from '@/components/general-table'
import TableSearch from '@/components/table-search'
import {
  CopyCableChannel,
  CopyCableWell,
  CopyCatogery,
  CopyComponent,
  CopyMaterial,
  CopyPoleType,
  getAllLib,
} from '@/services/resource-config/resource-lib'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useControllableValue } from 'ahooks'
import { Button, Input, message, Modal, Select } from 'antd'
import { isArray } from 'lodash'
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styles from './index.less'

const { Search } = Input

interface Props {
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  changeFinishEvent: (resourceLibId: string, id: string) => void
  libId: string
  requestSource?: 'resource'
  requestUrl: string
  type: string
  extractParams?: object
  refeshTable: () => void
}

const TemplateLibImportModal: React.FC<Props> = (props) => {
  const {
    libId = '',
    requestSource = 'resource',
    changeFinishEvent,
    requestUrl,
    type,
    extractParams,
    refeshTable,
  } = props
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [keyWord, setKeyWord] = useState('')
  const [resourceLibId, setResourceLibId] = useState(libId)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [placeholder, setPlaceholder] = useState('')
  const [libOptions, setLibOptions] = useState<any[]>([])
  const [defaultValue, setDefaultValue] = useState('')
  const [columns, setColumns] = useState<any>([])
  const [loading, setLoading] = useState(false)

  const tableRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // 初始化获取资源库列表
    getAllLib().then((res) => {
      if (res) {
        let libs = res?.map((item: any) => {
          return { label: item['libName'], value: item['id'] }
        })
        setLibOptions(libs)
      }
    })
  }, [])
  useEffect(() => {
    if (!state) return
    // 默认选中下拉列表当前资源库
    setDefaultValue(resourceLibId)
    // 根据不同的type设置不同的columns，搜索框提示文字
    switch (type) {
      case 'material':
        setColumns([
          {
            dataIndex: 'materialName',
            index: 'materialName',
            title: '物料名称',
            width: 200,
          },
          {
            dataIndex: 'spec',
            index: 'spec',
            title: '规格型号',
            width: 200,
          },
        ])
        setPlaceholder('请输入物料名称')
        break
      case 'component':
        setColumns([
          {
            dataIndex: 'componentName',
            index: 'componentName',
            title: '组件名称',
            width: 200,
          },
          {
            dataIndex: 'componentSpec',
            index: 'componentName',
            title: '组件型号',
            width: 200,
          },
        ])
        setPlaceholder('请输入组件名称')
        break
      case 'category':
        setColumns([
          {
            dataIndex: 'poleTypeName',
            index: 'poleTypeName',
            title: '分类名称',
            width: 200,
          },
          {
            dataIndex: 'poleTypeCode',
            index: 'poleTypeCode',
            title: '分类简号',
            width: 200,
          },
        ])
        setPlaceholder('请输入分类名称')
        break
      case 'pole-type':
        setColumns([
          {
            dataIndex: 'moduleName',
            index: 'moduleName',
            title: '杆型名称',
            width: 200,
          },
          {
            dataIndex: 'poleTypeCode',
            index: 'poleTypeCode',
            title: '杆型简号',
            width: 200,
          },
        ])
        setPlaceholder('请输入杆型名称')
        break
      case 'cable-well':
        setColumns([
          {
            dataIndex: 'cableWellName',
            index: 'cableWellName',
            title: '电缆井名称',
            width: 420,
          },
          {
            dataIndex: 'shortName',
            index: 'shortName',
            title: '模块简称',
            width: 200,
          },
        ])
        setPlaceholder('请输入电缆井名称')
        break
      case 'cable-channel':
        setColumns([
          {
            dataIndex: 'channelName',
            index: 'channelName',
            title: '电缆通道名称',
            width: 480,
          },
          {
            dataIndex: 'shortName',
            index: 'shortName',
            title: '模块简称',
            width: 260,
          },
        ])
        setPlaceholder('请输入电缆通道名称')
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
  const onSave = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }

    try {
      setLoading(true)
      let res = {}
      switch (type) {
        case 'material':
          res = await CopyMaterial({
            dataIds: [tableSelectRows[0].id],
            fromId: defaultValue,
            targetId: libId,
          })
          break
        case 'component':
          res = await CopyComponent({
            dataIds: [tableSelectRows[0].id],
            fromId: defaultValue,
            targetId: libId,
          })
          break
        case 'category':
          res = await CopyCatogery({
            dataIds: [tableSelectRows[0].id],
            fromId: defaultValue,
            targetId: libId,
          })
          break
        case 'pole-type':
          res = await CopyPoleType({
            dataIds: [tableSelectRows[0].id],
            fromId: defaultValue,
            targetId: libId,
          })
          break
        case 'cable-well':
          res = await CopyCableWell({
            dataIds: [tableSelectRows[0].id],
            fromId: defaultValue,
            targetId: libId,
          })
          break
        case 'cable-channel':
          res = await CopyCableChannel({
            dataIds: [tableSelectRows[0].id],
            fromId: defaultValue,
            targetId: libId,
          })
          break
      }
      setLoading(false)
      Modal.confirm({
        title: '编辑数据',
        icon: <ExclamationCircleOutlined />,
        content: '模板导入成功，是否编辑该条数据',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          changeFinishEvent(libId, res[0])
          setState(false)
        },
        onCancel: () => {
          setState(false)
          // 刷新外层组件的数据列表
          refeshTable?.()
        },
      })
    } catch (error) {
      setLoading(false)
    }
  }
  const tableButton = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
          <Search
            placeholder={placeholder}
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
            filterOption={(input, option: any) => (option?.label ?? '').includes(input)}
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
          // 电缆通道用libId传值
          extractParams={{ ...extractParams, keyWord, resourceLibId, libId: resourceLibId }}
          needTitleLine={false}
          requestSource={requestSource}
          url={requestUrl}
        />
      </Modal>
    </>
  )
}

export default TemplateLibImportModal
