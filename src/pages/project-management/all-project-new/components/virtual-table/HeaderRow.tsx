import { memo } from 'react'
import VTCell from './Cell'
import { OriginParams } from './VirtualTable'

/**
 * 子级 Header
 */
const HeaderRow = memo(
  ({ rowData, rowIndex, originColumns, rowHeight }: OriginParams) => {
    return (
      <div
        className='vt-row min-w-max h-full font-bold'
        style={{ borderBottom: 'none' }}
      >
        {originColumns!.map(({ title, width, ...rest }, index) => (
          <VTCell
            {...rest}
            style={{ color: '#1F1F1F', borderBottom: 'none' }}
            width={width}
            height={rowHeight}
            prefix={(index: number) => {
              if (index !== 0) return null
              return (
                <span
                  className='ant-checkbox-wrapper vt-checkbox'
                  style={{ width: '25px' }}
                />
              )
            }}
            rowData={rowData}
            rowIndex={rowIndex}
            columnIndex={index}
            columns={originColumns!}
            key={index}
          >
            {title}
          </VTCell>
        ))}
      </div>
    )
  }
)

export default HeaderRow
