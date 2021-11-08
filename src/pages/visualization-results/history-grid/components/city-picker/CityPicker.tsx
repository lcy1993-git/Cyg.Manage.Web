import { CSSProperties, FC } from 'react'
import CityList from './CityList'
import LetterPicker from './LetterPicker'
import rawData from './province-city.json'
import { Province } from './type'

/**
 * 省市数据
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

const { letters, data } = processData(rawData)

export interface CityPickerProps {
  className?: string
  style?: CSSProperties
}

const CityPicker: FC<CityPickerProps> = ({ className, style }) => {
  return (
    <div className={className} style={style}>
      <LetterPicker
        onSelect={(v) => {
          console.log(v)
        }}
        letters={letters}
      />
      <CityList
        onSelect={(v) => {
          console.log(v)
        }}
        data={data}
      />
    </div>
  )
}

export default CityPicker
