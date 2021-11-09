import { FC } from 'react'
import CityList from './CityList'
import LetterPicker from './LetterPicker'
import rawData from './province-city.json'
import { CityWithProvince } from './type'
import useCityPicker from './useCityPicker'

export type CityPickerProps = {
  onSelect: (city: CityWithProvince) => void
}

const CityPicker: FC<CityPickerProps> = ({ children, ...rest }) => {
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
      style={{
        border: '#DBDBDB',
        borderWidth: '1px',
        borderStyle: 'solid',
        width: '350px',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          padding: '.3rem .5rem',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <span style={{ color: '#505050' }}>选择城市：</span>
          <span style={{ color: '#1F1F1F' }}>{selectedCityLocation}</span>
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
