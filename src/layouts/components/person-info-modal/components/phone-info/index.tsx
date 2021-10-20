import { useState, useRef } from "react";
import { Button, Input, message, Popconfirm, Space } from "antd";
import classNames from "classnames";
import { changeUserPhone, unBindUserPhone } from '@/services/user/user-info';
import PersonInfoModalVerificationCode from "../verification-code";
import styles from './index.less';
import { isRegularCode } from "../../person-info-rule";

interface PhoneInfoProps {
  phone: undefined | string;
  refresh: () => void;
  cancelPhone: () => void;
}
type Step = 0 | 1 | 2;

const regPhone = /^[1][3,4,5,7,8,9][0-9]{9}$/;

const PhoneInfo: React.FC<PhoneInfoProps> = ({
  phone,
  refresh,
  cancelPhone
}) => {

  const [step, setStep] = useState<Step>(phone ? 0 : 1)
  // const [step, setStep] = useState<Step>(2)

  const [currentPhone, setCurrentPhone] = useState<string>("");
  const [currentCode, setCurrentCode] = useState("")
  const [canOkClick, setCanOkClick] = useState<boolean>(false);

  const bindPhoneRef = useRef<Input>(null);

  const bindPhoneHandler = () => {
    const phoneNumber = bindPhoneRef.current!.input.value;
    if (!regPhone.test(phoneNumber)) {
      message.error("手机格式有误，请输入有效的11位手机号码")
    } else if (bindPhoneRef.current!.input.value === phone) {
      message.error("更换的手机号不能与原手机号相同")
    } else {
      setCurrentPhone(phoneNumber);
      setStep(2);
    }
  }

  const filishClickHandler = () => {
    if(!isRegularCode(currentCode)) {
      message.error("验证码格式有误，请输入有效6位数验证码")
      return 
    }
    changeUserPhone({
      code: currentCode,
      phone: currentPhone
    }).then(() => {
      setStep(0)
      message.success("更新成功")
      refresh()
    })
  }

  const handlerUnBindPhone = () => {
    unBindUserPhone().then(() => {
      message.success('解绑成功')
      refresh()
    })
  }

  const getStepComponent = (step: Step) => {
    // 已绑定手机
    if (step === 0) {
      return (
        <>
          <div className={styles.minHeight60}>
            已经绑定手机号: {phone}
          </div>
          <div className={classNames(styles.ml110, styles.minHeight60)}>
            <Space>
              <Button onClick={() => setStep(1)} type="primary">更换手机号</Button>
              <Popconfirm placement="top" title="解绑后无法通过该手机号登录，是否解绑？" onConfirm={handlerUnBindPhone}>
                <Button>解绑</Button>
              </Popconfirm>
            </Space>
          </div>
        </>
      );
      // 绑定新手机
    } else if (step === 1) {
      return (
        <>
          <div className={classNames(styles.minHeight60, styles.flex)}>
            <div className={styles.base60}>手机号: </div>
            <div><Input style={{ width: "200px" }} ref={bindPhoneRef} /></div>
          </div>
          <div className={classNames(styles.minHeight60, styles.ml60)}>
            <Button type="primary" onClick={bindPhoneHandler}>下一步</Button>
            <Button className={styles.ml12} onClick={() => phone ? setStep(0) : cancelPhone()}>取消</Button>
          </div>
        </>
      );
      // 获取验证码
    } else if (step === 2) {
      return (
        <>
          <div className={styles.minHeight60}>
            手机号: {currentPhone}
          </div>
          <div className={styles.minHeight60}>
            <PersonInfoModalVerificationCode type={1} phoneNumber={currentPhone} canSend={true} onChange={setCurrentCode} setCanOkClick={setCanOkClick} />
          </div>
          <div className={classNames(styles.minHeight60, styles.flex, styles.ml60)}>
            <Button disabled={!canOkClick} type="primary" onClick={filishClickHandler}>绑定</Button>
            <Button className={styles.ml12} onClick={() => setStep(phone ? 0 : 1)}>取消</Button>
          </div>
        </>
      );
    }
    return null
  }
  return (
    <div className={styles.phoneInfoWrap}>
      {getStepComponent(step)}
    </div>

  );
}

export default PhoneInfo;

