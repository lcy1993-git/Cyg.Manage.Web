import '@/assets/icon/iconfont.css'
import DataSelect from '@/components/data-select'
import GeneralTable from '@/components/general-table'
import ModalConfirm from '@/components/modal-confirm'
import PageCommonWrap from '@/components/page-common-wrap'
import TableSearch from '@/components/table-search'
import { baseUrl } from '@/services/common'
import {
  addCompanyFileItem,
  addFileGroupItem,
  deleteCompanyFileItem,
  deleteFileGroupItem,
  downLoadFileItem,
  getCompanyDefaultOptions,
  getCompanyFileDetail,
  getFileList,
  updateCompanyDefaultOptions,
  updateCompanyFileItem,
  uploadCompanyFile,
} from '@/services/operation-config/company-file'
import { getUploadUrl } from '@/services/resource-config/drawing'
import { TableRequestResult } from '@/services/table'
import { useGetButtonJurisdictionArray, useGetSelectData } from '@/utils/hooks'
import { uploadAuditLog } from '@/utils/utils'
import { DownloadOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Popconfirm, Spin, Tooltip } from 'antd'
import { isArray } from 'lodash'
import React, { useMemo, useState } from 'react'
import CompanyFileForm from './components/add-edit-form'
// import UrlSelect from '@/components/url-select';
import FileGroupForm from './components/add-file-group'
import DefaultParams from './components/default-params'
import styles from './index.less'

const { Search } = Input

