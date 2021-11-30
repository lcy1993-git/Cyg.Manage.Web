export interface City {
  /** 名称 */
  name: string
  /** 拼音首字母小写 */
  letter: string
  /** 纬度 */
  lat: string
  /** 经度 */
  lng: string
  [key: string]: any
}

export interface Province extends Omit<City, 'lat' | 'lng'> {
  cities: City[]
}

export type CityWithProvince = City & { province: Omit<Province, 'cities'> }

export type LetterWithProvinces = {
  letter: string
  provinces: Province[]
}
