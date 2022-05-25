import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Input, Button, Modal, Form, Popconfirm, message } from 'antd'
import React, { useRef, useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { isArray } from 'lodash'
import '@/assets/icon/iconfont.css'
import {
  getNewsItemDetail,
  updateNewsItem,
  deleteNewsItem,
  addNewsItem,
  updateNewsState,
} from '@/services/news-config/info-manage'
// import DefaultParams from './components/default-params';
import { useGetButtonJurisdictionArray } from '@/utils/hooks'

import EnumSelect from '@/components/enum-select'
import { BelongManageEnum } from '@/services/personnel-config/manage-user'
import CyTag from '@/components/cy-tag'

import ModalConfirm from '@/components/modal-confirm'
import VisualConfigForm from './components/add-edit-form'
import {
  addVisualConfigItem,
  deleteVisualConfigItem,
  getVisualConfigItem,
  modifyVisualConfigItem,
  updateConfigStatus,
} from '@/services/backstage-config/visual-config'
import TableStatus from '@/components/table-status'

const { Search } = Input

const mapColor = {
  勘察图层: 'greenOne',
  方案图层: 'greenTwo',
  设计图层: 'greenThree',
  拆除图层: 'greenFour',
}

const VisualConfig: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [status, setStatus] = useState<number>(0)

  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run } = useRequest(getVisualConfigItem, {
    manual: true,
  })

  // const { data: TreeData = [] } = useRequest(() => getGroupInfo('4'));
  // const mapTreeData = (data: any) => {
  //   return {
  //     title: data.text,
  //     key: data.id,
  //     children: data.children ? data.children.map(mapTreeData) : [],
  //   };
  // };

  // const handleData = useMemo(() => {
  //   return TreeData?.map(mapTreeData);
  // }, [JSON.stringify(TreeData)]);

  const searchComponent = () => {
    return (
      <div className={styles.search}>
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入关键词"
          />
        </TableSearch>
      </div>
    )
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    await deleteVisualConfigItem(editDataId)
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search()
    }
  }

  const updateStatus = async (id: string) => {
    await updateConfigStatus(id)
    search()
    message.success('状态修改成功')
  }

  const columns = [
    {
      dataIndex: 'layerTypes',
      index: 'layerTypes',
      title: '图层类别',
      width: 300,
      render: (text: any, record: any) => {
        const { layerTypes } = record
        const el = layerTypes.map((item: any) => {
          return (
            <>
              <TableStatus className="mr7" color={mapColor[item.text]}>
                {item.text}
              </TableStatus>
            </>
          )
        })
        return <>{el}</>
      },
    },
    {
      title: '状态',
      dataIndex: 'isDisabled',
      index: 'isDisabled',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = record.isDisabled
        return (
          <>
            {buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                  onClick={() => updateStatus(record.id)}
                >
                  禁用
                </span>
              ) : (
                <span
                  onClick={() => updateStatus(record.id)}
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                >
                  启用
                </span>
              ))}
            {!buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked ? (
                <span style={{ cursor: 'pointer' }} className="colorRed">
                  禁用
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }} className="colorPrimary">
                  启用
                </span>
              ))}
          </>
        )
      },
    },

    {
      dataIndex: 'elementType',
      index: 'elementType',
      title: '元素类别',
      render: (text: any, record: any) => {
        return record.elementTypes.map((item: any) => {
          return (
            <CyTag key={item.value} className="mr7">
              {item.text}
            </CyTag>
          )
        })
      },
    },
    {
      dataIndex: 'limitQty',
      index: 'limitQty',
      title: '限制查询数量',
      width: 120,
    },
    {
      dataIndex: 'minZoomLevel',
      index: 'minZoomLevel',
      title: '最小缩放等级',
      width: 150,
    },
    {
      dataIndex: 'maxZoomLevel',
      index: 'maxZoomLevel',
      title: '最大缩放等级',
      width: 150,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
    },
  ]

  //添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddConfig = () => {
    addForm.validateFields().then(async (values) => {
      const submitInfo = {
        minZoomLevel: '',
        maxZoomLevel: '',
        limitQty: 0,
        remark: '',
        ...values,
      }

      await addVisualConfigItem(submitInfo)
      refresh()
      message.success('添加成功')
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id

    const checkContentData = await run(editDataId)

    setEditFormVisible(true)

    editForm.setFieldsValue({
      ...checkContentData,
      layerTypes: checkContentData?.layerTypes.map((item: any) => String(item.value)),
      elementTypes: checkContentData?.elementTypes.map((item: any) => String(item.value)),
    })
  }

  const sureEditConfig = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = {
        id: editData.id,
        remark: editData.remark,
        limitQty: editData.limitQty,
        minZoomLevel: editData.minZoomLevel,
        maxZoomLevel: editData.maxZoomLevel,
        ...values,
      }

      await modifyVisualConfigItem(submitInfo)
      refresh()
      message.success('更新成功')
      setEditFormVisible(false)
    })
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {/* {buttonJurisdictionArray?.includes('add-visual-config') && ( */}
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        {/* )} */}

        {/* {buttonJurisdictionArray?.includes('edit-visual-config') && ( */}
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
        {/* )} */}

        {/* {buttonJurisdictionArray?.includes('delete-visual-config') && ( */}
        <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        {/* )} */}
      </div>
    )
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        url="/MapElementQueryConfig/GetPagedList"
        tableTitle="可视化配置"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          state: status,
          keyWord: searchKeyWord,
        }}
      />

      <Modal
        maskClosable={false}
        title="添加-可视化配置"
        width="600px"
        visible={addFormVisible}
        okText="保存"
        onOk={() => sureAddConfig()}
        onCancel={() => {
          setAddFormVisible(false)
          addForm.resetFields()
        }}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm}>
          <VisualConfigForm form={addForm} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-可视化配置"
        width="880px"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditConfig()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm}>
          <VisualConfigForm form={editForm} />
        </Form>
      </Modal>
    </PageCommonWrap>
  )
}

export default VisualConfig
