import { useEffect, useMemo, useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Select, Input } from 'antd';
import { getQuotaLibrary } from '@/services/technology-economics/quota-library'
import TableSearch from '@/components/table-search';
import styles from './index.less';
import Item from 'antd/lib/list/Item';

const { Option } = Select;

interface Items {
  id: string;
  name: string;
}

interface QuotaLibSelectProps {
  onChange: (arg0: string) => void;
  data: Items []
}

interface QuotaLibSearchProps {
  keyWords: string;
  setKeyWords: (arg0: string) => void;
  run: (arg0: string) => void;
}

interface QuotaLibSlotProps{
  onChange: (arg0: string) => void;
  // keyWords: string;
}

const QuotaLibSelect: React.FC<QuotaLibSelectProps> = ({onChange, data}) => {

  const options = useMemo(() => {
    
    return data.map(({id, name}, index) => {
      // if(index === 0) {
      //   return (
      //     <Option value={id} key={id}>{name}</Option>
      //   )
      // }
      return (
        <Option value={id} key={id}>{name}</Option>
      )
    })
  },[JSON.stringify(data)])

  return (
    <TableSearch label="选择定额库" width="400px">
      <Select
        style={{width: 300}}
        onChange={(e: string) => onChange(e)}
        placeholder="请选择"
      >
        {options}
      </Select>
    </TableSearch>
  );
}

const QuotaLibSearch: React.FC<QuotaLibSearchProps> = (props) => {
  const {keyWords, setKeyWords, run} = props;
  return (
    <TableSearch width="250px" >
      <Input.Search value={keyWords} placeholder="名称" enterButton onChange={(e) => setKeyWords(e.target.value)} onSearch={() => run(keyWords)}></Input.Search>
    </TableSearch>
  );
}

const QuotaLibSlot: React.FC<QuotaLibSlotProps> = ({onChange}) => {
  const [keyWords, setKeyWords] = useState("");
  const {data, run} = useRequest(getQuotaLibrary, {
    manual: true
  });
  
  useMount(() => {
    run();
  })


  
  const formatData = useMemo(() => {
    if(data?.items && data?.items.length > 0) return data?.items;
    return [];
    
  }, [JSON.stringify(data)]);

  return (
    <div className="flex">
      <QuotaLibSearch keyWords={keyWords} setKeyWords={setKeyWords} run={run}/>
      <div className={styles.empty} />
      <QuotaLibSelect data={formatData} onChange={onChange}/>
    </div>
  )
}

export default QuotaLibSlot;