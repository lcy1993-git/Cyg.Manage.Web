import {Button, Space, Switch, Table} from "antd";
import type {ColumnsType} from "antd/lib/table/Table";
import React, {useEffect, useState} from "react";
import styles from './index.less'
import {queryCommonlyTablePager} from "@/services/technology-economic/usual-quota-table";
import type {QueryData} from "@/services/technology-economic/usual-quota-table";
import moment from "moment";

interface Props {
}

interface CommonlyTable {
  "id": string;
  "number": string;
  "name": string;
  "commonlyTableType": number
  "commonlyTableTypeText": string;
  "sourceFile": string;
  "publishDate": moment.Moment
  "publishOrg": string;
  "year": string;
  "industryType": number
  "industryTypeText": string;
  "majorType": number
  "majorTypeText": string;
  "remark": string;
  "enabled": boolean
}

const UsualQuotaTable: React.FC<Props> = () => {
  const [dataSource, setDataSource] = useState<CommonlyTable[]>([])
  const [queryData, setQueryData] = useState<QueryData>({
    "pageIndex": 1,
    "pageSize": 10,
    "sort": {
      "propertyName": '',
      "isAsc": false
    },
    "keyWord": ''
  })
  const getTableData = async () => {
    const res = await queryCommonlyTablePager(queryData)
    // @ts-ignore
    setDataSource(res?.items)
  }
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      width: 80,
      render: (text: string, record: any, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: '名称',
      align: 'center',
      width: 170,
    },
    {
      dataIndex: 'commonlyTableTypeText',
      key: 'commonlyTableTypeText',
      title: '费率类型',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'sourceFile',
      key: 'sourceFile',
      ellipsis: true,
      title: '来源文件',
      align: 'center',
      width: 150,
    },
    {
      dataIndex: 'publishDate',
      key: 'publishDate',
      title: '发布时间',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (text: any) => {
        return moment(text).format('YYYY/MM/DD')
      }
    },
    {
      dataIndex: 'publishOrg',
      key: 'publishOrg',
      title: '发布机构',
      align: 'center',
      ellipsis: true,
      width: 150
    },
    {
      dataIndex: 'year',
      key: 'year',
      title: '费率年度',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'industryTypeText',
      key: 'industryTypeText',
      title: '行业类别',
      align: 'center',
      width: 120,
    },
    {
      dataIndex: 'majorTypeText',
      key: 'majorTypeText',
      title: '适用专业',
      align: 'center',
      width: 100,
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      title: '状态',
      width: 120,
      align: 'center',
      render: (enable: boolean) => {
        return (
          <Space>
            <Switch checked={enable} disabled={true}/>
            <span>{enable ? '启用' : '停用'}</span>
          </Space>
        )
      }
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '备注',
      width: 100,
      align: 'center',
    },
  ];
  const addCommonly = ()=>{
    console.log('add')
  }
  useEffect(() => {
    getTableData()
  }, [])
  return (
    <div className={styles.usualQuotaTable}>
      <div className={styles.topButtons}>
        <Space>
          <Button type={'primary'}>费率详情</Button>
          <Button type={'primary'} onClick={addCommonly}>添加</Button>
          <Button>编辑</Button>
          <Button>删除</Button>
        </Space>
      </div>
      <Table
        dataSource={dataSource}
        rowKey={'id'}
        columns={columns}/>;
    </div>
  );
}

export default UsualQuotaTable;
