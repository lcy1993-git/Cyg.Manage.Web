// import {Space, Switch,Input, Button} from "antd";
// import type {ColumnsType} from "antd/lib/table/Table";
// import React, {useEffect, useState} from "react";
// import styles from './index.less'
// import {getMaterialLibraryList} from "@/services/technology-economic/supplies-library";
// import type {QueryData} from "@/services/technology-economic/usual-quota-table";
// import GeneralTable from '@/components/general-table';
//
// const { Search } = Input;
// interface Props {
//
// }
//
// export interface SuppliesbleRow {
//   "id": string
//   "name": string
//   "publishOrg": string
//   "publishDate": string | moment.Moment
//   "remark": string
//   "enabled": boolean
// }
//
// const SuppliesLibrary: React.FC<Props> = () => {
//   const [dataSource, setDataSource] = useState<SuppliesbleRow[]>([])
//   const setStatus = (status: boolean, record: SuppliesbleRow) => {
//     console.log(status, record)
//   }
//   const [pageData, setPageData] = useState<QueryData>({
//     "pageIndex": 1,
//     "pageSize": 10,
//     "sort": {
//       "propertyName": '',
//       "isAsc": false
//     },
//     "keyWord": ''
//   } as QueryData)
//   const [pagination,setPagination] = useState({
//     total:0,
//     pageSize:10,
//   })
//   const columns: ColumnsType<any> = [
//     {
//       dataIndex: 'name',
//       key: 'name',
//       title: '名称',
//       align: 'center',
//       width: 170,
//     },
//     {
//       dataIndex: 'publishDate',
//       key: 'publishDate',
//       title: '发布时间',
//       align: 'center',
//       width: 80,
//     },
//     {
//       dataIndex: 'publishOrg',
//       key: 'publishOrg',
//       ellipsis: true,
//       title: '发布机构',
//       align: 'center',
//       width: 170,
//     },
//     {
//       dataIndex: 'enabled',
//       key: 'enabled',
//       title: '状态',
//       ellipsis: true,
//       align: 'center',
//       width: 140,
//       render: (enable: boolean, record: any) => {
//         return (
//           <Space>
//             <Switch checked={enable} onChange={(status) => setStatus(status, record)}/>
//             <span>{enable ? '启用' : '停用'}</span>
//           </Space>
//         )
//       }
//     },
//     {
//       dataIndex: 'remark',
//       key: 'remark',
//       title: '说明',
//       align: 'center',
//       ellipsis: true,
//       width: 150,
//     }
//   ];
//   const getTableData = async () => {
//     const res = await getMaterialLibraryList(pageData)
//     setPagination(res.total)
//     setDataSource(res.items)
//   }
//
//   const onSearch = (text: string)=>{
//     const data = {...pageData}
//     data.keyWord = text
//     setPageData(data)
//   }
//   const pageDataChange = (page: number, pageSize: number)=>{
//     const data = {...pageData}
//     data.pageSize = pageSize
//     data.pageIndex = page
//     setPageData(data)
//   }
//   useEffect(() => {
//     getTableData()
//   }, [pageData])
//   return (
//     <div className={styles.suppliesLibrary}>
//       <div className={styles.topButton}>
//         <div className={styles.search}>
//           <Search placeholder="请输入关键词" onSearch={onSearch} enterButton />
//         </div>
//         <div>
//           <Space>
//             <Button type={'primary'}>添加</Button>
//             <Button>删除</Button>
//             <Button>查看详情</Button>
//           </Space>
//         </div>
//       </div>
//       <GeneralTable
//         rowKey={'id'}
//         size={'small'}
//         tableTitle="物料库管理"
//         url='/MaterialLibrary/GetMaterialLibraryList'
//         dataSource={dataSource}
//         columns={columns}/>;
//     </div>
//   );
// }
//
// export default SuppliesLibrary;
import React, { useState } from 'react';
import { history } from 'umi';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { Input, Button, Modal, Form, Switch, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EyeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { isArray } from 'lodash';

import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';

import {
  createMaterialMachineLibrary,
  deleteMaterialMachineLibrary,
  setMaterialMachineLibraryStatus
} from '@/services/technology-economic';
import styles from './index.less';

type DataSource = {
  id: string;
  [key: string]: string;
}

const { Search } = Input;

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    title: '名称',
    width: 300,
  },
  {
    dataIndex: 'quotaLibrarys',
    key: 'quotaLibrarys',
    title: '已关联定额库',
  },
  {
    dataIndex: 'publishDate',
    key: 'publishDate',
    title: '发布时间',
  },
  {
    dataIndex: 'publishOrg',
    key: 'publishOrg',
    title: '发布机构',
  },
  {
    dataIndex: 'year',
    key: 'year',
    title: '价格年度',
  },
  {
    dataIndex: 'industryType',
    key: 'industryType',
    title: '适用行业',
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
            setMaterialMachineLibraryStatus(record.id, checked);
          }}
        />
      );
    }
  },
  {
    dataIndex: 'remark',
    key: 'remark',
    title: '备注',
    width: 400
  },
];

const SuppliesLibrary: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<DataSource[] | Object>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [addForm] = Form.useForm();

  const searchComponent = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="键名"
        />
      </TableSearch>
    );
  };

  const tableSearchEvent = () => {
    search();
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

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {

      await createMaterialMachineLibrary(values);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    })
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const id = tableSelectRows[0].id;
    await deleteMaterialMachineLibrary(id);
    refresh();
    message.success('删除成功');
  };

  const gotoMoreInfo = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    const id = tableSelectRows[0].id;
    history.push(`/technology-economic/material-infomation?id=${id}`)
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {
          !buttonJurisdictionArray?.includes('quotaLib-add') &&
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        }
        {
          !buttonJurisdictionArray?.includes('quotaLib-del') &&
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
        }
        {
          !buttonJurisdictionArray?.includes('quotaLib-info') &&
          <Button className="mr7" onClick={() => gotoMoreInfo()}>
            <EyeOutlined />
            查看详情
          </Button>
        }

      </div>
    );
  };

  const tableSelectEvent = (data: DataSource[] | Object) => {
    setTableSelectRows(data);
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as ColumnsType<DataSource | object>}
        url="/MaterialLibrary/GetMaterialLibraryList"
        tableTitle="物料库管理"
        getSelectData={tableSelectEvent}
        requestSource='tecEco'
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-定额库"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default SuppliesLibrary;
