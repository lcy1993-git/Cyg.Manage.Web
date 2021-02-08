import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Switch, Form, Popconfirm, message } from 'antd';
import React, { useState } from 'react';
import DictionaryForm from './components/add-edit-form';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getDictionaryDetail,
  addDictionaryItem,
  updateDictionaryItemStatus,
  updateDictionaryItem,
  deleteDictionaryItem,
} from '@/services/system-config/dictyionary-manage';
import { isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import TableExportButton from '@/components/table-export-button';

const { Search } = Input;

interface RouteListItem {
  name: string;
  id: string;
}

const DictionaryManage: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [ids, setIds] = useState<string[]>([]);

  const [currentId, setCurrentId] = useState<string>('');

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getDictionaryDetail, {
    manual: true,
  });
  const [routeList, setRouteList] = useState<RouteListItem[]>([
    {
      name: '根目录',
      id: '',
    },
  ]);

  const searchComponent = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="键名"
        />
      </TableSearch>
    );
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteDictionaryItem(editDataId);
    refresh();
    message.success('删除成功');
  };

  const updateStatus = async (record: any) => {
    const { id } = record;
    console.log(record);

    await updateDictionaryItemStatus(id);
    refresh();
    message.success('状态修改成功');
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

  const keyCellClickEvent = (id: string, name: string) => {
    const copyRouteList = [...routeList];
    copyRouteList.push({
      name,
      id,
    });
    // console.log(copyRouteList[copyRouteList.length - 1].id);
    setCurrentId(copyRouteList[copyRouteList.length - 1].id);
    setRouteList(copyRouteList);

    setSearchKeyWord('');
    search({
      keyWord: '',
      parentId: id,
    });
  };

  const columns = [
    {
      dataIndex: 'key',
      index: 'key',
      title: '键',
      width: 120,
      render: (text: string, record: any) => {
        return (
          <span
            className={styles.dictionaryKeyCell}
            onClick={() => keyCellClickEvent(record.id, record.key)}
          >
            {record.key}
          </span>
        );
      },
    },
    {
      dataIndex: 'value',
      index: 'value',
      title: '值',
      width: 360,
    },
    {
      dataIndex: 'extensionColumn',
      index: 'extensionColumn',
      title: '扩展列',
      width: 180,
    },
    {
      dataIndex: 'sort',
      index: 'sort',
      title: '排序',
      width: 80,
    },
    {
      dataIndex: 'isDisable',
      index: 'isDisable',
      title: '状态',
      width: 100,
      render: (text: any, record: any) => {
        const isChecked = !record.isDisable;
        return <Switch checked={isChecked} onChange={() => updateStatus(record)} />;
      },
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '描述',
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          parentId: routeList[routeList.length - 1].id,
          key: '',
          value: '',
          extensionColumn: '',
          sort: 0,
          isDisable: false,
          remark: '',
        },
        value,
      );
      await addDictionaryItem(submitInfo);
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
    const AuthorizationData = await run(editDataId);

    editForm.setFieldsValue(AuthorizationData);
  };

  const sureEditAuthorization = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          key: editData.key,
          value: editData.value,
          extensionColumn: editData.extensionColumn,
          sort: editData.sort,
          isDisable: editData.isDisable,
          remark: editData.remark,
          parentId: editData.parentId,
        },
        values,
      );
      await updateDictionaryItem(submitInfo);
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
          // disabled
        >
          <Button className="mr7">
            <DeleteOutlined />
            删除
          </Button>
        </Popconfirm>
        <TableImportButton className={styles.importBtn} importUrl="/Dictionary/Import" />
        <TableExportButton selectIds={ids} exportUrl="/Dictionary/Export" />
      </div>
    );
  };
  //存入选中的数据id 导出
  tableSelectRows.map((item: any) => {
    ids.push(item.id);
  });

  const routeItemClickEvent = (id: string, name: string) => {
    const copyRouteList = [...routeList];
    const currentDataIndex = copyRouteList.findIndex((item) => item.id === id);

    if (currentDataIndex !== copyRouteList.length) {
      copyRouteList.splice(currentDataIndex + 1, copyRouteList.length);
    }
    setRouteList(copyRouteList);
    setCurrentId(copyRouteList[copyRouteList.length - 1].id);
    setSearchKeyWord('');
    search({
      keyWord: '',
      parentId: id,
    });
  };

  const routeElement = routeList.map((item) => {
    return (
      <div
        key={item.id}
        className={styles.routeItem}
        onClick={() => routeItemClickEvent(item.id, item.name)}
      >
        {item.name}/
      </div>
    );
  });

  const titleSlotElement = () => {
    return (
      <div className={styles.routeComponent}>
        <span>/</span>
        {routeElement}
      </div>
    );
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
        url="/Dictionary/GetPagedList"
        tableTitle="系统字典"
        getSelectData={(data) => setTableSelectRow(data)}
        type="checkbox"
        extractParams={{ keyWord: searchKeyWord, parentId: currentId }}
      />
      <Modal
        title="添加-字典"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <DictionaryForm parentName={routeList[routeList.length - 1].name} />
        </Form>
      </Modal>
      <Modal
        title="编辑-字典"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <DictionaryForm parentName={routeList[routeList.length - 1].name} />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default DictionaryManage;
