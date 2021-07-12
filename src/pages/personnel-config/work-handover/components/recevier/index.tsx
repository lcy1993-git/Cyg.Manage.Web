import { Select } from 'antd';
import React, { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { getReceiver } from '@/services/personnel-config/work-handover';

interface RecevierParams {
  userId: string;
  clientCategory?: number;
  isCompanyGroupIdentity?: boolean;
}

const Recevier: React.FC<RecevierParams> = (props) => {
  const { userId, clientCategory, isCompanyGroupIdentity } = props;
  const { data: resData } = useRequest(
    () => getReceiver({ userId, clientCategory, isCompanyGroupIdentity }),
    {
      ready: !!userId,
    },
  );

  const handleData = useMemo(() => {
    if (resData) {
      return resData?.map((item: any) => {
        return { label: item.text, value: item.value };
      });
    }
    return [];
  }, [JSON.stringify(resData)]);

  return (
    <>
      <Select
        showSearch
        filterOption={(input: string, option: any) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        options={handleData}
        style={{ width: '270px' }}
        placeholder="请选择接收人员"
      />
    </>
  );
};

export default Recevier;
