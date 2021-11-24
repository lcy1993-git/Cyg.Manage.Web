import React, { useEffect, useState } from 'react'
import { history } from 'umi'
import {
  Input,
  Button,
  Modal,
  Form,
  Switch,
  message,
  Space,
  Row,
  Col,
  DatePicker,
  Select,
  Spin,
} from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { isArray } from 'lodash'

import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'

import { GetMaterialLibraryAllListNoUsed } from '@/services/technology-economic/supplies-library'
import FileUpload from '@/components/file-upload'
import useBoolean from 'ahooks/lib/useBoolean'
import moment from 'moment'
import {
  addSourceMaterialMappingQuota,
  deleteMaterialMappingQuota,
  materialMappingQuotaModifyStatus,
} from '@/services/technology-economic/material'
// import AdjustmentFileForm from "@/pages/technology-economic/spread-coefficient/components/adjustment-file-form";

export interface SuppliesLibraryData {
  id?: string
  name: string
  publishOrg: string
  publishDate: string | moment.Moment
  remark: string
  // "enabled": boolean
  file: any
}

const { Search } = Input

const { confirm } = Modal
const { Option } = Select

const MaterialMapping: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<SuppliesLibraryData[] | Object>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)

  const [materialList, setMaterialList] = useState<{ name: string; id: string }[]>([])
  const [triggerUploadFile] = useBoolean(false)

  const [form] = Form.useForm()

  const getMaterialData = async () => {
    const res = await GetMaterialLibraryAllListNoUsed()
    setMaterialList(res)
  }
  useEffect(() => {
    getMaterialData()
  }, [])
  const columns: ColumnsType<any> = [
    {
      dataIndex: 'name',
      key: 'name',
      title: '名称',
      align: 'center',
      width: 170,
    },
    {
      dataIndex: 'publishDate',
      key: 'publishDate',
      title: '发布时间',
      align: 'center',
      width: 80,
      render(value: string): string {
        return `${moment(value).format('YYYY-MM-DD')}`
      },
    },
    {
      dataIndex: 'publishOrg',
      key: 'publishOrg',
      ellipsis: true,
      title: '发布机构',
      align: 'center',
      width: 170,
    },
    // {
    //   dataIndex: 'enabled',
    //   key: 'enabled',
    //   title: '状态',
    //   ellipsis: true,
    //   align: 'center',
    //   width: 140,
    //   render: (enable: boolean, record: any) => {
    //     return (
    //       <Space>
    //         <Switch checked={enable} onChange={(status) => setStatus(status, record)}/>
    //         <span>{enable ? '启用' : '停用'}</span>
    //       </Space>
    //     )
    //   }
    // },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '说明',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
  ]
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
    getMaterialData()
    setAddFormVisible(true)
    form.resetFields()
  }

  const setStatus = async (status: boolean, record: any) => {
    await materialMappingQuotaModifyStatus(record.id)
    refresh()
  }

  const gotoMoreInfo = () => {
    if (tableSelectRows?.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const { id, sourceMaterialLibraryId } = tableSelectRows?.[0] ?? ''
    history.push(
      `/technology-economic/mapping-infomation?id=${id}&sourceMaterialLibraryId=${sourceMaterialLibraryId}`
    )
  }
  const onFinish = (val: SuppliesLibraryData) => {
    setSpinning(true)

    const data = JSON.parse(JSON.stringify(val))
    // data.enabled = !!data.enabled
    data.file = val.file
    data.publishDate = moment(data.publishDate).format('YYYY-MM-DD')
    addSourceMaterialMappingQuota(data)
      .then(() => {
        setAddFormVisible(false)
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
      title: '确定要删除该物料映射吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteMaterialMappingQuota(tableSelectRows[0].id)
        refresh()
        setTableSelectRows([])
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

        <Button onClick={onRemoveRow} className="mr7">
          <DeleteOutlined />
          删除
        </Button>
        <Button className="mr7" onClick={() => gotoMoreInfo()}>
          <EyeOutlined />
          查看详情
        </Button>
      </Space>
    )
  }

  const tableSelectEvent = (data: SuppliesLibraryData[] | Object) => {
    setTableSelectRows(data)
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as ColumnsType<SuppliesLibraryData | object>}
        url="/MaterialLibrary/GetSourceMaterialMappingLibraryList"
        tableTitle="物料库映射管理"
        getSelectData={tableSelectEvent}
        requestSource="tecEco1"
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-物料库映射"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        footer={false}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={spinning}>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            form={form}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
          >
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[{ required: true, message: '请输入名称!' }]}
                >
                  <Input placeholder={'请输入名称'} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="发布时间" name="publishDate">
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item label="发布机构" name="publishOrg">
                  <Input />
                </Form.Item>
              </Col>
              {/*<Col span={12}>*/}
              {/*  <Form.Item*/}
              {/*    label="状态"*/}
              {/*    name="enabled"*/}
              {/*  >*/}
              {/*    <Switch/>*/}
              {/*  </Form.Item>*/}
              {/*</Col>*/}

              <Col span={12}>
                <Form.Item
                  label="关联物料库"
                  name="sourceMaterialLibraryId"
                  rules={[{ required: true, message: '请选择关联物料库!' }]}
                >
                  <Select>
                    {materialList.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  label="上传文件"
                  name="file"
                  rules={[{ required: true, message: '请上传物料库文件!' }]}
                >
                  <FileUpload trigger={triggerUploadFile} maxCount={1} accept=".xls,.xlsx" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item label="说明" name="remark">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
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

export default MaterialMapping
