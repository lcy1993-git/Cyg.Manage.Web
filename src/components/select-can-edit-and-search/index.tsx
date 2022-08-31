import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { getDataByUrl } from '@/services/common'

interface SelectCanEditAndSearchProps {
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

const SelectCanEditAndSearch: React.FC<SelectCanEditAndSearchProps> = (props) => {
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
  const [selectValue, setSelectValue] = useState<string>()
  const [list, setList] = useState<any[]>([])
  // throttleSearch
  const { run: throttleSearch } = useRequest(
    (value) => {
      let params = { ...extraParams }
      params[searchKey] = value
      return getDataByUrl(url, params, requestSource, requestType, postType)
    },
    {
      ready: !!url,
      debounceInterval: 1500,
      manual: true,
      onSuccess: (res) => {
        if (dataStructure) {
          setList(
            res[dataStructure].map((item: any) => {
              return {
                label: item[titlekey],
                value: item[valuekey],
              }
            })
          )
        } else {
          setList(
            res.map((item) => {
              return {
                label: item[titlekey],
                value: item[valuekey],
              }
            })
          )
        }
      },
    }
  )

  const changeHandle = (value: string) => {
    setSelectValue(value)
  }
  const searchHandle = (value: string) => {
    if (value) {
      setSelectValue(value)
      throttleSearch(value)
    }
  }
  useEffect(() => {
    value && setSelectValue(value)
  }, [value])
  return (
    <div className={styles.wrap}>
      <Select
        showSearch
        value={selectValue}
        allowClear
        onBlur={() => {
          onChange?.(selectValue || '', 'blur')
        }}
        onSelect={(value) => {
          onChange?.(value, 'select')
        }}
        placeholder={placeholder}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={(value: any) => searchHandle(value)}
        onChange={(value) => changeHandle(value)}
        notFoundContent={null}
        options={list}
      ></Select>
    </div>
  )
}
export default SelectCanEditAndSearch
