import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, Popconfirm, message, Spin } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getMapFieldDetail,
  updateMapFieldItem,
  deleteMapFieldItem,
  addMapFieldItem,
} from '@/services/system-config/map-field';
import { isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import TableExportButton from '@/components/table-export-button';
import MapFieldForm from './components/add-edit-form';

const { Search } = Input;

const MapField: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getMapFieldDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="关键词" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => tableSearchEvent()}
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

    await deleteMapFieldItem(editDataId);
    refresh();
    message.success('删除成功');
    setTableSelectRows([]);
  };

  const tableSearchEvent = () => {
    search({
      keyWord: searchKeyWord,
    });
  };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // 列表搜索
  const search = (params: object) => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search(params);
    }
  };

  const columns = [
    {
      dataIndex: 'deviceType',
      index: 'deviceType',
      title: '表类型',
      width: 150,
    },
    {
      dataIndex: 'dsName',
      index: 'dsName',
      title: '控件字段',
      width: 150,
    },
    {
      dataIndex: 'responseName',
      index: 'responseName',
      title: '服务端字段',
      width: 150,
    },
    {
      dataIndex: 'postGISName',
      index: 'postGISName',
      title: 'PostGis字段',
      width: 200,
    },
    {
      dataIndex: 'pgModelName',
      index: 'pgModelName',
      title: 'postGis实体字段',
      width: 200,
    },
    {
      dataIndex: 'description',
      index: 'description',
      title: '字段描述',
      width: 200,
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddMapField = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          deviceType: '',
          dsName: '',
          responseName: '',
          postGISName: '',
          pgModelName: '',
          description: '',
        },
        value,
      );
      await addMapFieldItem(submitInfo);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  //编辑
  const editEvent = async () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择一条数据进行编辑');
      return;
    }

    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const MapFieldData = await run(editDataId);

    editForm.setFieldsValue(MapFieldData);
  };

  const sureEditMapField = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          deviceType: editData.deviceType,
          dsName: editData.dsName,
          responseName: editData.responseName,
          postGISName: editData.postGISName,
          pgModelName: editData.pgModelName,
          description: editData.description,
        },
        values,
      );
      await updateMapFieldItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
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
        <TableImportButton className={styles.importBtn} importUrl="/MapField/Import" />
        <TableExportButton
          selectIds={tableSelectRows.map((item) => {
            return item.id;
          })}
          exportUrl="/MapField/Export"
        />
      </div>
    );
  };

  const titleSlotElement = () => {
    return <div className={styles.routeComponent}></div>;
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        titleSlot={titleSlotElement}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        url="/MapField/GetPagedList"
        tableTitle="数据映射"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-映射"
        width="720px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMapField()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <Spin spinning={loading}>
            <MapFieldForm />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-映射"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditMapField()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <MapFieldForm />
          </Spin>
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default MapField;
