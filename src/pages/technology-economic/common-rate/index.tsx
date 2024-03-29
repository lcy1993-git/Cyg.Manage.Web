import GeneralTable from '@/components/general-table'
import PageCommonWrap from '@/components/page-common-wrap'
import TableImportButton from '@/components/table-import-button'
import TableSearch from '@/components/table-search'
import { addRateTable, editRateTable } from '@/services/technology-economic/common-rate'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Space, Spin } from 'antd'
import { ColumnsType } from 'antd/lib/table'
import { isArray } from 'lodash'
import moment from 'moment'
import React, { useState } from 'react'
import { history } from 'umi'
import AddDictionaryForm from './components/add-edit-form'

const { Search } = Input

type DataSource = {
  id: string
  [key: string]: string
}

const ProjectList: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRow] = useState<DataSource[] | object>([])
  const [searchKeyWord, setSearchKeyWord] = useState<string>('')
  const [modalType, setModalType] = useState<string>('')
  const [formVisible, setFormVisible] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const buttonJurisdictionArray = useGetButtonJurisdictionArray()
  const [form] = Form.useForm()

  const initColumns = [
    // {
    //   dataIndex: 'number',
    //   key: 'number',
    //   title: '序号',
    //   width: 160,
    // },
    {
      dataIndex: 'name',

      title: '名称',
      width: 200,
    },
    {
      dataIndex: 'rateFileType',

      title: '费率类型',
      width: 200,
      render(v: number): string {
        return [
          '建筑安装取费表费率',
          '拆除取费表费率',
          '地形增加系数',
          '未计价材料施工损耗率',
          '土方参数',
          '社保公积金费率',
        ][v - 1]
      },
    },

    {
      dataIndex: 'sourceFile',

      title: '来源文件',
      width: 300,
    },
    {
      dataIndex: 'publishDate',

      title: '发布时间',
      width: 130,
      render(v: string) {
        return moment(v).format('YYYY-MM-DD')
      },
    },
    {
      dataIndex: 'publishOrg',

      title: '发布机构',
      width: 150,
    },
    {
      dataIndex: 'year',

      title: '费率年度',
      width: 100,
    },
    {
      dataIndex: 'majorType',

      title: '适用专业',
      width: 150,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
      width: 220,
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
          placeholder="关键词"
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

  // //添加
  // const addEvent = () => {
  //   form.resetFields();
  //   setModalType('add');
  //   setFormVisible(true);
  // };

  // const sureAddAuthorization = () => {
  //   form.validateFields().then(async (values: AddRateTable) => {
  //     await addRateTable({...values});
  //     refresh();
  //     setFormVisible(false);
  //     form.resetFields();
  //   });
  // };

  // 编辑
  const editEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑')
    } else {
      const publishDate = moment(tableSelectRows[0].publishDate)
      setModalType('edit')
      setFormVisible(true)
      form.setFieldsValue({ ...tableSelectRows[0], publishDate })
    }
  }
  //
  // // 查看详情
  // const sureDeleteData = async () => {
  //   if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
  //     message.error('请选择一条数据进行编辑');
  //     return;
  //   }
  //   const id = tableSelectRows[0].id;
  //   await deleteRateTable(id);
  //   refresh();
  //   message.success('删除成功');
  // };

  const gotoMoreInfo = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行查看')
      return
    }
    let name = [
      '建筑安装取费表费率',
      '拆除取费表费率',
      '地形增加系数',
      '未计价材料施工损耗率',
      '土方参数',
      '社保公积金费率',
    ][tableSelectRows[0].rateFileType - 1]
    let id = tableSelectRows[0].id
    if (['建筑安装取费表费率', '拆除取费表费率'].includes(name)) {
      history.push(
        `/technology-economic/common-rate-infomation?id=${tableSelectRows[0].id}&name=${encodeURI(
          name
        )}&isDemolition=${name === '拆除取费表费率'}`
      )
    } else if (['地形增加系数', '未计价材料施工损耗率', '土方参数'].includes(name)) {
      history.push(`/technology-economic/usual-quota-table/detail?name=${encodeURI(name)}&id=${id}`)
    } else if (name === '社保公积金费率') {
      history.push(`/technology-economic/social-security-fund?id=${tableSelectRows[0].id}`)
    }
  }
  const setSuccessful = () => {}
  const tableElement = () => {
    return (
      <div style={{ display: 'flex' }}>
        {!buttonJurisdictionArray?.includes('commonrate-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        <TableImportButton
          modalTitle={'导入常用费率'}
          buttonTitle={'导入'}
          requestSource={'tecEco1'}
          accept={'.zip'}
          style={{ display: 'inline' }}
          importUrl={`/RateTable/ImportRateFileZip`}
          setSuccessful={setSuccessful}
        />
        &nbsp;
        {/*<Button className="mr7" onClick={() => setImportVisibel(true)}>*/}
        {/*  <ImportOutlined />*/}
        {/*  导入*/}
        {/*</Button>*/}
        {/*{*/}
        {/*  !buttonJurisdictionArray?.includes('commonrate-del') &&*/}
        {/*  <Popconfirm*/}
        {/*    title="您确定要删除该条数据?"*/}
        {/*    onConfirm={sureDeleteData}*/}
        {/*    okText="确认"*/}
        {/*    cancelText="取消"*/}
        {/*  >*/}
        {/*    <Button className="mr7">*/}
        {/*      <DeleteOutlined />*/}
        {/*      删除*/}
        {/*    </Button>*/}
        {/*  </Popconfirm>*/}
        {/*}*/}
        {!buttonJurisdictionArray?.includes('commonrate-info') && (
          <Button className="mr7" onClick={gotoMoreInfo}>
            <EyeOutlined />
            费率详情
          </Button>
        )}
      </div>
    )
  }

  const tableSelectEvent = (data: DataSource[] | object) => {
    setTableSelectRow(data)
  }
  // const onOK = () => {
  //   if (fileList.length === 0) {
  //     message.error('当前未上传文件');
  //   } else {
  //     ImportRateFileZip(fileList[0]).then(() => {
  //       message.success('上传成功');
  //       setImportVisibel(false);
  //     });
  //   }
  // };
  const onModalOkClick = async () => {
    const values = await form.validateFields()
    setSpinning(true)

    if (modalType === 'add') {
      addRateTable({ ...values })
        .then(() => {
          message.success('添加成功')
          setFormVisible(false)
          setSpinning(false)
          form.resetFields()
          //@ts-ignore
          tableRef.current.reset()
        })
        .finally(() => {
          setSpinning(false)
        })
    } else if (modalType === 'edit') {
      editRateTable({ ...values, id: tableSelectRows[0].id })
        .then(() => {
          message.success('编辑成功')
          // tableRef.current.reset();
          setFormVisible(false)
          setTableSelectRow([])
          setSpinning(false)
          //@ts-ignore
          tableRef.current.reset()
          //@ts-ignore
          tableRef.current.refresh()
          form.resetFields()
        })
        .finally(() => {
          setSpinning(false)
        })
    }

    refresh()
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        rowKey={'id'}
        columns={initColumns as ColumnsType<object>}
        url="/RateTable/QueryRateFilePager"
        tableTitle="常用费率"
        getSelectData={tableSelectEvent}
        requestSource="tecEco1"
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />

      {/*<Modal*/}
      {/*  title="导入常用费率"*/}
      {/*  onOk={onOK}*/}
      {/*  onCancel={() => setImportVisibel(false)}*/}
      {/*  visible={importVisibel}*/}
      {/*>*/}
      {/*  <FileUpload*/}
      {/*    maxCount={1}*/}
      {/*    accept=".zip"*/}
      {/*    trigger={true}*/}
      {/*    process={true}*/}
      {/*    onChange={(e) => setFileList(e)}*/}
      {/*    className={styles.file}*/}
      {/*    uploadFileFn={async () => {}}*/}
      {/*  />*/}
      {/*</Modal>*/}
      <Modal
        maskClosable={false}
        title={`${modalType === 'add' ? '添加' : '编辑'}-常用费率`}
        width="880px"
        visible={formVisible}
        okText="确认"
        footer={null}
        onCancel={() => setFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={spinning}>
          <Form form={form} preserve={false}>
            <AddDictionaryForm modalType={modalType} />
          </Form>
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Space>
              <Button onClick={() => setFormVisible(false)}>取消</Button>
              <Button onClick={onModalOkClick} type={'primary'}>
                确定
              </Button>
            </Space>
          </div>
        </Spin>
      </Modal>
    </PageCommonWrap>
  )
}

export default ProjectList
