import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import {
  EditOutlined,
  ImportOutlined,
  PlusOutlined,
  PoweroffOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getResourceLibDetail,
  addResourceLibItem,
  updateResourceLibItem,
  restartResourceLib,
  changeLibStatus,
} from '@/services/resource-config/resource-lib';
import { isArray } from 'lodash';
import ResourceLibForm from './components/add-edit-form';
import UploadDrawing from './components/upload-drawing';
import { getUploadUrl } from '@/services/resource-config/drawing';
import SaveImportLib from './components/upload-lib';
import SaveImportLineStressSag from './components/upload-lineStressSag';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';
import { history } from 'umi';
import { useLayoutStore } from '@/layouts/context';

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
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();
  const [status, setStatus] = useState<string>('0');

  const [libId, setLibId] = useState<string>('');
  const [currentManageId, setCurrentManageId] = useState<string>(''); //当前管理 模块的资源库Id

  const { data: keyData } = useRequest(() => getUploadUrl());

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getResourceLibDetail, {
    manual: true,
  });

  const { setResourceManageFlag: setResourceManageFlag, resourceManageFlag } = useLayoutStore();

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
        <TableSearch marginLeft="20px" label="资源库状态" width="300px">
          <EnumSelect
            enumList={BelongManageEnum}
            onChange={(value) => searchByStatus(value)}
            placeholder="-全部-"
          />
        </TableSearch>
      </div>
    );
  };

  const searchByStatus = (value: any) => {
    setStatus(value);
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        status: value,
      });
    }
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

useEffect(() => {
  
}, [resourceManageFlag])

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
      title: '名称',
      width: 280,
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
        );
      },
      width: 180,
      render: (text: any, record: any) => {
        return record.isDisabled === true ? '已禁用' : '-';
      },
    },
    {
      dataIndex: 'action',
      title: '操作',
      width: 100,
      render: (text: any, record: any) => {
        console.log(resourceManageFlag, '111111');

        return !resourceManageFlag ? (
          <span
            className="canClick"
            onClick={() => {
              setResourceManageFlag?.(true);

              setCurrentManageId(record.id);
              history.push({
                pathname: `/resource-config/resource-manage?libId=${record.id}&&libName=${record.libName}`,
              });
              refresh();
            }}
          >
            <u>管理</u>
          </span>
        ) : (
          <span
            // className="canClick"
            onClick={() => message.error('当前资源库已打开"模块管理"界面，请关闭后重试')}
          >
            <u>管理</u>
          </span>
        );
      },
    },
  ];
  console.log(resourceManageFlag, '2222222');


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
    const editDataId = tableSelectRows[0].id;

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试');
      return;
    }

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
      message.warning('请选择要操作的行');
      return;
    }
    const editDataId = tableSelectRows[0].id;

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试');
      return;
    }
    setLibId(tableSelectRows[0].id);
    setUploadLibVisible(true);
  };

  const uploadDrawingEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行');
      return;
    }
    const editDataId = tableSelectRows[0].id;

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试');
      return;
    }
    setLibId(tableSelectRows[0].id);
    setUploadDrawingVisible(true);
  };

  const importLineStreeSagEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行');
      return;
    }
    const editDataId = tableSelectRows[0].id;

    //如果打开了当前资源库模块管理，则无法操作此项
    if (editDataId === currentManageId) {
      message.error('当前资源库已打开"模块管理"界面，请关闭后重试');
      return;
    }
    setLibId(tableSelectRows[0].id);
    setUploadLineStressSagVisible(true);
  };

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

        {buttonJurisdictionArray?.includes('lib-import-drawing') && (
          <Button className="mr7" onClick={() => uploadDrawingEvent()}>
            <ImportOutlined />
            导入图纸
          </Button>
        )}

        {buttonJurisdictionArray?.includes('lib-import-lib') && (
          <Button className="mr7" onClick={() => importLibEvent()}>
            <ImportOutlined />
            导入资源库
          </Button>
        )}

        {buttonJurisdictionArray?.includes('lib-import-linestresssag') && (
          <Button className="mr7" onClick={() => importLineStreeSagEvent()}>
            <ImportOutlined />
            导入应力弧垂表
          </Button>
        )}

        {buttonJurisdictionArray?.includes('lib-restart') && (
          <Button className="mr7" onClick={() => restartLib()}>
            <RedoOutlined />
            重启资源服务
          </Button>
        )}
        {buttonJurisdictionArray?.includes('lib-restart') && (
          <Button className="mr7" onClick={() => startLib()}>
            <PoweroffOutlined />
            启用
          </Button>
        )}
        {buttonJurisdictionArray?.includes('lib-restart') && (
          <Button className="mr7" onClick={() => forbidLib()}>
            <StopOutlined />
            禁用
          </Button>
        )}
      </div>
    );
  };

  const startLib = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行');
      return;
    }
    await changeLibStatus({ id: tableSelectRows[0].id, status: 1 });
    message.success('该资源库已启用');
    refresh();
  };

  const forbidLib = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择要操作的行');
      return;
    }
    await changeLibStatus({ id: tableSelectRows[0].id, status: 2 });
    message.info('该资源库已禁用');
    refresh();
  };

  const uploadFinishEvent = () => {
    refresh();
  };

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
