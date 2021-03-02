import React from "react"
import styles from "./index.less"

interface CyTagProps {
    className?: string
}

const CyTag:React.FC<CyTagProps> = (props) => {
    const {className,...rest} = props;
    return (
        <span className={`${styles.cyTag} ${className}`} {...rest}>
            {props.children}
        </span>
    )
}

export default CyTag