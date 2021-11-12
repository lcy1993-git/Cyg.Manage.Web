export interface City {
  /** 名称 */
  name: string
  /** 拼音首字母小写 */
  letter: string
  [key: string]: any
}

export interface Province extends City {
  cities: City[]
}

export type CityWithProvince = City & { province: Omit<Province, 'cities'> }

export type LetterWithProvinces = {
  letter: string
  provinces: Province[]
}
