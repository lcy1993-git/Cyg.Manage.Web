import CommonTitle from '@/components/common-title'
import WrapperComponent from '@/components/page-common-wrap'
import {
  addArea,
  defaultPriceDifferenceTemplate,
  deleteTemplateItem,
  getAllTemplateItemsById,
  importDefaultTemplateData,
  updateArea,
} from '@/services/technology-economic/spread-coefficient'
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Form, message, Modal, Popconfirm } from 'antd'
import qs from 'qs'
import { useEffect, useState } from 'react'
import AddOrEditForm from './components/add-edit-form'
import ImportTemplateForm from './components/import-template/inex'
import RightComponent from './components/right-component'
import styles from './index.less'

interface ListData {
  item1: string
  item2: string
}

const PriceDifferenceDetails: React.FC = () => {
  const prop = qs.parse(window.location.href.split('?')[1])
  const { id, name } = prop

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [listData, setListData] = useState<ListData[]>([])
  const [activeValue, setActiveValue] = useState<ListData>({ item1: '', item2: '' })
  const [rightData, setRightData] = useState<any>({})
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [importForm] = Form.useForm()
  useEffect(() => {
    getList()
  }, [])
  // 列表刷新
  const refresh = () => {
    getList()
  }
  const getList = async () => {
    // console.log(1412293753747296256);
    const result = await getAllTemplateItemsById(id)
    setListData(result.content)
    setActiveValue(result.content[0])
    getRightData(result.content[0] ? result.content[0].item2 : {})
  }
  const getRightData = async (id: string) => {
    const result = await defaultPriceDifferenceTemplate(id)
    setRightData(result.content)
  }
  // const {
  //   data: listData = [],
  //   run: listDataRun,
  //   loading: preLoading,
  // } = useRequest<ListData[]>(getRateTypeList, {
  //   manual: true,
  //   onSuccess: (res) => {
  //     setActiveValue(res[0]);
  //   },
  // });

  // useMount(() => {
  //   listDataRun();
  // });

  const listDataElement = listData.map((item) => {
    return (
      <div
        className={`${styles.listElementItem} ${
          item?.item2 === activeValue?.item2 ? styles.listActive : ''
        }`}
        key={item.item2}
        onClick={() => {
          getRightData(item.item2)
          setActiveValue(item)
        }}
      >
        {item.item1}
      </div>
    )
  })
  // 创建按钮
  const addEvent = () => {
    setAddFormVisible(true)
  }

  // 删除
  const sureDeleteData = async () => {
    if (!activeValue) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const params = [activeValue.item2]
    await deleteTemplateItem(params)
    refresh()
    message.success('删除成功')
  }

  // 编辑
  const editEvent = () => {
    if (activeValue && activeValue.item2) {
      setEditFormVisible(true)
      editForm.setFieldsValue({
        item1: activeValue.item1,
      })
    }
  }
  // 导入模板modal
  const importTemplate = () => {
    setImportFormVisible(true)
  }
  // 新增确认按钮
  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {
      let value: any = {}
      value.area = values.item1 ? values.item1 : ''
      value.files = values.file
      value.templateId = id
      let urlParams = JSON.parse(JSON.stringify(value))
      delete urlParams.files
      await addArea({ files: value.files }, urlParams)
      refresh()
      setAddFormVisible(false)
      addForm.resetFields()
    })
  }
  // 编辑确认按钮
  const sureEditAuthorization = () => {
    editForm.validateFields().then(async (values) => {
      let value = values
      value.area = values.item1 ? values.item1 : ''
      value.templateId = id
      value.templateItemId = activeValue.item2
      let urlParams = JSON.parse(JSON.stringify(value))
      delete urlParams.file
      // TODO 编辑接口
      await updateArea({ file: value.file }, urlParams)
      refresh()
      setEditFormVisible(false)
      editForm.resetFields()
    })
  }
  // 导入模板确认
  const sureImportTemplate = () => {
    importForm.validateFields().then(async (values) => {
      values.templateId = id
      const urlParams = JSON.parse(JSON.stringify(values))
      delete urlParams.files
      await importDefaultTemplateData({ files: values?.files }, urlParams) // TODO
      refresh()
      setImportFormVisible(false)
      importForm.resetFields()
    })
  }
  return (
    <WrapperComponent>
      <div className={styles.allDiv}>
        <div className={styles.topDiv}>
          <div className={styles.topDivTitle}>
            <CommonTitle>{name}价差详情</CommonTitle>
          </div>
          <div className={styles.importButton}>
            <div>
              <Button type="primary" className="mr7" onClick={() => addEvent()}>
                <PlusOutlined />
                添加
              </Button>
              <Button className="mr7" onClick={() => editEvent()}>
                <EditOutlined />
                编辑
              </Button>
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
              <Button className="mr7" onClick={() => importTemplate()}>
                <EyeOutlined />
                导入模板
              </Button>
            </div>
          </div>
        </div>
        {/* <Spin spinning={preLoading}> */}
        <div className={styles.bottomContainer}>
          <div className={styles.containerLeft}>
            <div className={styles.containerLeftTitle}>目录</div>
            <div className={styles.listElement}>{listDataElement}</div>
          </div>
          <div className={styles.containerRight}>
            <div className={styles.body}>
              <RightComponent rightData={rightData} />
            </div>
          </div>
        </div>
        {/* </Spin> */}
      </div>
      <Modal
        maskClosable={false}
        title="添加-价差地区"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <AddOrEditForm type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-价差地区"
        width="880px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <AddOrEditForm type="edit" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="导入-价差模板"
        width="880px"
        visible={importFormVisible}
        okText="确认"
        onOk={() => sureImportTemplate()}
        onCancel={() => setImportFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={importForm} preserve={false}>
          <ImportTemplateForm type="edit" />
        </Form>
      </Modal>
    </WrapperComponent>
  )
}

export default PriceDifferenceDetails
