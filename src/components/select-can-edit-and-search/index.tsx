import { getDataByUrl } from '@/services/common'
import { useRequest } from 'ahooks'
import { Select } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'

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
// 选择选项时的开关，以及失去焦点时暂存组件的value值
let isSelect = false
let selectedValue = ''
let blurVal = ''
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
  const [val, setVal] = useState<string>()
  const [list, setList] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState<string>()
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
    setVal(value)
    setSearchValue(value)
  }
  const searchHandle = (value: string) => {
    if (value) {
      setVal(value)
      throttleSearch(value)
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
    value && setVal(value)
  }, [value])
  return (
    <div className={styles.wrap}>
      <Select
        showSearch
        value={val}
        allowClear
        onBlur={() => {
          const value = !!blurVal ? blurVal : val || ''
          setSearchValue(value)
          onChange?.(value, 'blur')
        }}
        onSelect={(value: any) => {
          onChange?.(value, 'select')
          isSelect = true
          selectedValue = value
        }}
        placeholder={placeholder}
        showArrow={false}
        onSearch={(value: any) => searchHandle(value)}
        onChange={(value) => changeHandle(value)}
        options={list}
        searchValue={searchValue}
      ></Select>
    </div>
  )
}
export default SelectCanEditAndSearch
