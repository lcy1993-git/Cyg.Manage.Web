import { useEffect, useMemo, useRef } from 'react';
import { useRequest } from 'ahooks';
import { Select } from 'antd';
import { getQuotaLibrary } from '@/services/technology-economics/quota-library'
import { RefSelectProps } from 'antd/lib/select';
const { Option } = Select;

const QuotaLibSelect = () => {
  // const {data} = useRequest(getQuotaLibrary);
  // console.log(data);
  getQuotaLibrary().then(res => {
    console.log(res);
    
  })
  const ref = useRef<RefSelectProps>(null);

  const onChange =() => {
    
  }
  // const a = useMemo(() => {
  //   console.log(ref);
    
  // }, [JSON.stringify(ref)])
  return (
    <div >
      <Select
        ref={ref}
        style={{width: 200}}
        onChange={onChange}
      >
        <Option value={99999999}>7777777777</Option>
        <Option value={22222222}>1111111111</Option>
      </Select>
    </div>
  );
}

export default QuotaLibSelect;