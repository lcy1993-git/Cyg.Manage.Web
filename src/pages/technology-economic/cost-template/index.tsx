import { Tabs } from 'antd';

import React, { useEffect, useState, useRef } from 'react';
import styles from './index.less';
import ConstructionFees from '@/pages/technology-economic/cost-template/components/construction-fees';
import { getCostTableDirectory } from '@/services/technology-economic/cost-template';
import qs from 'qs';

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
  const childRef = useRef<HTMLDivElement>(null);
  const getDirectory = async () => {
    const id = (qs.parse(window.location.href.split('?')[1]).id as string) || '';
    const res = await getCostTableDirectory(id);
    // @ts-ignore
    setMenus(res);
    console.log(res);
  };
  const onChange = (key: string) => {
    setCurrentTabId(key);
  };
  useEffect(() => {
    getDirectory();
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
        <h3 className={styles.content}>目录</h3>
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
