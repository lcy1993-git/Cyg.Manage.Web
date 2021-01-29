import React, { useMemo } from 'react';

import { Select } from 'antd';
import { useRequest } from 'ahooks';
import { getDataByUrl } from '@/services/common';

interface UrlSelectProps {
  url?: string;
  titleKey?: string;
  valueKey?: string;
  extraParams?: object;
  defaultData?: any[];
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
    ...rest
  } = props;

  const { data } = useRequest(() => getDataByUrl(url, extraParams), {
    ready: !!(url && !defaultData),
    refreshDeps: [url, JSON.stringify(extraParams)],
  });

  const afterHanldeData = useMemo(() => {
    if (defaultData) {
      return defaultData.map((item: any) => {
        return { label: item[titleKey], value: item[valueKey] };
      });
    }
    if (data) {
      return data.content.map((item: any) => {
        return { label: item[titleKey], value: item[valueKey] };
      });
    }
    return [];
  }, [JSON.stringify(data), JSON.stringify(defaultData)]);

  return <WrapperComponent options={afterHanldeData} {...((rest as unknown) as P)} />;
};

export default withUrlSelect(Select);
