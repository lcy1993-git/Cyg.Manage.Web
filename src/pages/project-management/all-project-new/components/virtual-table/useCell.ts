import { CellProps } from './Cell'
import { ColumnDataIndex } from './VirtualTable'

const useCell = <T>({
  style,
  width,
  height,
  fixed,
  columns,
  ellipsis,
  className,
  ...rest
}: CellProps<T>) => {
  const renderer = genCellRenderer<T>(rest)

  const wrapperStyle = computeCellWrapStyle(style, {
    width,
    height,
    columnIndex: rest.columnIndex,
    fixed,
    columns,
  })

  const wrapperClass = computeCellWrapClass(className, {
    fixed,
    ellipsis,
    columnIndex: rest.columnIndex,
    columns,
  })

  return { renderer, wrapperStyle, wrapperClass }
}

/**
 * 计算单元数据
 */
function calculateCellValue<T extends Record<string, any>>(
  rowData: T,
  dataIndex: ColumnDataIndex<T>,
  rowIndex: number,
  columnIndex: number
) {
  let cellValue = null

  if (typeof dataIndex === 'string') {
    // string
    cellValue = rowData[dataIndex]
  } else if (Array.isArray(dataIndex) && dataIndex.length > 0) {
    // array
    let index = 0
    cellValue = rowData[dataIndex[index++]]
    while (index < dataIndex.length && cellValue) {
      cellValue = (cellValue as any)[dataIndex[index++]]
    }
  } else if (typeof dataIndex === 'function') {
    // function
    cellValue = dataIndex(rowData, rowIndex, columnIndex)
  }

  return cellValue
}

/**
 * 生成单元格内部节点
 */
function genCellRenderer<T extends Record<string, any>>({
  rowData,
  dataIndex,
  rowIndex,
  columnIndex,
  render,
  children,
}: Omit<CellProps<T>, 'width' | 'style' | 'columns' | 'height'>) {
  if (children) {
    return children
  }

  if (!dataIndex && !render) {
    return null
  }

  const cellValue = calculateCellValue(
    rowData,
    dataIndex as NonNullable<ColumnDataIndex<T>>,
    rowIndex,
    columnIndex
  )

  return typeof render === 'function'
    ? render(cellValue, rowData, rowIndex, columnIndex)
    : cellValue
}

/**
 * 计算单元格内联样式
 */
function computeCellWrapStyle<T extends Record<string, any>>(
  style: CellProps<T>['style'],
  {
    width,
    height,
    fixed,
    columns,
    columnIndex,
  }: Pick<
    CellProps<T>,
    'fixed' | 'columns' | 'columnIndex' | 'width' | 'height'
  >
) {
  const defaultStyle = { ...style, width, height, lineHeight: `${height}px` }

  if (!fixed) return defaultStyle

  if (fixed !== 'left' && fixed !== 'right') {
    console.error(`fixed should be "left" or "right", but got ${fixed}.`)
    return defaultStyle
  }

  const fixedStyle = {
    [fixed]: computeStickyOffset(fixed, columnIndex, columns),
  }

  return Object.assign({}, defaultStyle, fixedStyle)
}

/**
 * 计算单元格 className
 */
function computeCellWrapClass<T extends Record<string, any>>(
  defaultClass: string = '',
  {
    fixed,
    ellipsis,
    columnIndex,
    columns,
  }: Pick<CellProps<T>, 'fixed' | 'ellipsis' | 'columnIndex' | 'columns'>
) {
  let className = 'vt-cell'

  if (fixed === 'left' || fixed === 'right') {
    let lastFixedLeftIndex =
      columns.length -
      1 -
      [...columns].reverse().findIndex((c) => c.fixed === 'left')

    const stickyClass = ` sticky${
      columnIndex === lastFixedLeftIndex ? ' stick-left-last' : ''
    }`

    className += stickyClass
  }

  if (ellipsis === true) {
    className += ' ellipsis'
  }

  className += ` ${defaultClass}`

  return className
}

/**
 * 计算 sticky 距离
 */
function computeStickyOffset(
  fixed: 'left' | 'right',
  columnIndex: number,
  columns: { width?: number }[]
) {
  const isStickyLeft = fixed === 'left'

  const offset = columns
    .slice(
      isStickyLeft ? 0 : columnIndex + 1,
      isStickyLeft ? columnIndex : undefined
    )
    .reduce((s, c) => (s += c.width!), 0)

  return `${offset}px`
}

export default useCell
