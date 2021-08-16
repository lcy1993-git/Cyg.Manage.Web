import { Tabs } from 'antd';

import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import ConstructionFees from '@/pages/technology-economic/cost-template/components/construction-fees';
import { getCostTableDirectory } from '@/services/technology-economic/cost-template';
import qs from 'qs';
import TableImportButton from "@/components/table-import-button";

const { TabPane } = Tabs;

interface Props {}

export interface CostMenus {
  id: string;
  name: string;
  parentId: string;
}

const CostTemplate: React.FC<Props> = () => {
  const [menus, setMenus] = useState<CostMenus[]>([]);
  const [currentTabId, setCurrentTabId] = useState<string>('');
  const [id, setId] = useState<string>('');
  const childRef = useRef<HTMLDivElement>(null);
  const getDirectory = async (fid: string) => {
    const res = await getCostTableDirectory(fid);
    // @ts-ignore
    setMenus(res);
  };
  const onChange = (key: string) => {
    setCurrentTabId(key);
  };
  useEffect(() => {
    const fid = (qs.parse(window.location.href.split('?')[1]).id as string) || '';
    setId(fid)
    getDirectory(fid);
  }, []);
  useEffect(() => {
    const parent = menus.filter((i) => {
      return i.parentId == null;
    });
    if (parent.length !== 0) {
      setCurrentTabId(parent[0].id);
    }
  }, [menus]);
  return (
    <div className={styles.costTemplate}>
      <div className={styles.leftMenu}>
        <div className={styles.topBox}>
          <h3 className={styles.content}>目录{currentTabId}</h3>
          <div className={styles.importBtn}>
          <TableImportButton
            style={{
              marginRight:'20px',
              marginTop:'20px'
            }}
          requestSource={'tecEco1'}
          extraParams={{ EngineeringTemplateId: id }}
          importUrl={'/EngineeringTemplateCostTable/ImportEngineeringTemplateCostTable'}
          />
          </div>
        </div>

        <Tabs tabPosition={'left'} centered onChange={onChange}>
          {menus
            .filter((i) => i.parentId == null)
            .map((menu) => {
              return (
                <TabPane tab={menu.name} key={menu.id}>
                  {currentTabId === menu.id && (
                    <ConstructionFees ref={childRef} menus={menus} id={currentTabId} />
                  )}
                </TabPane>
              );
            })}
        </Tabs>
      </div>
    </div>
  );
};

export default CostTemplate;
