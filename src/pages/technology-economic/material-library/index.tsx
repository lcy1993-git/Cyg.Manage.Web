import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Popconfirm, Space, Spin } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isArray } from 'lodash'
import React, { useState } from 'react'
import { history } from 'umi'

import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import DictionaryForm from './components/add-edit-form'

import {
  createMaterialMachineLibrary,
  deleteMaterialMachineLibrary,
} from '@/services/technology-economic'
import moment from 'moment'
import styles from './index.less'

type DataSource = {
  id: string
  [key: string]: string
}

const { Search } = Input

const columns = [
  {
    dataIndex: 'name',

    title: '名称',
    width: 300,
  },
  {
    dataIndex: 'quotaLibrarys',

    title: '已关联定额库',
    render: (val: any[]) => {
      return val.join(' | ')
    },
  },
  {
    dataIndex: 'publishDate',

    title: '发布时间',
    render: (text: any) => {
      return moment(text).format('YYYY/MM/DD')
    },
  },
  {
    dataIndex: 'publishOrg',

    title: '发布机构',
  },
  {
    dataIndex: 'year',

    title: '价格年度',
  },
  {
    dataIndex: 'industryTypeText',

    title: '适用行业',
  },
  // {
  //   dataIndex: 'enabled',
  //   key: 'enabled',
  //   title: '状态',
  //   render(value: boolean, record: DataSource) {
  //     return (
  //       <Switch
  //         defaultChecked={value}
  //         onClick={(checked) => {
  //           setMaterialMachineLibraryStatus(record.id, checked);
  //         }}
  //       />
  //     );
  //   },
  // },
  {
    dataIndex: 'remark',

    title: '备注',
    width: 400,
  },
]

const QuotaLibrary: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<DataSource[] | Object>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)

  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const [addForm] = Form.useForm()

  const searchComponent = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="请输入关键词"
        />
      </TableSearch>
    )
  }

  const tableSearchEvent = () => {
    search()
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

  // 添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddAuthorization = () => {
    addForm.validateFields().then((values) => {
      setSpinning(true)
      const data = JSON.parse(JSON.stringify(values))
      // data.file = values.file
      data.publishDate = moment(values.publishDate).format('YYYY-MM-DD')
      data.year = moment(values.year).format('YYYY')
      let params = JSON.parse(JSON.stringify(data))
      delete params.file
      createMaterialMachineLibrary({ file: values.file }, params)
        .then(() => {
          refresh()
          setAddFormVisible(false)
          addForm.resetFields()
        })
        .finally(() => {
          setSpinning(false)
        })
    })
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const { id } = tableSelectRows[0]
    await deleteMaterialMachineLibrary(id)
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  const gotoMoreInfo = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const { id } = tableSelectRows[0]
    history.push(`/technology-economic/material-infomation?id=${id}`)
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {!buttonJurisdictionArray?.includes('quotaLib-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {!buttonJurisdictionArray?.includes('quotaLib-del') && (
          <Popconfirm
            title="您确定要删除该条数据?"
            onConfirm={sureDeleteData}
            okText="确认"
            cancelText="取消"
          >
            <Button className="mr7">
              <DeleteOutlined />
              删除
            </Button>
          </Popconfirm>
        )}
        {!buttonJurisdictionArray?.includes('quotaLib-info') && (
          <Button className="mr7" onClick={() => gotoMoreInfo()}>
            <EyeOutlined />
            查看详情
          </Button>
        )}
      </div>
    )
  }

  const tableSelectEvent = (data: DataSource[] | Object) => {
    setTableSelectRows(data)
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as ColumnsType<DataSource | object>}
        url="/MaterialMachineLibrary/QueryMaterialMachineLibraryPager"
        tableTitle="材机库管理"
        getSelectData={tableSelectEvent}
        requestSource="tecEco"
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-材机库"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        footer={null}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={spinning}>
          <Form form={addForm} preserve={false}>
            <DictionaryForm type="add" />
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
    </PageCommonWrap>
  )
}

export default QuotaLibrary
