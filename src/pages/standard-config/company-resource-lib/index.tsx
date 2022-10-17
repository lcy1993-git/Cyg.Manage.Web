import CommonTitle from '@/components/common-title'
import EmptyTip from '@/components/empty-tip'
import PageCommonWrap from '@/components/page-common-wrap'
import { useLayoutStore } from '@/layouts/context'
import { getUploadUrl } from '@/services/resource-config/drawing'
import {
  backupResourceLib,
  creatCampanyResourceLib,
  exportChartByPath,
  exportCompanyLib,
  getCampanyResourceLibListsWithBackUpInfo,
  getChartPath,
  getResourceLibDetail,
  restartResourceLib,
  restoreResourceLib,
  updateResourceLibItem,
} from '@/services/resource-config/resource-lib'
import { useGetButtonJurisdictionArray, useGetUserInfo } from '@/utils/hooks'
import { EditOutlined, ExportOutlined, ImportOutlined, RedoOutlined } from '@ant-design/icons'
import { useMount, useRequest } from 'ahooks'
import { Button, Dropdown, Form, Menu, message, Modal, Spin, Table } from 'antd'
import { isArray } from 'lodash'
import React, { useMemo, useState } from 'react'
import { history } from 'umi'
import ResourceLibForm from '../canon-resource-lib/./components/add-edit-form'
import ResourceLibraryManageModal from '../canon-resource-lib/./components/resource-library-manage-modal'
import UploadAll from '../canon-resource-lib/./components/upload-all'
import UploadDrawing from '../canon-resource-lib/./components/upload-drawing'
import SaveImportLib from '../canon-resource-lib/./components/upload-lib'
import styles from './index.less'

