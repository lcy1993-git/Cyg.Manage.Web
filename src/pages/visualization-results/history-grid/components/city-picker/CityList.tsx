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
    <div className="overflow-y-auto pl-2 pt-2" style={{ height: '400px' }}>
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

const CorrespondingCities = ({ cities, ...rest }: CorrespondingCitiesProps) => {
  const { onSelect, selectedCity } = useContext(CityListContext)

  return (
    <div className="flex flex-wrap">
      {cities.map((c) => (
        <span
          className={`mx-1 mb-2 px-1 cursor-pointer ${
            selectedCity?.name === c.name
              ? 'text-theme-green bg-theme-green-light'
              : 'text-gray-800'
          }`}
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
