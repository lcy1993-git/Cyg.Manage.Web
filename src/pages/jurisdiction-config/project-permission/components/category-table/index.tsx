import React, { useState, useEffect } from 'react';
import { Button, Form, message, Popconfirm, Table } from 'antd';
import CommonTitle from '@/components/common-title';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import PermissionTypeModal from '../type-select-modal';
import CyTag from '@/components/cy-tag';
import EditSelectModal from '../edit-select-modal';

export interface permissionItem {
  category: string | undefined;
  objectId: string | undefined;
  projectTypes: number[] | undefined;
  objectName: string | undefined;
}

interface TableParams {
  getItems?: (value: permissionItem[]) => void;
  editItems?: permissionItem[];
}

const colorMap = {
  1: 'green',
  2: 'blue',
  4: 'yellow',
  8: 'green',
  16: 'blue',
  32: 'green',
};

const CategoryTable: React.FC<TableParams> = (props) => {
  const { getItems, editItems } = props;
  const [typeSelectModalVisible, setTypeSelectModalVisible] = useState<boolean>(false);
  const [tableSelectData, setTableSelectData] = useState<any[]>([]);
  const [currentTableData, setCurrentTableData] = useState<permissionItem[]>(editItems ?? []);
  const [editTypeSelectModal, setEditTypeSelectModal] = useState<boolean>(false);
  const [clickKey, setClickKey] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  // const tableRef = React.useRef<HTMLDivElement>(null);

  //table数据改变则重新获取
  useEffect(() => {
    getItems?.(currentTableData);
  }, [currentTableData]);

  const columns = [
    {
      title: '对象类型',
      dataIndex: 'category',
      index: 'category',
      width: 150,
      render: (text: any, record: any) => {
        return record.categoryText
          ? record.categoryText
          : record.category === '1'
          ? '公司'
          : record.category === '2'
          ? '部组'
          : '公司用户';
      },
    },
    {
      title: '对象',
      dataIndex: 'objectId',
      index: 'objectId',
      width: 280,
      render: (text: any, record: any) => {
        return record.objectName;
      },
    },
    {
      title: '项目类型',
      dataIndex: 'projectTypes',
      index: 'projectTypes',
      render: (text: any, record: any) => {
        return record.projectTypes?.map((item: any) => {
          return item.value ? (
            <CyTag key={item.value} className="mr7" color={colorMap[item.value]}>
              {item.text}
            </CyTag>
          ) : (
            <CyTag key={item} className="mr7" color={colorMap[item]}>
              {item === 1
                ? '立项项目'
                : item === 2
                ? '委托项目'
                : item === 4
                ? '执行项目'
                : item === 8
                ? '共享项目'
                : item === 16
                ? '被委托项目'
                : '被共享项目'}
            </CyTag>
          );
        });
      },
    },
  ];

  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setClickKey(selectedRows.map((item) => item['objectId']));
      setTableSelectData(selectedRows);
    },
  };

  //条目删除
  const removeEvent = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.warning('请选择要移除的条目');
      return;
    }
    const deleteId = tableSelectData[0].objectId;
    const copyData = [...currentTableData];
    const hasDeleteData = copyData.filter((item) => item.objectId !== deleteId);

    setCurrentTableData(hasDeleteData);
    setTableSelectData([]);
    message.success('已移除');
  };

  //编辑条目信息
  const editPermissionItemEvent = () => {
    if (tableSelectData && tableSelectData.length === 0) {
      message.warning('请选择你要编辑的条目');
      return;
    }

    const editItem = tableSelectData[0];
    setLoading(true);
    editForm.setFieldsValue({
      ...editItem,
      category: String(editItem.category),
      companyId: String(editItem?.category) === '1' ? String(editItem.objectId) : undefined,
      groupId: String(editItem?.category) === '2' ? String(editItem.objectId) : undefined,
      userId: String(editItem?.category) === '3' ? String(editItem.objectId) : undefined,
      proType:
        String(editItem?.category) === '1'
          ? editItem.projectTypes?.map((item: any) => (item.value ? item.value : item))
          : undefined,
      groupType:
        String(editItem?.category) === '2'
          ? editItem.projectTypes?.map((item: any) => (item.value ? item.value : item))
          : undefined,
      userType:
        String(editItem?.category) === '3'
          ? editItem.projectTypes?.map((item: any) => (item.value ? item.value : item))
          : undefined,
    });
    setEditTypeSelectModal(true);
  };

  return (
    <>
      <div className={styles.categoryHead}>
        <div>
          <CommonTitle>配置权限条目</CommonTitle>
        </div>
        <div className={styles.buttonPart}>
          <Button type="primary" className="mr7" onClick={() => setTypeSelectModalVisible(true)}>
            <PlusOutlined />
            添加
          </Button>
          <Button className="mr7" onClick={editPermissionItemEvent}>
            <EditOutlined />
            编辑
          </Button>
          <Popconfirm
            title="您确定要删除该条数据?"
            onConfirm={removeEvent}
            okText="确认"
            cancelText="取消"
          >
            <Button>
              <DeleteOutlined />
              删除
            </Button>
          </Popconfirm>
        </div>
      </div>
      <div className={styles.permissionTable}>
        <Table
          size="small"
          rowKey="objectId"
          rowSelection={{
            type: 'radio',
            columnWidth: '38px',
            selectedRowKeys: clickKey,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={currentTableData}
          bordered
        />
      </div>

      {typeSelectModalVisible && (
        <PermissionTypeModal
          visible={typeSelectModalVisible}
          onChange={setTypeSelectModalVisible}
          changeTableEvent={setCurrentTableData}
          hasAddData={currentTableData}
          editData={tableSelectData[0]}
          addForm={addForm}
        />
      )}
      {editTypeSelectModal && (
        <EditSelectModal
          visible={editTypeSelectModal}
          onChange={setEditTypeSelectModal}
          changeTableEvent={setCurrentTableData}
          hasAddData={currentTableData}
          editData={tableSelectData[0]}
          finishEvent={setClickKey}
          setEmpty={setTableSelectData}
          editForm={editForm}
          loading={loading}
          setLoading={setLoading}
        />
      )}
    </>
  );
};

export default CategoryTable;
