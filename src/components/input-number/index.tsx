import { MinusOutlined, PlusOutlined} from "@ant-design/icons";
import { Input } from "antd";
import React, { memo, useState, useEffect } from "react";
import { add, isNumber, subtract } from "lodash"
import styles from "./index.less";

interface InputNumberProps {
    limit?: number
    onChange?: (inputValue: number) => void
    canInput?: boolean
    maxNumber?: number
    minNumber?: number
}

const InputNumber: React.FC<InputNumberProps> = (props) => {
    const { limit = 1, onChange, canInput = false, maxNumber, minNumber } = props;
    const [inputValue, setInputValue] = useState<number>(0);

    const inputEvent = (e: any) => {
        setInputValue(e.target.value);
    }

    const addEvent = () => {
        if (isNumber(maxNumber)) {
            if (add(inputValue, limit) <= maxNumber) {
                setInputValue(add(inputValue, limit))
            }
            return
        }
        setInputValue(add(inputValue, limit))
    }

    const cutEvent = () => {
        if (isNumber(minNumber)) {
            if (subtract(inputValue, limit) >= minNumber) {
                setInputValue(subtract(inputValue, limit))
            }
            return
        }
        setInputValue(subtract(inputValue, limit))
    }

    useEffect(() => {
        onChange?.(inputValue)
    }, [inputValue])

    return (
        <div className={styles.inputNumber}>
            <div className={styles.inputContent}>
                <Input readOnly={!canInput} value={inputValue} onChange={inputEvent} />
            </div>
            <div className={styles.controlValueContent}>
                <div className={styles.cutButton} onClick={() => cutEvent()}>
                    <MinusOutlined />
                </div>
                <div className={styles.limitNumber}>
                    {limit}
                </div>
                <div className={styles.addButton} onClick={() => addEvent()}>
                    <PlusOutlined />
                </div>
            </div>

        </div>
    )
}

export default memo(InputNumber)

