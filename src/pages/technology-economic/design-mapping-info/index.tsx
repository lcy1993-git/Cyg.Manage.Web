import React, {useEffect, useState} from 'react';
import {Input, Button, Modal, Space, Select, message} from 'antd';
import type {ColumnsType} from 'antd/lib/table';

import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';

import {
  getMaterialLibraryList
} from '@/services/technology-economic/supplies-library';
import {
  addSourceMaterialMappingQuota,
  getSourceMaterialMappingDesignLibraryList,
  manageMaterialMappingDesignItem,
  MaterialMappingInherit,
} from '@/services/technology-economic/material';
import qs from "qs";
import styles from "@/pages/project-management/all-project-new/components/approval-project-modal/index.less";
import {ExclamationCircleOutlined} from "@ant-design/icons";
import imgSrc from "@/assets/image/relation.png"
import MappingManage from "@/pages/technology-economic/design-mapping-info/components/manage";

export interface SuppliesLibraryData {
  "id": string
  "sourceMaterialMappingDesignLibraryId": string
  "number": string
  "name": string
  "standard": string
  "sourceMaterialLibraryId": string
  "sourceMaterialLibraryName": string
  "sourceMaterialItemId": string
  "sourceMaterialItemName": string
  "sourceMaterialItemIdCode": string
  "sourceMaterialItemStandard": string
}

const {Search} = Input;

const {confirm} = Modal;
const {Option} = Select;

const DesignMappingInfo: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<SuppliesLibraryData[] | Object>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [inheritance, setInheritance] = useState<boolean>(false);
  const [materialList, setMaterialList] = useState<{ name: string, id: string }[]>([])
  const [inheritanceArr, setInheritanceArr] = useState<{ id: string, name: string }[]>([])
  const [id, setId] = useState<string>('')
  const [inheritId, setInheritId] = useState<string>('')


  const getMaterialData = async () => {
    const res = await getMaterialLibraryList({
      "pageIndex": 1,
      "pageSize": 9999,
      "keyWord": '',
      "sort": {
        "propertyName": '',
        "isAsc": true
      },
    })
    setMaterialList(res.items)
    const vals = await getSourceMaterialMappingDesignLibraryList({
      "pageIndex": 1,
      "pageSize": 9999,
      "keyWord": '',
    })
    setInheritanceArr(vals.items)
  }
  useEffect(() => {
    let val = qs.parse(window.location.href.split("?")[1])?.id
    val = val === 'undefined' ? '' : val
    setId(val as string);
    getMaterialData()
  }, [])
  const handlerEdit = (item: SuppliesLibraryData) => {
    setAddFormVisible(true)
    setTableSelectRows(item)
  }
  const handlerDel = (val: string) => {
    confirm({
      title: '确定要删除该映射吗?',
      icon: <ExclamationCircleOutlined/>,
      async onOk() {
        await manageMaterialMappingDesignItem(val)
        refresh()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
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

  // 添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const onFinish = async (val: SuppliesLibraryData) => {
    const data = {...val}
    await addSourceMaterialMappingQuota(data)
    setAddFormVisible(false)
    refresh()
  }

  const tableElement = () => {
    return (
      <Space>
        <Button type="primary" className="mr7" onClick={() => setInheritance(true)}>
          继承
        </Button>
      </Space>
    );
  };


  const materialInherit = async () => {
    await MaterialMappingInherit({
      inheritId: id,
      byInheritId: inheritId
    })
    message.success('继承成功')
  }
  const columns: ColumnsType<any> = [
    {
      dataIndex: 'number',
      key: 'number',
      title: '编号',
      align: 'center',
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: '名称',
      align: 'center',
    },
    {
      dataIndex: 'standard',
      key: 'standard',
      title: '规格',
      align: 'center',
    },
    {
      dataIndex: 'publishOrg',
      key: 'publishOrg',
      ellipsis: true,
      title: '关联设计端资源库',
      align: 'center',
    },
    {
      dataIndex: 'sourceMaterialLibraryId',
      key: 'sourceMaterialLibraryId',
      title: '关系',
      ellipsis: true,
      align: 'center',
      width: 110,
      render: (val: string) => {
        return (
          val !== null ? <img src={imgSrc} alt={''} style={{width: '80'}} width={80}/> : ''
        )
      }
    },
    {
      dataIndex: 'sourceMaterialLibraryName',
      key: 'sourceMaterialLibraryName',
      title: '技经物料库',
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'sourceMaterialItemIdCode',
      key: 'sourceMaterialItemIdCode',
      title: '编号',
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'sourceMaterialItemName',
      key: 'sourceMaterialItemName',
      title: '名称',
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'sourceMaterialItemStandard',
      key: 'sourceMaterialItemStandard',
      title: '规格',
      align: 'center',
      ellipsis: true,
    },
    {
      title: "管理",
      render(t, record: any) {
        return (
          <div className={styles.buttonArea}>
            <Button type="link" onClick={() => handlerEdit(record)}>编辑</Button>
            <Button type="link" onClick={() => handlerDel(record.id)}>删除</Button>
          </div>
        )
      },
      width: 120
    },
  ];

  return (
    <PageCommonWrap>
      {
        id && <GeneralTable
          ref={tableRef}
          buttonLeftContentSlot={searchComponent}
          buttonRightContentSlot={tableElement}
          needCommonButton={true}
          columns={columns as ColumnsType<SuppliesLibraryData | object>}
          url="/MaterialLibrary/GetMaterialMappingDesignItemList"
          tableTitle="查看设计端物料库映射详情"
          requestSource='tecEco1'
          type="radio"
          extractParams={{
            keyWord: searchKeyWord,
            materialMappingDesignLibraryId: id,
          }}
        />
      }
      <Modal
        maskClosable={false}
        title="添加继承"
        width="500px"
        visible={inheritance}
        okText="确认"
        footer={false}
        onCancel={() => setInheritance(false)}
        cancelText="取消"
        destroyOnClose
      >
        <div style={{marginBottom: '40px'}}>
          <Select onChange={(val) => setInheritId(val as string)} style={{width: '350px'}}
                  placeholder={'请选择被继承的设计端物料库映射'}>
            {
              inheritanceArr.map(o => {
                return <Option value={o.id} key={o.id} disabled={o.id === id}>{o.name}</Option>
              })
            }
          </Select>
        </div>
        <div style={{marginTop: "-14px", float: 'right'}}>
          <Space>
            <Button onClick={() => setInheritance(false)}>
              取消
            </Button>
            <Button type="primary" onClick={materialInherit}>
              确定
            </Button>
          </Space>
        </div>
      </Modal>
      <Modal
        maskClosable={false}
        title="添加-物料库映射"
        width="1500px"
        visible={addFormVisible}
        okText="确认"
        footer={false}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <div style={{height: '700px'}}>
          <MappingManage/>
        </div>
      </Modal>
    </PageCommonWrap>
  );
};

export default DesignMappingInfo;

