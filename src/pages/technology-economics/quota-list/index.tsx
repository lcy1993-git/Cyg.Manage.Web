
import PageCommonWrap from '@/components/page-common-wrap';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, DatePicker, Popconfirm, Spin, Form, Select } from 'antd';
import EditForm from './components/edit-from';
import React, { useMemo, useRef, useState } from 'react';
import { isArray } from 'lodash';
import { getFileLogDetail, deleteReportLog } from '@/services/system-config/report-log';
import TreeTable from './components/file-tree-table';

import { TreeData, formatDataTree } from '@/utils/utils';
const data = [
  {
    "id": "1369223437942743040",
    "name": "配网预算定额2016",
    "parentId": null,
    "libId": "1357588635508068352",
    "explain": null,
    "level": 1,
    "sort": 0
  },
  {
    "id": "1369223437942743041",
    "name": "第一册 建筑工程",
    "parentId": "1369223437942743040",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 2,
    "sort": 0
  },
  {
    "id": "1369223437942743042",
    "name": "第1章 土石方与施工降水工程",
    "parentId": "1369223437942743041",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 3,
    "sort": 0
  },
  {
    "id": "1369223437942743043",
    "name": "1.1 人工施工土方",
    "parentId": "1369223437942743042",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 4,
    "sort": 0
  },
  {
    "id": "1369223437942743044",
    "name": "1.1.1 挖土方",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743045",
    "name": "1.1.2 挖沟、槽、基坑",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743046",
    "name": "1.1.3 挖淤泥、流砂、冻土",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743047",
    "name": "1.1.4 运土方、淤泥、冻土",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743048",
    "name": "1.1.5 平整场地、回填土",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743049",
    "name": "1.1.6 支挡土板",
    "parentId": "1369223437942743043",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743050",
    "name": "1.2 人工施工石方",
    "parentId": "1369223437942743042",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 4,
    "sort": 0
  },
  {
    "id": "1369223437942743051",
    "name": "1.2.1 凿岩石",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743052",
    "name": "1.2.2 打孔爆破石方",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743053",
    "name": "1.2.3 运石方、回填石方",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  },
  {
    "id": "1369223437942743054",
    "name": "1.2.4 清底修边",
    "parentId": "1369223437942743050",
    "libId": "1357588635508068352",
    "explain": null,
    "level": 5,
    "sort": 0
  }
];
const columns = [
  {
    title: "目录名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "层级",
    dataIndex: "level",
    key: "level",
    width: 180
  },
  {
    title: "排序码",
    dataIndex: "sort",
    key: "sort",
    width: 180
  },
];

const QuotaList: React.FC = () => {

  // const { data, run, loading } = useRequest(getMapFieldDetail, {
  //   manual: true,
  // });

  const dataSource = formatDataTree(data);
  console.log(dataSource);
  
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const sureEditMapField = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      // const submitInfo = Object.assign(
      //   {
      //     id: editData.id,
      //     deviceType: editData.deviceType,
      //     dsName: editData.dsName,
      //     responseName: editData.responseName,
      //     postGISName: editData.postGISName,
      //     pgModelName: editData.pgModelName,
      //     description: editData.description,
      //   },
      //   values,
      // );
      // await updateMapFieldItem(submitInfo);
      // refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const expKeysAll = useMemo(() => data.flat(Infinity).map((i: TreeData) => i.id), [JSON.stringify(data)])

  const rightButton = () => {
    return (
      <div>
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
      </div>
    );
  };

  const searchElement = () => {
    return (
      <div>
        定额库 <Select style={{width: 200}} placeholder="- 请选择定额库 -"></Select>
      </div>
    );
  }

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteReportLog(editDataId);
    tableFresh();
    message.success('删除成功');
  };

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search();
    }
  };
  //数据修改刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };


  return (
    <PageCommonWrap>
      <TreeTable
        tableTitle="定额库目录"
        dataSource={dataSource}
        columns={columns}
        refreshTable={() => 1}
        buttonLeftContentSlot={searchElement}
        buttonRightContentSlot={rightButton}
        pageIndex={1}
        expKeysAll={expKeysAll}
      />
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
          {/* <Spin spinning={loading}> */}
            <EditForm />
          {/* </Spin> */}
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default QuotaList;
