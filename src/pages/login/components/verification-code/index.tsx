import { Button, Input, message } from "antd";
import React, { useState } from "react";
import styles from "./index.less";
import {useInterval} from "ahooks";

interface VerificationCodeProps {
    onChange?: (value: string) => void
}

const VerificationCode:React.FC<VerificationCodeProps> = (props) => {
    const {onChange} = props;
    const [delayNumber, setDelayNumber] = useState<number>();
    const [residueNumber, setResidueNumber] = useState<number>(0);

    const [inputValue, setInputValue] = useState<string>("");
    
    useInterval(() => {
        if(residueNumber > 0) {
            setResidueNumber(residueNumber - 1)
        }
        if(residueNumber === 0) {
            setDelayNumber(undefined);
        }
    },delayNumber,{immediate: false})

    const buttonShowWord = delayNumber ? `倒计时${residueNumber}秒` : "发送验证码";

    // TODO 发送请求验证码请求
    const sendVerificationCode = () => {
        setDelayNumber(1000)
        setResidueNumber(60)
        message.success("验证码发送成功");
    }

    const InputValueChangeEvent = (value: string) => {
        setInputValue(value);
        onChange?.(value);
    }

    return (
        <div className={styles.verificationCodeComponent}>
            <div className={styles.verificationCodeComponentInputContent}>
                <Input value={inputValue} onChange={(e) => InputValueChangeEvent(e.target.value)} placeholder="验证码" className={styles.verificationCodeComponentInput} />
            </div>
            <div className={styles.verificationCodeComponentButtonContent}>
                <Button onClick={() => sendVerificationCode()} disabled={!!delayNumber} className={styles.verificationCodeComponentButton} type="primary">
                    {buttonShowWord}
                </Button>
            </div>
        </div>
    )
}

export default VerificationCode;