import { getDataByUrl } from '@/services/common'
import { useRequest } from 'ahooks'
import { Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
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
  // 依赖的参数值
  update?: string
}

// 选择选项时的开关，以及失去焦点时暂存组件的value值
let isSelect = false
let isInputKey = false

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
  const selectRef = useRef<HTMLDivElement>(null)

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

  const searchHandle = (value: string) => {
    if (value) {
      setVal(value)
      setSearchValue(value)
    } else {
      if (isSelect) {
        // 选中select选项时
      } else if (isInputKey) {
        // 删除到空白字符串
        setVal(value)
        setSearchValue(value)
      } else {
        // 鼠标左键点击时
        // @ts-ignore
        selectRef.current.focus()
      }
    }
  }
  useEffect(() => {
    run()
  }, [update])
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
        onSearch={(value: any) => searchHandle(value)}
        onSelect={(value: any, option: any) => {
          onChange?.(value, 'select')
          isSelect = true
          setTimeout(() => {
            isSelect = false
          }, 100)
          // 点击相同选项时不会触发searchhandle，所以在这里setstate
          setSearchValue(option.label)
        }}
        options={data}
        placeholder={placeholder}
        searchValue={searchValue}
        showArrow={false}
        onInputKeyDown={() => {
          isInputKey = true
          setTimeout(() => {
            isInputKey = false
          }, 100)
        }}
      />
    </div>
  )
}
export default SelectCanEdit
