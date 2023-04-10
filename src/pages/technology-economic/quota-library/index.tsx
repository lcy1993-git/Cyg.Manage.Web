import React, { useState } from 'react'
import { history } from 'umi'
import { Input, Button, Modal, Form, message, Popconfirm, Spin, Space } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { EyeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { isArray } from 'lodash'

import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import DictionaryForm from './components/add-edit-form'
import {
  createQuotaLibrary,
  CreateQuotaLibrary,
  deleteQuotaLibrary,
} from '@/services/technology-economic'

import styles from './index.less'
import moment from 'moment'

const { Search } = Input

type DataSource = {
  id: string
  [key: string]: string
}

const columns = [
  {
    dataIndex: 'name',

    title: '名称',
    width: 300,
  },
  {
    dataIndex: 'materialMachineLibraryName',

    title: '使用材机库',
    width: 160,
  },
  {
    dataIndex: 'quotaScopeText',

    title: '定额类别',
    width: 160,
  },
  {
    dataIndex: 'publishDate',

    title: '发布时间',
    width: 130,
    render: (text: any) => {
      return moment(text).format('YYYY/MM/DD')
    },
  },
  {
    dataIndex: 'publishOrg',

    title: '发布机构',
    width: 150,
  },
  {
    dataIndex: 'year',

    title: '价格年度',
    width: 100,
  },
  {
    dataIndex: 'industryTypeText',

    title: '行业类别',
    width: 150,
  },
  {
    dataIndex: 'majorType',

    title: '适用专业',
    width: 150,
    render: (num: number) => {
      if (num === 1) {
        return '建筑'
      } else if (num === 2) {
        return '安装'
      } else {
        return ''
      }
    },
  },
  // {
  //   dataIndex: 'enabled',
  //   key: 'enabled',
  //   title: '状态',
  //   width: 70,
  //   render(value: boolean, record: DataSource) {
  //     return (
  //       <Switch
  //         defaultChecked={value}
  //         onClick={(checked) => {
  //           setQuotaLibraryStatus(record.id, checked);
  //         }}
  //       />
  //     );
  //   },
  // },
  {
    dataIndex: 'remark',
    index: 'remark',
    title: '备注',
    width: 220,
  },
]

const QuotaLibrary: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<DataSource[] | object>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)

  // const buttonJurisdictionArray = useGetButtonJurisdictionArray();

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

  //添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddAuthorization = () => {
    setSpinning(true)
    addForm.validateFields().then(async (values: CreateQuotaLibrary) => {
      const data = {}
      for (let key: string in values) {
        if (values[key] !== undefined) {
          data[key] = values[key]
        }
      }
      createQuotaLibrary(data as CreateQuotaLibrary)
        .then(() => {
          refresh()
          setAddFormVisible(false)
          addForm.resetFields()
          setSpinning(false)
        })
        .catch(() => {
          message.error('上传失败')
          setSpinning(false)
        })
    })
    // setTimeout(()=>{
    //   setSpinning(false);
    // },10000)
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const id = tableSelectRows[0].id
    await deleteQuotaLibrary(id)
    refresh()
    setTableSelectRows([])
    message.success('删除成功')
  }

  const gotoMoreInfo = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const id = tableSelectRows[0].id
    history.push(`/technology-economic/quota-infomation?id=${id}`)
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {
          // buttonJurisdictionArray?.includes('quotalib-add') &&
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        }
        {
          // buttonJurisdictionArray?.includes('quotalib-del') &&
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
        }
        {
          // buttonJurisdictionArray?.includes('quotalib-info') &&
          <Button className="mr7" onClick={() => gotoMoreInfo()}>
            <EyeOutlined />
            查看详情
          </Button>
        }
      </div>
    )
  }

  const tableSelectEvent = (data: DataSource[] | object) => {
    setTableSelectRows(data)
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as ColumnsType<object>}
        url="/QuotaLibrary/QueryQuotaLibraryPager"
        tableTitle="定额库管理"
        getSelectData={tableSelectEvent}
        requestSource="tecEco"
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />

      <Modal
        maskClosable={false}
        title="添加-定额库"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        footer={false}
        destroyOnClose
      >
        <Spin spinning={spinning} tip={'上传中...'}>
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
