import pinyin from 'pinyin'

export const areaDataTransformer = (data: any[]) => {
  const getPinyinFirstLetter = (c: string) => {
    return c === '重庆' ? 'c' : pinyin(c, { style: pinyin.STYLE_FIRST_LETTER })[0][0]
  }

  const filterEntries = ({ shortName: name, id: code, latitude: lat, longitude: lng }: any) => ({
    name,
    code,
    lat,
    lng,
  })

  const transformedData = data.map((p: any) => {
    const { shortName, children } = p

    return {
      ...filterEntries(p),
      letter: getPinyinFirstLetter(shortName),
      cities: children
        ? children.map((c: any) => filterEntries(c)).filter(Boolean)
        : [filterEntries(p)],
    }
  })

  return transformedData
}
