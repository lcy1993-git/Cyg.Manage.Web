import { Button } from "antd";
import React, { useState } from "react"
import styles from "./index.less"

interface EditInfoItemProps {
    value: string
    onChange?: (value: string) => void
    oldValue?: string
    label: string
}

const EditInfoItem:React.FC<EditInfoItemProps> = (props) => {
    const {value,onChange,oldValue,label} = props;

    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");

    return (
        <div className={styles.editInfoItem}>
            <div className={styles.editInfoItemLabel}>
                {label}
            </div>
            <div className={styles.editInfoItemContent}>
                {oldValue}
            </div>
            <div className={styles.editInfoItemButton}>
                <Button type="text">编辑</Button>
            </div>
        </div>
    )
}

export default EditInfoItem