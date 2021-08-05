import {useState, useRef} from 'react';
import { useMount } from 'ahooks';
import { Tabs } from 'antd';

import PageCommonWrap from "@/components/page-common-wrap";
import ListTable from '../components/list-table';
import InfoTabs from './components/info-tabs';
import { TreeSelect } from 'antd';

import qs from 'qs';

import styles from './index.less'
import { getMaterialLibraryTreeById } from '@/services/technology-economic/supplies-library';


const { TabPane } = Tabs;
const columns = [
  {
    title: '序号',
    width: 80,
    render(v: any, record: any,index: number){
      return <span>{index + 1}</span>
    }
  },
  {
    dataIndex: 'materialType',
    index: 'materialType',
    title: '物料类型',
    width: 100,
    ellipsis: true,
    render(v: any){
      return <span>{['设备','主材'][v -1]}</span>
    }
  },
  {
    dataIndex: 'code',
    index: 'code',
    title: '物料编码',
    width: 100,
    ellipsis: true
  },
  {
    dataIndex: 'name',
    index: 'name',
    title: '名称',
    // width: 200,
    ellipsis: true
  },
  {
    dataIndex: 'standard',
    index: 'standard',
    title: '规格',
    width: 140,
    ellipsis: true
  },
  {
    dataIndex: 'unit',
    index: 'unit',
    title: '单位',
    width: 100,
    ellipsis: true
  },
  {
    dataIndex: 'taxPrice',
    index: 'taxPrice',
    title: '含税价',
    width: 120,
    ellipsis: true
  },
  {
    dataIndex: 'price',
    index: 'price',
    title: '不含税价',
    width: 120,
    ellipsis: true
  },
  {
    dataIndex: 'supplyType',
    index: 'supplyType',
    title: '供货方',
    width: 70,
    ellipsis: true,
    render(v: any){
      return <span>{['设备','主材'][v -1]}{v}</span>
    }
  },
  {
    dataIndex: 'signWeight',
    index: 'signWeight',
    title: '单量',
    width: 70,
  },
  {
    dataIndex: 'lossRate',
    index: 'lossRate',
    title: '损耗率(%)',
    width: 100,
  },
  {
    dataIndex: 'freight',
    index: 'freight',
    title: '运杂费率(%)',
    width: 100,
  },
  {
    dataIndex: 'packingFactor',
    index: 'packingFactor',
    title: '包装系数(%)',
    width: 100,
  },
  {
    dataIndex: 'transportType',
    index: 'transportType',
    title: '类别/运输类型',
    width: 120,
  },
  {
    dataIndex: 'isUnload',
    index: 'isUnload',
    title: '卸车',
    width: 100,
    render(v: any): JSX.Element {
      return <span>{v ? '是' : '否'}</span>
    }
  },
  {
    dataIndex: 'isStorage',
    index: 'isStorage',
    title: '保管',
    width: 70,
    render(v: any): JSX.Element {
      return <span>{v ? '是' : '否'}</span>
    }
  },
  {
    dataIndex: 'isSend',
    index: 'isSend',
    title: '配送',
    width: 70,
    render(v: any): JSX.Element {
      return <span>{v ? '是' : '否'}</span>
    }
  },
  {
    dataIndex: 'isDeviceMaterial',
    index: 'isDeviceMaterial',
    title: '设备性材料',
    width: 100,
    render(v: any): JSX.Element {
      return <span>{v ? '是' : '否'}</span>
    }
  },
  {
    dataIndex: 'valuationTypeText',  // 这个字段后端暂时没有
    index: 'valuationTypeText',
    title: '所属项目划分',
    width: 110,
    render(v: any, record: any){
      return record?.materialMachineItem?.valuationTypeText
    }
  },
  {
    dataIndex: 'valuationTypeText',  // 这个字段后端暂时没有
    index: 'valuationTypeText',
    title: '关联定额1',
    width: 100,
    render(v: any, record: any){
      return record?.materialMachineItem?.valuationTypeText
    }
  }
];

const SupplieslInfomation = () => {

  const [materialLibraryId, setMaterialLibraryId] = useState<string>("");
  const [resourceItem, setResourceItem] = useState<any>({});
  const [materialLibList,setMaterialLibList] = useState([])

  const getTree = (arr: any[])=>{
    return arr.map(item=>{
      // eslint-disable-next-line no-param-reassign
      item.title = item.name;
      // eslint-disable-next-line no-param-reassign
      item.value = item.id;
      if (item.children && item.children.length !== 0){
        getTree(item.children)
      }
      return item
    })
  }
  useMount(async () => {
    const res = await getMaterialLibraryTreeById(qs.parse(window.location.href.split("?")[1]).id as string || '1422453838113542253')
    setMaterialLibList(getTree(res) as [])
  })

  const ref = useRef(null);

  const treeOnChange = (val: any)=>{
    setMaterialLibraryId(val?.value)
  }

  return (
    <PageCommonWrap noPadding={true} className={styles.quotaProjectWrap}>
      <div className={styles.wrap} ref={ref}>
        <div className={styles.wrapLeftMenu}>
          <Tabs className="normalTabs noMargin" >
              <TabPane tab="物料库目录" key="物料库目录">
                 <div className={styles.selectWrap}>
                   <TreeSelect
                     showSearch
                     style={{ width: '100%' }}
                     dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                     placeholder="请选择物料库"
                     allowClear
                     labelInValue
                     treeData={materialLibList}
                     treeDefaultExpandAll
                     onChange={treeOnChange}
                   >
                   </TreeSelect>
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
                      catalogueId={materialLibraryId}
                      scrolly={1500}
                      setResourceItem={setResourceItem}
                      url="/MaterialLibrary/GetMaterialLibraryItemList"
                      rowKey={'id'}
                      columns={columns}
                      params={{
                        'materialLibraryTreeId':materialLibraryId
                      }}
                      cruxKey={null}
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

export default SupplieslInfomation;
