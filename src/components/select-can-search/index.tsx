import { getDataByUrl } from '@/services/common'
import { useMount, useRequest } from 'ahooks'
import { AutoComplete } from 'antd'
import React, { useEffect, useState } from 'react'
const { Option } = AutoComplete

interface AutoCompleteCanSearchProps {
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
  searchKey?: string
  dataStructure?: string
}
const AutoCompleteCanSearch: React.FC<AutoCompleteCanSearchProps> = (props) => {
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
    searchKey = 'name',
    dataStructure,
  } = props
  const [result, setResult] = useState<any[]>([])
  const [val, setVal] = useState<string>('')

  // throttleSearch
  const { run: throttleSearch } = useRequest(
    (value) => {
      let params = { ...extraParams }
      params[searchKey] = value
      return getDataByUrl(url, params, requestSource, requestType, postType)
    },
    {
      ready: !!url,
      debounceInterval: 600,
      manual: true,
      onSuccess: (res) => {
        if (dataStructure) {
          const list = res[dataStructure].map((item: any) => {
            return {
              label: item[titlekey],
              value: item[valuekey],
            }
          })
          setResult(list)
        } else {
          const list = res.map((item: any) => {
            return {
              label: item[titlekey],
              value: item[valuekey],
            }
          })
          setResult(list)
        }
      },
    }
  )
  useMount(() => {
    throttleSearch('')
  })

  const handleSearch = (value: string) => {
    setVal(value)
    throttleSearch(value)
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
          {item.value}
        </Option>
      ))}
    </AutoComplete>
  )
}

export default AutoCompleteCanSearch
