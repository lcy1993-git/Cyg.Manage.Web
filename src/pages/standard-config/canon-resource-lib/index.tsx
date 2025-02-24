import EnumSelect from '@/components/enum-select'
import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { useLayoutStore } from '@/layouts/context'
import AuthorizationConfirmation from '@/pages/jurisdiction-config/role-permissions/components/authorization-confirmation'
import { baseUrl } from '@/services/common'
import { BelongManageEnum } from '@/services/personnel-config/manage-user'
import { getUploadUrl } from '@/services/resource-config/drawing'
import {
  addResourceLibItem,
  changeLibStatus,
  exportCompanyLib,
  getResourceLibDetail,
  restartResourceLib,
  updateResourceLibItem,
} from '@/services/resource-config/resource-lib'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { handleDecrypto, uploadAuditLog } from '@/utils/utils'
import {
  EditOutlined,
  ExportOutlined,
  ImportOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
} from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Dropdown, Form, Input, Menu, message, Modal, Spin, Tooltip } from 'antd'
import { isArray } from 'lodash'
import React, { useEffect, useMemo, useState } from 'react'
import { history } from 'umi'
import ResourceLibForm from './components/add-edit-form'
import ResourceLibraryManageModal from './components/resource-library-manage-modal'
import UploadAll from './components/upload-all'
import UploadDrawing from './components/upload-drawing'
import SaveImportLib from './components/upload-lib'
import styles from './index.less'

const { Search } = Input

