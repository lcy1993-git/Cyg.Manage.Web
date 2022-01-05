import { Checkbox } from 'antd'
import { Key } from 'react'
import VTCell from './Cell'
import Expander from './Expander'
import { Column, OriginParams } from './VirtualTable'

export function allocateWidth(width: number, buckets: number) {
  const result = []

  while (buckets) {
    const slicedWidth = ~~(width / buckets)
    result.push(slicedWidth)
    width -= slicedWidth
    buckets--
  }

  return result
}

type ParentRowProps = OriginParams & {
  columns: Column[]
  data: any[]
  update: (data: any[]) => void
  cache: React.MutableRefObject<any>
}

/**
 * 父级行
 */
const ParentRow = ({
  data,
  update,
  cache,
  columns,
  rowData,
  rowIndex,
  rowHeight,
  tableHeight,
  tableWidth,
  maxRowWidth,
  selectRows,
  selectedRowKeys,
}: ParentRowProps) => {
  // 滚动条宽度
  const SCROLL_BAR_WIDTH = 19
  // 是否超出容器高度
  const needScroll = data.length * rowHeight > tableHeight
  // 可用宽度
  const usefulWidth = tableWidth - (needScroll ? SCROLL_BAR_WIDTH : 0)

  // 分配宽度
  const widthBuckets = allocateWidth(usefulWidth, columns.length)

  const _columns = columns.map((c, index) => ({
    ...c,
    fixed: 'left' as const,
    // 分配宽度
    width: widthBuckets[index],
  }))

  const subKeys = rowData.projects.map((p: any) => p.id)
  const allRelatedKeys = [...subKeys]

  const childChecked = selectedRowKeys.some((k) => subKeys.includes(k))
  const allChildrenChecked = subKeys.every((k: Key) => selectedRowKeys.includes(k))

  const indeterminate = childChecked && !allChildrenChecked

  const prefix = (index: number, rowData: any) => {
    if (index !== 0) return null

    // 新数据
    const updatedData = Array.from(data)
    // 缓存数据
    const cachedData = cache.current

    const parentId = rowData.id
    const parentIndexInData = data.findIndex((d: any) => d.id === parentId)
    const parentIndexInCache = cachedData.findIndex((d: any) => d.id === parentId)
    const childrenLength = rowData.projects.length

    // 默认是否展开
    const defaultExpanded =
      data[parentIndexInData + 2]?.id === cachedData[parentIndexInCache + 2]?.id

    const expandCallback = (expanded: boolean) => {
      if (expanded) {
        // todo 展开

        if (!cachedData) {
          throw new Error('no cached data to implement expanding operation.')
        }

        const children = cachedData.slice(
          parentIndexInCache + 1,
          parentIndexInCache + 1 + childrenLength + 1
        )

        updatedData.splice(parentIndexInData + 1, 0, ...children)
      } else {
        // todo 收起
        updatedData.splice(parentIndexInData + 1, childrenLength + 1)
      }

      update(updatedData)
    }

    return (
      <>
        <Expander defaultExpanded={defaultExpanded} callback={expandCallback} />
        <Checkbox
          onChange={(e) => selectRows(allRelatedKeys, e.target.checked)}
          indeterminate={indeterminate}
          checked={childChecked}
        />
      </>
    )
  }

  return (
    <div
      style={{ width: maxRowWidth < usefulWidth ? usefulWidth : maxRowWidth }}
      className="h-full"
    >
      {_columns!.map(({ width, ...rest }, index) => (
        <VTCell
          {...rest}
          className="parent ellipsis"
          style={{ border: 'none', backgroundColor: '#F2F2F2' }}
          width={width}
          prefix={prefix}
          height={rowHeight}
          rowData={rowData}
          rowIndex={rowIndex}
          columnIndex={index}
          columns={_columns}
          key={index}
        />
      ))}
    </div>
  )
}

export default ParentRow
