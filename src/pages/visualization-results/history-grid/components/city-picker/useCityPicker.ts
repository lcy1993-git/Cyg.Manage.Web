import { useMemo, useState } from 'react'
import { CityPickerProps } from './CityPicker'
import { CityWithProvince, Province } from './type'

type useCityPickerProps = CityPickerProps & { rawData: unknown }

const useCityPicker = ({ rawData, onSelect, value }: useCityPickerProps) => {
  const { letters, data } = processData(rawData)

  const [selectedLetter, setSelectedLetter] = useState<string>('a')
  const [selectedCity, setSelectedCity] = useState<CityWithProvince | undefined>(value)

  const selectedCityLocation = useMemo(() => {
    if (!selectedCity) {
      return '暂无'
    }

    return `${selectedCity.province.name} / ${selectedCity.name}`
  }, [selectedCity])

  const onSelectLetter = (letter: string) => setSelectedLetter(letter)

  const onSelectCity = (city: CityWithProvince) => {
    setSelectedCity(city)
    onSelect(city)
  }

  return {
    letters,
    data,
    selectedCityLocation,
    selectedLetter,
    selectedCity,
    onSelectLetter,
    onSelectCity,
  }
}

/**
 * 处理省市原始数据
 * @see https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov
 */
const processData = (rawData: any) => {
  const provinces: Province[] = Object.values(rawData)
    .map(({ c, y, n }: any) => {
      return {
        cities: c ? Object.values(c).map((c: any) => ({ name: c.n, letter: c.y })) : c,
        name: n,
        letter: y,
      }
    })
    .sort((a, b) => a.letter.codePointAt(0)! - b.letter.codePointAt(0)!)

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

export default useCityPicker
