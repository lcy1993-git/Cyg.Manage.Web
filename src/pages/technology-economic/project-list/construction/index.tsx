import React, {useEffect, useState} from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import TreeTable from '../components/tree-table';
import EmptyTip from '@/components/empty-tip';

const columns = [
  {
    dataIndex: 'number',
    key: 'number',
    title: '编号',
    width: 300,
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: '名称',
  },
  {
    dataIndex: 'projectCode',
    key: 'projectCode',
    title: '项目代码',
  },
  {
    dataIndex: 'professionalPropertyText',
    key: 'professionalPropertyText',
    title: '专业属性',
  },
  {
    dataIndex: 'unit',
    key: 'unit',
    title: '单位',
  },
  {
    dataIndex: 'costNo',
    key: 'costNo',
    title: '费用编码',
  },
];
type IProps = { dataSource: any };
const Construction: React.FC<IProps> = ({ dataSource }) => {
  const [update,setUpdate] = useState(true)
  useEffect(()=>{
    setUpdate(false)
    setTimeout(()=>{
      setUpdate(true)
    },100)
  },[dataSource])
  return (
    <PageCommonWrap>
      {(dataSource && update) && dataSource.length ? (
        <TreeTable dataSource={dataSource} columns={columns} needCheck={false} defaultExpandAllRows />
      ) : (
        <EmptyTip className="pt20 pb20" />
      )}
      <div style={{ height: '50px' }}></div>
    </PageCommonWrap>
  );
};

export default Construction;
