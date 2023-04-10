import { getRegionData, useApi } from '@/pages/visualization-results/history-grid/service'
import { areaDataTransformer } from '@/pages/visualization-results/history-grid/utils/area-data-transformer'
import { EnvironmentFilled } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useMyContext } from '../../Context'
import { location } from '../../PlanMap/utils/initializeMap'
import LetterPicker from './LetterPicker'
import { City, LetterWithProvinces, Province } from './type'

interface PropsType {
  visible: Boolean
}
type CorrespondingCitiesProps = {
  cities: City[]
}
type CorrespondingProvincesProps = LetterWithProvinces
const ID_PREFIX = 'CITY_PICKER_IDENTIFY_'

const CityList = (props: PropsType) => {
  const { visible } = props
  const [selectedLetter, setSelectedLetter] = useState<string>('a')
  // 获取城市数据
  const { data } = useApi(getRegionData, {
    initialData: [],
    filter: (res) => areaDataTransformer(res.data),
  })

  const processData = (rawData: Province[]) => {
    const provinces: Province[] = rawData.sort((a, b) => {
      return a.letter.codePointAt(0)! - b.letter.codePointAt(0)!
    })

    const letters = [...new Set(provinces.map((d) => d.letter))]

    const data = letters.map((letter) => {
      return {
        letter,
        provinces: provinces.filter((p) => p.letter === letter),
      }
    })

    return {
      letters,
      data,
    }
  }

  const cityData = processData(data)

  const { letters } = cityData

  useEffect(() => {
    const item = document.getElementById(`${ID_PREFIX}${selectedLetter.toUpperCase()}`)
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedLetter])
  // const store = useContainer();

  const { selectCity } = useMyContext()

  return (
    <div
      className="absolute w-80 bg-white shadow-lg"
      style={{ display: visible ? 'inline-block' : 'none', zIndex: 20, height: '480px' }}
    >
      <div className="py-1 px-2 flex justify-between items-center">
        <div>
          <span className="text-gray-500">选择城市：</span>
          <span className="text-gray-900">{selectCity.name || '暂无'}</span>
        </div>
        <span>
          <EnvironmentFilled className="pr-1" />
          定位
        </span>
      </div>
      <LetterPicker
        onSelect={(l) => {
          setSelectedLetter(l)
        }}
        letters={letters}
      />
      <div className="w-full overflow-y-auto bg-white" style={{ height: '412px', zIndex: 1000 }}>
        <div className="overflow-y-auto pl-2 pt-2 scrollbar-base" style={{ height: '412px' }}>
          {cityData.data.map((item: any) => (
            <CorrespondingProvinces key={item.letter} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

const CorrespondingProvinces = ({ letter, provinces }: CorrespondingProvincesProps) => {
  return (
    <div id={`${ID_PREFIX}${letter.toUpperCase()}`} className="flex items-start">
      <div className="flex-shrink-0 w-8 text-left text-xl font-semibold leading-5 text-gray-400">
        {letter.toUpperCase()}
      </div>
      <div>
        {provinces.map(({ cities, ...rest }) => (
          <div key={rest.name} className="flex">
            <div className="flex-shrink-0 w-14 text-gray-900">{rest.name}：</div>
            <CorrespondingCities cities={cities} {...rest} />
          </div>
        ))}
      </div>
    </div>
  )
}
/**
 * 展示具体城市
 * */
const CorrespondingCities = ({ cities }: CorrespondingCitiesProps) => {
  // const store = useContainer();
  const { setselectCity, mapRef } = useMyContext()
  return (
    <div className="flex flex-wrap">
      {cities.map((c) => (
        <span
          className={`mx-1 mb-2 px-1 cursor-pointer hover:underline`}
          key={c.code}
          onClick={() => {
            setselectCity(c)
            location(mapRef.map, parseFloat(c.lng), parseFloat(c.lat))
          }}
        >
          {c.name}
        </span>
      ))}
    </div>
  )
}

export default CityList
