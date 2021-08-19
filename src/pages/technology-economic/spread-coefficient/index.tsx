import React, { useState } from 'react';
import { history } from 'umi';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { Input, Button, Modal, Form, Switch, message, Popconfirm, Tabs } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { isArray } from 'lodash';

import GeneralTable from './components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
// import TableSearch from '@/components/table-search';
import DictionaryForm from './components/add-edit-form';

import {
  addPricingTemplate,
  editPricingTemplate,
  setPricingTemplate,
  deletePricingTemplate,
  queryPricingTemplatePager,
} from '@/services/technology-economic/pricing-template';
import styles from './index.less';
import { useEffect } from 'react';
import moment from 'moment';
import { getEnums } from '../utils';
import ImageIcon from '@/components/image-icon';
import CommonTitle from '@/components/common-title';
import AdjustmentFileForm from './components/adjustment-file-form/inex';
import {
  createAdjustmentFile,
  createCatalogue,
  deleteAdjustmentFile,
  deleteTemplate,
  setAdjustmentFileStatus,
  setDefaultTemplateStatus,
  updateAdjustmentFile,
  updateCatalogue,
} from '@/services/technology-economic/spread-coefficient';
interface ResponseData {
  items?: {
    id?: string;
    name?: string;
    engineeringTemplateType: string;
  }[];
}
type DataSource = {
  id: string;
  [key: string]: string;
};
const { TabPane } = Tabs;
const { Search } = Input;
const engineeringTemplateTypeList = getEnums('EngineeringTemplateType');