const ResourceLib: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [libVisible, setLibVisible] = useState(false)
  const [authorizationConfirmation, setAuthorizationConfirmation] = useState<boolean>(false)
  const [uploadDrawingVisible, setUploadDrawingVisible] = useState<boolean>(false)
  const [uploadLibVisible, setUploadLibVisible] = useState<boolean>(false)
  const [uploadAllVisible, setUploadAllVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [status, setStatus] = useState<string>('0')
  const [libId, setLibId] = useState<string>('')
  const [changeItem, setChangeItem] = useState<any>({ id: '', status: 1 })
  const [currentManageId, setCurrentManageId] = useState<string>(window.localStorage.manageId) //当前管理 模块的资源库Id
  const [ifSuccess, setIfSuccess] = useState<boolean>(false)
  const { data: keyData } = useRequest(() => getUploadUrl())

  //导出加载
  const [exportLoading, setExportLoading] = useState<boolean>(false)

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getResourceLibDetail, {
    manual: true,
  })

  const { resourceManageFlag } = useLayoutStore()

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="230px">
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
        </TableSearch>
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
    if (!resourceManageFlag) {
      setCurrentManageId('')
      return [
        // {
        //   dataIndex: 'id',
        //   index: 'id',
        //   title: '编号',
        //   width: 180,
        // },
        {
          dataIndex: 'libName',
          index: 'libName',
          title: '名称',
          width: 280,
        },
        // {
        //   dataIndex: 'dbName',
        //   index: 'dbName',
        //   title: '数据库',
        //   width: 240,
        // },
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
          //   width: 200,
        },
        {
          dataIndex: 'isDisabled',
          index: 'isDisabled',
          title: () => {
            return (
              <span>
                禁用状态
                <Tooltip
                  title="“禁用”表示当前资源库不可被新立项工程调用，已立项并调用该资源库的工程不受影响。"
                  placement="top"
                >
                  <QuestionCircleOutlined style={{ paddingLeft: 15 }} />
                </Tooltip>
              </span>
            )
          },
          width: 150,
          render: (text: any, record: any) => {
            const isChecked = !record.isDisabled
            return (
              <>
                {buttonJurisdictionArray?.includes('lib-status') &&
                  (isChecked ? (
                    <span
                      style={{ cursor: 'pointer' }}
                      className="colorPrimary"
                      onClick={() => updateStatusEvent(record.id, 2)}
                    >
                      启用
                    </span>
                  ) : (
                    <span
                      onClick={() => updateStatusEvent(record.id, 1)}
                      style={{ cursor: 'pointer' }}
                      className="colorRed"
                    >
                      禁用
                    </span>
                  ))}
                {!buttonJurisdictionArray?.includes('lib-status') && (
                  <>
                    {isChecked ? (
                      <span className="colorPrimary">启用</span>
                    ) : (
                      <span className="colorRed">禁用</span>
                    )}
                  </>
                )}
              </>
            )
          },
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
                  setCurrentManageId(record.id)
                  storage.setItem('manageId', record.id)
                  history.push(
                    `/standard-config/resource-manage?libId=${record.id}&&libName=${encodeURI(
                      record.libName
                    )}`
                  )
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
      // {
      //   dataIndex: 'id',
      //   index: 'id',
      //   title: '编号',
      //   width: 180,
      // },
      {
        dataIndex: 'libName',
        index: 'libName',
        title: '名称',
        width: 280,
      },
      // {
      //   dataIndex: 'dbName',
      //   index: 'dbName',
      //   title: '数据库',
      //   width: 240,
      // },
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
        //   width: 200,
      },
      {
        dataIndex: 'isDisabled',
        index: 'isDisabled',
        title: () => {
          return (
            <span>
              禁用状态
              <Tooltip
                title="“已禁用”表示当前资源库不可被新立项工程调用，已立项并调用该资源库的工程不受影响。"
                placement="right"
              >
                <QuestionCircleOutlined style={{ paddingLeft: 15 }} />
              </Tooltip>
            </span>
          )
        },
        width: 150,
        render: (text: any, record: any) => {
          const isChecked = !record.isDisabled
          return (
            <>
              {isChecked ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                  onClick={() => updateStatusEvent(record.id, 2)}
                >
                  启用
                </span>
              ) : (
                <span
                  onClick={() => updateStatusEvent(record.id, 1)}
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                >
                  禁用
                </span>
              )}
            </>
          )
        },
      },

      {
        dataIndex: '',
        title: '操作',
        width: 100,
        render: () => {
          return (
            <span
              className="canClick"
              onClick={() => message.error('当前资源库已打开"模块管理"界面，请关闭后重试')}
            >
              <u>管理</u>
            </span>
          )
        },
      },
    ]
  }, [resourceManageFlag])

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
    if (editDataId === currentManageId) {
      message.error('已打开"资源库模块管理"界面，请关闭后重试')
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
    setAuthorizationConfirmation(true)
    // await restartResourceLib()
    // message.success('操作成功')
  }

  const uploadAllEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行')
      return
    }
    const editDataId = tableSelectRows[0].id

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentManageId) {
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
    if (editDataId === currentManageId) {
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
    if (editDataId === currentManageId) {
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

  /**导出资源库 */
  const exportLibEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('未选择典设资源库')
      return
    }

    try {
      setExportLoading(true)
      const res = await exportCompanyLib(tableSelectRows[0].id)
      let blob = new Blob([res], {
        type: 'application/zip',
      })
      let reader = new FileReader()
      reader.readAsText(blob, 'utf-8')
      reader.onload = (result: any) => {
        // 此处代码用于判断当前加密返回结果是否报错，如报错，则不导出文件且提示，否则导出文件
        const resData = result.target.result
        if (resData.slice(0, 2) === '04') {
          const handleBlobMsg = handleDecrypto(resData)
          message.error(handleBlobMsg.message)
        } else {
          let finalyFileName = `资源库.zip`
          // for IE
          //@ts-ignore
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            //@ts-ignore
            window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
          } else {
            // for Non-IE
            let objectUrl = URL.createObjectURL(blob)
            let link = document.createElement('a')
            link.href = objectUrl
            link.setAttribute('download', finalyFileName)
            document.body.appendChild(link)
            link.click()
            window.URL.revokeObjectURL(link.href)
          }
          message.success('导出成功')
        }
      }
    } catch (msg) {
      console.error(msg)
    } finally {
      setExportLoading(false)
    }
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('lib-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            创建
          </Button>
        )}

        {buttonJurisdictionArray?.includes('lib-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('lib-export') && (
          // <Dropdown overlay={exportMenu}>
          <Button className="mr7" onClick={() => exportLibEvent()}>
            <ExportOutlined />
            导出
          </Button>
          // </Dropdown>
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
        {/* {buttonJurisdictionArray?.includes('lib-resource-iterate') && (
          <Button className="mr7" onClick={() => setLibVisible(true)}>
            资源库迭代
          </Button>
        )} */}
      </div>
    )
  }

  const updateStatusEvent = async (id: string, status: number) => {
    const obj = { id: id, status: status }
    setChangeItem(obj)
    setAuthorizationConfirmation(true)
  }

  const uploadFinishEvent = () => {
    refresh()
  }
  useEffect(() => {
    if (ifSuccess) {
      setAuthorizationConfirmation(false)
      toUpdateStatusEvent()
    }
  }, [ifSuccess]) // eslint-disable-line react-hooks/exhaustive-deps

  const toUpdateStatusEvent = async () => {
    if (changeItem && changeItem.id) {
      try {
        await changeLibStatus(changeItem)
        setChangeItem({ id: '', status: 1 })
        setIfSuccess(false)
        message.success('操作成功')
        refresh()
        uploadAuditLog([
          {
            auditType: 2,
            eventType: 10,
            eventDetailType: changeItem.status === 2 ? '资源库禁用' : '资源库启用',
            executionResult: '成功',
            auditLevel: 2,
            serviceAdress: `${baseUrl.project}/Porject/UpdateStatus`,
          },
        ])
      } catch (e) {
        uploadAuditLog([
          {
            auditType: 2,
            eventType: 10,
            eventDetailType: changeItem.status === 2 ? '资源库禁用' : '资源库启用',
            executionResult: '失败',
            auditLevel: 2,
            serviceAdress: `${baseUrl.project}/Porject/UpdateStatus`,
          },
        ])
      }
    } else {
      await restartResourceLib()
      setIfSuccess(false)
      message.success('操作成功')
    }
  }

  return (
    <PageCommonWrap>
      <Spin spinning={exportLoading} tip="导出中...">
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
            libType: 0,
          }}
        />
      </Spin>
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
      <AuthorizationConfirmation
        changeItem={changeItem}
        authorizationConfirmation={authorizationConfirmation}
        setAuthorizationConfirmation={setAuthorizationConfirmation}
        setIfSuccess={setIfSuccess}
      />
    </PageCommonWrap>
  )
}

export default ResourceLib
