import { Map } from 'ol'
import React, { useState, useMemo } from 'react'
import { getCityAreas } from '@/services/project-management/all-project'
import { useRequest } from 'ahooks'

export interface MapRef {
  mapRef: globalThis.Map<unknown, unknown>
  map: Map
}
export const useCurrentRef = <T>(value: any): T => {
  const ref = React.useRef<T>(value)
  return ref.current
}
const areaMap = {}
export const useAreaData = () => {
  const [city, setCity] = useState<any[]>([])
  const { data: cityData } = useRequest(() => getCityAreas(), {
    onSuccess: () => {
      if (cityData) {
        setCity(cityData.data)
      }
    },
  })
  const transformArrtToAreaData = (areas: any[]) => {
    const [province, city, county] = areas
    return {
      province: !isNaN(province) ? province : '',
      city: !isNaN(city) ? city : '',
      area: !isNaN(county) ? county : '',
      provinceName: !isNaN(province) ? areaMap[province] : '',
      cityName: !isNaN(city) ? areaMap[city] : '',
      areaName: !isNaN(county) ? areaMap[county] : '',
    }
  }
  const transformAreaDataToArr = (areaData: any) => {
    const { province, city, area } = areaData
    const areas = []
    !!province && areas.push(province)
    !!city && areas.push(city)
    !!area && areas.push(area)
    return areas
  }
  const transformAreaDataToString = (areaData: any) => {
    const { provinceName, cityName, areaName } = areaData
    const arr = []
    !!provinceName && arr.push(provinceName)
    !!cityName && arr.push(cityName)
    !!areaName && arr.push(areaName)
    return arr.join('/')
  }
  const mapHandleCityData = (data: any) => {
    areaMap[data.id] = data.text
    return {
      label: data.shortName,
      value: data.id,
      children: data.children
        ? [
            { label: '无', value: `${data.id}_null`, children: undefined },
            ...data.children.map(mapHandleCityData),
          ]
        : undefined,
    }
  }
  const areaData = useMemo(() => {
    return city?.map(mapHandleCityData)
  }, [JSON.stringify(city)])
  return {
    areaData,
    transformArrtToAreaData,
    transformAreaDataToArr,
    transformAreaDataToString,
  }
}
