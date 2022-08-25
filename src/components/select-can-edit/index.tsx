import { Select } from 'antd'
import React, { useState, useMemo } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { getDataByUrl } from '@/services/common'

// const { Option } = Select

interface SelectCanEditProps {
  onChange?: (a: string, b: string) => void
  placeholder?: string
  url?: string
  extraParams?: object
  titlekey?: string
  valuekey?: string
  requestSource?: 'project' | 'common' | 'resource' | 'material' | 'component' | 'tecEco'
  requestType?: 'post' | 'get'
  postType?: 'query' | 'body'
}

const SelectCanEdit: React.FC<SelectCanEditProps> = (props) => {
  const {
    onChange,
    placeholder,
    url = '',
    extraParams = {},
    titlekey = 'text',
    valuekey = 'value',
    requestSource = 'project',
    requestType = 'get',
    postType = 'body',
  } = props
  const [selectValue, setSelectValue] = useState<string>()

  const { data: resData } = useRequest(
    () => getDataByUrl(url, extraParams, requestSource, requestType, postType),
    {
      ready: !!url,
      refreshDeps: [url, JSON.stringify(extraParams)],
    }
  )
  const afterHanldeData = useMemo(() => {
    if (resData) {
      return resData.items.map((item: any) => {
        return { label: item[titlekey], value: item[valuekey] }
      })
    }
    return []
  }, [JSON.stringify(resData)])

  const changeHandle = (value: string) => {
    setSelectValue(value)
  }
  const searchHandle = (value: string) => {
    if (value) {
      setSelectValue(value)
    }
  }

  return (
    <div className={styles.wrap}>
      <Select
        allowClear
        showSearch
        value={selectValue}
        onBlur={() => {
          onChange?.(selectValue || '', 'blur')
        }}
        options={afterHanldeData}
        onChange={(value) => changeHandle(value)}
        onSearch={(value: any) => searchHandle(value)}
        onSelect={(value) => {
          onChange?.(value, 'select')
        }}
        placeholder={placeholder}
      />
    </div>
  )
}
export default SelectCanEdit
