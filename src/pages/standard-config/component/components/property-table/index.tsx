import GeneralTable from '@/components/general-table';
import { Button, message, Form, Modal } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
// import styles from './index.less';
import { isArray } from 'lodash';
import {
  getComponentPropertyItem,
  updateComponentPropertyItem,
  addComponentPropertyItem,
  deleteComponentPropertyItem,
} from '@/services/resource-config/component';
import { useRequest } from 'ahooks';
import AddComponentProperty from './add-form';
import EditComponentProperty from './edit-form';
interface ModuleDetailParams {
  libId: string;
  componentId: string[];
}

const ComponentProperty: React.FC<ModuleDetailParams> = (props) => {
  const { libId, componentId } = props;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getComponentPropertyItem, {
    manual: true,
  });

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  const columns = [
    {
      dataIndex: 'propertyName',
      index: 'propertyName',
      title: '属性名称',
      width: 280,
    },
    {
      dataIndex: 'propertyValue',
      index: 'propertyValue',
      title: '属性值',
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

      await addComponentPropertyItem(saveInfo);
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

    editForm.setFieldsValue(ComponentDetailData);
  };

  const sureEditcomponentDetail = () => {
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libId: libId,
          propertyName: editData.propertyName,
          propertyValue: editData.propertyValue,
        },
        values,
      );
      await updateComponentPropertyItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条组件属性删除！');
      return;
    }
    const selectDataId = tableSelectRows[0].id;
    await deleteComponentPropertyItem(libId, selectDataId);
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
      {/* <Table dataSource={propertyData} columns={columns} /> */}
      <GeneralTable
        noPaging
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/ComponentProperty/GetList"
        columns={columns}
        requestSource="resource"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          componentId: componentId[0],
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-组件属性"
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
        <AddComponentProperty addForm={addForm} />
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-组件属性"
        width="980px"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditcomponentDetail()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        centered
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <EditComponentProperty />
        </Form>
      </Modal>
    </div>
  );
};

export default ComponentProperty;
