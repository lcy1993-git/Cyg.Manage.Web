import React, { useState } from 'react'
import { CaretDownOutlined } from '@ant-design/icons'

interface ExpanderProps {
  defaultExpanded?: boolean
  callback: (expanded: boolean) => void
}

const Expander = ({ defaultExpanded, callback }: ExpanderProps) => {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <CaretDownOutlined
      rotate={expanded ? 0 : 180}
      className='ant-checkbox-wrapper vt-checkbox'
      style={{ width: '28px', borderRight: '1px solid #dbdbdb', paddingLeft: "3px"}}
      onClick={() => {
        callback(!expanded)
        setExpanded((v) => !v)
      }}
    />
  )
}

export default Expander
