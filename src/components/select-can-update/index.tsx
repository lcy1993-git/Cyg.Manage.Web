import { getDataByUrl } from '@/services/common'
import { useRequest } from 'ahooks'
import { AutoComplete } from 'antd'
import React, { useEffect, useState } from 'react'
const { Option } = AutoComplete

interface AutoCompleteCanUpdateProps {
  onChange?: (a: string, b: string) => void
  value?: string
  placeholder?: string
  url?: string
  extraParams?: object
  titlekey?: string
  valuekey?: string
  requestSource?: 'project' | 'common' | 'resource' | 'material' | 'component' | 'tecEco'
  requestType?: 'post' | 'get'
  postType?: 'query' | 'body'
  // 依赖的参数值
  update?: string
}
const AutoCompleteCanUpdate: React.FC<AutoCompleteCanUpdateProps> = (props) => {
  const {
    onChange,
    value,
    placeholder,
    url = '',
    extraParams = {},
    titlekey = 'text',
    valuekey = 'values',
    requestSource = 'project',
    requestType = 'get',
    postType = 'body',
    update,
  } = props
  const [result, setResult] = useState<any[]>([])
  const [val, setVal] = useState<string>('')

  const { run } = useRequest(
    () => getDataByUrl(url, { ...extraParams, name: update }, requestSource, requestType, postType),
    {
      ready: !!url,
      refreshDeps: [url, JSON.stringify(extraParams)],
      manual: true,
      onSuccess: (res) => {
        const list = res.map((item) => {
          return {
            label: item[titlekey],
            value: item[valuekey],
          }
        })
        setResult(list)
      },
    }
  )
  const handleSearch = (value: string) => {
    setVal(value)
  }

  const handleSelect = (value: string) => {
    onChange?.(value, 'select')
  }
  const handleBlur = () => {
    onChange?.(val, 'blur')
  }

  useEffect(() => {
    value && setVal(value)
  }, [value])
  useEffect(() => {
    run()
  }, [update, run])

  return (
    <AutoComplete
      onSearch={handleSearch}
      onSelect={handleSelect}
      onBlur={handleBlur}
      placeholder={placeholder}
      value={val}
    >
      {result.map((item: any, index: number) => (
        <Option key={index} value={item.value}>
          {item.label}
        </Option>
      ))}
    </AutoComplete>
  )
}

export default AutoCompleteCanUpdate
