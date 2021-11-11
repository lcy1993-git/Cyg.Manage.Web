import { CSSProperties, FC } from 'react'
import CityList from './CityList'
import LetterPicker from './LetterPicker'
import rawData from './province-city.json'
import { CityWithProvince } from './type'
import useCityPicker from './useCityPicker'

export type CityPickerProps = {
  className?: string
  style?: CSSProperties
  value?: CityWithProvince
  onSelect: (city: CityWithProvince) => void
}

const CityPicker: FC<CityPickerProps> = ({ className, style, children, ...rest }) => {
  const {
    letters,
    data,
    selectedCityLocation,
    selectedCity,
    selectedLetter,
    onSelectCity,
    onSelectLetter,
  } = useCityPicker({
    ...rest,
    rawData,
  })

  return (
    <div
      className={`border border-gray-300 bg-white border-solid select-none overflow-hidden ${
        className || ''
      }`}
      style={{ width: '350px', ...style }}
    >
      <div className="py-1 px-2 flex justify-between items-center">
        <div>
          <span className="text-gray-500">选择城市：</span>
          <span className="text-gray-900">{selectedCityLocation}</span>
        </div>
        {children}
      </div>
      <LetterPicker
        onSelect={(l) => {
          onSelectLetter(l)
        }}
        letters={letters}
      />
      <CityList
        onSelect={(c, p) => {
          onSelectCity({ ...c, province: p })
        }}
        selectedCity={selectedCity}
        selectedLetter={selectedLetter}
        data={data}
      />
    </div>
  )
}

export default CityPicker
