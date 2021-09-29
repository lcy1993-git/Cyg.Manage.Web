import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input, Button, message, Form, Modal } from 'antd';
import React, { useState } from 'react';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
// import styles from './index.less';
import { isArray } from 'lodash';
import {
  getCableChannelDetailItem,
  updateCableChannelDetailItem,
  deleteCableChannelDetailItem,
  addCableChannelDetailItem,
} from '@/services/resource-config/cable-channel';
import { useRequest } from 'ahooks';
import AddcableChannelDetail from './add-form';
import EditcableChannelDetail from './edit-form';
import ModalConfirm from '@/components/modal-confirm';
interface ModuleDetailParams {
  libId: string;
  cableChannelId: string[];
}

const { Search } = Input;

const cableChannelDetail: React.FC<ModuleDetailParams> = (props) => {
  const { libId, cableChannelId } = props;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getCableChannelDetailItem, {
    manual: true,
  });

  // useEffect(() => {
  //   search();
  // }, [cableChannelId]);

  const searchComponent = () => {
    return (
      <div>
        <TableSearch width="328px">
          <Search
            allowClear
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入电缆通道明细信息"
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
      dataIndex: 'cableChannelId',
      index: 'cableChannelId',
      title: '电缆通道编号',
      width: 180,
    },
    {
      dataIndex: 'channelName',
      index: 'channelName',
      title: '电缆通道名称',
      width: 500,
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
      width: 220,
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
        return record.isComponent === true ? '是' : '否';
      },
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddcableChannelDetail = () => {
    addForm.validateFields().then(async (value) => {
      const saveInfo = Object.assign(
        {
          libId: libId,
          cableChannelId: cableChannelId[0],
        },
        value,
      );

      await addCableChannelDetailItem(saveInfo);
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
    const cableChannelDetailData = await run(libId, editDataId);
    const formData =
      cableChannelDetailData?.isComponent == 1
        ? {
            componentId: {
              id: cableChannelDetailData.itemId,
              name: cableChannelDetailData.itemName,
            },
            itemNumber: cableChannelDetailData.itemNumber,
          }
        : {
            materialId: {
              id: cableChannelDetailData.itemId,
              name: cableChannelDetailData.itemName,
            },
            itemNumber: cableChannelDetailData.itemNumber,
          };

    editForm.setFieldsValue(formData);
  };

  const sureEditcableChannelDetail = () => {
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
      await updateCableChannelDetailItem(submitInfo);
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
    await deleteCableChannelDetailItem(libId, selectDataId);
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
      <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
    </>
  );

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => searchComponent()}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/cableChannelDetails/GetPageList"
        columns={columns}
        type="radio"
        requestSource="resource"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          cableChannelIds: cableChannelId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-电缆通道明细"
        width="88%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddcableChannelDetail()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        centered
        destroyOnClose
      >
        <Form form={addForm}>
          <AddcableChannelDetail addForm={addForm} resourceLibId={libId} />
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        title="编辑-电缆通道明细"
        width="50%"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditcableChannelDetail()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        centered
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <EditcableChannelDetail resourceLibId={libId} />
        </Form>
      </Modal>
    </div>
  );
};

export default cableChannelDetail;
