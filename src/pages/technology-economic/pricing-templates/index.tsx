import React, { useState } from 'react';
import { history } from 'umi';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { Input, Button, Modal, Form, Switch, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { isArray } from 'lodash';

import GeneralTable from '@/components/general-table';
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

const { Search } = Input;
const engineeringTemplateTypeList = getEnums('EngineeringTemplateType');
const columns = [
  {
    dataIndex: 'no',
    key: 'no',
    title: '编号',
    width: 300,
  },
  {
    dataIndex: 'engineeringTemplateType',
    key: 'engineeringTemplateType',
    title: '模板类型',
    render: (text: string, record: any) => {
      return getTypeName(record.engineeringTemplateType);
    },
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
    dataIndex: 'version',
    key: 'version',
    title: '版本',
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
    render(value: boolean, record: DataSource) {
      return (
        <Switch
          defaultChecked={value}
          onClick={(checked) => {
            setPricingTemplate(record.id, checked);
          }}
        />
      );
    },
  },
];
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
const PricingTemplates: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<DataSource[] | Object>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();
  const [selectList, setSelectList] = useState<number[]>([]);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  useEffect(() => {
    getSelectList();
  }, []);
  const getSelectList = async () => {
    const list: number[] = [];
    const data: ResponseData = await queryPricingTemplatePager({ pageIndex: 1, pageSize: 3000 });
    if (data) {
      if (data.hasOwnProperty('items') && data.items?.length) {
        data.items.map((item) => {
          list.push(parseInt(item.engineeringTemplateType as string));
        });
      }
    }
    setSelectList(list);
  };
  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
      getSelectList();
    }
  };

  // 创建按钮
  const addEvent = () => {
    setAddFormVisible(true);
  };
  // 新增确认按钮
  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {
      await addPricingTemplate(values);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };
  // 编辑确认按钮
  const sureEditAuthorization = () => {
    editForm.validateFields().then(async (values) => {
      const id = tableSelectRows[0].id;
      let value = values;
      value.id = id;
      // TODO 编辑接口
      await editPricingTemplate(value);
      refresh();
      setEditFormVisible(false);
      editForm.resetFields();
    });
  };
  // 删除
  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const id = tableSelectRows[0].id;
    await deletePricingTemplate(id);
    refresh();
    message.success('删除成功');
  };

  // 编辑按钮
  const editEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    setEditFormVisible(true);
    editForm.setFieldsValue({
      ...tableSelectRows[0],
    });
  };
  // 跳转工程目录
  const engineeringCatalog = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    const id = tableSelectRows[0].id;
    history.push(`/technology-economic/project-list?id=${id}`);
  };
  const commonRates = () => {
    history.push(`/technology-economic/common-rate`);
  };
  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {!buttonJurisdictionArray?.includes('quotaLib-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {!buttonJurisdictionArray?.includes('quotaLib-info') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {!buttonJurisdictionArray?.includes('quotaLib-del') && (
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
        )}
        <Button className="mr7" onClick={() => engineeringCatalog()}>
          <FileSearchOutlined />
          工程量目录
        </Button>
        <Button className="mr7" onClick={() => commonRates()}>
          <FileSearchOutlined />
          常用费率
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          <FileSearchOutlined />
          费用模板
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          <FileSearchOutlined />
          报表模板
        </Button>
      </div>
    );
  };

  const tableSelectEvent = (data: DataSource[] | Object) => {
    setTableSelectRow(data);
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as ColumnsType<DataSource | object>}
        url="/EngineeringTemplate/QueryEngineeringTemplatePager"
        tableTitle="计价模板管理"
        getSelectData={tableSelectEvent}
        type="radio"
        requestSource="tecEco1"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="创建-计价模板"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <DictionaryForm type="add" selectList={selectList} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-计价模板"
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
    </PageCommonWrap>
  );
};

export default PricingTemplates;
