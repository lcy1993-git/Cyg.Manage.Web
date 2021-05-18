import React, { useEffect, useMemo } from 'react';

import { Select } from 'antd';
import { useRequest } from 'ahooks';
import { getDataByUrl } from '@/services/common';

export interface UrlSelectProps {
  url?: string;
  titleKey?: string;
  valueKey?: string;
  extraParams?: object;
  defaultData?: any[];
  needFilter?: boolean;
  requestSource?: 'project' | 'common' | 'resource' | 'material' | 'component';
  requestType?: 'post' | 'get';
  paramsMust?: string[];
  postType?: 'query' | 'body';
  libId?: string;
  needAll?: boolean;
  allValue?: string;
  manual?: boolean; //是否手动执行fetch数据
  trigger?: boolean; //用来触发fetch方法
}

const withUrlSelect = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & UrlSelectProps,
) => {
  const {
    url = '',
    manual = false,
    titleKey = 'Title',
    valueKey = 'ID',
    defaultData,
    extraParams = {},
    needFilter = true,
    requestSource = 'project',
    paramsMust = [],
    requestType = 'get',
    postType = 'body',
    needAll = false,
    trigger = false,
    libId = '',
    allValue = '',
    ...rest
  } = props;

  // URL 有数值
  // defaultData 没有数值
  // 必须传的参数不为空

  const { data: resData, run } = useRequest(
    () => getDataByUrl(url, extraParams, requestSource, requestType, postType, libId),
    {
      manual,
      ready: !!(
        url &&
        !defaultData &&
        !(paramsMust.filter((item) => !extraParams[item]).length > 0)
      ),
      refreshDeps: [url, JSON.stringify(extraParams)],
    },
  );

  useEffect(() => {
    if (!manual) {
      run();
    }
  }, [trigger]);

  const afterHanldeData = useMemo(() => {
    if (defaultData) {
      const copyData = [...defaultData];
      if (needAll) {
        const newObject = {};
        newObject[titleKey] = '全部';
        newObject[valueKey] = allValue;
        copyData.unshift(newObject);
      }
      return copyData.map((item: any) => {
        return { label: item[titleKey], value: item[valueKey] };
      });
    }
    if (!(url && !defaultData && !(paramsMust.filter((item) => !extraParams[item]).length > 0))) {
      return [];
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
