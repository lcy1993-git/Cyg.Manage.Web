import { useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Button, Modal, message, Spin, Popconfirm, Form } from 'antd';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import { getRateTypeList } from '@/services/technology-economic/common-rate'
import styles from './index.less';
import GeneralTable from '@/components/general-table';
import { columns } from '@/pages/visualization-results/components/material-table';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';
import AreaManagrForm from './components/AreaManagrForm';
interface ListData {
  value: string;
  text: string;
}

const AreaTypeManage: React.FC = () => {
  const [activeValue, setActiveValue] = useState<ListData>({ value: "", text: "" });
  
  const [form] = useForm();

  const columns = [
    {
      dataIndex: '1',
      index: '1',
      title: '一级行政区',
      width: 180,
    },
    {
      dataIndex: '2',
      index: '2',
      title: '二级行政区',
      width: 180,
    },
    {
      dataIndex: '3',
      index: '3',
      title: '三级行政区',
      width: 180,
    },
  ]

  const listData: ListData[] = [
    {
      value: "1",
      text: "I"
    },
    {
      value: "2",
      text: "II"
    },
    {
      value: "3",
      text: "III"
    },
    {
      value: "4",
      text: "IV"
    },
    {
      value: "5",
      text: "V"
    },
  ]

  const editEvent = () => {

  }
  const addEvent = () => {

  }
  const sureDeleteData = () => {

  }

  

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

  const listDataElement = listData.map((item, index) => {
    return (
      <div
        className={`${styles.listElementItem} ${item.value === activeValue.value ? styles.listActive : ""}`}
        key={item.value}
        onClick={() => setActiveValue(item)}
      >
        {item.text}
      </div>
    )
  })

  return (
    <WrapperComponent>
      <div className={styles.imfomationModalWrap}>
        <div className={styles.topContainer}>
          <div className={styles.topContainerTitle}>
            <CommonTitle>地区分类管理</CommonTitle>
          </div>

        </div>
        <Spin spinning={false}>
        <div className={styles.bottomContainer}>
          <div className={styles.containerLeft}>
            <div className={styles.containerLeftTitle}>
              目录
            </div>
            <div className={styles.listElement}>
              {listDataElement}
            </div>
          </div>
          <div className={styles.containerRight}>
            <div className={styles.body}>
              <GeneralTable
                url=""
                buttonRightContentSlot={() => tableRightSlot}
                columns={columns}
              />
            </div>
          </div>
        </div>
        </Spin>
      </div>
      <Modal

      >
        <Form form={form}>
          <AreaManagrForm type={'add'}/>
        </Form>
      </Modal>
    </WrapperComponent>
  )
}

export default AreaTypeManage;