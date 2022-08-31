import { Select } from 'antd'
import React, { useState, useMemo, useEffect } from 'react'
import styles from './index.less'
import { useRequest } from 'ahooks'
import { getDataByUrl } from '@/services/common'

// const { Option } = Select

interface SelectCanEditProps {
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
  update?: string
}

const SelectCanEdit: React.FC<SelectCanEditProps> = (props) => {
  const {
    onChange,
    value,
    placeholder,
    url = '',
    extraParams = {},
    titlekey = 'text',
    valuekey = 'value',
    requestSource = 'project',
    requestType = 'get',
    postType = 'body',
    update,
  } = props
  const [selectValue, setSelectValue] = useState<string>()
  const [data, setData] = useState<any[]>([])

  const { run } = useRequest(
    () => getDataByUrl(url, { ...extraParams, name: update }, requestSource, requestType, postType),
    {
      ready: !!url,
      refreshDeps: [url, JSON.stringify(extraParams)],
      manual: true,
      onSuccess: (res) => {
        setData(
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

  const changeHandle = (value: string) => {
    setSelectValue(value)
  }
  const searchHandle = (value: string) => {
    if (value) {
      setSelectValue(value)
    }
  }
  useEffect(() => {
    run()
  }, [update])
  useEffect(() => {
    value && setSelectValue(value)
  }, [value])
  return (
    <div className={styles.wrap}>
      <Select
        allowClear
        showSearch
        value={selectValue}
        onBlur={() => {
          onChange?.(selectValue || '', 'blur')
        }}
        options={data}
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
