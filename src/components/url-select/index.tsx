import React, { useMemo } from 'react'

import { Select } from 'antd'
import { useRequest, useUpdateEffect } from 'ahooks'
import { getDataByUrl } from '@/services/common'

export interface UrlSelectProps {
  url?: string
  titlekey?: string
  valuekey?: string
  extraParams?: object
  defaultData?: any[]
  needFilter?: boolean
  requestSource?: 'project' | 'common' | 'resource' | 'material' | 'component' | 'tecEco'
  requestType?: 'post' | 'get'
  paramsMust?: string[]
  postType?: 'query' | 'body'
  libId?: string
  needAll?: boolean
  allValue?: string
  manual?: boolean //是否手动执行fetch数据
  trigger?: boolean //用来触发fetch方法
  updateFlag?: boolean // 调用接口拉取新数据的标识
}

const withUrlSelect = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & UrlSelectProps
) => {
  const {
    url = '',
    titlekey = 'text',
    valuekey = 'value',
    defaultData,
    extraParams = {},
    needFilter = true,
    requestSource = 'project',
    paramsMust = [],
    requestType = 'get',
    postType = 'body',
    needAll = false,
    allValue = '',
    updateFlag,
    ...rest
  } = props

  // URL 有数值
  // defaultData 没有数值
  // 必须传的参数不为空
  const { data: resData, run } = useRequest(
    () => getDataByUrl(url, extraParams, requestSource, requestType, postType),
    {
      ready: !!(
        url &&
        !defaultData &&
        !(paramsMust.filter((item) => !extraParams[item]).length > 0)
      ),
      refreshDeps: [url, JSON.stringify(extraParams)],
    }
  )

  const afterHanldeData = useMemo(() => {
    if (defaultData) {
      const copyData = [...defaultData]
      if (needAll) {
        const newObject = {}
        newObject[titlekey] = '全部'
        newObject[valuekey] = allValue
        copyData.unshift(newObject)
      }
      return copyData.map((item: any) => {
        return { label: item[titlekey], value: item[valuekey] }
      })
    }
    if (!(url && !defaultData && !(paramsMust.filter((item) => !extraParams[item]).length > 0))) {
      return []
    }
    if (resData) {
      return resData.map((item: any) => {
        return { label: item[titlekey], value: item[valuekey] }
      })
    }
    return []
  }, [JSON.stringify(resData), JSON.stringify(defaultData)])
  useUpdateEffect(() => {
    run()
  }, [updateFlag])
  return (
    <WrapperComponent
      showSearch={needFilter}
      options={afterHanldeData}
      {...((rest as unknown) as P)}
      filterOption={(input: string, option: any) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    />
  )
}

export default withUrlSelect(Select)
