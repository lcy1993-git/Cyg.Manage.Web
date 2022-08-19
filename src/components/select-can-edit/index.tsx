import { Select } from 'antd'
import React, { useState } from 'react'
import styles from './index.less'

const { Option } = Select

interface SelectCanEditProps {
  onChange?: (a: string) => void
  placeholder?: string
}

const SelectCanEdit: React.FC<SelectCanEditProps> = (props) => {
  const { onChange, placeholder } = props
  const [selectValue, setSelectValue] = useState<string>()
  const selectOpts = [
    { label: '导线', value: '导线' },
    { label: '电力电缆', value: '电力电缆' },
    { label: '其他', value: '其他' },
  ]

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
          onChange?.(selectValue || '')
        }}
        options={selectOpts}
        onChange={(value) => changeHandle(value)}
        onSearch={(value: any) => searchHandle(value)}
        onSelect={(value) => {
          onChange?.(value)
        }}
        placeholder={placeholder}
      >
        {selectOpts.map((item) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          )
        })}
      </Select>
    </div>
  )
}
export default SelectCanEdit
