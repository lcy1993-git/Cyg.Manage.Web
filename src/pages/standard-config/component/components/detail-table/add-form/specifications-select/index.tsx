import DataSelect from '@/components/data-select'
import { getMaterialSpecName, getSpecName } from '@/services/resource-config/component'
import useRequest from '@ahooksjs/use-request'
import React, { useEffect, useMemo } from 'react'

interface SpecificationsSelectProps {
  typeEnum: string
  name: string
  libId: string
  isBorder: boolean
}

const SpecificationsSelect: React.FC<SpecificationsSelectProps> = (props) => {
  const { name, typeEnum, libId, isBorder = false, ...rest } = props
  const { run, data } = useRequest(
    () => (typeEnum === '0' ? getMaterialSpecName({ libId, name }) : getSpecName({ libId, name })),
    {
      manual: true,
    }
  )

  const handleSelectData = useMemo((): { label: string; value: string }[] => {
    if (name && data) {
      if (typeEnum === '0') {
        return data.map((item) => ({ label: item.spec, value: item.materialId, unit: item.unit }))
      }
      if (typeEnum === '1') {
        return data.map((item) => ({
          label: item.componentSpec,
          value: item.componentId,
          unit: item.unit,
        }))
      }
    }
    return []
  }, [name, data, typeEnum])

  useEffect(() => {
    if (name) {
      run()
    }
  }, [name, libId])

  const getSelectPlaceholder = (type: string): string => {
    if (type === '0') {
      return '请选择物料规格'
    }
    if (type === '1') {
      return '请选择组件规格'
    }
    return '请先选择类型'
  }

  return (
    <DataSelect
      {...rest}
      placeholder={getSelectPlaceholder(typeEnum)}
      options={handleSelectData}
      bordered={isBorder}
    />
  )
}

export default SpecificationsSelect
