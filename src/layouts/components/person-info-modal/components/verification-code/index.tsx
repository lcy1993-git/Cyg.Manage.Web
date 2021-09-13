import { Button, Input, message } from "antd";
import React, { useState, useMemo, useEffect } from "react";
import styles from "./index.less";
import { useInterval } from "ahooks";
import { SendSmsType, getSmsCode } from "@/services/common"

interface PersonInfoModalVerificationCodeProps {
  type: SendSmsType,
  phoneNumber: string,
  onChange?: (value: string) => void
  canSend?: boolean;
  setCanOkClick?: (arg0: boolean) => void | false
}

const PersonInfoModalVerificationCode: React.FC<PersonInfoModalVerificationCodeProps> = (props) => {
  const { onChange, type, phoneNumber, canSend = false, setCanOkClick = false } = props;
  const [delayNumber, setDelayNumber] = useState<number>();
  const [residueNumber, setResidueNumber] = useState<number>(0);

  const [inputValue, setInputValue] = useState<string>("");

  useInterval(() => {
    if (residueNumber > 0) {
      setResidueNumber(residueNumber - 1)
    }
    if (residueNumber === 0) {
      setDelayNumber(undefined);
    }
  }, delayNumber, { immediate: false })

  const buttonShowWord = delayNumber ? `倒计时${residueNumber}秒` : "发送验证码";

  useEffect(() => {
    if (setCanOkClick) {
      delayNumber ? setCanOkClick(true) : setCanOkClick(false)
    }
  }, [delayNumber])

  // TODO 发送请求验证码请求
  const sendVerificationCode = async () => {
    await getSmsCode({ phoneNum: phoneNumber, sendSmsType: type });
    setDelayNumber(1000)
    setResidueNumber(60)
    message.success("验证码发送成功");
  }

  const InputValueChangeEvent = (value: string) => {
    setInputValue(value);
    onChange?.(value);
  }

  const canSendSmsFlag = useMemo(() => {
    // delayNumber不是0的时候，都不能进行发送
    if (delayNumber) {
      return false
    }
    // delayNumber是0， 并且canSend 是false的时候，不能发送
    if (!delayNumber && !canSend) {
      return false
    }

    return true
  }, [delayNumber, canSend])

  return (
    <div className={styles.verificationCodeComponent}>
      <div>
        验证码：
      </div>
      <div className={styles.verificationCodeComponentInputContent}>
        <Input value={inputValue} onChange={(e) => InputValueChangeEvent(e.target.value)} placeholder="验证码" className={styles.verificationCodeComponentInput} />
      </div>
      <div className={styles.verificationCodeComponentButtonContent}>
        <Button onClick={() => sendVerificationCode()} disabled={!canSendSmsFlag} className={styles.verificationCodeComponentButton}>
          {buttonShowWord}
        </Button>
      </div>
    </div>
  )
}

export default PersonInfoModalVerificationCode;