export const getTypeName = (no: number) => {
  let str = '';
  engineeringTemplateTypeList &&
    engineeringTemplateTypeList.map((item: any) => {
      if (no === item.value) {
        str = item.text;
      }
    });
  return str;
};
const ProjectTypeList = [
  { text: '价差目录', value: 1 },
  { text: '调整文件', value: 2 },
];
const SpreadCoefficient: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const tableADRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<DataSource[] | Object>([]); // 价差目录
  const [tableSelectADRows, setTableSelectADRow] = useState<DataSource[] | Object>([]); // 调整文件
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false); // 价差目录
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [addADFormVisible, setAddADFormVisible] = useState<boolean>(false); // 调整文件
  const [editADFormVisible, setEditADFormVisible] = useState<boolean>(false);
  const [projectType, setProjectType] = useState<number>(1);
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [addADForm] = Form.useForm();
  const [editADForm] = Form.useForm();
  const columns = [
    {
      dataIndex: 'no',
      key: 'no',
      title: '编号',
      width: 300,
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: '模板名称',
    },
    {
      dataIndex: 'publishDate',
      key: 'publishDate',
      title: '发布时间',
      render: (text: string, record: any) => {
        return moment(record.expiryTime).format('YYYY-MM-DD HH:mm ');
      },
    },
    {
      dataIndex: 'publishedBy',
      key: 'publishedBy',
      title: '发布单位',
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '备注',
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      title: '状态',
      render: (value: boolean, record: DataSource) => {
        if (projectType === 1) {
        }
        return (
          <Switch
            defaultChecked={value}
            onClick={(checked) => {
              projectType === 1
                ? setDefaultTemplateStatus(record.id, checked)
                : setAdjustmentFileStatus(record.id, checked);
            }}
          />
        );
      },
    },
  ];
  // 切换tab
  const callback = (key: any) => {
    setProjectType(parseInt(key));
    // getList(key);
  };
  // 列表刷新
  const refresh = () => {
    const ref = projectType === 1 ? tableRef : tableADRef;
    if (ref && ref.current) {
      // @ts-ignore
      ref.current.refresh();
    }
  };

  // 创建按钮
  const addEvent = () => {
    projectType === 1 ? setAddFormVisible(true) : setAddADFormVisible(true);
  };

  // 删除
  const sureDeleteData = async () => {
    if (projectType === 1) {
      // 价差目录

      if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
        message.error('请选择一条数据进行编辑');
        return;
      }
      const id = [tableSelectRows[0].id];
      await deleteTemplate(id); // TODO
      refresh();
      message.success('删除成功');
    } else {
      // 调整文件
      if (tableSelectADRows && isArray(tableSelectADRows) && tableSelectADRows.length === 0) {
        message.error('请选择一条数据进行编辑');
        return;
      }
      const id = tableSelectADRows[0].id;
      await deleteAdjustmentFile(id); // TODO
      refresh();
      message.success('删除成功');
    }
  };

  // 编辑
  const editEvent = () => {
    console.log(tableSelectRows[0])
    if (projectType === 1) {
      // 价差目录
      if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
        message.error('请选择要操作的行');
        return;
      }
      setEditFormVisible(true);
      editForm.setFieldsValue({
        ...tableSelectRows[0],
      });
    } else {
      // 调整文件
      if (tableSelectADRows && isArray(tableSelectADRows) && tableSelectADRows.length === 0) {
        message.error('请选择要操作的行');
        return;
      }
      setEditADFormVisible(true);
      editADForm.setFieldsValue({
        ...tableSelectADRows[0],
      });
    }
  };
  // 查看详情 TODO
  const lookDetail = () => {
    if (projectType === 1) {
      if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
        message.error('请选择要操作的行');
        return;
      }
      const id = tableSelectRows[0].id;
      const name = tableSelectRows[0].name;
      history.push(`/technology-economic/price-difference-details?id=${id}&name=${name}`);
    } else {
      history.push(`/technology-economic/adjustment-file-details`);
    }
  };
  // 价差目录新增确认按钮
  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {
      console.log(values);

      await createCatalogue(values); // TODO
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };
  // 价差目录编辑确认按钮
  const sureEditAuthorization = () => {
    editForm.validateFields().then(async (values) => {
      const id = tableSelectRows[0].id;
      let value = values;
      value.id = id;
      // TODO 编辑接口
      await updateCatalogue(value);
      refresh();
      setEditFormVisible(false);
      editForm.resetFields();
    });
  };
  // 调整文件新增确认按钮
  const sureAddADAuthorization = () => {
    addADForm.validateFields().then(async (values) => {
      await createAdjustmentFile(values); // TODO
      refresh();
      setAddADFormVisible(false);
      addADForm.resetFields();
    });
  };
  // 调整文件编辑确认按钮
  const sureEditADAuthorization = () => {
    editADForm.validateFields().then(async (values) => {
      const id = tableSelectRows[0].id;
      let value = values;
      value.id = id;
      // TODO 编辑接口
      await updateAdjustmentFile(value);
      refresh();
      setEditFormVisible(false);
      editForm.resetFields();
    });
  };
  const tableElement = () => {
    return (
      <div className={styles.topDiv}>
        <CommonTitle>价差系数</CommonTitle>
        <div className={styles.buttonArea}>
          {/* {buttonJurisdictionArray?.includes('pricing-tem-add') && (
            <Button type="primary" className="mr7" onClick={() => addEvent()}>
              <PlusOutlined />
              添加
            </Button>
          )} */}
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
          {/* {buttonJurisdictionArray?.includes('pricing-tem-edit') && (
            <Button className="mr7" onClick={() => editEvent()}>
              <EditOutlined />
              编辑
            </Button>
          )} */}
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
          {/* {buttonJurisdictionArray?.includes('pricing-tem-del') && (
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
          )} */}
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
          <Button className="mr7" onClick={() => lookDetail()}>
            <EyeOutlined />
            查看详情
          </Button>
        </div>
      </div>
    );
  };
  // 价差目录
  const tableSelectEvent = (data: DataSource[] | Object) => {
    setTableSelectRow(data);
  };
  // 调整文件
  const tableSelectADEvent = (data: DataSource[] | Object) => {
    setTableSelectADRow(data);
  };

  return (
    <PageCommonWrap>
      {tableElement()}
      <div className={styles.moduleTabs}>
        <Tabs onChange={callback} type="card">
          {ProjectTypeList.map((item: any, index: number) => {
            return (
              <TabPane tab={item.text} key={item.value}>
                <div className={styles.pannelTable}>
                  {projectType === 1 ? (
                    // 价差目录
                    <GeneralTable
                      ref={tableRef}
                      needCommonButton={false}
                      columns={columns as ColumnsType<DataSource | object>}
                      url="/PriceDifference/GetAllDefaultPriceDifferenceTemplates"
                      getSelectData={tableSelectEvent}
                      type="radio"
                      requestSource="tecEco1"
                      extractParams={{}}
                    />
                  ) : (
                    // 调整文件
                    <GeneralTable
                      ref={tableADRef}
                      needCommonButton={false}
                      columns={columns as ColumnsType<DataSource | object>}
                      url="/PriceDifference/GetAllAdjustmentFiles"
                      getSelectData={tableSelectADEvent}
                      type="radio"
                      requestSource="tecEco1"
                      extractParams={{}}
                    />
                  )}
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </div>

      <Modal
        maskClosable={false}
        title="创建-价差目录"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <DictionaryForm type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-价差目录"
        width="880px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <DictionaryForm type="edit" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="创建-调整文件"
        width="880px"
        visible={addADFormVisible}
        okText="确认"
        onOk={() => sureAddADAuthorization()}
        onCancel={() => setAddADFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addADForm} preserve={false}>
          <AdjustmentFileForm type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-调整文件"
        width="880px"
        visible={editADFormVisible}
        okText="确认"
        onOk={() => sureEditADAuthorization()}
        onCancel={() => setEditADFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editADForm} preserve={false}>
          <AdjustmentFileForm type="edit" />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default SpreadCoefficient;
