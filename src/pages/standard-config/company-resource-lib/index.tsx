import PageCommonWrap from '@/components/page-common-wrap'
import { EditOutlined, ImportOutlined, RedoOutlined } from '@ant-design/icons'
import { Input, Button, Modal, Form, message, Spin, Dropdown, Menu, Table } from 'antd'
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
import { history } from 'umi'
import { useLayoutStore } from '@/layouts/context'
import { useMemo } from 'react'
import UploadAll from '../canon-resource-lib/./components/upload-all'
import ResourceLibraryManageModal from '../canon-resource-lib/./components/resource-library-manage-modal'
import EmptyTip from '@/components/empty-tip'
import CommonTitle from '@/components/common-title'

const ResourceLib: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [uploadDrawingVisible, setUploadDrawingVisible] = useState<boolean>(false)
  const [uploadLibVisible, setUploadLibVisible] = useState<boolean>(false)
  const [uploadAllVisible, setUploadAllVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [libVisible, setLibVisible] = useState(false)
  const [libId, setLibId] = useState<string>('')
  const [currentCompanyManageId, setCurrentCompanyManageId] = useState<string>(
    window.localStorage.manageId
  ) //当前管理 模块的资源库Id

  const { data: keyData } = useRequest(() => getUploadUrl())

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getResourceLibDetail, {
    manual: true,
  })

  const { resourceManageFlag } = useLayoutStore()

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const columns = useMemo(() => {
    if (!resourceManageFlag) {
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
                  storage.setItem('manageId', record.id)
                  history.push({
                    pathname: `/standard-config/resource-manage?libId=${record.id}&&libName=${record.libName}`,
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
              onClick={() => message.error('已打开"资源库模块管理"界面，请关闭后重试')}
            >
              <u>管理</u>
            </span>
          )
        },
      },
    ]
  }, [resourceManageFlag])

  //编辑
  const editEvent = async () => {
    const editDataId = tableData[0].id

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
    const editDataId = tableData[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentCompanyManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试')
      return
    }
    setLibId(tableData[0].id)
    setUploadAllVisible(true)
  }

  const importLibEvent = () => {
    const editDataId = tableData[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentCompanyManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试')
      return
    }
    setLibId(tableData[0].id)
    setUploadLibVisible(true)
  }

  const uploadDrawingEvent = () => {
    if (tableData && isArray(tableData) && tableData.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const editDataId = tableData[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentCompanyManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试')
      return
    }
    setLibId(tableData[0].id)
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
  const tableData = [
    {
      dbName: 'pdd_resource',
      id: '1519857076424179712',
      isDisabled: false,
      libName: '甘肃临夏',
      remark: null,
      rootDirPath: '1519857076424179712',
      version: '1.0',
    },
  ]

  return (
    <PageCommonWrap>
      <div className={styles.cyGeneralTableTitleContnet}>
        <div className={styles.cyGeneralTableTitleShowContent}>
          {<CommonTitle>{'资源库管理'}</CommonTitle>}
        </div>
      </div>
      <div className={styles.cyGeneralTableButtonContent}>
        <div className={styles.cyGeneralTableButtonRightContent}>{tableElement?.()}</div>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={false}
        bordered={true}
        locale={{
          emptyText: <EmptyTip className="pt20 pb20" />,
        }}
      />
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
