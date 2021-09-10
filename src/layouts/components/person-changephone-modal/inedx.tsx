import React, {useEffect, useState} from 'react';
import { Form, Modal, Input, message } from 'antd';
import ImageIcon from '@/components/image-icon';
import { loginRules } from '@/pages/login/components/login-form/rule';
import { phoneNumberRule } from '@/utils/common-rule';
import VerificationCode from '@/components/verification-code';
import { changeUserPhone } from '@/services/user/user-info';
import styles from './index.less';
import { useExternal } from 'ahooks';

interface ChangedValues {
  phone?: string;
  code?: string;
}

/**
 * 判断用户是否已经为绑定手机状态
 * @绑定手机 type = 0
 * @修改手机 type = 1
 */
 type Type = 0 | 1 | undefined;

interface Props {
  visble: boolean;
  closeChangePhoneModal: () => void;
  reload: () => void;
  type: Type;
  typeTitle: string
}

const ChangePhoneModal = (props: Props) => {

  const {visble, closeChangePhoneModal, reload, type, typeTitle} = props;

  const [canSendCode, setCanSendCode] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [codeNumber, setCodeNumber] = useState<string>('');


  const [canOkClick, setCanOkClick] = useState<boolean>(false)

  const [form] = Form.useForm();

  useEffect(() => {
    const state = phoneNumberRule.test(phoneNumber);
    canSendCode !== state && setCanSendCode(state);
  }, [phoneNumber]);

  const formChangeEvent = (changedValues: ChangedValues) => {
    if(changedValues.hasOwnProperty('phone')){
      setPhoneNumber(changedValues?.phone!)
    }else if(changedValues.hasOwnProperty('code')) {
      setCodeNumber(changedValues?.code!)
    }
  };

  const submit = () => {
    if(!canOkClick) {
      message.error('请点击发送验证码按钮并确保手机格式正确');
    }else if((/^\d{6}$/).test(codeNumber)) {
      const params = {
        code: codeNumber,
        phone: phoneNumber
      };
      if(type === 1){
        changeUserPhone(params).then(() => {
          message.success("操作成功");
          closeChangePhoneModal();
          reload();
        })
      }else if(type === 0) {
        // bind
        changeUserPhone(params).then(() => {
          message.success("操作成功");
          closeChangePhoneModal();
          reload();
        })
      }
    }else{
      message.error('请输入有效6位数验证码')
    }
  }

  return (
    <Modal
      maskClosable={false}
      className={styles.modal}
      width={300}
      visible={visble}
      title={typeTitle}
      bodyStyle={{ padding: "0px 20px" }}
      // destroyOnClose width={750}
      okText="确定"
      cancelText="取消"
      onCancel={closeChangePhoneModal}
      onOk={submit}
    >
      <Form className={styles.content} onValuesChange={formChangeEvent}>
        <Form.Item
          className={styles.phoneInput}
          name="phone"
          // rules={loginRules['phone'].phone}
          validateTrigger="onBlur"
        >
          <Input
            suffix={<ImageIcon imgUrl="phone.png" />}
            placeholder="手机号"
            className={styles.loginInput}
            type="text"
          />
        </Form.Item>
        <Form.Item
          className={styles.verificationCode}
          name="code"
          rules={loginRules['phone'].verificationCode}
        >
          <VerificationCode setCanOkClick={setCanOkClick} canSend={canSendCode} type={1} phoneNumber={phoneNumber} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangePhoneModal;