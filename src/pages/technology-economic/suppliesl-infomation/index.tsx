import type { Key} from 'react';
import {useState, useRef, useEffect} from 'react';
import {useMount} from 'ahooks';
import { Tabs } from 'antd';

import PageCommonWrap from "@/components/page-common-wrap";
import ListTable from '../components/list-table';
import InfoTabs from './components/info-tabs';

import { Select } from 'antd';
import qs from 'qs';

import styles from './index.less'
import {getMaterialLibraryList, getMaterialLibraryTreeById } from '@/services/technology-economic/supplies-library';

import { Tree } from 'antd';

const { Option } = Select;

const { DirectoryTree } = Tree;
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
      return <span>{['甲供','乙供'][v -1]}</span>
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

interface SelectIten {
  enabled: boolean
  id: string
  name: string
  publishDate: moment.Moment
  publishOrg: string
  remark: string
}
const SupplieslInfomation = () => {

  const [materialLibraryId, setMaterialLibraryId] = useState<string>("");
  const [resourceItem, setResourceItem] = useState<any>({});
  const [materialLibList,setMaterialLibList] = useState([])
  const [slectLsit,setSlectLsit] = useState<SelectIten[]>([])
  const [id,setId] = useState<string>('')

  const getTree = (arr: any[])=>{
    return arr.map(item=>{
      // eslint-disable-next-line no-param-reassign
      item.title = item.name;
      // eslint-disable-next-line no-param-reassign
      item.value = item.id;
      // eslint-disable-next-line no-param-reassign
      item.key = item.id;
      if (item.children && item.children.length !== 0){
        getTree(item.children)
      }
      return item
    })
  }
  useMount(async () => {
    let val = qs.parse(window.location.href.split("?")[1])?.id
    val = val === 'undefined' ? '' : val
    console.log(val)
    setId(val as string);
  })
 const getTreeList = async ()=>{
    if (id === '') return
   const res = await getMaterialLibraryTreeById(id)
   setMaterialLibList(getTree(res) as [])
  }
  useEffect(()=>{
    getTreeList()
  },[id])
  const ref = useRef(null);
  const typeOnChange = (val: string)=>{
    setId(val)
  }
  const treeOnChange = (val: any)=>{
    setMaterialLibraryId(val[0])
  }
  const  getSelectList = async ()=> {
    const data = {
      "pageIndex": 1,
      "pageSize": 1000,
      "keyWord": ''
    }
    const res = await  getMaterialLibraryList(data)
    setSlectLsit(res?.items)
  }

  useEffect(()=>{
    getSelectList()
  },[])
  return (
    <PageCommonWrap noPadding={true} className={styles.quotaProjectWrap}>
      <div className={styles.wrap} ref={ref}>
        <div className={styles.wrapLeftMenu}>
          <Tabs className="normalTabs noMargin" >
              <TabPane tab="物料库目录" key="物料库目录">
                 <div className={styles.selectWrap}>
                   <Select
                     style={{ width: 270 }}
                     value={id}
                     onChange={typeOnChange}>
                     {
                       slectLsit.map(item=>{
                         return <Option value={item.id} key={item.id}>{item.name}</Option>
                       })
                     }
                   </Select>
                   <br/>
                   <br/>
                  <div className={styles.treeBox}>
                    {
                      materialLibList.length !== 0 && <DirectoryTree
                        defaultExpandAll={false}
                        key={'id'}
                        onSelect={treeOnChange}
                        treeData={materialLibList}
                      />
                    }
                  </div>
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
                      requestSource={'tecEco1'}
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
