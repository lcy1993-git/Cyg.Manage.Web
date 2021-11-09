import { createContext, useContext, useEffect } from 'react'
import { City, CityWithProvince, LetterWithProvinces, Province } from './type'

type CityListProps = {
  data: LetterWithProvinces[]
  onSelect: (city: City, province: Omit<Province, 'cities'>) => void
  selectedLetter: string
  selectedCity?: CityWithProvince
}

type CorrespondingProvincesProps = LetterWithProvinces

type CorrespondingCitiesProps = {
  cities: City[]
}

const ID_PREFIX = 'CITY_PICKER_IDENTIFY_'

const CityListContext = createContext<Omit<CityListProps, 'data' | 'selectedLetter'>>({
  onSelect: () => {},
})

const CityList = ({ selectedLetter, selectedCity, data, onSelect }: CityListProps) => {
  useEffect(() => {
    const item = document.getElementById(`${ID_PREFIX}${selectedLetter.toUpperCase()}`)
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [selectedLetter])

  return (
    <div
      style={{
        width: '350px',
        height: '350px',
        overflowY: 'auto',
      }}
    >
      <CityListContext.Provider value={{ selectedCity, onSelect }}>
        {data.map((item) => (
          <CorrespondingProvinces key={item.letter} {...item} />
        ))}
      </CityListContext.Provider>
    </div>
  )
}

const CorrespondingProvinces = ({ letter, provinces }: CorrespondingProvincesProps) => {
  return (
    <div
      id={`${ID_PREFIX}${letter.toUpperCase()}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        padding: '.5rem 0 .5rem .5rem',
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: '2rem',
          textAlign: 'left',
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#B2B2B2',
          lineHeight: '1.2rem',
        }}
      >
        {letter.toUpperCase()}
      </div>
      <div>
        {provinces.map(({ cities, ...rest }) => (
          <div key={rest.name} style={{ display: 'flex' }}>
            <div style={{ flexShrink: 0, color: '#1F1F1F', width: '3.5rem' }}>{rest.name}：</div>
            <CorrespondingCities cities={cities} {...rest} />
          </div>
        ))}
      </div>
    </div>
  )
}

const CorrespondingCities = ({ cities, ...rest }: CorrespondingCitiesProps) => {
  const { onSelect, selectedCity } = useContext(CityListContext)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'stretch' }}>
      {cities.map((c) => (
        <span
          style={{
            margin: '0 .5rem .2rem .2rem',
            padding: '0 .2rem',
            cursor: 'pointer',
            color: selectedCity?.name === c.name ? '#0E7B3B' : '#1F1F1F',
            backgroundColor: selectedCity?.name === c.name ? '#E4F5EB' : 'unset',
          }}
          key={c.name}
          onClick={() => onSelect(c, rest)}
        >
          {c.name}
        </span>
      ))}
    </div>
  )
}

export default CityList
