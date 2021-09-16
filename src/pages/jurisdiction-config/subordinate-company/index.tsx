import React, { useRef } from 'react';
import GeneralTable from '@/components/general-table';
import styles from './index.less';
import PageCommonWrap from '@/components/page-common-wrap';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const CompanyHierarchy: React.FC = () => {
  const superiorRef = useRef<HTMLDivElement>(null);
  const subordinateRef = useRef<HTMLDivElement>(null);

  const columns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      index: 'name',
      width: 320,
    },
    {
      title: '公司名称',
      dataIndex: 'name',
      index: 'name',
      width: 320,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      index: 'phone',
      width: 180,
    },
    {
      title: '联系邮箱',
      dataIndex: 'email',
      index: 'email',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      index: 'address',
    },
  ];

  return (
    <PageCommonWrap>
      <div className={styles.hierarchyTable}>
        <Tabs defaultActiveKey="superior" type="card">
          <TabPane tab="上级公司" key="superior" style={{ height: '740px' }}>
            <div className={styles.leftTableContent}>
              <GeneralTable
                noPaging
                needTitleLine={false}
                ref={superiorRef}
                defaultPageSize={20}
                columns={columns}
                extractParams={{
                  category: 1,
                }}
                url="/CompanyHierarchy/GetListByCurrent"
              />
            </div>
          </TabPane>
          <TabPane tab="下级公司" key="subordinate" style={{ height: '740px' }}>
            <div className={styles.leftTableContent}>
              <GeneralTable
                noPaging
                needTitleLine={false}
                ref={subordinateRef}
                defaultPageSize={20}
                columns={columns}
                extractParams={{
                  category: 2,
                }}
                url="/CompanyHierarchy/GetListByCurrent"
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </PageCommonWrap>
  );
};

export default CompanyHierarchy;
