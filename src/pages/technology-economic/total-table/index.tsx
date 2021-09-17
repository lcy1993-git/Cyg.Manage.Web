import { Table } from 'antd';
import type { ColumnsType } from 'antd/lib/table/Table';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import TableImportButton from '@/components/table-import-button';
import { queryEngineeringInfoCostTotal } from '@/services/technology-economic/total-table';
import WrapperComponent from '@/components/page-common-wrap';
import qs from 'qs';

interface Props {}

interface TotalTableRow {
  id: string;
  engineeringTemplateId: string;
  no: string;
  name: string;
  code: string;
  constructionCostFormula: null | string;
  deviceCostFormula: null | string;
  installCostFormula: null | string;
  otherCostFormula: null | string;
  basicReserveCostFormula: null | string;
  totalCostFormula: null | string;
  staticInvestmentRatio: null | string;
  unitInvestmentCountFormula: null | string;
  unit: null | string;
  unitInvestmentFormula: null | string;
  costNo: null | string;
  remark: null | string;
  parentId: null | string;
  isLeaf: boolean;
  sort: number;
}

const TotalTable: React.FC<Props> = () => {
  const [dataSource, setDataSource] = useState<TotalTableRow[]>([]);
  const id = (qs.parse(window.location.href.split('?')[1]).id as string) || '';
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      width: 50,
      align:'center',
      render: (text: string, record: any, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      dataIndex: 'name',
      key: 'name',
      title: '名称',
      align: 'center',
      width: 220,
    },
    {
      dataIndex: 'code',
      key: 'code',
      title: '代码',
      align: 'center',
      width: 80,
    },
    {
      dataIndex: 'constructionCostFormula',
      key: 'constructionCostFormula',
      ellipsis: true,
      title: '建筑工程费(JZF)',
      align: 'center',
      width: 270,
    },
    {
      dataIndex: 'deviceCostFormula',
      key: 'deviceCostFormula',
      title: '设备购置费(SBF)',
      ellipsis: true,
      align: 'center',
      width: 240,
    },
    {
      dataIndex: 'installCostFormula',
      key: 'installCostFormula',
      title: '安装工程费(AZF)',
      align: 'center',
      ellipsis: true,
      width: 250,
    },
    {
      dataIndex: 'otherCostFormula',
      key: 'otherCostFormula',
      title: '其他费用(QTF)',
      align: 'center',
      ellipsis: true,
      width: 220,
    },
    {
      dataIndex: 'basicReserveCostFormula',
      key: 'basicReserveCostFormula',
      title: '基本预备费(JBYBF)',
      align: 'center',
      width: 220,
      ellipsis: true,
    },
    {
      dataIndex: 'totalCostFormula',
      key: 'totalCostFormula',
      title: '合计费(HJF)',
      align: 'center',
      ellipsis: true,
      width:200,
    },
    {
      dataIndex: 'staticInvestmentRatio',
      key: 'staticInvestmentRatio',
      title: '静态投资比例(ZZJ)',
      width: 220,
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'unitInvestmentCountFormula',
      key: 'unitInvestmentCountFormula',
      title: '单位投资量',
      width: 200,
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'unit',
      key: 'unit',
      title: '单位',
      width: 80,
      align: 'center',
    },
    {
      dataIndex: 'unitInvestmentFormula',
      key: 'unitInvestmentFormula',
      title: '单位投资(DWTZ)',
      width: 220,
      align: 'center',
      ellipsis: true,
    },
    {
      dataIndex: 'costNo',
      key: 'costNo',
      title: '费用编码',
      width: 120,
      align: 'center',
    },
    {
      dataIndex: 'remark',
      key: 'remark',
      title: '备注',
      width: 120,
      align: 'center',
    },
  ];
  const getTableData = async () => {
    const res = await queryEngineeringInfoCostTotal(id);
    // @ts-ignore
    setDataSource(res);
  };
  useEffect(() => {
    getTableData();
  }, []);
  return (
    <WrapperComponent>
      <div className={styles.totalTable}>
        <div className={styles.topButton}>
          <TableImportButton
            extraParams={{EngineeringTemplateId:id}}
            buttonTitle={'导入总算表'}
            requestSource={'tecEco1'}
            setSuccessful={getTableData}
            importUrl={'/EngineeringTotal/ImportEngineeringInfoCostTotal'}
          />
        </div>
        <Table
          pagination={false}
          size={'small'}
          scroll={{ y: 720,x:2200 }}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </WrapperComponent>
  );
};

export default TotalTable;