const ResourceLib: React.FC = () => {
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [uploadDrawingVisible, setUploadDrawingVisible] = useState<boolean>(false)
  const [uploadLibVisible, setUploadLibVisible] = useState<boolean>(false)
  const [uploadAllVisible, setUploadAllVisible] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [libVisible, setLibVisible] = useState(false)
  const [libId, setLibId] = useState<string>('')
  const [tableData, setTableData] = useState<any[]>([])
  const [clickKey, setClickKey] = useState<any[]>([])
  const [currentCompanyManageId, setCurrentCompanyManageId] = useState<string>(
    window.localStorage.manageId
  ) //当前管理 模块的资源库Id
  const userInfo = useGetUserInfo()

  //导出加载
  const [exportLoading, setExportLoading] = useState<boolean>(false)

  const { data: keyData } = useRequest(() => getUploadUrl())
  const [editForm] = Form.useForm()

  const { data, run, loading } = useRequest(getResourceLibDetail, {
    manual: true,
  })
  // 默认创建公司库test
  const { run: createLib } = useRequest(
    () => {
      return creatCampanyResourceLib({
        libType: 1,
        libSource: userInfo.companyId,
        libName: '公司库',
        version: 'v1.0',
        remark: '公司库',
      })
    },
    {
      manual: true,
      onSuccess: (res) => {
        setTableData([res])
      },
    }
  )
  // 获取公司资源库，没有则创建
  const { run: getList } = useRequest(
    () =>
      getCampanyResourceLibListsWithBackUpInfo({
        libType: 1,
        libSource: userInfo.companyId,
        status: 0,
      }),
    {
      manual: true,
      onSuccess: (res: any) => {
        if (res?.length === 0) {
          createLib()
        } else {
          setTableData(res)
        }
      },
    }
  )

  /**获取图纸路径 */
  const { data: chartPath } = useRequest(() => getChartPath(clickKey[0]), {
    ready: !!clickKey.length,
    refreshDeps: [clickKey[0]],
  })

  const { resourceManageFlag } = useLayoutStore()

  // 列表刷新
  const refresh = () => {
    getList()
  }
  useMount(() => {
    getList()
  })
  const backupLib = async (record: any) => {
    Modal.confirm({
      title: '提示',
      okText: '确认',
      cancelText: '取消',
      content: '确定备份当前资源库？',
      onOk: async () => {
        await backupResourceLib({ libId: record.id, isCreateNew: false })
        message.success('备份成功')
        refresh()
      },
    })
  }
  const restoreLib = (record: any) => {
    Modal.confirm({
      title: '提示',
      okText: '确认',
      cancelText: '取消',
      content: '确定还原当前资源库？',
      onOk: async () => {
        await restoreResourceLib({ libId: record.id, version: record.backUpVersion })
        message.success('还原成功')
        refresh()
      },
    })
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
          dataIndex: 'companyName',
          index: 'companyName',
          title: '公司名称',
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
          dataIndex: 'backUpTime',
          index: 'backUpTime',
          title: '备份时间',
          width: 200,
        },
        {
          dataIndex: 'action',
          title: '操作',
          width: 200,
          render: (text: any, record: any) => {
            const storage = window.localStorage
            return (
              <span>
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
                <span
                  className="canClick"
                  style={{ marginLeft: '20px' }}
                  onClick={() => {
                    backupLib(record)
                  }}
                >
                  <u>备份</u>
                </span>
                <span
                  className="canClick"
                  style={{ marginLeft: '20px' }}
                  onClick={() => {
                    restoreLib(record)
                  }}
                >
                  <u>还原</u>
                </span>
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
        dataIndex: 'backUpTime',
        index: 'backUpTime',
        title: '备份时间',
      },
      {
        dataIndex: '',
        title: '操作',
        width: 170,
        render: (text: any, record: any) => {
          return (
            <span>
              <span
                className="canClick"
                onClick={() => message.error('已打开"资源库模块管理"界面，请关闭后重试')}
              >
                <u>管理</u>
              </span>
              <span
                className="canClick"
                style={{ marginLeft: '20px' }}
                onClick={() => {
                  backupLib(record)
                }}
              >
                <u>备份</u>
              </span>
              <span
                className="canClick"
                style={{ marginLeft: '20px' }}
                onClick={() => {
                  restoreLib(record)
                }}
              >
                <u>还原</u>
              </span>
            </span>
          )
        },
      },
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /**导出图纸 */
  const exportDrawingEvent = async () => {
    if (!chartPath) {
      message.warning('未选择公司库或导出路径不存在')
      return
    }
    try {
      setExportLoading(true)
      const res = await exportChartByPath(chartPath)
      let blob = new Blob([res], {
        type: 'application/zip',
      })
      let finalyFileName = `图纸.zip`
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
    } catch (msg) {
      console.error(msg)
    } finally {
      setExportLoading(false)
    }
  }

  /**导出资源库 */
  const exportLibEvent = async () => {
    if (!clickKey.length) {
      message.warning('未选择公司资源库')
      return
    }
    try {
      setExportLoading(true)
      const res = await exportCompanyLib(clickKey[0])
      let blob = new Blob([res], {
        type: 'application/zip',
      })
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
    } catch (msg) {
      console.error(msg)
    } finally {
      setExportLoading(false)
    }
  }

  const importMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('lib-import-drawing') && (
        <Menu.Item key="importDraw" onClick={() => uploadDrawingEvent()}>
          导入图纸
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('lib-import-lib') && (
        <Menu.Item key="importLib" onClick={() => importLibEvent()}>
          导入资源库
        </Menu.Item>
      )}
    </Menu>
  )

  //导出
  const exportMenu = (
    <Menu>
      {buttonJurisdictionArray?.includes('lib-export-drawing') && (
        <Menu.Item key="exportDraw" onClick={() => exportDrawingEvent()}>
          导出图纸
        </Menu.Item>
      )}
      {buttonJurisdictionArray?.includes('lib-export-lib') && (
        <Menu.Item key="exportLib" onClick={() => exportLibEvent()}>
          导出资源库
        </Menu.Item>
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
        {buttonJurisdictionArray?.includes('lib-export') && (
          <Dropdown overlay={exportMenu}>
            <Button className="mr7">
              <ExportOutlined />
              导出
            </Button>
          </Dropdown>
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

  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setClickKey(selectedRows.map((item) => item['id']))
      // setTableSelectData(selectedRows)
    },
  }

  return (
    <PageCommonWrap>
      <Spin spinning={exportLoading} tip="导出中...">
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
          rowSelection={{
            type: 'radio',
            columnWidth: '38px',
            selectedRowKeys: clickKey,
            ...rowSelection,
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
      </Spin>
    </PageCommonWrap>
  )
}

export default ResourceLib