const CompanyFile: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false)
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const [defaultParamsVisible, setDefaultParamsVisible] = useState<boolean>(false)
  const [fileGroupModalVisible, setFileGroupModalVisible] = useState<boolean>(false)
  const [fileGroupId, setFileGroupId] = useState<string>('')
  const [nowSelectGroup, setNowSelectGroup] = useState<string>('')
  const [editingFileName, setEditingFileName] = useState<string>('')
  const [fileId, setFileId] = useState<string>()
  const [fileCategory, setFileCategory] = useState<number>()
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()

  const [tableData, setTableData] = useState<TableRequestResult>()

  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [defaultForm] = Form.useForm()
  const [addGroupForm] = Form.useForm()

  const { data: keyData } = useRequest(() => getUploadUrl())

  const securityKey = keyData?.uploadCompanyFileApiSecurity

  const { data, run, loading } = useRequest(getCompanyFileDetail, {
    manual: true,
  })

  const { data: defaultOptions, run: getDefaultOptions } = useRequest(getCompanyDefaultOptions, {
    manual: true,
  })

  const { data: fileGroupData = [], run: getfileGroup } = useGetSelectData(
    {
      url: '/CompanyFileGroup/GetList',
      method: 'post',
    },
    {
      onSuccess: () => {
        setFileGroupId(fileGroupData[0]?.value)
        setNowSelectGroup(fileGroupData[0]?.label)
      },
    }
  )

  const { data: fileData = [], run: getList } = useRequest(
    () => getFileList({ keyWord: searchKeyWord, groupId: fileGroupId }),
    {
      ready: !!fileGroupId,
      refreshDeps: [fileGroupId],
    }
  )

  //判断文件组立项依据是否存在
  const isBasisExist = useMemo(() => {
    if (fileData) {
      const fileCategory = fileData.items?.map((item: any) => {
        return item.fileCategory
      })
      return fileCategory?.includes(5)
    }
  }, [fileData])

  const searchComponent = () => {
    return (
      <div>
        <TableSearch width="248px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入名称/类别"
          />
        </TableSearch>
      </div>
    )
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除')
      return
    }
    const editData = tableSelectRows[0]
    const editDataId = editData.id
    await deleteCompanyFileItem(editDataId)
    refresh()
    getList()
    setTableSelectRows([])
    message.success('删除成功')
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

  const columns = [
    {
      dataIndex: 'fileCategory',
      index: 'fileCategory',
      title: '类别',
      width: 180,
      render: (text: any, record: any) => {
        return record.fileCategoryText
      },
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '名称',
      width: 240,
    },
    // {
    //   dataIndex: 'id',
    //   index: 'id',
    //   title: '文件编号',
    //   width: 200,
    // },
    {
      dataIndex: 'describe',
      index: 'describe',
      title: '描述',
      // width: 200,
    },
  ]

  //添加
  const addEvent = () => {
    setAddFormVisible(true)
  }

  const addUploadFile = async () => {
    return uploadCompanyFile(
      addForm.getFieldValue('file'),
      { securityKey },
      '/Upload/CompanyFile'
    ).then(
      (fileId: string) => {
        setFileId(fileId)
      },
      () => {}
    )
  }

  const editUploadFile = async () => {
    return uploadCompanyFile(
      editForm.getFieldValue('file'),
      { securityKey },
      '/Upload/CompanyFile'
    ).then(
      (fileId: string) => {
        setFileId(fileId)
      },
      () => {}
    )
  }

  const sureAddCompanyFile = () => {
    addForm.validateFields().then(async (values) => {
      if (fileId) {
        const submitInfo = Object.assign(
          {
            name: '',
            fileId: fileId,
            fileCategory: 0,
            describe: '',
            groupId: fileGroupId,
          },
          values
        )

        await addCompanyFileItem(submitInfo)
        refresh()
        getList()
        message.success('添加成功')
        setAddFormVisible(false)
        addForm.resetFields()
      } else {
        message.warn('文件未上传或上传失败')
      }
    })
  }

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = tableSelectRows[0]

    const editDataId = editData.id
    setFileCategory(editData.fileCategory)
    setEditingFileName(editData.name)

    setEditFormVisible(true)
    const CompanyFileData = await run(editDataId)

    editForm.setFieldsValue(CompanyFileData)
  }

  const sureEditCompanyFile = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
      return
    }
    const editData = data!
    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          fileId: fileId ?? editData.fileId,
          describe: editData.describe,
          groupId: editData.groupId,
        },
        values
      )
      await updateCompanyFileItem(submitInfo)
      message.success('更新成功')
      setEditFormVisible(false)
      search()
    })
  }

  const defaultParamsEvent = async () => {
    setDefaultParamsVisible(true)
    const defaultOptions = await getDefaultOptions(fileGroupId)

    defaultForm.setFieldsValue(defaultOptions)
  }

  const saveDefaultOptionsEvent = () => {
    const defaultData = defaultOptions!

    defaultForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          groupId: fileGroupId,
          designOrganize: defaultData.designOrganize,
          frameTemplate: defaultData.frameTemplate,
          directoryTemplate: defaultData.directoryTemplate,
          descriptionTemplate: defaultData.descriptionTemplate,
        },
        values
      )
      await updateCompanyDefaultOptions(submitInfo)
      refresh()
      message.success('更新成功')
      setDefaultParamsVisible(false)
    })
  }

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('company-file-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('company-file-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-file-download') && (
          <Popconfirm
            title="您确定要下载该文件？"
            onConfirm={() => downLoadEvent()}
            okText="确认"
            cancelText="取消"
          >
            <Button className="mr7">
              <DownloadOutlined />
              下载
            </Button>
          </Popconfirm>
        )}

        {buttonJurisdictionArray?.includes('company-file-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
      </div>
    )
  }

  //下载公司文件
  const downLoadEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择公司文件下载')
      return
    }
    const fileId = tableSelectRows[0].fileId
    const fileName = tableSelectRows[0].fileName

    const res = await downLoadFileItem({ fileId, securityKey })

    const suffix = fileName?.substring(fileName.lastIndexOf('.') + 1)

    let blob = new Blob([res], {
      type: `application/${suffix}`,
    })
    let finallyFileName = `${tableSelectRows[0].name}.${suffix}`
    //for IE
    //@ts-ignore
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //@ts-ignore
      window.navigator.msSaveOrOpenBlob(blob, finallyFileName)
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob)
      let link = document.createElement('a')
      link.href = objectUrl
      link.setAttribute('download', finallyFileName)
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }
    message.success('下载成功')
    uploadAuditLog([
      {
        auditType: 1,
        eventType: 5,
        eventDetailType: '文件下载',
        executionResult: '成功',
        auditLevel: 2,
        serviceAdress: `${baseUrl.project}/Download/GetFileById`,
      },
    ])
  }

  //公司文件组操作
  const addFileGroupEvent = () => {
    setFileGroupModalVisible(true)
    refresh()
  }

  //选择文件组别获取对应公司文件
  const searchByFileGroup = (value?: any) => {
    const currentTitle = fileGroupData.filter((item: any) => {
      if (value === item.value) {
        return item.label
      }
    })

    setNowSelectGroup(currentTitle[0]?.label)

    setFileGroupId(value)
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        groupId: value,
      })
    }
  }

  const saveFileGroupEvent = () => {
    addGroupForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          name: '',
          remark: '',
        },
        values
      )

      await addFileGroupItem(submitInfo)
      message.success('添加成功')
      getfileGroup()
      setFileGroupModalVisible(false)
      addGroupForm.resetFields()
      refresh()
      searchByFileGroup()
    })
  }

  const deleteFileGroupEvent = async () => {
    if (fileGroupId === undefined || fileGroupId === '') {
      message.warning('未选择要删除公司文件组别')
      return
    }
    if (tableData && tableData?.items.length > 0) {
      message.error('该分组包含公司文件,无法删除')
      return
    }
    await deleteFileGroupItem(fileGroupId)
    message.success('已删除')
    getfileGroup()
    searchByFileGroup()
  }

  const titleSlotElement = () => {
    return <div>{`-${nowSelectGroup}`}</div>
  }

  const onAddFormChange = (changedValues: any) => {
    if (changedValues.file) {
      setFileId(undefined)
    }
  }

  const onEditFormChange = (changedValues: any) => {
    if (changedValues.file) {
      setFileId(undefined)
    }
  }

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.companyFile}>
        <div className={styles.fileGroupHead}>
          <div className="flex">
            <TableSearch className={styles.fileGroupSelect} label="文件组" width="360px">
              <DataSelect
                showSearch
                value={fileGroupId}
                options={fileGroupData}
                placeholder="请选择文件组别"
                onChange={(value: any) => searchByFileGroup(value)}
                style={{ width: '100%' }}
              />
            </TableSearch>
            <TableSearch width="400px" marginLeft="20px">
              {buttonJurisdictionArray?.includes('add-file-group') && (
                <Button className="mr7" type="primary" onClick={() => addFileGroupEvent()}>
                  <PlusOutlined />
                  新建文件组
                </Button>
              )}

              {buttonJurisdictionArray?.includes('delete-file-group') && (
                <ModalConfirm
                  changeEvent={deleteFileGroupEvent}
                  content="确定删除当前文件组吗？"
                  title="删除文件组"
                />
              )}

              {buttonJurisdictionArray?.includes('company-file-defaultOptions') && (
                <Tooltip title="成果默认参数和对应公司文件组关联" style={{ borderRadius: 15 }}>
                  <Button className={styles.iconParams} onClick={() => defaultParamsEvent()}>
                    <i className="iconfont iconcanshu" />
                    成果默认参数
                  </Button>
                </Tooltip>
              )}
            </TableSearch>
          </div>
        </div>
        <div className={styles.fileTable}>
          {fileGroupId && (
            <GeneralTable
              titleSlot={titleSlotElement}
              getTableRequestData={setTableData}
              ref={tableRef}
              buttonLeftContentSlot={searchComponent}
              buttonRightContentSlot={tableElement}
              needCommonButton={false}
              columns={columns}
              url="/CompanyFile/GetPagedList"
              tableTitle="成果模板"
              getSelectData={(data) => setTableSelectRows(data)}
              extractParams={{
                keyWord: searchKeyWord,
                groupId: fileGroupId,
              }}
            />
          )}
        </div>
      </div>
      <Modal
        maskClosable={false}
        title="添加-文件"
        width="720px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyFile()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form onValuesChange={onAddFormChange} form={addForm} preserve={false}>
          <Spin spinning={loading}>
            <CompanyFileForm
              uploadFileFn={addUploadFile}
              type="add"
              groupData={tableData}
              isBasisExist={isBasisExist}
            />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-文件"
        width="680px"
        visible={editFormVisible}
        // okText="确认"
        // onOk={() => sureEditCompanyFile()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        footer={[
          <div className={styles.editSlot}>
            <div className={styles.editTip}>
              注意：成果文件名称修改后，需在设计端成果参数功能下重新选择该模版。
            </div>
            <div>
              <Button key="cancle" onClick={() => setEditFormVisible(false)}>
                取消
              </Button>
              <Button key="save" type="primary" onClick={() => sureEditCompanyFile()}>
                确认
              </Button>
            </div>
          </div>,
        ]}
        destroyOnClose
      >
        <Form form={editForm} onValuesChange={onEditFormChange} preserve={false}>
          <Spin spinning={loading}>
            <CompanyFileForm
              uploadFileFn={editUploadFile}
              groupData={tableData}
              editingName={editingFileName}
              fileCategory={fileCategory}
            />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="成果默认参数"
        width="780px"
        visible={defaultParamsVisible}
        okText="确认"
        onOk={() => saveDefaultOptionsEvent()}
        onCancel={() => setDefaultParamsVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={defaultForm} preserve={false}>
          <Spin spinning={loading}>
            <DefaultParams groupId={fileGroupId} />
          </Spin>
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="新建模板文件组"
        width="820px"
        visible={fileGroupModalVisible}
        okText="确认"
        onOk={() => saveFileGroupEvent()}
        onCancel={() => setFileGroupModalVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addGroupForm} preserve={false}>
          <FileGroupForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  )
}

export default CompanyFile
