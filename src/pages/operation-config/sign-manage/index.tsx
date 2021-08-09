import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, Popconfirm, message, Spin, Tooltip, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { isArray } from 'lodash';
import '@/assets/icon/iconfont.css';
import {
  updateSignFileItem,
  addSignFileItem,
  deleteSignFileItem,
  getSignFileDetail,
  getSignDefaultOptions,
  updateSignGroupDefaultOptions,
  uploadCompanyFile,
  addSignGroupItem,
  deleteSignGroupItem,
  downLoadSignFileItem,
} from '@/services/operation-config/sign-manage';
import DefaultSign from './components/default-sign';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
// import UrlSelect from '@/components/url-select';
import SignGroupForm from './components/add-sign-group';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';
import { TableRequestResult } from '@/services/table';
import SignFileForm from './components/add-edit-form';

const { Search } = Input;
const { TabPane } = Tabs;

const SignManage: React.FC = () => {
  const auditRef = React.useRef<HTMLDivElement>(null);
  const approvalRef = React.useRef<HTMLDivElement>(null);
  const checkRef = React.useRef<HTMLDivElement>(null);
  const designRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [defaultParamsVisible, setDefaultParamsVisible] = useState<boolean>(false);
  const [signGroupModalVisible, setSignGroupModalVisible] = useState<boolean>(false);
  const [signGroupId, setSignGroupId] = useState<string>('');
  const [nowSelectGroup, setNowSelectGroup] = useState<string>('');
  const [editingFileName, setEditingFileName] = useState<string>('');
  const [fileId, setFileId] = useState<string>();
  const [tabKey, setTabKey] = useState<string>('approval');
  // const [fileCategory, setFileCategory] = useState<number>();
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [tableData, setTableData] = useState<TableRequestResult>();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [defaultForm] = Form.useForm();
  const [addGroupForm] = Form.useForm();

  const { data: keyData } = useRequest(() => getUploadUrl());

  const securityKey = keyData?.uploadCompanyFileApiSecurity;

  const { data, run, loading } = useRequest(getSignFileDetail, {
    manual: true,
  });

  const { data: defaultOptions, run: getDefaultOptions } = useRequest(getSignDefaultOptions, {
    manual: true,
  });
  const { data: signGroupData = [], run: getSignGroup } = useGetSelectData(
    {
      url: '/CompanySignGroup/GetList',
      method: 'post',
    },
    {
      onSuccess: () => {
        setSignGroupId(signGroupData[0]?.value);
        setNowSelectGroup(signGroupData[0]?.label);
      },
    },
  );

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;
    await deleteSignFileItem(editDataId);
    refresh();
    setTableSelectRows([]);
    message.success('删除成功');
  };

  // 列表刷新
  const refresh = () => {
    if (tabKey === 'approval') {
      if (approvalRef && approvalRef.current) {
        // @ts-ignore
        approvalRef.current.refresh();
        return;
      }
    }
    if (tabKey === 'audit') {
      if (auditRef && auditRef.current) {
        // @ts-ignore
        auditRef.current.refresh();
        return;
      }
    }
    if (tabKey === 'check') {
      if (checkRef && checkRef.current) {
        // @ts-ignore
        checkRef.current.refresh();
        return;
      }
    }
    if (tabKey === 'design') {
      if (designRef && designRef.current) {
        // @ts-ignore
        designRef.current.refresh();
        return;
      }
    }
  };

  const columns = [
    {
      dataIndex: 'userId',
      index: 'userId',
      title: '人员',
      width: 180,
      render: (text: any, record: any) => {
        return record.userName ? record.userName : '无';
      },
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '签批文件',
      width: 180,
    },

    {
      dataIndex: 'describe',
      index: 'describe',
      title: '备注',
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const addUploadFile = async () => {
    return uploadCompanyFile(
      addForm.getFieldValue('file'),
      { securityKey },
      '/Upload/CompanyFile',
    ).then(
      (fileId: string) => {
        setFileId(fileId);
      },
      () => {},
    );
  };

  const editUploadFile = async () => {
    return uploadCompanyFile(
      editForm.getFieldValue('file'),
      { securityKey },
      '/Upload/CompanyFile',
    ).then(
      (fileId: string) => {
        setFileId(fileId);
      },
      () => {},
    );
  };

  const sureAddCompanyFile = () => {
    addForm.validateFields().then(async (values) => {
      if (fileId) {
        const submitInfo = Object.assign(
          {
            name: '',
            fileId: fileId,
            categorys: [],
            describe: '',
            userId: '',
            groupId: signGroupId,
          },
          values,
        );

        await addSignFileItem(submitInfo);
        refresh();
        message.success('添加成功');
        setAddFormVisible(false);
        addForm.resetFields();
      } else {
        message.warn('文件未上传或上传失败');
      }
    });
  };

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];

    const editDataId = editData.id;
    setEditingFileName(editData.name);

    setEditFormVisible(true);
    const CompanyFileData = await run(editDataId);

    editForm.setFieldsValue(CompanyFileData);
  };

  const sureEditCompanyFile = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;
    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          fileId: fileId ?? editData.fileId,
          describe: editData.describe,
          groupId: editData.groupId,
        },
        values,
      );
      await updateSignFileItem(submitInfo);
      message.success('更新成功');
      setEditFormVisible(false);
      refresh();
    });
  };

  const defaultParamsEvent = async () => {
    const defaultOptions = await getDefaultOptions(signGroupId);
    defaultForm.setFieldsValue(defaultOptions);
    setDefaultParamsVisible(true);
  };

  const saveDefaultOptionsEvent = () => {
    const defaultData = defaultOptions!;
    defaultForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          groupId: signGroupId,
          approve: defaultData.approve,
          audit: defaultData.audit,
          calibration: defaultData.calibration,
          designSurvey: defaultData.designSurvey,
        },
        values,
      );
      await updateSignGroupDefaultOptions(submitInfo);
      refresh();
      message.success('更新成功');
      setDefaultParamsVisible(false);
    });
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {/* {buttonJurisdictionArray?.includes('sign-file-add') && ( */}
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        {/* )} */}

        {/* {buttonJurisdictionArray?.includes('sign-file-edit') && ( */}
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
        {/* )} */}
        {/* {buttonJurisdictionArray?.includes('sign-file-download') && ( */}
        <Popconfirm
          title="您确定要下载该公司文件？"
          onConfirm={() => downLoadEvent()}
          okText="确认"
          cancelText="取消"
        >
          <Button className="mr7">
            <DownloadOutlined />
            下载
          </Button>
        </Popconfirm>
        {/* )} */}

        {/* {buttonJurisdictionArray?.includes('sign-file-delete') && ( */}
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
        {/* )} */}
      </div>
    );
  };

  //下载公司文件
  const downLoadEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择公司文件下载');
      return;
    }
    const fileId = tableSelectRows[0].fileId;
    const fileName = tableSelectRows[0].fileName;

    const res = await downLoadSignFileItem({ fileId, securityKey });

    const suffix = fileName?.substring(fileName.lastIndexOf('.') + 1);

    let blob = new Blob([res], {
      type: `application/${suffix}`,
    });
    let finallyFileName = `${tableSelectRows[0].name}.${suffix}`;
    //for IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, finallyFileName);
    } else {
      // for Non-IE
      let objectUrl = URL.createObjectURL(blob);
      let link = document.createElement('a');
      link.href = objectUrl;
      link.setAttribute('download', finallyFileName);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }
    message.success('下载成功');
  };
  console.log(signGroupId);

  //公司文件组操作
  const addFileGroupEvent = () => {
    setSignGroupModalVisible(true);
    refresh();
  };

  //选择文件组别获取对应公司文件
  const searchByFileGroup = (value?: any) => {
    const currentTitle = signGroupData.filter((item: any) => {
      if (value === item.value) {
        return item.label;
      }
    });

    setNowSelectGroup(currentTitle[0]?.label);

    setSignGroupId(value);
  };

  const tabChangeEvent = (value: string) => {
    setTabKey(value);
    if (value === 'approval') {
      if (approvalRef && approvalRef.current) {
        // @ts-ignore
        approvalRef.current.searchByParams({
          groupId: signGroupId,
          category: 1,
        });
        return;
      }
    }
    if (value === 'audit') {
      if (auditRef && auditRef.current) {
        // @ts-ignore
        auditRef.current.searchByParams({
          groupId: signGroupId,
          category: 2,
        });
        return;
      }
    }
    if (value === 'check') {
      if (checkRef && checkRef.current) {
        // @ts-ignore
        checkRef.current.searchByParams({
          groupId: signGroupId,
          category: 3,
        });
        return;
      }
    }
    if (value === 'design') {
      if (designRef && designRef.current) {
        // @ts-ignore
        designRef.current.searchByParams({
          groupId: signGroupId,
          category: 4,
        });
        return;
      }
    }
  };

  useEffect(() => {
    refresh();
  }, [signGroupId]);

  const saveSignGroupEvent = () => {
    addGroupForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          name: '',
          remark: '',
        },
        values,
      );

      await addSignGroupItem(submitInfo);
      message.success('添加成功');
      getSignGroup();
      setSignGroupModalVisible(false);
      addGroupForm.resetFields();
      refresh();
      searchByFileGroup();
    });
  };

  const deleteFileGroupEvent = async () => {
    if (signGroupId === undefined || signGroupId === '') {
      message.warning('未选择要删除签批文件组别');
      return;
    }
    if (tableData && tableData?.items.length > 0) {
      message.error('该分组包含签批文件,无法删除');
      return;
    }
    await deleteSignGroupItem(signGroupId);
    message.success('已删除');
    getSignGroup();
    searchByFileGroup();
  };

  const titleSlotElement = () => {
    return <div>{`-${nowSelectGroup}`}</div>;
  };

  const onAddFormChange = (changedValues: any) => {
    if (changedValues.file) {
      setFileId(undefined);
    }
  };

  const onEditFormChange = (changedValues: any) => {
    if (changedValues.file) {
      setFileId(undefined);
    }
  };

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.companyFile}>
        <div className={styles.fileGroupHead}>
          <div className="flex">
            <TableSearch className={styles.fileGroupSelect} label="签批分组" width="360px">
              <DataSelect
                showSearch
                value={signGroupId}
                options={signGroupData}
                placeholder="请选择签批组别"
                onChange={(value: any) => searchByFileGroup(value)}
                style={{ width: '100%' }}
              />
            </TableSearch>
            <TableSearch width="400px">
              {/* {buttonJurisdictionArray?.includes('add-sign-group') && ( */}
              <Button className="mr7" type="primary" onClick={() => addFileGroupEvent()}>
                <PlusOutlined />
                新建签批分组
              </Button>
              {/* )} */}

              <Popconfirm
                title="确定要删除当前文件组吗?"
                onConfirm={deleteFileGroupEvent}
                okText="确认"
                cancelText="取消"
              >
                {/* {buttonJurisdictionArray?.includes('delete-sign-group') && ( */}
                <Button className="mr7">删除当前分组</Button>
                {/* )} */}
              </Popconfirm>
              {/* {buttonJurisdictionArray?.includes('sign-manage-defaultOptions') && ( */}
              <Tooltip title="默认参数和对应签批分组关联" style={{ borderRadius: 15 }}>
                <Button className={styles.iconParams} onClick={() => defaultParamsEvent()}>
                  {/* <i className="iconfont iconcanshu" /> */}
                  默认参数
                </Button>
              </Tooltip>
              {/* )} */}
            </TableSearch>
          </div>
        </div>

        <div className={styles.fileTable}>
          <Tabs type="card" onChange={(value) => tabChangeEvent(value)}>
            <TabPane tab="批准" key="approval">
              {signGroupId && (
                <GeneralTable
                  titleSlot={titleSlotElement}
                  getTableRequestData={setTableData}
                  ref={approvalRef}
                  needCommonButton={true}
                  columns={columns}
                  url="/CompanySign/GetPagedList"
                  tableTitle="批准"
                  getSelectData={(data) => setTableSelectRows(data)}
                  extractParams={{
                    keyWord: searchKeyWord,
                    groupId: signGroupId,
                    category: 1,
                  }}
                />
              )}
            </TabPane>
            <TabPane tab="审核" key="audit">
              {signGroupId && (
                <GeneralTable
                  titleSlot={titleSlotElement}
                  getTableRequestData={setTableData}
                  ref={auditRef}
                  needCommonButton={true}
                  columns={columns}
                  url="/CompanySign/GetPagedList"
                  tableTitle="审核"
                  getSelectData={(data) => setTableSelectRows(data)}
                  extractParams={{
                    keyWord: searchKeyWord,
                    groupId: signGroupId,
                    category: 2,
                  }}
                />
              )}
            </TabPane>
            <TabPane tab="校核" key="check">
              {signGroupId && (
                <GeneralTable
                  titleSlot={titleSlotElement}
                  getTableRequestData={setTableData}
                  ref={checkRef}
                  needCommonButton={true}
                  columns={columns}
                  url="/CompanySign/GetPagedList"
                  tableTitle="校核"
                  getSelectData={(data) => setTableSelectRows(data)}
                  extractParams={{
                    keyWord: searchKeyWord,
                    groupId: signGroupId,
                    category: 3,
                  }}
                />
              )}
            </TabPane>
            <TabPane tab="设计/勘测" key="design">
              {signGroupId && (
                <GeneralTable
                  titleSlot={titleSlotElement}
                  getTableRequestData={setTableData}
                  ref={designRef}
                  needCommonButton={true}
                  columns={columns}
                  url="/CompanySign/GetPagedList"
                  tableTitle="设计/勘测"
                  getSelectData={(data) => setTableSelectRows(data)}
                  extractParams={{
                    keyWord: searchKeyWord,
                    groupId: signGroupId,
                    category: 4,
                  }}
                />
              )}
            </TabPane>
          </Tabs>

          <div className={styles.buttonArea}>
            {/* {buttonJurisdictionArray?.includes('sign-file-add') && ( */}
            <Button type="primary" className="mr7" onClick={() => addEvent()}>
              <PlusOutlined />
              添加
            </Button>
            {/* )} */}

            {/* {buttonJurisdictionArray?.includes('sign-file-edit') && ( */}
            <Button className="mr7" onClick={() => editEvent()}>
              <EditOutlined />
              编辑
            </Button>
            {/* )} */}
            {/* {buttonJurisdictionArray?.includes('sign-file-download') && ( */}
            <Popconfirm
              title="您确定要下载该公司文件？"
              onConfirm={() => downLoadEvent()}
              okText="确认"
              cancelText="取消"
            >
              <Button className="mr7">
                <DownloadOutlined />
                下载
              </Button>
            </Popconfirm>
            {/* )} */}

            {/* {buttonJurisdictionArray?.includes('sign-file-delete') && ( */}
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
            {/* )} */}
          </div>
        </div>
      </div>
      <Modal
        maskClosable={false}
        title="添加-签批"
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
            <SignFileForm uploadFileFn={addUploadFile} type="add" groupData={tableData} />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-签批"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyFile()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} onValuesChange={onEditFormChange} preserve={false}>
          <Spin spinning={loading}>
            <SignFileForm
              type="edit"
              uploadFileFn={editUploadFile}
              groupData={tableData}
              editingName={editingFileName}
            />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="默认参数"
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
            <DefaultSign groupId={signGroupId} />
          </Spin>
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="新建模板文件组"
        width="820px"
        visible={signGroupModalVisible}
        okText="确认"
        onOk={() => saveSignGroupEvent()}
        onCancel={() => setSignGroupModalVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addGroupForm} preserve={false}>
          <SignGroupForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default SignManage;
