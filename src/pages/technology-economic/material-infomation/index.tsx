import {useEffect, useMemo, useState, useRef} from 'react';
import { useMount, useRequest, useSize } from 'ahooks';
import { Tabs, Tree, Select } from 'antd';

import PageCommonWrap from "@/components/page-common-wrap";
import ListTable from '../components/list-table';
import InfoTabs from './components/info-tabs';

import type { TreeData} from '@/utils/utils';
import {formatDataTree, fileTreeFormData} from '@/utils/utils';
import { queryMaterialMachineLibraryPager, queryMaterialMachineLibraryCatalogList } from '@/services/technology-economic';
import qs from 'qs';

import styles from './index.less'

const { TabPane } = Tabs;

interface Items {
  id: string;
  total: number;
  name: string;
}
interface MaterialList{
  total: number;
  items: Items[];
}

const ResourcesMachinesType = ["未知", "人工", "材料", "机械"];

const columns = [
  {
    dataIndex: 'no',
    index: 'no',
    title: '材机库编号',
    width: 100,
    ellipsis: true,
    render(v: any, record: any){
      return record?.materialMachineItem?.no
    }
  },
  {
    dataIndex: 'type',
    index: 'type',
    title: '人材机类型',
    width: 100,
    ellipsis: true,
    render(v: any, record: any){
      return ResourcesMachinesType[record?.materialMachineItem?.type] ?? ""
    }
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '人材机名称',
    // width: 200,
    ellipsis: true,
    render(v: any, record: any){
      return record?.materialMachineItem?.name
    }
  },
  {
    dataIndex: 'unit',
    index: 'unit',
    title: '单位',
    width: 100,
    ellipsis: true,
    render(v: any, record: any){
      return record?.materialMachineItem?.unit
    }
  },
  {
    dataIndex: 'prePrice',
    index: 'prePrice',
    title: '预算价(元)',
    width: 120,
    ellipsis: true,
    render(v: any, record: any){
      return record?.materialMachineItem?.prePrice
    }
  },
  {
    dataIndex: 'weight',
    index: 'weight',
    title: '单重(kg)',
    width: 120,
    ellipsis: true,
    render(v: any, record: any){
      return record?.materialMachineItem?.weight
    }
  },
  {
    dataIndex: 'valuationTypeText',
    index: 'valuationTypeText',
    title: '类别',
    width: 70,
    ellipsis: true,
    render(v: any, record: any){
      return record?.materialMachineItem?.valuationTypeText
    }
  }
];

const QuotaProject = () => {

  const [materialLibraryId, setMaterialLibraryId] = useState<string>(qs.parse(window.location.href.split("?")[1]).id as string || "");
  const [catalogueId, setCatalogueId] = useState<string>("");
  const [resourceItem, setResourceItem] = useState<any>({});

  const defaultLibValue = materialLibraryId ? {defaultValue: materialLibraryId} : {}

  const {data: materialLibList = {total: 0, items: []}, run: materialLibRun} = useRequest<MaterialList>(queryMaterialMachineLibraryPager, {
    manual: true
  })

  useMount(() => {
    materialLibRun({pageIndex: 1, pageSize: 3000});
  })

  const {data: catalogueList, run: catalogueListRun } = useRequest<TreeData[]>(queryMaterialMachineLibraryCatalogList, {
    manual: true
  })

  const ref = useRef(null);
  const refWrap = useSize(ref)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    materialLibraryId && catalogueListRun(materialLibraryId);
  }, [materialLibraryId])

  const treeData = useMemo(() => {
    if(catalogueList && catalogueList.length > 0) {
      return fileTreeFormData(formatDataTree(catalogueList))
    }
      return [];

  }, [catalogueList]);

  const options = useMemo(() => {
    if(materialLibList.total) {
      return materialLibList.items.map((item) => {
        return (
          <Select.Option value={item.id} key={item.id}>
            {item.name}
          </Select.Option>
        );
      })
    }
      return null;


  }, [materialLibList]);

  const onCheck = (kes: React.Key[], {node}: any) => {

    setCatalogueId(node.key)
  }
  return (
    <PageCommonWrap noPadding={true} className={styles.quotaProjectWrap}>
      <div className={styles.wrap} ref={ref}>
        <div className={styles.wrapLeftMenu}>
          <Tabs className="normalTabs noMargin" >
              <TabPane tab="材机库目录" key="材机库目录">
                <div className={styles.selectWrap}>
                  <Select
                    placeholder="请选择材机库"
                    style={{width: '100%'}}
                    children={options}
                    onChange={(e: any)=>setMaterialLibraryId(e)}
                    {...defaultLibValue}
                  />
                </div>
                <div className={styles.fileTree}>
                  <Tree.DirectoryTree
                    onSelect={onCheck}
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
              <TabPane tab="&nbsp;&nbsp;资源列表" key="资源列表">
                <div className={styles.tabPaneBox}>
                  <div className={styles.listTable}>
                    <ListTable
                      catalogueId={catalogueId}
                      scrolly={refWrap?.height ? refWrap?.height-531 : 0}
                      setResourceItem={setResourceItem}
                      url="/MaterialMachineLibraryCatalog/QueryMaterialMachineItemPager"
                      rowKey={(e: any)=>e.materialMachineItem?.id}
                      columns={columns}
                      cruxKey="materialMachineItem"
                    />
                  </div>
                  <div className={styles.heightEmpty} />
                  <InfoTabs data={resourceItem} />
                </div>
              </TabPane>
            </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  );
}

export default QuotaProject;
