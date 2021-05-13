import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, Popconfirm, message, Spin } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { isArray } from 'lodash';
import '@/assets/icon/iconfont.css';
import CompanyFileForm from './components/add-edit-form';
import {
  updateCompanyFileItem,
  addCompanyFileItem,
  deleteCompanyFileItem,
  getCompanyFileDetail,
  getCompanyDefaultOptions,
  updateCompanyDefaultOptions,
  uploadCompanyFile,
  addFileGroupItem,
  deleteFileGroupItem,
  downLoadFileItem,
} from '@/services/operation-config/company-file';
import DefaultParams from './components/default-params';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
// import UrlSelect from '@/components/url-select';
import FileGroupForm from './components/add-file-group';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';
import { TableRequestResult } from '@/services/table';

const { Search } = Input;

const CompanyFile: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [defaultParamsVisible, setDefaultParamsVisible] = useState<boolean>(false);
  const [fileGroupModalVisible, setFileGroupModalVisible] = useState<boolean>(false);
  const [fileGroupId, setFileGroupId] = useState<string>();
  const [nowSelectGroup, setNowSelectGroup] = useState<string>('');
  const [editingFileName, setEditingFileName] = useState<string>('');

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [tableData, setTableData] = useState<TableRequestResult>();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [defaultForm] = Form.useForm();
  const [addGroupForm] = Form.useForm();

  const { data: keyData } = useRequest(() => getUploadUrl());

  const securityKey = keyData?.uploadCompanyFileApiSecurity;

  const { data, run, loading } = useRequest(getCompanyFileDetail, {
    manual: true,
  });

  const { data: defaultOptions, run: getDefaultOptions } = useRequest(getCompanyDefaultOptions, {
    manual: true,
  });
  const { data: fileGroupData = [], run: getfileGroup } = useGetSelectData(
    {
      url: '/CompanyFileGroup/GetList',
      method: 'post',
    },
    {
      onSuccess: () => {
        setFileGroupId(fileGroupData[0]?.value);
        setNowSelectGroup(fileGroupData[0]?.label);
      },
    },
  );

  const searchComponent = () => {
    return (
      <div>
        <TableSearch label="文件名称" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入文件名搜索"
          />
        </TableSearch>
      </div>
    );
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;
    await deleteCompanyFileItem(editDataId);
    refresh();
    setTableSelectRow([]);
    message.success('删除成功');
  };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const columns = [
    {
      dataIndex: 'fileCategory',
      index: 'fileCategory',
      title: '类别',
      width: 150,
      render: (text: any, record: any) => {
        return record.fileCategoryText;
      },
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '名称',
      width: 150,
    },
    {
      dataIndex: 'id',
      index: 'id',
      title: '文件编号',
      width: 200,
    },
    {
      dataIndex: 'describe',
      index: 'describe',
      title: '描述',
      // width: 200,
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddCompanyFile = () => {
    addForm.validateFields().then(async (values) => {
      const { file } = values;
      const fileId = await uploadCompanyFile(file, { securityKey }, '/Upload/CompanyFile');

      const submitInfo = Object.assign(
        {
          name: '',
          fileId: fileId,
          fileCategory: 0,
          describe: '',
          groupId: fileGroupId,
        },
        values,
      );

      await addCompanyFileItem(submitInfo);
      refresh();
      message.success('添加成功');
      setAddFormVisible(false);
      addForm.resetFields();
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
      const { file } = values;
      let fileId = editData.fileId;
      if (file && file.length > 0) {
        fileId = await uploadCompanyFile(file, { securityKey }, '/Upload/CompanyFile');
      }

      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          fileId: fileId,
          describe: editData.describe,
          groupId: editData.groupId,
        },
        values,
      );
      await updateCompanyFileItem(submitInfo);
      refresh();
      message.success('更新成功');
      setEditFormVisible(false);
    });
  };

  const defaultParamsEvent = async () => {
    setDefaultParamsVisible(true);
    const defaultOptions = await getDefaultOptions();
    defaultForm.setFieldsValue(defaultOptions);
  };

  const saveDefaultOptionsEvent = () => {
    const defaultData = defaultOptions!;
    defaultForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          designOrganize: defaultData.designOrganize,
          frameTemplate: defaultData.frameTemplate,
          directoryTemplate: defaultData.directoryTemplate,
          descriptionTemplate: defaultData.descriptionTemplate,
          approve: defaultData.approve,
          audit: defaultData.audit,
          calibration: defaultData.calibration,
          designSurvey: defaultData.designSurvey,
        },
        values,
      );
      await updateCompanyDefaultOptions(submitInfo);
      refresh();
      message.success('更新成功');
      setDefaultParamsVisible(false);
    });
  };

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
        {/* {buttonJurisdictionArray?.includes('company-file-edit') && ( */}
        <Button className="mr7" onClick={() => downLoadEvent()}>
          <DownloadOutlined />
          下载
        </Button>
        {/* )} */}

        {buttonJurisdictionArray?.includes('company-file-delete') && (
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
        )}
        {buttonJurisdictionArray?.includes('company-file-defaultOptions') && (
          <Button className={styles.iconParams} onClick={() => defaultParamsEvent()}>
            <i className="iconfont iconcanshu" />
            成果默认参数
          </Button>
        )}
      </div>
    );
  };

  //下载公司文件
  const downLoadEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请先选择一条公司文件下载');
      return;
    }
    const fileId = tableSelectRows[0].fileId;
    const fileName = tableSelectRows[0].fileName;

    const res = await downLoadFileItem({ fileId, securityKey });

    const suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
    // console.log(suffix);

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

  //公司文件组操作
  const addFileGroupEvent = () => {
    setFileGroupModalVisible(true);
    refresh();
  };

  //选择文件组别获取对应公司文件
  const searchByFileGroup = (value?: any) => {
    const currentTitle = fileGroupData.filter((item: any) => {
      if (value === item.value) {
        return item.label;
      }
    });

    setNowSelectGroup(currentTitle[0]?.label);

    setFileGroupId(value);
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        groupId: value,
      });
    }
  };

  const saveFileGroupEvent = () => {
    addGroupForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          name: '',
          remark: '',
        },
        values,
      );

      await addFileGroupItem(submitInfo);
      message.success('添加成功');
      getfileGroup();
      setFileGroupModalVisible(false);
      addGroupForm.resetFields();
      refresh();
      searchByFileGroup();
    });
  };

  const deleteFileGroupEvent = async () => {
    if (fileGroupId === undefined || fileGroupId === '') {
      message.warning('未选择要删除公司文件组别');
      return;
    }
    if (tableData && tableData?.items.length > 0) {
      message.error('该分组包含公司文件,无法删除');
      return;
    }
    await deleteFileGroupItem(fileGroupId);
    message.success('已删除');
    getfileGroup();
    searchByFileGroup();
  };

  const titleSlotElement = () => {
    return <div>{`-${nowSelectGroup}`}</div>;
  };

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.companyFile}>
        <div className={styles.fileGroupHead}>
          <div className="flex">
            <TableSearch className={styles.fileGroupSelect} label="公司文件组" width="280px">
              <DataSelect
                showSearch
                value={fileGroupId}
                options={fileGroupData}
                placeholder="请选择文件组别"
                onChange={(value: any) => searchByFileGroup(value)}
              />
            </TableSearch>
            <TableSearch width="300px">
              {buttonJurisdictionArray?.includes('add-file-group') && (
                <Button className="mr7" type="primary" onClick={() => addFileGroupEvent()}>
                  <PlusOutlined />
                  新建公司文件组
                </Button>
              )}

              <Popconfirm
                title="确定要删除当前文件组吗?"
                onConfirm={deleteFileGroupEvent}
                okText="确认"
                cancelText="取消"
              >
                {buttonJurisdictionArray?.includes('delete-file-group') && (
                  <Button className="mr7">删除当前组</Button>
                )}
              </Popconfirm>
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
              needCommonButton={true}
              columns={columns}
              url="/CompanyFile/GetPagedList"
              tableTitle="公司文件"
              getSelectData={(data) => setTableSelectRow(data)}
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
        <Form form={addForm} preserve={false}>
          <Spin spinning={loading}>
            <CompanyFileForm type="add" groupData={tableData} />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-文件"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyFile()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <CompanyFileForm groupData={tableData} editingName={editingFileName} />
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
            <DefaultParams />
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
  );
};

export default CompanyFile;
