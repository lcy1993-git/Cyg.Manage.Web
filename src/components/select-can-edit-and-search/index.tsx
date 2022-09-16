import { getDataByUrl } from '@/services/common'
import { useRequest } from 'ahooks'
import { Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
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
let isInputKey = false
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
  const selectRef = useRef<HTMLDivElement>(null)
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

  const searchHandle = (value: string) => {
    if (value) {
      setVal(value)
      throttleSearch(value)
      setSearchValue(value)
      isInputKey = false
    } else {
      if (isInputKey) {
        // 删除到空白字符串
        setVal(value)
        setSearchValue(value)
        isInputKey = false
      } else if (isSelect) {
        // 选中select选项时
      } else {
        // 鼠标左键点击时
        // @ts-ignore
        selectRef.current.focus()
      }
    }
  }
  useEffect(() => {
    value && setVal(value)
    value && setSearchValue(value)
  }, [value])
  return (
    <div className={styles.wrap}>
      <Select
        // allowClear
        ref={selectRef}
        showSearch
        value={val}
        onBlur={() => {
          onChange?.(val || '', 'blur')
        }}
        onSelect={(value: any, option: any) => {
          onChange?.(value, 'select')
          isSelect = true
          setTimeout(() => {
            isSelect = false
          }, 100)
          // 点击相同选项时不会触发searchhandle，所以在这里setstate
          setSearchValue(option.label)
        }}
        placeholder={placeholder}
        showArrow={false}
        onSearch={(value: any) => searchHandle(value)}
        options={list}
        searchValue={searchValue}
        onInputKeyDown={() => {
          isInputKey = true
        }}
      ></Select>
    </div>
  )
}
export default SelectCanEditAndSearch
