import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { getDataByUrl } from '@/services/common'

const { Option } = Select

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
  } = props
  const [selectValue, setSelectValue] = useState<string>('')
  const [list, setList] = useState<any[]>([])
  // throttleSearch
  const { run: throttleSearch } = useRequest(
    (value) =>
      getDataByUrl(url, { ...extraParams, name: value }, requestSource, requestType, postType),
    {
      ready: !!url,
      debounceInterval: 1500,
      manual: true,
      onSuccess: (res) => {
        setList(
          res.map((item) => {
            return {
              label: item[titlekey],
              value: item[valuekey],
            }
          })
        )
      },
    }
  )
  // const options = list.map((d) => (
  //   <Option key={d.value} value={d.value}>
  //     {d.label}
  //   </Option>
  // ))

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
