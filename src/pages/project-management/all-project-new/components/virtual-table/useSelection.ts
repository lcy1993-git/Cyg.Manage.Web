import { useState, useEffect, Key } from 'react'
import { VirtualTableProps } from './VirtualTable'

const useSelection = <T>({
  rowSelection,
}: Pick<VirtualTableProps<T>, 'rowSelection'>) => {
  const [selectedKeys, updateSelectedKeys] = useState<Key[]>(
    rowSelection?.defaultSelectedKeys || []
  )

  useEffect(() => {
    if (rowSelection && rowSelection.onChange && selectedKeys.length > 0) {
      rowSelection.onChange(selectedKeys)
    }
  }, [selectedKeys, rowSelection])

  const updateSelectedKeysFlow = (
    rowKeys: Key[],
    selected: boolean,
    rowData: T
  ) => {
    updateSelectedKeys!((keys: Key[]) =>
      selected
        ? Array.from(new Set([...keys, ...rowKeys]))
        : keys.filter((k) => !rowKeys.includes(k))
    )

    if (rowSelection && rowSelection.onSelect) {
      rowKeys.forEach((k) => rowSelection.onSelect!(k, selected, rowData))
    }
  }

  return { updateSelectedKeysFlow, selectedKeys }
}

export default useSelection
