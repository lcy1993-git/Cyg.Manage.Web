import { City, Province } from './type'

interface CityListProps {
  data: {
    letter: string
    provinces: Province[]
  }[]
  onSelect: (city: City) => void
}

const CityList = ({ data, onSelect }: CityListProps) => {
  return (
    <div>
      {data.map((item) => (
        <CorrespondingCities {...item} onSelect={onSelect} />
      ))}
    </div>
  )
}

interface ProvinceWithCityProps {
  letter: string
  provinces: Province[]
  onSelect: CityListProps['onSelect']
}

const CorrespondingCities = ({ letter, provinces, onSelect }: ProvinceWithCityProps) => {
  return (
    <div
      style={{
        width: '500px',
        display: 'flex',
        alignItems: 'flex-start',
        marginRight: '1rem',
        padding: '.5rem',
      }}
    >
      <div style={{ fontSize: '2rem', color: 'gray', lineHeight: '2rem' }}>
        {letter.toUpperCase()}
      </div>
      <div>
        {provinces.map(({ name, cities }) => (
          <div key={name} style={{ display: 'flex' }}>
            <div>{name}：</div>
            <div>
              {cities.map((c) => (
                <span onClick={() => onSelect(c)}>{c.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CityList
