import { getCommonSelectData, getDataByUrl } from '@/services/common';
import { getEngineerEnum } from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';
import moment from 'moment';
import { useMemo } from 'react';
import { useMap } from 'ahooks';

// const loadEnumsData = JSON.parse(localStorage.getItem('loadEnumsData') ?? '');

export interface EnumItem {
  key: string;
  value: EnumValue[];
}

export interface EnumValue {
  value: number;
  text: string;
}
interface UrlSelectDataParams {
  url: string;
  method?: 'post' | 'get';
  extraParams?: any;
  titleKey?: string;
  valueKey?: string;
  requestSource?: 'project' | 'common' | 'resource';
  ready?: boolean;
}

interface GetSelectDataParams {
  url: string;
  method?: 'post' | 'get';
  extraParams?: any;
  titleKey?: string;
  valueKey?: string;
  requestSource?: 'project' | 'common' | 'resource';
  postType?: 'body' | 'query';
}

export const useGetSelectData = (params: GetSelectDataParams, options?: any) => {
  const {
    url,
    method = 'get',
    extraParams = {},
    titleKey = 'text',
    valueKey = 'value',
    requestSource = 'project',
    postType = 'body',
  } = params;

  const { data: resData = [], loading, run } = useRequest(
    () => getCommonSelectData({ url, method, params: extraParams, requestSource, postType }),
    {
      ...options,
    },
  );

  const afterHanldeData = useMemo(() => {
    if (resData) {
      return resData.map((item: any) => {
        return { label: item[titleKey], value: item[valueKey] };
      });
    }
    return [];
  }, [JSON.stringify(resData)]);

  return { data: afterHanldeData, loading, run };
};

export const useGetUserInfo = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') ?? '{}');
  return userInfo;
};

export const useGetButtonJurisdictionArray = () => {
  const buttonJurisdictionArray = JSON.parse(
    localStorage.getItem('buttonJurisdictionArray') ?? '[]',
  );
  return buttonJurisdictionArray;
};

export const useGetProjectEnum = () => {
  const { data: resData } = useRequest(() => getEngineerEnum(), {});
  const {
    meteorologicLevel,
    projectAssetsNature,
    projectAttribute,
    projectBatch,
    projectCategory,
    projectClassification,
    projectConstructType,
    projectDataSourceType,
    projectGrade,
    projectImportance,
    projectKvLevel,
    projectMajorCategory,
    projectNature,
    projectPType,
    projectReformAim,
    projectReformCause,
    projectRegionAttribute,
    projectStage,
  } = resData ?? {};

  return {
    meteorologicLevel,
    projectAssetsNature,
    projectAttribute,
    projectBatch,
    projectCategory,
    projectClassification,
    projectConstructType,
    projectDataSourceType,
    projectGrade,
    projectImportance,
    projectKvLevel,
    projectMajorCategory,
    projectNature,
    projectPType,
    projectReformAim,
    projectReformCause,
    projectRegionAttribute,
    projectStage,
  };
};

export const useMapEnum = () => {
  const [map, { set, setAll, remove, reset, get }] = useMap<string | number, string>([
    ['msg', 'hello world'],
    [123, 'number type'],
  ]);
};

interface TimeArrayItem {
  startTime: string;
  endTime: string;
}

export const useGetMinAndMaxTime = (timeArray: TimeArrayItem[]) => {
  const minAndMaxTimeArray = useMemo(() => {
    let minStartTime = null;
    let maxEndTime = null;
    if (timeArray && timeArray.length > 0) {
      const startTimeArray = timeArray.map((item) => moment(item.startTime));
      const endTimeArray = timeArray.map((item) => moment(item.endTime));

      minStartTime = moment.min(startTimeArray).format('YYYY-MM-DD');
      maxEndTime = moment.max(endTimeArray).format('YYYY-MM-DD');
    }

    const monthStartTime = moment(minStartTime).startOf('month');
    const monthEndTime = moment(maxEndTime).endOf('month');

    return {
      minStartTime,
      maxEndTime,
      days: moment(monthEndTime).diff(monthStartTime, 'days') + 1,
      diffMonths: moment(monthEndTime).diff(monthStartTime, 'months') + 1,
      monthStartTime,
      monthEndTime,
    };
  }, [JSON.stringify(timeArray)]);
  return minAndMaxTimeArray;
};
