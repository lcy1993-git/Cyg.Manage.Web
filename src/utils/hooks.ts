import { getCommonSelectData, getDataByUrl } from '@/services/common';
import { getEngineerEnum } from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';

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
}

export const useGetSelectData = (params: GetSelectDataParams, options?: any) => {
  const {
    url,
    method = 'get',
    extraParams = {},
    titleKey = 'text',
    valueKey = 'value',
    requestSource = 'project',
  } = params;

  const { data: resData = [], loading, run } = useRequest(
    () => getCommonSelectData({ url, method, params: extraParams, requestSource }),
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
  const buttonJurisdictionArray = JSON.parse(localStorage.getItem('buttonJurisdictionArray') ?? '[]');
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
