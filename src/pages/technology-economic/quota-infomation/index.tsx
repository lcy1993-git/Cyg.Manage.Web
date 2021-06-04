import {useEffect, useMemo, useState, useRef} from 'react';
import PageCommonWrap from "@/components/page-common-wrap";
import ChapterInfo from './components/chapter-info';
import ListTable from './components/list-table';
import InfoTabs from './components/info-tabs';
import { Tabs, Tree, Select } from 'antd';
import { queryQuotaLibraryPager, queryQuotaLibraryCatalogList, getQuotaLibraryCatalogDescription } from '@/services/technology-economic';
import styles from './index.less'
import { useMount, useRequest, useSize } from 'ahooks';
import {formatDataTree, fileTreeFormData, TreeData} from '@/utils/utils';
import qs from 'qs';

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

const QuotaProject = () => {
  const [activeQuotaId, setActiveQuotaId] = useState<string>(qs.parse(window.location.href.split("?")[1]).id as string || "");
  const [catalogueId,setCatalogueId] = useState<string>("");
  const [resourceItem, setResourceItem] = useState<any>({});

  const {data: quotaList = {total: 0, items: []}, run: quotaListRun} = useRequest<QuotaList>(queryQuotaLibraryPager, {
    manual: true
  })

  const {data: catalogueList, run: catalogueListRun } = useRequest<TreeData[]>(queryQuotaLibraryCatalogList, {
    manual: true
  })

  const {data: chapterData, run: chapterRun} = useRequest<string>(getQuotaLibraryCatalogDescription, {manual: true});
  console.log(chapterData);
  
  const [keyWord, setKeyWord] = useState("");
  // const { data: projectList, run: projectListRun } = useRequest(queryQuotaItemList, {
  //   manual: true
  // });

  // useEffect(() => {
  //   if(catalogueId) {
  //     projectListRun({
  //       id: catalogueId,
  //       pageIndex: 1,
  //       pageSize: 10,
  //       keyWord
  //     })
  //     chapterRun(catalogueId)
  //   }

  // }, [catalogueId])

  const ref = useRef(null);
  const refWrap = useSize(ref)

  useEffect(() => {
    activeQuotaId && catalogueListRun(activeQuotaId);
  }, [activeQuotaId])

  // useEffect(() => {
  //   catalogueId && projectListRun(catalogueId);
  // }, [catalogueId])

  useMount(() => {
    quotaListRun({pageIndex: 1, pageSize: 3000});
    activeQuotaId && catalogueListRun(activeQuotaId);
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
                  <Select placeholder="请选择定额库" style={{width: '100%'}} children={options} onChange={(e)=>setActiveQuotaId(e)} defaultValue={activeQuotaId}/>
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
                    <ListTable catalogueId={catalogueId} scrolly={refWrap?.height ? refWrap?.height-531 : 0} setResourceItem={setResourceItem} url="/QuotaLibraryCatalog/QueryQuotaItemPager" rowKey={(e)=>e.quotaItem?.id}/>
                  </div>
                  <div className={styles.heightEmpty} />
                  <InfoTabs data={resourceItem}/>
                </div>
              </TabPane>
              <TabPane tab="章节说明" key="章节说明">
                <ChapterInfo data={chapterData || ""} id={catalogueId}/>
              </TabPane>
            </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  );
}

export default QuotaProject;