import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { EditOutlined, ImportOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons'
import { Input, Button, Modal, Form, message, Spin, Dropdown, Menu } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import {
  getResourceLibDetail,
  addResourceLibItem,
  updateResourceLibItem,
  restartResourceLib,
} from '@/services/resource-config/resource-lib'
import { isArray } from 'lodash'
import ResourceLibForm from '../canon-resource-lib/./components/add-edit-form'
import UploadDrawing from '../canon-resource-lib/./components/upload-drawing'
import { getUploadUrl } from '@/services/resource-config/drawing'
import SaveImportLib from '../canon-resource-lib/./components/upload-lib'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import EnumSelect from '@/components/enum-select'
import { BelongManageEnum } from '@/services/personnel-config/manage-user'
import { history } from 'umi'
import { useLayoutStore } from '@/layouts/context'
import { useMemo } from 'react'
import UploadAll from '../canon-resource-lib/./components/upload-all'
import ResourceLibraryManageModal from '../canon-resource-lib/./components/resource-library-manage-modal'

const { Search } = Input

const ResourceLib: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)

  const [uploadDrawingVisible, setUploadDrawingVisible] = useState<boolean>(false)
  const [uploadLibVisible, setUploadLibVisible] = useState<boolean>(false)
  const [uploadAllVisible, setUploadAllVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [status, setStatus] = useState<string>('0')
  const [libVisible, setLibVisible] = useState(false)
  const [libId, setLibId] = useState<string>('')
  const [currentCompanyManageId, setCurrentCompanyManageId] = useState<string>(
    window.localStorage.companyManageId
  ) //当前管理 模块的资源库Id

  const { data: keyData } = useRequest(() => getUploadUrl())

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getResourceLibDetail, {
    manual: true,
  })

  const { companyResourceManageFlag } = useLayoutStore()

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        {/* <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入资源库"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="资源库状态" width="300px">
          <EnumSelect
            enumList={BelongManageEnum}
            onChange={(value) => searchByStatus(value)}
            placeholder="-全部-"
          />
        </TableSearch> */}
      </div>
    )
  }

  const searchByStatus = (value: any) => {
    setStatus(value)
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        status: value,
      })
    }
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

  const columns = useMemo(() => {
    if (!companyResourceManageFlag) {
      setCurrentCompanyManageId('')
      return [
        {
          dataIndex: 'libName',
          index: 'libName',
          title: '名称',
          width: 280,
        },
        {
          dataIndex: 'version',
          index: 'version',
          title: '版本',
          width: 140,
        },
        {
          dataIndex: 'remark',
          index: 'remark',
          title: '备注',
        },
        {
          dataIndex: 'action',
          title: '操作',
          width: 100,
          render: (text: any, record: any) => {
            const storage = window.localStorage
            return (
              <span
                className="canClick"
                onClick={() => {
                  setCurrentCompanyManageId(record.id)
                  storage.setItem('companyManageId', record.id)
                  history.push({
                    pathname: `/standard-config/company-resource-manage?libId=${record.id}&&libName=${record.libName}`,
                  })
                }}
              >
                <u>管理</u>
              </span>
            )
          },
        },
      ]
    }
    return [
      {
        dataIndex: 'libName',
        index: 'libName',
        title: '名称',
        width: 280,
      },
      {
        dataIndex: 'version',
        index: 'version',
        title: '版本',
        width: 140,
      },
      {
        dataIndex: 'remark',
        index: 'remark',
        title: '备注',
      },
      {
        dataIndex: '',
        title: '操作',
        width: 100,
        render: (text: any, record: any) => {
          return (
            <span
              className="canClick"
              onClick={() => message.error('已打开"公司资源库模块管理"界面，请关闭后重试')}
            >
              <u>管理</u>
            </span>
          )
        },
      },
    ]
  }, [companyResourceManageFlag])

  //添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const sureAddResourceLib = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libName: '',
          version: '',
          remark: '',
        },
        value
      )
      await addResourceLibItem(submitInfo)
      refresh()
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
    const editDataId = tableSelectRows[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentCompanyManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试')
      return
    }

    setEditFormVisible(true)
    const ResourceLibData = await run(editDataId)

    editForm.setFieldsValue(ResourceLibData)
  }

  const sureEditResourceLib = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = data!

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libName: editData.libName,
          version: editData.version,
          remark: editData.remark,
        },
        values
      )
      await updateResourceLibItem(submitInfo)
      refresh()
      message.success('更新成功')
      editForm.resetFields()
      setEditFormVisible(false)
    })
  }

  //重启资源服务
  const restartLib = async () => {
    await restartResourceLib()
    message.success('操作成功')
  }

  const uploadAllEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const editDataId = tableSelectRows[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentCompanyManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试')
      return
    }
    setLibId(tableSelectRows[0].id)
    setUploadAllVisible(true)
  }

  const importLibEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const editDataId = tableSelectRows[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentCompanyManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试')
      return
    }
    setLibId(tableSelectRows[0].id)
    setUploadLibVisible(true)
  }

  const uploadDrawingEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const editDataId = tableSelectRows[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentCompanyManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试')
      return
    }
    setLibId(tableSelectRows[0].id)
    setUploadDrawingVisible(true)
  }

  const importMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('lib-import-drawing') && (
        <Menu.Item onClick={() => uploadDrawingEvent()}>导入图纸</Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('lib-import-lib') && (
        <Menu.Item onClick={() => importLibEvent()}>导入资源库</Menu.Item>
      )}
    </Menu>
  )

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {/* {buttonJurisdictionArray?.includes('lib-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            创建
          </Button>
        )} */}

        {buttonJurisdictionArray?.includes('lib-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('lib-oneclick-import') && (
          <Button className="mr7" onClick={() => uploadAllEvent()}>
            <ImportOutlined />
            一键导入
          </Button>
        )}

        {buttonJurisdictionArray?.includes('lib-import') && (
          <Dropdown overlay={importMenu}>
            <Button className="mr7">
              <ImportOutlined />
              导入
            </Button>
          </Dropdown>
        )}

        {buttonJurisdictionArray?.includes('lib-restart') && (
          <Button className="mr7" onClick={() => restartLib()}>
            <RedoOutlined />
            重启资源服务
          </Button>
        )}

        {buttonJurisdictionArray?.includes('lib-resource-iterate') && (
          <Button className="mr7" onClick={() => setLibVisible(true)}>
            资源库迭代
          </Button>
        )}
      </div>
    )
  }

  const uploadFinishEvent = () => {
    refresh()
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/ResourceLib/GetPageList"
        tableTitle="资源库管理"
        getSelectData={(data) => setTableSelectRows(data)}
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
          status: status,
        }}
      />
      <Modal
        maskClosable={false}
        title="创建资源库"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddResourceLib()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <ResourceLibForm />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-资源库"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditResourceLib()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <ResourceLibForm />
          </Spin>
        </Form>
      </Modal>

      <UploadDrawing
        libId={libId}
        securityKey={keyData?.uploadChartApiSecurity}
        visible={uploadDrawingVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setUploadDrawingVisible}
      />
      <SaveImportLib
        libId={libId}
        requestSource="resource"
        visible={uploadLibVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setUploadLibVisible}
      />
      <UploadAll
        libId={libId}
        requestSource="resource"
        visible={uploadAllVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setUploadAllVisible}
      />

      {libVisible && (
        <ResourceLibraryManageModal
          visible={libVisible}
          onChange={setLibVisible}
          changeFinishEvent={refresh}
        />
      )}
    </PageCommonWrap>
  )
}

export default ResourceLib
