import { Checkbox } from 'antd'
import React, { Key, memo } from 'react'
import { ListChildComponentProps } from 'react-window'
import VTCell from './Cell'
import HeaderRow from './HeaderRow'
import { RowContext } from './VirtualTable'

type RowProps<T> = ListChildComponentProps<RowContext<T>>

const VTRow = memo(
  <T extends Record<string, any>>({
    index: rowIndex,
    style,
    data: {
      data: rawData,
      columns,
      headerRows,
      loadingText,
      rowSelection,
      selectedKeys,
      updateSelectedKeysFlow,
      customRow,
      ...rest
    },
    isScrolling,
  }: RowProps<T>) => {
    const rowData = rawData[rowIndex]

    const rowKey =
      rowSelection && rowSelection.rowKey
        ? rowSelection.rowKey(rowData)
        : rowIndex

    const renderParams = {
      ...rest,
      rowData,
      rowIndex,
      originColumns: columns,
      isScrolling: !!isScrolling,
      selectedRowKeys: selectedKeys,
      selectRows: (...params: [keys: Key[], selected: boolean]) =>
        updateSelectedKeysFlow(...params, rowData),
    } as const

    /* 表头 */
    if (
      typeof headerRows === 'function' &&
      headerRows(rowData, rowIndex) === true
    ) {
      return (
        <div style={{ ...style, width: 'max-content' }}>
          {<HeaderRow {...renderParams} />}
        </div>
      )
    }

    /* 自定义行 */
    if (
      customRow &&
      typeof customRow.custom === 'function' &&
      typeof customRow.row === 'function' &&
      customRow.custom(rowData, rowIndex) === true
    ) {
      return (
        <div style={{ ...style, width: 'max-content' }}>
          {customRow.row(renderParams)}
        </div>
      )
    }

    /* 默认 */
    const { height } = style as { height: number }
    const loading = isScrolling && loadingText

    const prefix = (index: number) => {
      if (index !== 0 || !rowSelection) return null

      return (
        <Checkbox
          className='vt-checkbox'
          checked={selectedKeys.includes(rowKey!)}
          onChange={(e) =>
            updateSelectedKeysFlow([rowKey!], e.target.checked, rowData)
          }
        />
      )
    }
    return (
      <div className='vt-row' style={{ ...style, width: 'max-content' }}>
        {loading
          ? loadingText
          : columns.map((c, index, _columns) => (
              <VTCell
                {...c}
                style={{ height, lineHeight: `${height}px` }}
                prefix={prefix}
                key={index}
                height={height}
                rowData={rowData}
                rowIndex={rowIndex}
                columnIndex={index}
                columns={_columns}
              />
            ))}
      </div>
    )
  }
)

export default VTRow
