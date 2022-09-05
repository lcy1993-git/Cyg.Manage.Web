import { getDataByUrl } from '@/services/common'
import { useRequest } from 'ahooks'
import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'

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

// 选择选项时的开关，以及失去焦点时暂存组件的value值
let isSelect = false
let selectedValue = ''
let blurVal = ''

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
  const [val, setVal] = useState<string>()
  const [data, setData] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState<string>()

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
    setVal(value)
  }
  const searchHandle = (value: string) => {
    if (value) {
      setVal(value)
      setSearchValue(value)
    } else {
      if (isSelect) {
        // 选中select选项时
        setSearchValue(selectedValue)
        isSelect = false
      } else {
        // 删除到空白字符串，或者blur时触发
        setVal(value)
        setSearchValue(value)
        // blur时需要存下失去焦点的值，存100ms供onblur回调函数取值
        blurVal = val || ''
        setTimeout(() => {
          blurVal = ''
        }, 100)
      }
    }
  }
  useEffect(() => {
    run()
  }, [update])
  useEffect(() => {
    value && setVal(value)
  }, [value])
  return (
    <div className={styles.wrap}>
      <Select
        allowClear
        showSearch
        value={val}
        onBlur={() => {
          const value = !!blurVal ? blurVal : val || ''
          setSearchValue(value)
          onChange?.(value, 'blur')
        }}
        onChange={(value) => changeHandle(value)}
        onSearch={(value: any) => searchHandle(value)}
        onSelect={(value: any) => {
          onChange?.(value, 'select')
          isSelect = true
          selectedValue = value
        }}
        options={data}
        placeholder={placeholder}
        searchValue={val}
        showArrow={false}
      />
    </div>
  )
}
export default SelectCanEdit
