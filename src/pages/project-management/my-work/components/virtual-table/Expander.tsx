import { CaretDownOutlined } from '@ant-design/icons'
import { Dispatch, SetStateAction } from 'react'

interface ExpanderProps {
  expanded?: boolean
  setExpanded: Dispatch<SetStateAction<boolean>>
  callback: (expanded: boolean) => void
}

const Expander = ({ expanded, setExpanded, callback }: ExpanderProps) => {
  // const [expanded, setExpanded] = useState(defaultExpanded)
  return (
    <CaretDownOutlined
      rotate={expanded ? 0 : 180}
      className="ant-checkbox-wrapper vt-checkbox"
      style={{ width: '28px', borderRight: '1px solid #dbdbdb', paddingLeft: '3px' }}
      onClick={() => {
        callback(!expanded)
        setExpanded((v) => !v)
      }}
    />
  )
}

export default Expander
