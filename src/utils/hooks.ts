import { getCommonSelectData } from '@/services/common'
import { getEngineerEnum } from '@/services/project-management/all-project'
import { useRequest } from 'ahooks'
import moment from 'moment'
import React, { useMemo } from 'react'

// const loadEnumsData = JSON.parse(localStorage.getItem('loadEnumsData') ?? '');

export interface EnumItem {
  key: string
  value: EnumValue[]
}

export interface EnumValue {
  value: number
  text: string
}
// interface UrlSelectDataParams {
//   url: string
//   method?: 'post' | 'get'
//   extraParams?: any
//   titleKey?: string
//   valueKey?: string
//   requestSource?: 'project' | 'common' | 'resource'
//   ready?: boolean
// }
// interface UrlSelectDataParams {
//   url: string
//   method?: 'post' | 'get'
//   extraParams?: any
//   titleKey?: string
//   valueKey?: string
//   requestSource?: 'project' | 'common' | 'resource'
//   ready?: boolean
// }

interface GetSelectDataParams {
  url: string
  method?: 'post' | 'get'
  extraParams?: any
  titleKey?: string
  valueKey?: string
  otherKey?: string
  requestSource?: 'project' | 'common' | 'resource'
  postType?: 'body' | 'query'
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
    otherKey = '',
  } = params

  const {
    data: resData = [],
    loading,
    run,
  } = useRequest(
    () => getCommonSelectData({ url, method, params: extraParams, requestSource, postType }),
    {
      ...options,
    }
  )

  const afterHanldeData = useMemo(() => {
    if (otherKey) {
      return resData.map((item: any) => {
        return {
          label: item[titleKey],
          value: item[valueKey],
          otherKey: item[otherKey],
          isDisabled: item.isDisabled,
        }
      })
    }
    if (resData) {
      return resData.map((item: any) => {
        return { label: item[titleKey], value: item[valueKey], isDisabled: item.isDisabled }
      })
    }
    return []
  }, [JSON.stringify(resData)])

  return { data: afterHanldeData, loading, run }
}

export const useGetUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo') ?? '{}')
  } catch (msg) {
    return {}
  }
}

export const useGetFunctionModules = () => {
  try {
    return JSON.parse(localStorage.getItem('functionModules') ?? '{}')
  } catch (msg) {
    return []
  }
}

export const useGetButtonJurisdictionArray = () => {
  try {
    return localStorage.getItem('buttonJurisdictionArray') ?? '[]'
  } catch (msg) {
    return [] as string[]
  }
}

export const useGetProjectEnum = () => {
  const { data: resData } = useRequest(() => getEngineerEnum(), {})

  //获取现场数据来源是否仅勘察
  const surveyOnly = localStorage.getItem('surveyOnly')

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
  } = resData ?? {}

  // 现场数据来源仅勘察 ，判断Tag：surveyOnly
  const handleDataSourceType = projectDataSourceType?.filter((item: any) => {
    if (surveyOnly && Number(surveyOnly) === 1) {
      return item.value === 0
    }
    return item.value !== -1
  })
  return {
    meteorologicLevel,
    projectAssetsNature,
    projectAttribute,
    projectBatch,
    projectCategory,
    projectClassification,
    projectConstructType,
    projectDataSourceType: handleDataSourceType,
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
  }
}

interface TimeArrayItem {
  startTime: string
  endTime: string
}

export const useGetMinAndMaxTime = (timeArray: TimeArrayItem[]) => {
  const minAndMaxTimeArray = useMemo(() => {
    let minStartTime = null
    let maxEndTime = null
    if (timeArray && timeArray.length > 0) {
      const startTimeArray = timeArray.map((item) => moment(item.startTime))
      const endTimeArray = timeArray.map((item) => moment(item.endTime))

      minStartTime = moment.min(startTimeArray).format('YYYY-MM-DD')
      maxEndTime = moment.max(endTimeArray).format('YYYY-MM-DD')
    }

    const monthStartTime = moment(minStartTime).startOf('month')
    const monthEndTime = moment(maxEndTime).endOf('month')

    return {
      minStartTime,
      maxEndTime,
      days: moment(monthEndTime).diff(monthStartTime, 'days') + 1,
      diffMonths: moment(monthEndTime).diff(monthStartTime, 'months') + 1,
      monthStartTime,
      monthEndTime,
    }
  }, [JSON.stringify(timeArray)])
  return minAndMaxTimeArray
}

export const useCurrentRef = <T>(value: any): T => {
  const ref = React.useRef<T>(value)
  return ref.current
}
