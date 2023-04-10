import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Switch,
} from 'antd'
import type { ColumnsType } from 'antd/lib/table/Table'
import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './index.less'
import {
  queryCommonlyTablePager,
  addCommonlyTable,
  deleteCommonlyTable,
  editCommonlyTable,
  SetCommonlyTableStatus,
} from '@/services/technology-economic/usual-quota-table'
import type { CommonlyTableForm } from '@/services/technology-economic/usual-quota-table'
import moment from 'moment'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import WrapperComponent from '@/components/page-common-wrap'
import GeneralTable from '@/components/general-table'
import _ from 'lodash'

interface Props {}

interface CommonlyTable {
  id: string
  number: string
  name: string
  commonlyTableType: number
  commonlyTableTypeText: string
  sourceFile: string
  publishDate: moment.Moment | string
  publishOrg: string
  year: moment.Moment | string
  industryType: number
  industryTypeText: string
  majorType: number
  majorTypeText: string
  remark: string
  enabled: boolean
}

const { Option } = Select
const { confirm } = Modal
const industryType = [
  {
    value: 0,
    text: '配电',
  },
  {
    value: 1,
    text: '变电',
  },
  {
    value: 2,
    text: '输电',
  },
]
const majorType = [
  {
    value: '建筑',
    text: '建筑',
  },
  {
    value: '安装',
    text: '安装',
  },
  {
    value: '拆除',
    text: '拆除',
  },
  {
    value: '余物清理',
    text: '余物清理',
  },
  {
    value: '全部',
    text: '全部',
  },
]
const UsualQuotaTable: React.FC<Props> = () => {
  const [dataSource, setDataSource] = useState<CommonlyTable[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [commonlyTableType, setCommonlyTableType] = useState<{ value: string; text: string }[]>([])
  const [selectRow, setSelectRow] = useState<Record<string, any>[]>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const tableRef = useRef<any>(null)
  const [form] = Form.useForm()
  const history = useHistory()

  const setStatus = async (status: boolean, row: CommonlyTable) => {
    await SetCommonlyTableStatus(row.id, status)
    if (tableRef?.current) {
      tableRef.current?.refresh()
    }
  }
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      width: 80,
      dataIndex: 'number',
    },
    // {
    //   dataIndex: 'name',
    //   key: 'name',
    //   title: '名称',
    //   align: 'center',
    //   width: 170,
    // },
    {
      dataIndex: 'commonlyTableTypeText',

      title: '费率类型',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'sourceFile',

      ellipsis: true,
      title: '来源文件',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'publishDate',

      title: '发布时间',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (text: any) => {
        return moment(text).format('YYYY/MM/DD')
      },
    },
    {
      dataIndex: 'publishOrg',

      title: '发布机构',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      dataIndex: 'year',

      title: '费率年度',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'industryTypeText',

      title: '行业类别',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'majorType',

      title: '适用专业',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'enabled',

      title: '状态',
      width: 120,
      align: 'center',
      render: (enable: boolean, record: any) => {
        return (
          <Space>
            <Switch checked={enable} onChange={(status) => setStatus(status, record)} />
            <span>{enable ? '启用' : '停用'}</span>
          </Space>
        )
      },
    },
    {
      dataIndex: 'remark',

      title: '备注',
      width: 100,
      align: 'center',
    },
  ]
  const addCommonly = () => {
    setIsEdit(false)
    form.resetFields()
    setIsModalVisible(true)
  }
  const onFinish = (val: CommonlyTableForm) => {
    setSpinning(true)
    const data = { ...val }
    data.publishDate = moment(val.publishDate).format('YYYY/MM/DD')
    data.year = moment(val.year).format('YYYY')
    if (isEdit) {
      data.id = selectRow[0].id
    }
    if (isEdit) {
      editCommonlyTable(data)
        .then(() => {
          message.success('修改成功')
          form.resetFields()
          setIsModalVisible(false)
          setIsEdit(false)
          tableRef.current?.reset()
          tableRef.current?.refresh()
        })
        .finally(() => {
          setSpinning(false)
        })
    } else {
      addCommonlyTable(data)
        .then(() => {
          message.success('添加成功')
          form.resetFields()
          setIsModalVisible(false)
          setIsEdit(false)
          tableRef.current?.reset()
          tableRef.current?.refresh()
        })
        .finally(() => {
          setSpinning(false)
        })
    }
    // if (tableRef?.current){
    tableRef.current?.refresh()
    // }
  }
  const onFinishFailed = (err: any) => {
    console.error(err)
  }
  const getCommonlyTableType = async () => {
    const res = localStorage.getItem('technologyEconomicEnums')
    if (res === null) return
    const type = JSON.parse(res)?.find(
      (item: { code: string }) => item.code === 'CommonlyTableType'
    )?.items
    setCommonlyTableType(type)
  }

  const tableOnSelect = (val: object[]) => {
    setSelectRow(val)
  }
  const removeRow = () => {
    if (selectRow.length === 0) {
      message.warn('请选择一行数据')
      return
    }
    confirm({
      title: '确定要删除该行数据吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteCommonlyTable(selectRow[0].id)
        message.success('删除成功!')
        if (tableRef?.current) {
          tableRef.current?.refresh()
        }
      },
    })
  }
  const showDetail = () => {
    if (selectRow.length === 0) {
      message.warn('请选择一行数据')
      return
    }
    history.push('/technology-economic/usual-quota-table/detail', {
      id: selectRow[0].id,
    })
  }
  const editRow = () => {
    if (selectRow.length === 0) {
      message.warn('请选择一行数据')
      return
    }
    setIsEdit(true)
    const current = _.cloneDeep(selectRow[0])
    if (current) {
      current.publishDate = moment(moment(current?.publishDate).format('YYYY-MM-DD'))
      current.year = moment(current?.year)
      setIsModalVisible(true)
      form.setFieldsValue(current)
    }
  }
  const getAllList = async () => {
    const res = await queryCommonlyTablePager({
      pageIndex: 1,
      pageSize: 10000,
      sort: {
        propertyName: '',
        isAsc: false,
      },
      keyWord: '',
    })
    setDataSource(res.items)
  }
  const tableElement = () => {
    return (
      <div className={styles.usualQuotaTable}>
        <div className={styles.topButtons}>
          <Space>
            <Button type={'primary'} onClick={showDetail}>
              <EyeOutlined />
              费率详情
            </Button>
            <Button type={'primary'} onClick={addCommonly}>
              <PlusOutlined />
              添加
            </Button>
            <Button onClick={editRow}>
              <EditOutlined />
              编辑
            </Button>
            <Button onClick={removeRow}>
              <DeleteOutlined />
              删除
            </Button>
          </Space>
        </div>
      </div>
    )
  }
  const searchComponent = () => {
    return <div></div>
  }
  useEffect(() => {
    getAllList()
    getCommonlyTableType()
  }, [])
  return (
    <WrapperComponent>
      <div>
        <GeneralTable
          ref={tableRef}
          needCommonButton={true}
          buttonRightContentSlot={tableElement}
          buttonLeftContentSlot={searchComponent}
          columns={columns as ColumnsType<object>}
          url="/CommonlyTable/QueryCommonlyTablePager"
          tableTitle="定额计价(安装乙供设备计入设备购置费)-常用费率"
          getSelectData={tableOnSelect}
          requestSource="tecEco1"
          type="radio"
        />
        <Modal
          title={`${isEdit ? '编辑' : '添加'}定额常用表`}
          visible={isModalVisible}
          destroyOnClose={true}
          footer={null}
          width={800}
          onCancel={() => setIsModalVisible(false)}
        >
          <Spin spinning={spinning}>
            <Form
              name="basic"
              initialValues={{ remember: true }}
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="序号"
                    name="number"
                    rules={[{ required: true, message: '请输入序号!' }]}
                  >
                    <InputNumber
                      min={0}
                      step={1}
                      precision={0}
                      style={{ width: '100% !important' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="费率年度" name="year">
                    <DatePicker picker="year" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="常用表类型"
                    name="commonlyTableType"
                    rules={[{ required: true, message: '请选择常用表类型!' }]}
                  >
                    <Select disabled={isEdit}>
                      {commonlyTableType.map((item) => {
                        return (
                          <Option
                            value={item.value}
                            key={item.value}
                            disabled={dataSource.some((i) => i.commonlyTableTypeText === item.text)}
                          >
                            {item.text}
                          </Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="行业类别"
                    name="industryType"
                    rules={[{ required: true, message: '请选择行业类别!' }]}
                  >
                    <Select>
                      {industryType.map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.text}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item
                    label="来源文件"
                    name="sourceFile"
                    rules={[{ required: true, message: '请输入来源文件!' }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="适用专业"
                    name="majorType"
                    // rules={[{required: true, message: '请选择适用专业!'}]}
                  >
                    <Select>
                      {majorType.map((item) => (
                        <Option value={item.value} key={item.value}>
                          {item.text}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="发布时间" name="publishDate">
                    <DatePicker />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="备注" name="remark">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col span={12}>
                  <Form.Item label="发布机构" name="publishOrg">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="状态" name="enabled" valuePropName="checked">
                    <Switch defaultChecked />
                  </Form.Item>
                </Col>
              </Row>
              <div style={{ display: 'flex', justifyContent: 'right' }}>
                <Space>
                  <Button onClick={() => setIsModalVisible(false)}>取消</Button>
                  <Button type="primary" htmlType="submit">
                    确定
                  </Button>
                </Space>
              </div>
            </Form>
          </Spin>
        </Modal>
      </div>
    </WrapperComponent>
  )
}

export default UsualQuotaTable
