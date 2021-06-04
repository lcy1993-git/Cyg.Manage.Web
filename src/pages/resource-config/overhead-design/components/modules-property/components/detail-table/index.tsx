import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input, Button, message, Form, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import styles from './index.less';
import { isArray } from 'lodash';
import {
  updateModulesDetailItem,
  addModuleDetailItem,
  deleteModulesDetailItem,
  getModuleDetailItem,
} from '@/services/resource-config/modules-property';
import { useRequest } from 'ahooks';
import UrlSelect from '@/components/url-select';
import AddModuleDetailTable from './add-form';
import EditModuleDetail from './edit-form';
interface ModuleDetailParams {
  libId: string;
  moduleId: string[];
}

const { Search } = Input;

const ModuleDetailTable: React.FC<ModuleDetailParams> = (props) => {
  const { libId, moduleId } = props;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [modulePart, setModulePart] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getModuleDetailItem, {
    manual: true,
  });

  useEffect(() => {
    search();
  }, [moduleId]);

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="关键词" width="230px">
          <Search
            allowClear
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="关键词"
          />
        </TableSearch>
        <TableSearch width="230px">
          <UrlSelect
            requestSource="resource"
            url="/ModulesDetails/GetParts"
            valueKey="value"
            titleKey="key"
            allowClear
            onChange={(value: any) => searchByPart(value)}
            placeholder="--所属部件--"
          />
        </TableSearch>
      </div>
    );
  };

  //选择资源库传libId
  const searchByPart = (value: any) => {
    setModulePart(value);
    search();
  };

  useEffect(() => {
    searchByPart(modulePart);
  }, [modulePart]);

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
      dataIndex: 'moduleId',
      index: 'moduleId',
      title: '模块编号',
      width: 180,
    },
    {
      dataIndex: 'moduleName',
      index: 'moduleName',
      title: '模块名称',
      width: 500,
    },

    {
      dataIndex: 'part',
      index: 'part',
      title: '所属部件',
      width: 180,
    },
    {
      dataIndex: 'itemId',
      index: 'itemId',
      title: '物料/组件编码',
      width: 220,
    },
    {
      dataIndex: 'itemName',
      index: 'itemName',
      title: '物料组件/名称',
      width: 180,
    },
    {
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      title: '数量',
      width: 150,
    },
    {
      dataIndex: 'isComponent',
      index: 'isComponent',
      title: '是否组件',
      width: 220,
      render: (text: any, record: any) => {
        return record.isComponent === 1 ? '是' : '否';
      },
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddModuleDetail = () => {
    addForm.validateFields().then(async (value) => {
      const saveInfo = Object.assign(
        {
          libId: libId,
          moduleId: moduleId[0],
        },
        value,
      );

      await addModuleDetailItem(saveInfo);
      message.success('添加成功');
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
    const ModuleDetailData = await run(libId, editDataId);
    ModuleDetailData.componentId = ModuleDetailData.isComponent == 1 ? ModuleDetailData.itemId : '';
    ModuleDetailData.materialId = ModuleDetailData.isComponent == 0 ? ModuleDetailData.itemId : '';

    editForm.setFieldsValue(ModuleDetailData);
  };

  const sureEditModuleDetail = () => {
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libId: libId,
          part: editData.part,
          componentId: editData.componentId,
          materialId: editData.materialId,
          itemId: editData.itemId,
          itemNumber: editData.itemNumber,
          isComponent: editData.isComponent,
        },
        values,
      );
      await updateModulesDetailItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条模块明细删除！');
      return;
    }
    const selectDataId = tableSelectRows[0].id;
    await deleteModulesDetailItem(libId, selectDataId);
    refresh();
    message.success('删除成功');
    setTableSelectRows([]);
  };

  const tableRightSlot = (
    <>
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
    </>
  );

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => searchComponent()}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/ModulesDetails/GetPageList"
        columns={columns}
        type="radio"
        requestSource="resource"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          moduleIds: moduleId,
          part: modulePart,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-模块明细"
        width="100%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddModuleDetail()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <AddModuleDetailTable addForm={addForm} resourceLibId={libId} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-模块明细"
        width="100%"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditModuleDetail()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <EditModuleDetail resourceLibId={libId} />
        </Form>
      </Modal>
    </div>
  );
};

export default ModuleDetailTable;
