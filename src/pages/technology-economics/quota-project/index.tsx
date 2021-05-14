import {useMemo, useState} from 'react';
import PageCommonWrap from "@/components/page-common-wrap";
import ListTable from './components/ListTable';
import { Tabs, Tree, Select } from 'antd';

import styles from './index.less'
const { TabPane } = Tabs;

const treeData = [
  {
    title: 'parent0',
    key: '0-0',
    children: [
      {
        title: 'leaf 0-0',
        key: '0-0-0',
        isLeaf: true,
      },
      {
        title: 'leaf 0-1',
        key: '0-0-1',
        isLeaf: true,
      },
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      {
        title: 'leaf 1-0',
        key: '0-1-0',
        isLeaf: true,
      },
      {
        title: 'leaf 1-1',
        key: '0-1-1',
        isLeaf: true,
      },
    ],
  },
];




const QuotaProject = () => {

  const [libId, setLibId] = useState<string>("");
  const [activeListId, setActiveListId] = useState<string>("");


  const onCheck = (kes: React.Key[], {node}: any) => {
    setActiveListId(activeListId)
  }
  return (
    <PageCommonWrap noPadding={true} className={styles.quotaProjectWrap}>
      <div className={styles.wrap}>
        <div className={styles.wrapLeftMenu}>
          <Tabs className="normalTabs noMargin" >
              <TabPane tab="定额库目录" key="1">
                <div className={styles.selectWrap}>
                  <Select name="" id="" placeholder="请选择定额库" style={{width: '100%'}} />
                </div>

                <Tree.DirectoryTree
                  onSelect={onCheck}
                  // onCheck={onCheck}
                  treeData={treeData}
                  defaultExpandAll
                />
              </TabPane>
            </Tabs>
        </div>
        <div className={styles.empty} />
        <div className={styles.wrapRigntContent}>
            <Tabs className="normalTabs noMargin" >
              <TabPane tab="&nbsp;&nbsp;资源列表" key="1">
                <div className={styles.tabPaneBox}>
                  <ListTable/>
                </div>
              </TabPane>
              <TabPane tab="章节说明" key="2"></TabPane>
            </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  );
}

export default QuotaProject;