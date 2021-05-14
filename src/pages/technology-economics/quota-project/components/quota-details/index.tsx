import PageCommonWrap from '@/components/page-common-wrap';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, DatePicker, Popconfirm, Spin, Form, Select } from 'antd';
import EditForm from './components/edit-from';
import React, { useMemo, useRef, useState } from 'react';
import { isArray } from 'lodash';
import { getFileLogDetail, deleteReportLog } from '@/services/system-config/report-log';
import TreeTable from '../../../components/file-tree-table';
import DetailsFormItem from '../quota-details-items';

import styles from './index.less';


interface Props {
  id: string;
  setDetailId: (arg0: string) => void
}

const data = [
  {id: "1",
    children: [{}]},
  {id: "2"}
];

const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "编号",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "单位",
    dataIndex: "dep",
    key: "dep",
  },
  {
    title: "单重（kg）",
    dataIndex: "kg",
    key: "kg",
  },
  {
    title: "系数",
    dataIndex: "xishu",
    key: "xishu",
  },
  {
    title: "数量",
    dataIndex: "num",
    key: "num",
  },
]

const QuotaDetails: React.FC<Props> = ({id, setDetailId}) => {

  // const { data, loading} = useRequest()

  const [addVisibel, setAddVisibel] = useState<boolean>(false);
  const [editVisibel, setEditVisibel] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const addEvent = () => {
    setAddVisibel(true);
  };

  const editEvent = () => {
    setEditVisibel(true);
  };

  const sureDeleteData = () => {
    console.log('删除');
  };

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

  const expKeysAll = useMemo(() => data.flat(Infinity).map((i) => i.id), [JSON.stringify(data)])

  return (
    <>
      <Modal
        className={styles.modal}
        maskClosable={false}
        title="定额明细"
        width="90vw"
        // visible={!!id}
        visible={true}
        okText="确认"
        onCancel={()=>setDetailId("")}
        cancelText="取消"
        destroyOnClose
        footer={null}
      >
        <TreeTable
          dataSource={data}
          columns={columns}
          buttonRightContentSlot={rightButton}
          expKeysAll={expKeysAll}
        />
        <Modal
          title= "定额明细-添加"
          visible={addVisibel}
          width={800}
          cancelText="取消"
          onCancel={() => setAddVisibel(false)}
          okText="确认"
          onOk={() => console.log('sureAdd')}
        >
          <Form form={addForm}>
            <DetailsFormItem />
          </Form>
        </Modal>
        <Modal
          title= "定额明细-编辑"
          visible={editVisibel}
          width={800}
          cancelText="取消"
          onCancel={() => setEditVisibel(false)}
          okText="确认"
          onOk={() => console.log('sureEdit')}
        >
          <Form form={editForm}>
            <DetailsFormItem />
          </Form>
        </Modal>
      </Modal>
    </>
  );
}

export default QuotaDetails;