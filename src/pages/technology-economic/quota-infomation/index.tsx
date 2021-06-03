import {useEffect, useMemo, useState, useRef} from 'react';
import PageCommonWrap from "@/components/page-common-wrap";
import ChapterInfo from './components/chapter-info';
import ListTable from './components/list-table';
import InfoTabs from './components/info-tabs';
import { Tabs, Tree, Select } from 'antd';
import { getQuotaLibrary, getCatalogueList } from '@/services/technology-economic/quota-library';
import styles from './index.less'
import { useMount, useRequest, useSize } from 'ahooks';
import {formatDataTree, fileTreeFormData, TreeData} from '@/utils/utils';

const { TabPane } = Tabs;

interface Items {
  id: string;
  total: number;
  name: string;
}
interface QuotaList{
  total: number;
  items: Items[];
}

const treeData1= [
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

const QuotaProject = ({location}) => {
  console.log(location);
  
  const [activeQuotaId, setActiveQuotaId] = useState<string>("");
  const [catalogueId,setCatalogueId] = useState<string>("");
  console.log(catalogueId);
  
  // const [activeListId, setActiveListId] = useState<string>("");

  const {data: quotaList = {total: 0, items: []}, run: quotaListRun} = useRequest<QuotaList>(getQuotaLibrary, {
    manual: true
  })

  const {data: catalogueList, run: catalogueListRun } = useRequest<TreeData[]>(getCatalogueList, {
    manual: true
  })
  
  // const { data: projectList, run: projectListRun } = useRequest(getProjectList, {
  //   manual: true
  // });
  const ref = useRef();
  const refWrap = useSize(ref)

  console.log(refWrap, "refWrap");
  

  useEffect(() => {
    activeQuotaId && catalogueListRun(activeQuotaId);
  }, [activeQuotaId])

  // useEffect(() => {
  //   catalogueId && projectListRun(catalogueId);
  // }, [catalogueId])

  useMount(() => {
    quotaListRun();
  })

  const treeData = useMemo(() => {
    console.log(catalogueList);
    
    if(catalogueList && catalogueList.length > 0) {
      return fileTreeFormData(formatDataTree(catalogueList))
    }else{
      return [];
    }
  }, [catalogueList]);

  const options = useMemo(() => {
    if(quotaList.total) {
      return quotaList.items.map((item) => {
        return (
          <Select.Option value={item.id} key={item.id}>
            {item.name}
          </Select.Option>
        );
      })
    }else{
      return null;
    }

  }, [quotaList]);

  const onCheck = (kes: React.Key[], {node}: any) => {
    setCatalogueId(node.key)
  }
  return (
    <PageCommonWrap noPadding={true} className={styles.quotaProjectWrap}>
      <div className={styles.wrap} ref={ref}>
        <div className={styles.wrapLeftMenu}>
          <Tabs className="normalTabs noMargin" >
              <TabPane tab="定额库目录" key="1">
                <div className={styles.selectWrap}>
                  <Select placeholder="请选择定额库" style={{width: '100%'}} children={options} onChange={(e)=>setActiveQuotaId(e)}/>
                </div>
                <div className={styles.fileTree}>
                  <Tree.DirectoryTree
                    onSelect={onCheck}
                    // onCheck={onCheck}
                    treeData={treeData}
                    defaultExpandAll
                  />
                </div>
              </TabPane>
            </Tabs>
        </div>
        <div className={styles.empty} />
        <div className={styles.wrapRigntContent}>
            <Tabs className="normalTabs noMargin" >
              <TabPane tab="&nbsp;&nbsp;资源列表" key="1">
                <div className={styles.tabPaneBox}>
                  <div className={styles.listTable}>
                    <ListTable catalogueId={catalogueId} scrolly={refWrap?.height ? refWrap?.height-531 : 0}/>
                  </div>
                  <div className={styles.heightEmpty} />
                  <InfoTabs />
                </div>
              </TabPane>
              <TabPane tab="章节说明" key="章节说明">
                <ChapterInfo />
              </TabPane>
            </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  );
}

export default QuotaProject;