import React, { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react';
import { Table } from 'antd';
import TableImportButton from '@/components/table-import-button';
import type { CostMenus } from '@/pages/technology-economic/cost-template';
// import {getCostTableProject} from "@/services/technology-economic/cost-template";
import styles from './index.less';
import { Tabs } from 'antd';
import { getCostTableProject } from '@/services/technology-economic/cost-template';

const { TabPane } = Tabs;

interface Props {
  menus?: CostMenus[];
  id: string;
  ref: any;
}

interface projectRow {
  engineeringInfoCostTableId: string | null;
  number: string;
  name: string;
  code: string;
  costFormula: null | string;
  rateFormula: string;
  parentId: string;
  isLeaf: boolean;
  remark: null | string;
  sort: number;
  costNo: null | string;
  isOutput: boolean;
}

const ConstructionFees: React.FC<Props> = forwardRef((props, ref: Ref<any>) => {
  const { menus, id } = props;
  const [datasource, setDateSource] = useState<projectRow[]>([]);
  const [tabs, setTabs] = useState<CostMenus[]>([]);

  const columns = [
    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '序号',
      width: 80,
      render: (text: string, record: any, index: number) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: '费用名称',
      dataIndex: 'name',
      key: 'name',
      width: 170,
    },
    {
      title: '代码',
      width: 100,
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '计算式',
      ellipsis: true,
      dataIndex: 'costFormula',
      key: 'costFormula',
    },
    {
      title: '费率(%)',
      ellipsis: true,
      width: 150,
      dataIndex: 'rateFormula',
      key: 'rateFormula',
    },
    {
      title: '备注',
      width: 200,
      dataIndex: 'remark',
      key: 'remark',
    },
  ];
  const getCostProjectData = async (projectId: string) => {
    const res = await getCostTableProject(projectId);
    setDateSource(res as []);
  };

  useEffect(() => {
    const page = menus?.filter((i) => i.parentId === id);
    if (page) {
      setTabs(page);
      if (page.length !== 0) {
        getCostProjectData(page[0].id);
      }
    }
  }, [id, menus]);
  useEffect(() => {
    console.log(datasource);
  }, [datasource]);
  useImperativeHandle(ref, () => ({
    changeVal: (projectId: string) => {
      getCostProjectData(projectId);
    },
  }));
  return (
    <>
      <div className={styles.constructionFees}>
        <div className={styles.importBtn}>
          <TableImportButton
            requestSource={'tecEco1'}
            extraParams={{ EngineeringTemplateId: id }}
            importUrl={'/EngineeringTemplateCostTable/ImportEngineeringTemplateCostTable'}
          />
        </div>
        {[0, 1].includes(tabs.length) ? (
          <Table
            dataSource={datasource}
            columns={columns}
            scroll={{ y: 750 }}
            pagination={false}
            bordered
            size={'small'}
          />
        ) : (
          <Tabs onChange={getCostProjectData}>
            {tabs.map((item) => {
              return (
                <TabPane tab={item.name} key={item.id}>
                  <Table
                    dataSource={datasource}
                    columns={columns}
                    scroll={{ y: 720 }}
                    pagination={false}
                    bordered
                    size={'small'}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        )}
      </div>
    </>
  );
});

export default ConstructionFees;
