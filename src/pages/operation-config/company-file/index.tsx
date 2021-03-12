import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
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
} from '@/services/operation-config/company-file';
import DefaultParams from './components/default-params';
import { getUploadUrl } from '@/services/resource-config/drawing';

const { Search } = Input;

const CompanyFile: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [defaultParamsVisible, setDefaultParamsVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [defaultForm] = Form.useForm();

  const { data: keyData } = useRequest(() => getUploadUrl());

  const securityKey = keyData?.uploadCompanyFileApiSecurity;

  const { data, run, loading } = useRequest(getCompanyFileDetail, {
    manual: true,
  });

  const { data: defaultOptions, run: getDefaultOptions } = useRequest(getCompanyDefaultOptions, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div>
        <TableSearch label="关键词" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入关键词搜索"
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
      dataIndex: 'fileCategory',
      index: 'fileCategory',
      title: '类别',
      width: 150,
      render: (text: any, record: any) => {
        return record.fileCategoryText;
      },
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
        },
        values,
      );
      console.log(submitInfo);

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
      const fileId = await uploadCompanyFile(file, { securityKey }, '/Upload/CompanyFile');
      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          fileId: fileId,
          describe: editData.describe,
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
        <Button className={styles.iconParams} onClick={() => defaultParamsEvent()}>
          <i className="iconfont iconcanshu" />
          成果默认参数
        </Button>
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
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
        }}
      />
      <Modal
        title="添加-文件"
        width="720px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyFile()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm}>
          <Spin spinning={loading}>
            <CompanyFileForm type="add" />
          </Spin>
        </Form>
      </Modal>
      <Modal
        title="编辑-文件"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyFile()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm}>
          <Spin spinning={loading}>
            <CompanyFileForm />
          </Spin>
        </Form>
      </Modal>

      <Modal
        title="成果默认参数"
        width="780px"
        visible={defaultParamsVisible}
        okText="确认"
        onOk={() => saveDefaultOptionsEvent()}
        onCancel={() => setDefaultParamsVisible(false)}
        cancelText="取消"
      >
        <Form form={defaultForm}>
          <Spin spinning={loading}>
            <DefaultParams />
          </Spin>
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default CompanyFile;
