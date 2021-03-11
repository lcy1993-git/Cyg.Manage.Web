import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, ImportOutlined, PlusOutlined, PoweroffOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin } from 'antd';
import React, { useMemo, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getResourceLibDetail,
  addResourceLibItem,
  updateResourceLibItem,
  restartResourceLib,
} from '@/services/resource-config/resource-lib';
import { isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import ResourceLibForm from './components/add-edit-form';
import UploadDrawing from './components/upload-drawing';
import { getUploadUrl, uploadLineStressSag } from '@/services/resource-config/drawing';
import SaveImportLib from './components/upload-lib';
import SaveImportLineStressSag from './components/upload-lineStressSag';

const { Search } = Input;

const ResourceLib: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [uploadDrawingVisible, setUploadDrawingVisible] = useState<boolean>(false);
  const [uploadLibVisible, setUploadLibVisible] = useState<boolean>(false);
  const [uploadLineStressSagVisible, setUploadLineStressSagVisible] = useState<boolean>(false);

  const { data: keyData } = useRequest(() => getUploadUrl());

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getResourceLibDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="关键词" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="关键词"
          />
        </TableSearch>
      </div>
    );
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
      dataIndex: 'id',
      index: 'id',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'libName',
      index: 'libName',
      title: '区域',
      width: 180,
    },
    {
      dataIndex: 'dbName',
      index: 'dbName',
      title: '数据库',
      width: 240,
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
      //   width: 200,
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddResourceLib = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libName: '',
          version: '',
          remark: '',
        },
        value,
      );
      await addResourceLibItem(submitInfo);
      refresh();
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
    const ResourceLibData = await run(editDataId);

    editForm.setFieldsValue(ResourceLibData);
  };

  const sureEditResourceLib = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libName: editData.libName,
          version: editData.version,
          remark: editData.remark,
        },
        values,
      );
      await updateResourceLibItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  //重启资源服务
  const restartLib = async () => {
    await restartResourceLib();
    message.success('操作成功');
  };

  const importLibEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    setUploadLibVisible(true);
  };

  const uploadDrawingEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    setUploadDrawingVisible(true);
  };

  const importLineStreeSagEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    setUploadLineStressSagVisible(true);
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          创建
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
        <Button className="mr7" onClick={() => uploadDrawingEvent()}>
          <ImportOutlined />
          导入图纸
        </Button>
        <Button className="mr7" onClick={() => importLibEvent()}>
          <ImportOutlined />
          导入资源库
        </Button>
        <Button className="mr7" onClick={() => importLineStreeSagEvent()}>
          <ImportOutlined />
          导入应力弧垂表
        </Button>

        <Button className="mr7" onClick={() => restartLib()}>
          <PoweroffOutlined />
          重启资源服务
        </Button>
      </div>
    );
  };

  const uploadFinishEvent = () => {
    refresh();
  };

  const libId = useMemo(() => {
    if (tableSelectRows && tableSelectRows.length > 0) {
      return tableSelectRows[0].id;
    }
    return undefined;
  }, [JSON.stringify(tableSelectRows)]);

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/ResourceLib/GetPageList"
        tableTitle="资源库管理"
        getSelectData={(data) => setTableSelectRow(data)}
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        title="创建资源库"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddResourceLib()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <ResourceLibForm />
        </Form>
      </Modal>
      <Modal
        title="编辑-资源库"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditResourceLib()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
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

      <SaveImportLineStressSag
        libId={libId}
        requestSource="resource"
        visible={uploadLineStressSagVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setUploadLineStressSagVisible}
      />
    </PageCommonWrap>
  );
};

export default ResourceLib;
