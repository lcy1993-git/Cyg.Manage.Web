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
  Switch,
  Table
} from "antd";
import type {ColumnsType} from "antd/lib/table/Table";
import React, {useEffect, useState} from "react";
import { useHistory } from 'react-router-dom';
import styles from './index.less'
import {
  queryCommonlyTablePager,
  getCommonlyTableTypeList,
  addCommonlyTable,
  deleteCommonlyTable,
  editCommonlyTable,
  SetCommonlyTableStatus
} from "@/services/technology-economic/usual-quota-table";
import type {QueryData, CommonlyTableForm} from "@/services/technology-economic/usual-quota-table";
import moment from "moment";
import {ExclamationCircleOutlined} from "@ant-design/icons";

interface Props {
}

interface CommonlyTable {
  "id": string;
  "number": string;
  "name": string;
  "commonlyTableType": number
  "commonlyTableTypeText": string;
  "sourceFile": string;
  "publishDate": moment.Moment | string
  "publishOrg": string;
  "year": moment.Moment | string;
  "industryType": number
  "industryTypeText": string;
  "majorType": number
  "majorTypeText": string;
  "remark": string;
  "enabled": boolean
}

const {Option} = Select
const {confirm} = Modal;
const industryType = [
  {
    value: 0,
    text: '配电'
  }, {
    value: 1,
    text: '变电'
  }, {
    value: 2,
    text: '输电'
  },
]
const majorType = [
  {
    value: 0,
    text: '建筑'
  }, {
    value: 1,
    text: '安装'
  }, {
    value: 2,
    text: '拆除'
  }, {
    value: 3,
    text: '余物清理'
  }, {
    value: 4,
    text: '全部'
  },
]
const UsualQuotaTable: React.FC<Props> = () => {
  const [dataSource, setDataSource] = useState<CommonlyTable[]>([])
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [commonlyTableType, setCommonlyTableType] = useState<{ value: string, text: string }[]>([])
  const [queryData, setQueryData] = useState<QueryData>({} as QueryData)
  const [selectRow, setSelectRow] = useState<React.Key[]>([])
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [form] = Form.useForm();
  const history = useHistory();

  const getTableData = async () => {
    const res = await queryCommonlyTablePager(queryData)
    setDataSource(res?.items)
  }
  const setStatus = async (status: boolean,row: CommonlyTable)=>{
    await SetCommonlyTableStatus(row.id,status)
    getTableData()
  }
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      width: 80,
      dataIndex:'number'
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: '名称',
      align: 'center',
      width: 170,
    },
    {
      dataIndex: 'commonlyTableTypeText',
      key: 'commonlyTableTypeText',
      title: '费率类型',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'sourceFile',
      key: 'sourceFile',
      ellipsis: true,
      title: '来源文件',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'publishDate',
      key: 'publishDate',
      title: '发布时间',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (text: any) => {
        return moment(text).format('YYYY/MM/DD')
      }
    },
    {
      dataIndex: 'publishOrg',
      key: 'publishOrg',
      title: '发布机构',
      align: 'center',
      ellipsis: true,
      width: 150
    },
    {
      dataIndex: 'year',
      key: 'year',
      title: '费率年度',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'industryTypeText',
      key: 'industryTypeText',
      title: '行业类别',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'majorTypeText',
      key: 'majorTypeText',
      title: '适用专业',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      title: '状态',
      width: 120,
      align: 'center',
      render: (enable: boolean,record: any) => {
        return (
          <Space>
            <Switch checked={enable}  onChange={(status)=>setStatus(status,record)}/>
            <span>{enable ? '启用' : '停用'}</span>
          </Space>
        )
      }
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '备注',
      width: 100,
      align: 'center',
    },
  ];
  const addCommonly = () => {
    setIsEdit(false)
    form.resetFields()
    setIsModalVisible(true)
  }
  const onFinish = async (val: CommonlyTableForm) => {
    const data = {...val}
    data.publishDate = moment(val.publishDate).format('YYYY/MM/DD')
    data.year = moment(val.year).format('YYYY')
    if (isEdit) {
      data.id= selectRow[0] as string
    }
    if (isEdit){
      await editCommonlyTable(data)
      message.success('修改成功')
      setIsModalVisible(false)
      setIsEdit(false)
    } else {
      await addCommonlyTable(data)
      message.success('添加成功')
      setIsModalVisible(false)
      setIsEdit(false)
    }
    getTableData()
  }
  const onFinishFailed = (err: any) => {
    console.log(err)
  }
  const getCommonlyTableType = async () => {
    const res = await getCommonlyTableTypeList()
    setCommonlyTableType(res)
  }
  const pageChange = (pagination: any)=>{
    console.log(pagination)
    getTableData()
  }
  const tableOnSelect = (val: React.Key[]) => {
    setSelectRow(val)
  }
  const removeRow = () => {
    if (selectRow.length === 0) {
      message.warn('请选择一行数据')
      return
    }
    confirm({
      title: '确定要删除该行数据吗?',
      icon: <ExclamationCircleOutlined/>,
      async onOk() {
        await deleteCommonlyTable(selectRow[0] as string)
        message.success('删除成功!')
        getTableData()
      }
    });
  }
  const showDetail = () => {
    if (selectRow.length === 0) {
      message.warn('请选择一行数据')
      return
    }
    history.push('/technology-economic/usual-quota-table/detail',{
      id:selectRow[0]
    })
  }
  const editRow = () => {
    if (selectRow.length === 0) {
      message.warn('请选择一行数据')
      return
    }
    setIsEdit(true)
    const current = dataSource.find(i => i.id === selectRow[0])
    // 此处后端测试数据不对,暂时使用模拟数据
    if (current) {
      current.publishDate = moment('2021/07/01')
      current.year = moment('2021')
      setIsModalVisible(true)
      form.setFieldsValue(current)
    }
  }
  useEffect(() => {
    setQueryData({
      "pageIndex": 1,
      "pageSize": 10,
      "sort": {
        "propertyName": '',
        "isAsc": false
      },
      "keyWord": ''
    })
    getTableData()
    getCommonlyTableType()
  }, [])
  return (
    <div className={styles.usualQuotaTable}>
      <div className={styles.topButtons}>
        <Space>
          <Button type={'primary'} onClick={showDetail}>费率详情</Button>
          <Button type={'primary'} onClick={addCommonly}>添加</Button>
          <Button onClick={editRow}>编辑</Button>
          <Button onClick={removeRow}>删除</Button>
        </Space>
      </div>

      <Table
        dataSource={dataSource}
        rowKey={'id'}
        onChange={pageChange}
        rowSelection={{
          type: 'radio',
          onChange: (val) => {
            tableOnSelect(val)
          }
        }}
        columns={columns}/>;

      <Modal
        title="添加定额常用表"
        visible={isModalVisible}
        destroyOnClose={true}
        footer={null}
        width={800}
        onCancel={() => setIsModalVisible(false)}>
        <Form
          name="basic"
          initialValues={{remember: true}}
          form={form}
          labelCol={{span: 8}}
          wrapperCol={{span: 16}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="序号"
                name="number"
                rules={[{required: true, message: '请输入序号!'}]}
              >
                <InputNumber min={0} step={1} precision={0} style={{width: '100% !important'}}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="费率年度"
                name="year"
              >
                <DatePicker picker="year"/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="常用表类型"
                name="commonlyTableType"
                rules={[{required: true, message: '请选择常用表类型!'}]}
              >
                <Select disabled={isEdit}>
                  {
                    commonlyTableType.map((item) => {
                        return (
                          <Option
                            value={item.value}
                            key={item.value}
                            disabled={dataSource.some(i => i.id === item.value)}
                          >{item.text}</Option>
                        )
                      }
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="行业类别"
                name="industryType"
                rules={[{required: true, message: '请选择行业类别!'}]}
              >
                <Select>
                  {
                    industryType.map(item => <Option value={item.value} key={item.value}>{item.text}</Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="来源文件"
                name="sourceFile"
                rules={[{required: true, message: '请输入来源文件!'}]}
              >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="适用专业"
                name="majorType"
                rules={[{required: true, message: '请选择适用专业!'}]}
              >
                <Select>
                  {
                    majorType.map(item => <Option value={item.value} key={item.value}>{item.text}</Option>
                    )
                  }
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="发布时间"
                name="publishDate"
              >
                <DatePicker/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="备注"
                name="remark"
              >
                <Input/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                label="发布机构"
                name="publishOrg"
              >
                <Input/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="状态"
                name="enabled"
              >
                <Switch/>
              </Form.Item>
            </Col>
          </Row>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default UsualQuotaTable;
