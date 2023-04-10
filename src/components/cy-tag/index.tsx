import React from 'react'
import styles from './index.less'

interface CyTagProps {
  className?: string
  color?: 'green' | 'blue' | 'yellow'
}

const CyTag: React.FC<CyTagProps> = (props) => {
  const { className, color = 'green', ...rest } = props
  return (
    <span className={`${styles.cyTag} ${className} ${styles[color]}`} {...rest}>
      {props.children}
    </span>
  )
}

export default CyTag
