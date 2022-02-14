import { uniqBy } from 'lodash'
import { Key, useCallback, useEffect, useState } from 'react'
import { VirtualTableProps } from './VirtualTable'

const useSelection = <T>(props: Pick<VirtualTableProps<T>, 'rowSelection' | 'data'>) => {
  const { rowSelection, data } = props

  const [selectedKeys, updateSelectedKeys] = useState<Key[]>(
    rowSelection?.defaultSelectedKeys || []
  )

  const [selectRows, updateSelectRows] = useState<T[]>([])

  useEffect(() => {
    if (!rowSelection) return

    if (rowSelection.onChange) {
      rowSelection.onChange(selectedKeys)
    }

    if (rowSelection.onSelectRowsChange) {
      rowSelection.onSelectRowsChange(selectRows)
    }
  }, [selectedKeys, rowSelection, selectRows])

  const updateSelectedKeysFlow = (
    rowKeys: Key[],
    selected: boolean,
    rowData: T,
    selectRowsData: T[]
  ) => {
    updateSelectedKeys((keys: Key[]) =>
      selected
        ? Array.from(new Set([...keys, ...rowKeys]))
        : keys.filter((k) => !rowKeys.includes(k))
    )

    // 对勾选的rowData, 如果是false,那么就去掉
    let afterHandleData: T[] = []

    if (selected) {
      afterHandleData = uniqBy([...selectRowsData, ...selectRows], 'id')
    } else {
      afterHandleData = selectRows.filter((item) => !selectRowsData.includes(item))
    }

    updateSelectRows(afterHandleData)

    if (rowSelection && rowSelection.onSelect) {
      rowKeys.forEach((k) => rowSelection.onSelect!(k, selected, rowData))
    }
  }

  const emptySelectArray = () => {
    updateSelectedKeys([])
    updateSelectRows([])
  }

  /** 全选 */
  const selectAll = useCallback(() => {
    const items = data.reduce((prev: any[], cur: any) => {
      cur.id && !cur._parent && prev.push(cur)
      return prev
    }, [])

    updateSelectedKeys(items.map(({ id }) => id))

    updateSelectRows(items)
  }, [data])

  return { updateSelectedKeysFlow, emptySelectArray, selectedKeys, selectAll }
}

export default useSelection
