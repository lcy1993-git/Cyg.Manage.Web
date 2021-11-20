function deepLoop(data: any, id: string) {
  for (let i = 0; i < data?.length; i++) {
    if (data[i].id === id) {
      return data[i]
    }

    if (data[i].children && data[i].children?.length > 0) {
      const res: any = deepLoop(data[i].children, id)
      if (res) {
        return res
      }
    }
  }
}

/**
 * 给数组每一项添加当前层级
 *
 * @param target 数据源
 * @param currentDeep 当前层级
 */
export function mixinDeps(target: any, currentDeep: any) {
  return target?.map((element: any) => {
    element.deps = currentDeep
    mixinDeps(element.children, currentDeep + 1)
    return { ...element }
  })
}

export default (data: any, id: string) => {
  return deepLoop(data, id)
}

export function getParentIds(data: any, keyArr: any) {
  for (let i = 0; i < data?.length; i++) {
    if (data[i].children && data[i].children?.length > 0) {
      keyArr.push(data[i].id)
      getParentIds(data[i].children, keyArr)
    }
  }
  return keyArr
}
