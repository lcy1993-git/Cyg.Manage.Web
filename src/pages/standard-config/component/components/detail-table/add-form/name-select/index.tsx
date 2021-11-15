import DataSelect from '@/components/data-select'
import React from 'react'

interface NameSelectProps {
  componentSelectData:
    | {
        label: string
        value: string
      }[]
    | undefined
  materialNameSelectData:
    | {
        label: string
        value: string
      }[]
    | undefined
  typeEnum: string
}

const NameSelect: React.FC<NameSelectProps> = (props) => {
  const { componentSelectData, materialNameSelectData, typeEnum, ...rest } = props
  const getSelectData = (type: string): { label: string; value: string }[] => {
    if (type === '0') {
      return materialNameSelectData ?? []
    }
    if (type === '1') {
      return componentSelectData ?? []
    }
    return []
  }

  const getSelectPlaceholder = (type: string): string => {
    if (type === '0') {
      return '请选择物料名称'
    }
    if (type === '1') {
      return '请选择组件名称'
    }
    return '请选择类型'
  }

  return (
    <DataSelect
      options={getSelectData(typeEnum)}
      {...rest}
      placeholder={getSelectPlaceholder(typeEnum)}
    />
  )
}

export default NameSelect
