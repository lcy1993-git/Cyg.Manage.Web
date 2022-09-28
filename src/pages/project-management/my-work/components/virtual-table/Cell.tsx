import { CSSProperties, memo, PropsWithChildren, ReactNode } from 'react'
import useCell from './useCell'
import { Column } from './VirtualTable'

export type CellProps<T> = PropsWithChildren<
  Column<T> & {
    rowData: T
    rowIndex: number
    columnIndex: number
    style?: CSSProperties
    className?: string
    columns: Column<T>[]
    height: number
    prefix?: (index: number, rowData: Record<string, any>) => ReactNode
  }
>

const VTCell = memo(<T extends Record<string, any>>({ prefix, ...rest }: CellProps<T>) => {
  const { wrapperStyle, wrapperClass, renderer } = useCell<T>(rest)

  return (
    <div style={wrapperStyle} className={wrapperClass}>
      {typeof prefix === 'function' && prefix(rest.columnIndex, rest.rowData)}
      {renderer}
    </div>
  )
})

export default VTCell
