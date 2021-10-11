import { Button, Input, message } from "antd";
import { useState } from "react";
import classNames from "classnames";

import styles from '../phone-info/index.less';
import { useRef } from "react";

interface EmailInfoProps {
  email: undefined | string;
  refresh: () => void;
}
type Step = 0 | 1 | 2;

const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

const EmailInfo: React.FC<EmailInfoProps> = ({
  email,
  refresh
}) => {

  const [step, setStep] = useState<Step>(email ? 0 : 1)

  const [currentEmail, setCurrentEmail] = useState<string>("")

  const bindEmailRef = useRef<Input>(null);
  const codeRef = useRef<Input>(null)

  const bindEmailHandler = () => {
    const emailNumber = bindEmailRef.current!.input.value;
    if (!regEmail.test(emailNumber)) {
      message.error("邮箱格式错误")
    } else if (bindEmailRef.current!.input.value.length > 20) {
      message.error('邮箱字符过长');
    } else if (bindEmailRef.current!.input.value === email) {
      message.error("更换的邮箱号不能与原邮箱号相同")
    } else {
      setCurrentEmail(emailNumber);
      setStep(2);
    }
  }
  const filishClickHandler = () => {
  }
  const getStepComponent = (step: Step) => {
    // 已绑定手机
    if (step === 0) {
      return (
        <>
          <div className={styles.minHeight60}>
            已经绑定邮箱: {email}
          </div>
          <div className={classNames(styles.ml110, styles.minHeight60)}>
            <Button onClick={() => setStep(1)} type="primary">更换邮箱</Button>
          </div>
        </>
      );
      // 绑定新手机
    } else if (step === 1) {
      return (
        <>
          <div className={classNames(styles.minHeight60, styles.flex)}>
            <div className={styles.base60}>邮箱: </div>
            <div><Input style={{ width: "200px" }} ref={bindEmailRef} /></div>
          </div>
          <div className={classNames(styles.minHeight60, styles.ml60)}>
            <Button type="primary" onClick={bindEmailHandler}>下一步</Button>
            <Button className={styles.ml12} onClick={() => setStep(email ? 0 : 1)}>取消</Button>
          </div>
        </>
      );
      // 获取验证码
    } else if (step === 2) {
      return (
        <>
          <div className={styles.minHeight60}>
            <span style={{ display: "inline-block", width: "56px" }}>邮箱: </span>
            {currentEmail}验证邮件已发出，去<span className={styles.link}>查收</span>或<span className={styles.link}>再发一次</span>
          </div>
          <div className={classNames(styles.minHeight60, styles.flex)}>
            {/* <PersonInfoModalVerificationCode type={4} phoneNumber={currentEmail} canSend={true} /> */}
            <div>验证码：</div>
            <div>
              <Input placeholder="验证码" ref={codeRef}></Input>
            </div>
          </div>
          <div className={classNames(styles.minHeight60, styles.flex, styles.ml60)}>
            <Button type="primary" onClick={filishClickHandler}>下一步</Button>
            <Button className={styles.ml12} onClick={() => setStep(email ? 0 : 1)}>取消</Button>
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

export default EmailInfo;
