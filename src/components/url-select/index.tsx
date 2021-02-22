import React, { useMemo } from 'react';

import { Select } from 'antd';
import { useRequest } from 'ahooks';
import { getDataByUrl } from '@/services/common';

interface UrlSelectProps {
  url?: string
  titleKey?: string
  valueKey?: string
  extraParams?: object
  defaultData?: any[]
  needFilter?: boolean
  requestSource?: "project" | "common" | "resource"
  requestType?: "post" | "get"
  paramsMust?: string[]
}

const withUrlSelect = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & UrlSelectProps,
) => {
  const {
    url = '',
    titleKey = 'Title',
    valueKey = 'ID',
    defaultData,
    extraParams = {},
    needFilter = true,
    requestSource = "project",
    paramsMust = [],
    ...rest
  } = props;

  // URL 有数值
  // defaultData 没有数值
  // 必须传的参数不为空

  const { data: resData } = useRequest(() => getDataByUrl(url, extraParams, requestSource), {
    ready: !!(url && !defaultData && !(paramsMust.filter((item) => !extraParams[item]).length > 0)),
    refreshDeps: [url, JSON.stringify(extraParams)],
  });

  const afterHanldeData = useMemo(() => {
    if (defaultData) {
      return defaultData.map((item: any) => {
        return { label: item[titleKey], value: item[valueKey] };
      });
    }
    if(!(url && !defaultData && !(paramsMust.filter((item) => !extraParams[item]).length > 0))) {
      return []
    }
    if (resData) {
      return resData.map((item: any) => {
        return { label: item[titleKey], value: item[valueKey] };
      });
    }
    return [];
  }, [JSON.stringify(resData), JSON.stringify(defaultData)]);

  return (
    <WrapperComponent
      showSearch={needFilter}
      options={afterHanldeData}
      {...((rest as unknown) as P)}
      filterOption={(input: string, option: any) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    />
  );
};

export default withUrlSelect(Select);
