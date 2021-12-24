import GeneralTable from '@/components/general-table'
import ImageIcon from '@/components/image-icon'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import {
  addPricingTemplate,
  deletePricingTemplate,
  editPricingTemplate,
  queryPricingTemplatePager,
  setPricingTemplate,
} from '@/services/technology-economic/pricing-template'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Popconfirm, Space, Spin, Switch } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { isArray } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { history } from 'umi'
import { getEnums } from '../utils'
import DictionaryForm from './components/add-edit-form'
import styles from './index.less'

const { Search } = Input
interface ResponseData {
  items?: {
    id?: string
    name?: string
    engineeringTemplateType: string
  }[]
}
type DataSource = {
  id: string
  [key: string]: string
}

const engineeringTemplateTypeList = getEnums('EngineeringTemplateType')

export const getTypeName = (no: number) => {
  let str = ''
  engineeringTemplateTypeList &&
    engineeringTemplateTypeList.map((item: any) => {
      if (no === item.value) {
        str = item.text
      }
    })
  return str
}
const PricingTemplates: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<DataSource[] | Object>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const [update, setUpdate] = useState<boolean>(true)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [selectList, setSelectList] = useState<number[]>([])
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  useEffect(() => {
    getSelectList()
  }, [])
  const getSelectList = async () => {
    const list: number[] = []
    const data: ResponseData = await queryPricingTemplatePager({ pageIndex: 1, pageSize: 3000 })
    if (data) {
      if (data.hasOwnProperty('items') && data.items?.length) {
        data.items.map((item) => {
          list.push(parseInt(item.engineeringTemplateType as string))
        })
      }
    }
    setSelectList(list)
  }
  const columns = [
    {
      dataIndex: 'no',
      key: 'no',
      title: '编号',
      width: 300,
    },
    {
      dataIndex: 'engineeringTemplateType',
      key: 'engineeringTemplateType',
      title: '模板类型',
      render: (text: string, record: any) => {
        return getTypeName(record.engineeringTemplateType)
      },
    },
    {
      dataIndex: 'publishDate',
      key: 'publishDate',
      title: '发布时间',
      render: (text: string, record: any) => {
        return moment(record.publishDate).format('YYYY-MM-DD HH:mm ')
      },
    },
    {
      dataIndex: 'version',
      key: 'version',
      title: '版本',
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '备注',
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      title: '状态',
      render(value: boolean, record: DataSource) {
        return (
          <Switch
            defaultChecked={value}
            onClick={(checked) => {
              setPricingTemplate(record.id, checked)
              // @ts-ignore
              tableRef.current.reset()
            }}
          />
        )
      },
    },
  ]
  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
      getSelectList()
    }
  }

  // 创建按钮
  const addEvent = () => {
    setAddFormVisible(true)
  }
  // 新增确认按钮
  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {
      await addPricingTemplate(values)
      setSpinning(false)
      refresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }
  // 编辑确认按钮
  const sureEditAuthorization = () => {
    editForm.validateFields().then((values) => {
      setSpinning(true)
      if (values.publishDate === 'Invalid date') {
        message.warn('发布时间为必填项!')
        setSpinning(false)
        return
      }
      const id = tableSelectRows[0].id
      let value = values
      value.id = id
      // TODO 编辑接口
      toUpdate(value)
    })
  }
  const toUpdate = async (value: any) => {
    await editPricingTemplate(value)
    setSpinning(false)
    refresh()
    setEditFormVisible(false)
    editForm.resetFields()
    setTableSelectRows([])
    getSelectList()
  }
  // 删除
  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const id = tableSelectRows[0].id
    await deletePricingTemplate(id)
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
    getSelectList()
  }

  // 编辑按钮
  const editEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    setEditFormVisible(true)
    editForm.setFieldsValue({
      ...tableSelectRows[0],
    })
  }
  // 跳转工程目录
  const engineeringCatalog = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const id = tableSelectRows[0].id
    history.push(`/technology-economic/project-list?id=${id}`)
  }
  // const commonRates = () => {
  //   history.push(`/technology-economic/common-rate`);
  // };
  // 跳转常用费率
  const gotoCostTemplate = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const id = tableSelectRows[0].id

    history.push(`/technology-economic/cost-template?id=${id}`)
  }
  // 跳转总算表
  const gotoTotalTable = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const id = tableSelectRows[0].id
    history.push(`/technology-economic/total-table?id=${id}`)
  }
  const gotoExpression = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const id = tableSelectRows[0].id
    history.push(`/technology-economic/expression?id=${id}`)
  }
  useEffect(() => {
    setUpdate(false)
    setTimeout(() => {
      setUpdate(true)
    }, 0)
  }, [spinning])
  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          {/* <EditOutlined />
            编辑 */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon width={16} height={16} imgUrl="edit.png" />
            <div style={{ marginLeft: '5px' }}>编辑</div>
          </div>
        </Button>
        <Popconfirm
          title="您确定要删除该条数据?"
          onConfirm={sureDeleteData}
          okText="确认"
          cancelText="取消"
        >
          <Button className="mr7">
            {/* <DeleteOutlined />
              删除 */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageIcon width={16} height={16} imgUrl="delete.png" />
              <div style={{ marginLeft: '5px' }}>删除</div>
            </div>
          </Button>
        </Popconfirm>
        <Button className="mr7" onClick={() => gotoCostTemplate()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon width={16} height={16} imgUrl="feeTemplate.png" />
            <div style={{ marginLeft: '5px' }}>取费表</div>
          </div>
        </Button>
        <Button className="mr7" onClick={() => engineeringCatalog()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon width={16} height={16} imgUrl="billOfQuantities.png" />
            <div style={{ marginLeft: '5px' }}>工程量目录</div>
          </div>
        </Button>
        {/* <Button className="mr7" onClick={() => commonRates()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon width={16} height={16} imgUrl="woodMachineTemplate.png" />
            <div style={{ marginLeft: '5px' }}>材机模板</div>
          </div>
        </Button> */}

        <Button className="mr7" onClick={() => gotoTotalTable()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon width={16} height={16} imgUrl="feeTemplate.png" />
            <div style={{ marginLeft: '5px' }}>总算表</div>
          </div>
        </Button>
        <Button className="mr7" onClick={() => gotoExpression()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon width={16} height={16} imgUrl="feeTemplate.png" />
            <div style={{ marginLeft: '5px' }}>表达式</div>
          </div>
        </Button>
        {/* <Button className="mr7" onClick={() => commonRates()}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ImageIcon width={16} height={16} imgUrl="reportTemplate.png" />

            <div style={{ marginLeft: '5px' }}>报表模板</div>
          </div>
        </Button> */}
      </div>
    )
  }

  const tableSelectEvent = (data: DataSource[] | Object) => {
    setTableSelectRows(data)
  }
  const searchComponent = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => refresh()}
          enterButton
          placeholder="请输入关键词"
        />
      </TableSearch>
    )
  }
  return (
    <PageCommonWrap>
      {update && (
        <GeneralTable
          ref={tableRef}
          buttonRightContentSlot={tableElement}
          buttonLeftContentSlot={searchComponent}
          needCommonButton={true}
          columns={columns as ColumnsType<DataSource | object>}
          url="/EngineeringTemplate/QueryEngineeringTemplatePager"
          tableTitle="计价模板管理"
          getSelectData={tableSelectEvent}
          type="radio"
          requestSource="tecEco1"
          extractParams={{
            keyWord: searchKeyWord,
          }}
        />
      )}
      <Modal
        maskClosable={false}
        title="添加-计价模板"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        footer={null}
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={spinning}>
          <Form form={addForm} preserve={false}>
            <DictionaryForm type="add" selectList={selectList} />
          </Form>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Space>
              <Button onClick={() => setAddFormVisible(false)}>取消</Button>
              <Button onClick={sureAddAuthorization} type={'primary'}>
                确定
              </Button>
            </Space>
          </div>
        </Spin>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-计价模板"
        width="880px"
        visible={editFormVisible}
        okText="确认"
        footer={null}
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={spinning}>
          <Form form={editForm} preserve={false}>
            <DictionaryForm type="edit" />
          </Form>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Space>
              <Button onClick={() => setEditFormVisible(false)}>取消</Button>
              <Button onClick={sureEditAuthorization} type={'primary'}>
                确定
              </Button>
            </Space>
          </div>
        </Spin>
      </Modal>
    </PageCommonWrap>
  )
}

export default PricingTemplates
