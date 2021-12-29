export const areaDataTransformer = (data: any[]) => {
  const filterEntries = ({ shortName: name, id: code, latitude: lat, longitude: lng }: any) => ({
    name,
    code,
    lat,
    lng,
  })

  const transformedData = data.map((p: any) => {
    const { children, indexFirstChar } = p

    return {
      ...filterEntries(p),
      letter: indexFirstChar.toLowerCase(),
      cities: children
        ? children.map((c: any) => filterEntries(c)).filter(Boolean)
        : [filterEntries(p)],
    }
  })

  return transformedData
}
