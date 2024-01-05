import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import {
  addMaterialLibrary,
  deleteMaterialLibraryById,
} from '@/services/technology-economic/supplies-library'
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  ImportOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import useBoolean from 'ahooks/lib/useBoolean'
import { Button, DatePicker, Form, Input, message, Modal, Space, Spin } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import { isArray } from 'lodash'
import moment from 'moment'
import React, { useState } from 'react'
import { history } from 'umi'

export interface AssemblyLibraryData {
  // id?: string
  // name: string
  // publishOrg: string
  // publishDate: string | moment.Moment
  // remark: string
  // "enabled": boolean
  file: any
}

const { Search } = Input

const { confirm } = Modal

const AssemblyLibrary: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<AssemblyLibraryData[] | Object>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const [triggerUploadFile] = useBoolean(false)

  const [form] = Form.useForm()

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'name',

      title: '名称',
      align: 'center',
      width: 300,
    },
    {
      dataIndex: 'publishDate',

      title: '发布时间',
      align: 'center',
      width: 180,
      render(v: string) {
        return moment(v).format('YYYY-MM-DD')
      },
    },
    {
      dataIndex: 'publishOrg',
      ellipsis: true,
      title: '版本',
      align: 'center',
      width: 300,
    },
    {
      dataIndex: 'publishOrg',
      ellipsis: true,
      title: '关联映射表',
      align: 'center',
      width: 260,
    },

    {
      dataIndex: 'remark',

      title: '备注',
      align: 'center',
      ellipsis: true,
      // width: 150,
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      title: '禁用状态',
      ellipsis: true,
      align: 'center',
      width: 140,
      render: (enable: boolean) => {
        console.log(enable, '?a ?')
        return (
          <Space>
            <span>{enable ? '启用' : '停用'}</span>
          </Space>
        )
      },
    },
  ]
  const searchComponent = () => {
    return (
      <TableSearch width="248px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="请输入组合件库名称"
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

  // const setStatus = async (status: boolean, record: any) => {
  //   await modifyMaterialLibraryStatus(record.id)
  //   refresh()
  // }

  const gotoMoreInfo = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const { id } = tableSelectRows?.[0] ?? ''
    history.push(`/technology-economic/suppliesl-infomation?id=${id}`)
  }
  const onFinish = (val: AssemblyLibraryData) => {
    setSpinning(true)
    const data = JSON.parse(JSON.stringify(val))
    data.file = val.file
    // data.enabled = !!data.enabled
    data.name = data.name.trimEnd().trimStart()
    if (data.name === '') {
      message.warning('名称不能为空')
      setSpinning(false)
      return
    }
    data.publishDate = moment(data.publishDate).format('YYYY-MM-DD')
    let urlParams = JSON.parse(JSON.stringify(data))
    delete urlParams.file
    addMaterialLibrary({ file: data.file }, urlParams)
      .then(() => {
        setSpinning(false)
        setAddFormVisible(false)
        form.resetFields()
        refresh()
      })
      .finally(() => {
        setSpinning(false)
      })
  }
  const onRemoveRow = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    confirm({
      title: '确定要删除该物料吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteMaterialLibraryById(tableSelectRows[0].id)
        refresh()
        setTableSelectRows([])
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  const tableElement = () => {
    return (
      <Space>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        <Button className="mr7" onClick={() => gotoMoreInfo()}>
          <ImportOutlined />
          导入映射
        </Button>
        <Button onClick={onRemoveRow} className="mr7">
          <DeleteOutlined />
          删除
        </Button>
      </Space>
    )
  }

  const tableSelectEvent = (data: AssemblyLibraryData[] | Object) => {
    setTableSelectRows(data)
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as ColumnsType<AssemblyLibraryData | object>}
        url="/AssemblyLibrary/QueryAssemblyLibraryPage"
        tableTitle="组合件库管理"
        getSelectData={tableSelectEvent}
        requestSource="tecEco1"
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-组合件库"
        width="550px"
        visible={addFormVisible}
        okText="确认"
        footer={false}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin tip={'上传中...'} spinning={spinning}>
          <Form name="basic" initialValues={{ remember: true }} form={form} onFinish={onFinish}>
            <CyFormItem
              label="名称"
              name="name"
              required
              rules={[{ required: true, message: '请输入名称!' }]}
            >
              <Input placeholder={'请输入名称'} />
            </CyFormItem>

            <CyFormItem
              label="发布时间"
              required
              name="publishDate"
              rules={[{ required: true, message: '请选择发布时间!' }]}
            >
              <DatePicker defaultValue={undefined} />
            </CyFormItem>

            <CyFormItem
              label="上传文件"
              name="file"
              required
              rules={[{ required: true, message: '请上传文件!' }]}
            >
              <FileUpload trigger={triggerUploadFile} maxCount={1} accept=".xls,.xlsx" />
            </CyFormItem>

            <CyFormItem label="备注" name="remark">
              <Input.TextArea rows={3} />
            </CyFormItem>

            {/* <Row gutter={20}></Row> */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Space>
                <Button onClick={() => setAddFormVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit">
                  确定
                </Button>
              </Space>
            </div>
          </Form>
        </Spin>
      </Modal>
    </PageCommonWrap>
  )
}

export default AssemblyLibrary
