import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Switch, Form, Popconfirm, message } from 'antd';
import React, { useState, useMemo, useCallback, useReducer } from 'react';
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
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

interface RouteListItem {
  name: string;
  id: string;
}

const ROUTE_LIST_STATE = {
  routeList: [
    {
      name: '根目录',
      id: '',
    },
  ],
};

interface State {
  routeList: RouteListItem[];
}

const reducer = (state: State, action: any) => {
  switch (action.code) {
    case 'add':
      return { routeList: [...state.routeList, { id: action.id, name: action.name }] };
    case 'edit':
      const routeList = [...state.routeList];
      const currentDataIndex = routeList.findIndex((item) => item.id === action.id);
      if (currentDataIndex !== routeList.length) {
        routeList.splice(currentDataIndex + 1, routeList.length);
      }
      return { routeList: routeList };
    default:
      throw new Error('传入值不对');
  }
};

const DictionaryManage: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [state, dispatch] = useReducer(reducer, ROUTE_LIST_STATE);

  const [selectIds, setSelectIds] = useState<string[]>([]);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getDictionaryDetail, {
    manual: true,
  });

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

    await updateDictionaryItemStatus(id);
    refresh();
    message.success('状态修改成功');
  };

  const tableSearchEvent = () => {
    search();
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

  const searchByParams = (params: object) => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams(params);
    }
  };

  const keyCellClickEvent = (id: string, name: string) => {
    dispatch({ code: 'add', id, name });
    //setRouteList([...routeList, { id, name }]);
    setSearchKeyWord('');
    searchByParams({
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
          parentId: state.routeList[state.routeList.length - 1].id ?? '',
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
        {buttonJurisdictionArray?.includes('add-dictionary') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('edit-dictionary') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        <Popconfirm
          title="您确定要删除该条数据?"
          onConfirm={sureDeleteData}
          okText="确认"
          cancelText="取消"
          // disabled
        >
          {buttonJurisdictionArray?.includes('delete-dictionary') && (
            <Button className="mr7">
              <DeleteOutlined />
              删除
            </Button>
          )}
        </Popconfirm>
        {buttonJurisdictionArray?.includes('import-dictionary') && (
          <TableImportButton className={styles.importBtn} importUrl="/Dictionary/Import" />
        )}
        {buttonJurisdictionArray?.includes('export-dictionary') && (
          <TableExportButton selectIds={selectIds} exportUrl="/Dictionary/Export" />
        )}
      </div>
    );
  };

  const routeItemClickEvent = (id: string, name: string) => {
    dispatch({ code: 'edit', id });
    setSearchKeyWord('');
    searchByParams({
      keyWord: '',
      parentId: id,
    });
  };

  const routeElement = state.routeList.map((item) => {
    return (
      <div
        key={`menu_${item.id}`}
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

  const tableSelectEvent = (data: any) => {
    setTableSelectRows(data);
    setSelectIds(data.map((item: any) => item.id));
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
        getSelectData={tableSelectEvent}
        type="checkbox"
        extractParams={{
          keyWord: searchKeyWord,
          parentId: state.routeList[state.routeList.length - 1].id ?? '',
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-字典"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <DictionaryForm parentName={state.routeList[state.routeList.length - 1].name ?? ''} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-字典"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <DictionaryForm parentName={state.routeList[state.routeList.length - 1].name ?? ''} />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default DictionaryManage;
