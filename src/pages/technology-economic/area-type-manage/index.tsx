import React, { Fragment, useEffect, useState } from 'react'
import { Button, Modal, Spin, Form, Select, Space, message } from 'antd'
import WrapperComponent from '@/components/page-common-wrap'
import CommonTitle from '@/components/common-title'
import styles from './index.less'
import GeneralTable from '@/components/general-table'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import { useForm } from 'antd/lib/form/Form'
import {
  createOrEditAreaInfo,
  deleteAreaInfo,
  importAreaInfo,
  queryAreaInfoDetail,
  queryAreaInfoList,
  queryBasicAreaByLevel,
} from '@/services/technology-economic/common-rate'
import { generateUUID } from '@/utils/utils'
import FileUpload from '@/components/file-upload'

interface ListData {
  value: string | number
  text: string
}

interface AreaItem {
  areaType: number
  areaTypeText: string
  firstCode: string
  firstName: string
  secondName: string[]
  thirdName: string[]
}

interface LevelItem {
  id: string
  parentId: string
  name: string
}

const { confirm } = Modal
const { Option } = Select
const AreaTypeManage: React.FC = () => {
  const [activeValue, setActiveValue] = useState<ListData>({ value: '1', text: '' }) // 目录选中项
  const [areaList, setAreaList] = useState<AreaItem[]>([]) // 列表
  const [isModalVisible, setIsModalVisible] = useState(false) // 弹窗控制
  const [isEdit, setIsEdit] = useState(false) // 编辑新增判断
  const [firstLevelList, setFirstLevelList] = useState<LevelItem[]>([]) // 一级地区
  const [secondLevelList, setSecondLevelList] = useState<LevelItem[]>([]) // 二级地区
  const [thirdLevelList, setThirdLevelList] = useState<LevelItem[]>([]) // 三级地区
  const [disabledThirdLevel, setDisabledThirdLevel] = useState<boolean>(false) // 禁用第三级地区
  const [selectValue, setSelecrValue] = useState<AreaItem>({} as AreaItem) // 列表选中项
  const [fileList, setFileList] = useState<File[]>([])
  const [importVisibel, setImportVisibel] = useState<boolean>(false)
  const [form] = useForm()

  const columns = [
    {
      dataIndex: 'firstName',
      index: '1',
      title: '一级行政区',
      width: 180,
    },
    {
      dataIndex: 'secondNames',
      index: '2',
      title: '二级行政区',
      width: 180,
      render: (arr: string[]) => {
        return <Fragment>{arr?.join(',')}</Fragment>
      },
    },
    {
      dataIndex: 'thirdNames',
      index: '3',
      title: '三级行政区',
      width: 180,
    },
  ]

  const listData: ListData[] = [
    {
      value: '1',
      text: 'I',
    },
    {
      value: '2',
      text: 'II',
    },
    {
      value: '3',
      text: 'III',
    },
    {
      value: '4',
      text: 'IV',
    },
    {
      value: '5',
      text: 'V',
    },
  ]
  const getLevelList = async (
    level: number,
    parentCode: string[],
    areaType?: number,
    firstCode?: string
  ) => {
    const res = await queryBasicAreaByLevel(level, parentCode, areaType, firstCode)
    if (level === 1) {
      setFirstLevelList(res)
    } else if (level === 2) {
      res.unshift(
        // 添加全部选项
        {
          id: 'all',
          parentId: 'all',
          name: '全部',
        }
      )
      setSecondLevelList(res)
    } else if (level === 3) {
      res.unshift({
        id: 'all',
        parentId: 'all',
        name: '全部',
      })
      setThirdLevelList(res)
    }
  }
  const onOK = () => {
    if (fileList.length === 0) {
      message.error('当前未上传文件')
    } else {
      importAreaInfo(fileList[0]).then(() => {
        message.success('上传成功')
        getAreaListByLevel(Number(activeValue.value))
        setImportVisibel(false)
      })
    }
  }
  // 获取编辑数据
  const turnEditData = async () => {
    const { content } = await queryAreaInfoDetail(selectValue.areaType, selectValue.firstCode)
    if (content.secondCodes.length === 0) {
      // 处理选项['全部']
      content.secondCodes = ['all']
    }
    if (content.thirdCodes.length === 0) {
      // 处理选项['全部']
      content.thirdCodes = ['all']
      setThirdLevelList([
        {
          id: 'all',
          parentId: 'all',
          name: '全部',
        },
      ])
      setDisabledThirdLevel(true)
    }
    await getLevelList(1, ['-1'], content.areaType, content.firstCode)
    await getLevelList(2, content.firstCode, content.areaType, content.firstCode)
    if (!content.secondCodes.includes('all') && content.secondCodes.length === 1) {
      await getLevelList(3, content.secondCodes[0], content.areaType, content.secondCodes[0])
    }
    form.setFieldsValue(content)
  }
  const editEvent = () => {
    if (Object.keys(selectValue).length === 0) {
      message.warn('请选择一行数据')
      return
    }
    form.resetFields()
    setIsModalVisible(true)
    setIsEdit(true)
    turnEditData()
  }
  const addEvent = () => {
    setIsModalVisible(true)
    setIsEdit(false)
    form.resetFields()
  }
  const getAreaListByLevel = async (level: number) => {
    const res = await queryAreaInfoList(level)
    const arr = res.map((item: any) => {
      // eslint-disable-next-line no-param-reassign
      item.id = generateUUID() // 添加唯一标识,解决列表选中出错的问题
      return item
    })
    setAreaList(arr)
  }
  const onFinish = async (values: any) => {
    const data = {
      areaType: +activeValue.value,
      firstCode: values.firstCode,
      secondCodes: values.secondCodes.includes('all') ? [] : values.secondCodes,
      thirdCodes: values.thirdCodes.includes('all') ? [] : values.thirdCodes,
      isEdit: false,
    }
    data.isEdit = isEdit
    await createOrEditAreaInfo(data)
    form.resetFields()
    setIsModalVisible(false)
    getAreaListByLevel(Number(activeValue.value))
  }

  const deleteArea = () => {
    if (!selectValue.firstCode) {
      message.warn('请选择一行数据')
      return
    }
    confirm({
      title: '确定要删除该地区分类吗?',
      icon: <ExclamationCircleOutlined />,
      async onOk() {
        await deleteAreaInfo(selectValue.areaType, selectValue.firstCode)
        message.success('删除成功')
        getAreaListByLevel(Number(activeValue.value))
      },
    })
  }
  const tableRightSlot = (
    <>
      <Button type="primary" className="mr7" onClick={() => addEvent()}>
        <PlusOutlined />
        添加
      </Button>
      <Button className="mr7" onClick={() => editEvent()}>
        <EditOutlined />
        编辑
      </Button>
      <Button className="mr7" onClick={deleteArea}>
        <DeleteOutlined />
        删除
      </Button>
      <Button className="mr7" onClick={() => setImportVisibel(true)}>
        <ImportOutlined />
        导入
      </Button>
    </>
  )

  const getSelectData = (values: object[]) => {
    if (values.length === 0) return
    setSelecrValue(values[0] as AreaItem)
  }

  const onBlur = () => {
    const values = form.getFieldsValue(['secondCodes'])?.secondCodes ?? []
    if (values.includes('all')) {
      // 选中全部的话,清除其他选项
      form.setFieldsValue({
        secondCodes: ['all'],
        thirdCodes: ['all'],
      })
      setDisabledThirdLevel(true)
    } else if (values.length > 1) {
      // 二级多选了,三级默认全部选中
      form.setFieldsValue({
        thirdCodes: ['all'],
      })
      setDisabledThirdLevel(true)
    } else {
      form.setFieldsValue({
        thirdCodes: [],
      })
      setDisabledThirdLevel(false)
    }
    getLevelList(3, values)
  }
  const thirdOnBlur = () => {
    const values = form.getFieldsValue(['thirdCodes'])?.thirdCodes ?? []
    if (values.includes('all')) {
      // 选择了多选,清除其余选项
      form.setFieldsValue({
        thirdCodes: ['all'],
      })
    }
  }
  const listDataElement = listData.map((item) => {
    return (
      <div
        className={`${styles.listElementItem} ${
          item.value === activeValue.value ? styles.listActive : ''
        }`}
        key={item.value}
        onClick={() => setActiveValue(item)}
      >
        {item.text}
      </div>
    )
  })
  useEffect(() => {
    getAreaListByLevel(Number(activeValue.value))
  }, [activeValue])
  useEffect(() => {
    if (isModalVisible) {
      getLevelList(1, ['-1'])
    }
  }, [isModalVisible])
  return (
    <WrapperComponent>
      <div className={styles.imfomationModalWrap}>
        <div className={styles.topContainer}>
          <div className={styles.topContainerTitle}>
            <CommonTitle>地区分类管理</CommonTitle>
          </div>
        </div>
        <Spin spinning={false}>
          <div className={styles.bottomContainer}>
            <div className={styles.containerLeft}>
              <div className={styles.containerLeftTitle}>目录</div>
              <div className={styles.listElement}>{listDataElement}</div>
            </div>
            <div className={styles.containerRight}>
              <div className={styles.body}>
                <GeneralTable
                  url=""
                  noPaging
                  dataSource={areaList}
                  getSelectData={getSelectData}
                  buttonRightContentSlot={() => tableRightSlot}
                  columns={columns}
                />
              </div>
            </div>
          </div>
        </Spin>
      </div>
      <Modal
        title="导入地区分类"
        onOk={onOK}
        onCancel={() => setImportVisibel(false)}
        visible={importVisibel}
      >
        <div className={styles.modalWrap}>
          <div className={styles.row}>
            <span className={styles.label}>上传文件</span>
            <FileUpload
              uploadFileBtn
              maxCount={1}
              accept=".xlsx"
              trigger={true}
              process={true}
              onChange={(e) => setFileList(e)}
              className={styles.file}
              uploadFileFn={async () => {}}
            />
          </div>
        </div>
      </Modal>
      <Modal
        title={isEdit ? '编辑-地区分类' : '添加-地区分类'}
        visible={isModalVisible}
        width={600}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose={true}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          onFinish={onFinish}
        >
          <Form.Item name="firstCode" label="一级行政区" rules={[{ required: true }]}>
            <Select
              placeholder="请选择一级行政区"
              onChange={(value: string) => getLevelList(2, [value])}
            >
              {firstLevelList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item name="secondCodes" label="二级行政区" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              placeholder="请选择二级行政区"
              onBlur={onBlur}
              onChange={onBlur}
            >
              {secondLevelList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item name="thirdCodes" label="三级行政区" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              disabled={disabledThirdLevel}
              placeholder="请选择三级行政区"
              onBlur={thirdOnBlur}
            >
              {thirdLevelList.map((item) => {
                return (
                  <Option value={item.id} key={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <div style={{ float: 'right' }}>
            <Space>
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button onClick={() => setIsModalVisible(false)}>取消</Button>
            </Space>
          </div>
          <br />
        </Form>
      </Modal>
    </WrapperComponent>
  )
}

export default AreaTypeManage
