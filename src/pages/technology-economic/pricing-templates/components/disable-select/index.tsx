import React, { useMemo } from 'react'
import { Select } from 'antd'
export interface DisableSelectProps {
  url?: string
  titleKey?: string
  valueKey?: string
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
  selectList: any[] // 已经选过的选项list
}

const withDisableSelect =
  <P extends {}>(WrapperComponent: React.ComponentType<P>) =>
  (props: P & DisableSelectProps) => {
    const {
      // url = '',
      titleKey = 'text',
      valueKey = 'value',
      defaultData,
      // extraParams = {},
      needFilter = true,
      // requestSource = 'project',
      // paramsMust = [],
      // requestType = 'get',
      // postType = 'body',
      // needAll = false,
      // libId = '',
      // allValue = '',
      selectList,
      ...rest
    } = props

    const afterHandleData = useMemo(() => {
      if (defaultData) {
        const copyData = [...defaultData]
        return copyData.map((item: any) => {
          if (selectList.length > 0) {
            selectList.map((res: any) => {
              if (item[valueKey] === res) {
                item.disabled = true
              } else {
                item.disabled = false
              }
            })
          } else {
            item.disabled = false
          }
          return {
            label: item[titleKey],
            value: item[valueKey],
            disabled: item.disabled ? item.disabled : false,
          }
          // return { label: item[titleKey], value: item[valueKey] };
        })
      } else {
        return []
      }
    }, [])

    return (
      <WrapperComponent
        showSearch={needFilter}
        options={afterHandleData}
        {...(rest as unknown as P)}
        filterOption={(input: string, option: any) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      />
    )
  }

export default withDisableSelect(Select)
