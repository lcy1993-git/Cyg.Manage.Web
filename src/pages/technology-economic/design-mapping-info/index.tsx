import React, {useEffect, useState} from 'react';
import {Input, Button, Modal, Space, Select, message} from 'antd';
import type {ColumnsType} from 'antd/lib/table';

import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';

import {
  getSourceMaterialMappingDesignLibraryList,
  deleteMaterialMappingDesignLibrary,
  MaterialMappingInherit,
} from '@/services/technology-economic/material';
import qs from "qs";
import styles from "./index.less";
import {ExclamationCircleOutlined, RedoOutlined} from "@ant-design/icons";
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
  const rankRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<SuppliesLibraryData>({} as SuppliesLibraryData);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [inheritance, setInheritance] = useState<boolean>(false);
  const [inheritanceArr, setInheritanceArr] = useState<{ id: string, name: string }[]>([])
  const [id, setId] = useState<string>('')
  const [inheritId, setInheritId] = useState<string>('') // 继承id
  const [rank, setRank] = useState<number>(3) // 控制按照关系排序

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };
  const getMaterialData = async () => {
    const vals = await getSourceMaterialMappingDesignLibraryList({
      "pageIndex": 1,
      "pageSize": 9999,
      "keyWord": '',
    })
    setInheritanceArr(vals.items)
  }

  const handlerEdit = (item: SuppliesLibraryData) => {
    setAddFormVisible(true)
    setTableSelectRows(item)
  }
  const handlerDel = (val: string) => {
    confirm({
      title: '确定要删除该映射吗?',
      icon: <ExclamationCircleOutlined/>,
      async onOk() {
        await deleteMaterialMappingDesignLibrary(val)
        refresh()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  const searchComponent = () => {
    return (
      <TableSearch label="关键词" width="300px">
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


  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };


  const tableElement = () => {
    return (
      <Space>
        <Button type="primary" className="mr7" onClick={() => setInheritance(true)}>
          继承
        </Button>
      </Space>
    );
  };

  const closeModel = () => {
    setAddFormVisible(false)
    refresh()
  }
  const materialInherit = async () => { // 映射继承
    await MaterialMappingInherit({
      inheritId: id,
      byInheritId: inheritId
    })
    message.success('继承成功')
    setInheritance(false)
  }
  const sortTableData = () => {
    // 关系排序
    if (rankRef.current === null) {
      rankRef.current = 2
    } else if (rankRef.current === 1) {
      rankRef.current = 2
    } else {
      rankRef.current = 1
    }
    setRank(rankRef.current)
  }

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'number',
      key: 'number',
      title: '编号',
      align: 'center',
      width:150
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
      dataIndex: 'sourceMaterialItemId',
      key: 'sourceMaterialItemId',
      title: () => {
        return <div>
          关系
          <span style={{float: 'right',cursor:'pointer'}} onClick={sortTableData}>
            <RedoOutlined />
              {/* { */}
              {/*  rank === 1 */}
              {/*    ? */}
              {/*    <CaretDownOutlined/> */}
              {/*    : */}
              {/*    <CaretUpOutlined/> */}
              {/* } */}
            </span>
        </div>
      },
      ellipsis: true,
      align: 'center',
      width: 110,
      render: (val: string) => {
        return (
          val !== null ? <img src={imgSrc} alt={''} style={{width: '80'}} width={80}/> : ''
        )
      }
    },
    // {
    //   dataIndex: 'sourceMaterialLibraryName',
    //   key: 'sourceMaterialLibraryName',
    //   title: '技经物料库',
    //   align: 'center',
    //   ellipsis: true,
    // },
    {
      dataIndex: 'sourceMaterialItemIdCode',
      key: 'sourceMaterialItemIdCode',
      title: '编号',
      align: 'center',
      width:150,
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
  ]
  const getSelectData = (val:any[])=>{
    setTableSelectRows(val[0])
  }
  useEffect(() => {
    let val = qs.parse(window.location.href.split("?")[1])?.id
    val = val === 'undefined' ? '' : val
    setId(val as string);
    getMaterialData()
  }, [])
  useEffect(() => {
    refresh()
  }, [rank])
  return (
    <PageCommonWrap>
      <div className={styles.designTableBox}>
        {
          id && <GeneralTable
            ref={tableRef}
            getSelectData={getSelectData}
            buttonLeftContentSlot={searchComponent}
            buttonRightContentSlot={tableElement}
            needCommonButton={true}
            columns={columns as ColumnsType<SuppliesLibraryData | object>}
            url="/MaterialLibrary/GetMaterialMappingDesignItemList"
            tableTitle="查看设计端物料库映射详情"
            requestSource='tecEco1'
            type="radio"
            extractParams={{
              rank,
              keyWord: searchKeyWord,
              materialMappingDesignLibraryId: id,
            }}
          />
        }
      </div>
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
        <div style={{height: '720px'}}>
          <MappingManage materialMappingDesignItemId={tableSelectRows.id} close={closeModel}/>
        </div>
      </Modal>
    </PageCommonWrap>
  );
};

export default DesignMappingInfo;

