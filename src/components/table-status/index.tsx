import React from 'react'
import styles from './index.less'

interface TableStatusProps {
  color?: 'gray' | 'orange' | 'greenOne' | 'greenTwo' | 'greenThree' | 'greenFour' | 'greenFive'
  className?: string
}

const TableStatus: React.FC<TableStatusProps> = (props) => {
  const { color = 'gray', className = '', ...rest } = props
  return (
    <span {...rest} className={`${className} ${styles[color]} ${styles.tableStatus}`}>
      {props.children}
    </span>
  )
}

export default TableStatus
