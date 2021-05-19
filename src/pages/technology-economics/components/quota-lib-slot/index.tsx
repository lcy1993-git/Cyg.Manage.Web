import { useEffect, useMemo, useState } from 'react';
import { useRequest } from 'ahooks';
import { Select, Input } from 'antd';
import { getQuotaLibrary } from '@/services/technology-economics/quota-library'
import TableSearch from '@/components/table-search';
import { RefSelectProps } from 'antd/lib/select';
import styles from './index.less';

const { Option } = Select;

interface Items {
  id: string;
  name: string;
}

interface QuotaLibSelectProps {
  onChange: (arg0: string) => void;
  data: {
    items: any []
  }
}

interface QuotaLibSearchProps {
  keyWords: string;
  setKeyWords: (arg0: string) => void;
}

interface QuotaLibSlotProps{
  onChange: (arg0: string) => void;
  // keyWords: string;
}

const QuotaLibSelect: React.FC<QuotaLibSelectProps> = ({onChange}) => {
  const {data=[{items: []}]} = useRequest(getQuotaLibrary);

  const options = useMemo(() => {
    if(data.items?.length === 0) return null
    return data.items?.map(({id, name}) => {
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
  const {keyWords, setKeyWords} = props;
  return (
    <TableSearch width="250px" >
      <Input.Search value={keyWords} placeholder="名称" enterButton onChange={(e) => setKeyWords(e.target.value)} onSearch={() => console.log(keyWords)}></Input.Search>
    </TableSearch>
  );
}

const QuotaLibSlot: React.FC<QuotaLibSlotProps> = ({onChange}) => {
  const [keyWords, setKeyWords] = useState("");
  const {data=[{items: []}]} = useRequest(getQuotaLibrary);

  return (
    <div className="flex">
      <QuotaLibSearch keyWords={keyWords} setKeyWords={setKeyWords}/>
      <div className={styles.empty} />
      <QuotaLibSelect data={data} onChange={onChange}/>
    </div>
  )
}

export default QuotaLibSlot;