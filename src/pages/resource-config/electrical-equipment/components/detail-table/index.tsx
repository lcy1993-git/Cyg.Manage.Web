import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input, Button, message, Form, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
// import styles from './index.less';
import { isArray } from 'lodash';
import {
  getComponentDetailItem,
  addComponentDetailItem,
  updateComponentDetailItem,
  deleteComponentDetailItem,
} from '@/services/resource-config/component';
import { useRequest } from 'ahooks';
import AddComponentDetail from './add-form';
import EditComponentDetail from './edit-form';
interface ModuleDetailParams {
  libId: string;
  componentId: string[];
}

const { Search } = Input;

const ElectricDetail: React.FC<ModuleDetailParams> = (props) => {
  const { libId, componentId } = props;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getComponentDetailItem, {
    manual: true,
  });

  useEffect(() => {
    search();
  }, [componentId]);

  const searchComponent = () => {
    return (
      <div>
        <TableSearch label="关键词" width="230px">
          <Search
            allowClear
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="编号/名称"
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
      dataIndex: 'componentId',
      index: 'componentId',
      title: '所属组件编码',
      width: 280,
    },
    {
      dataIndex: 'componentName',
      index: 'componentName',
      title: '所属组件名称',
      width: 450,
    },

    {
      dataIndex: 'itemId',
      index: 'itemId',
      title: '物料/组件编码',
      width: 180,
    },
    {
      dataIndex: 'itemName',
      index: 'itemName',
      title: '物料/组件名称',
      width: 350,
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

  const sureAddComponentDetail = () => {
    addForm.validateFields().then(async (value) => {
      const saveInfo = Object.assign(
        {
          libId: libId,
          componentId: componentId[0],
        },
        value,
      );

      await addComponentDetailItem(saveInfo);
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
    const ComponentDetailData = await run(libId, editDataId);
    ComponentDetailData.componentId =
      ComponentDetailData.isComponent == 1 ? ComponentDetailData.itemId : '';
    ComponentDetailData.materialId =
      ComponentDetailData.isComponent == 0 ? ComponentDetailData.itemId : '';

    editForm.setFieldsValue(ComponentDetailData);
  };

  const sureEditcomponentDetail = () => {
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libId: libId,
          componentId: editData.componentId,
          materialId: editData.materialId,
          itemId: editData.itemId,
          itemNumber: editData.itemNumber,
          isComponent: editData.isComponent,
        },
        values,
      );
      await updateComponentDetailItem(submitInfo);
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
    await deleteComponentDetailItem(libId, selectDataId);
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
        url="/ComponentDetail/GetPageList"
        columns={columns}
        requestSource="resource"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          componentIds: componentId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        title="添加-组件明细"
        width="70%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddComponentDetail()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: 480 }}
        centered
        destroyOnClose
      >
        <Form form={addForm}>
          <AddComponentDetail addForm={addForm} resourceLibId={libId} />
        </Form>
      </Modal>

      <Modal
        title="编辑-组件明细"
        width="980px"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditcomponentDetail()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        centered
      >
        <Form form={editForm}>
          <EditComponentDetail resourceLibId={libId} />
        </Form>
      </Modal>
    </div>
  );
};

export default ElectricDetail;
