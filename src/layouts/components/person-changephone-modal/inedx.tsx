import React, {useState} from 'react';
import { Form, Modal, Input } from 'antd';
import ImageIcon from '@/components/image-icon';
import { loginRules } from '@/pages/login/components/login-form/rule';
import { phoneNumberRule } from '@/utils/common-rule';
import VerificationCode from '@/components/verification-code';
import { changeUserPhone, bindUserPhone } from '@/services/user/user-info';
import styles from './index.less';

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
  const [codeNumber, setCodeNumber] = useState('');

  const [form] = Form.useForm();

  const testNumberRule = () => {
    const state = phoneNumberRule.test(phoneNumber);
    setCanSendCode(state);
  }

  const formChangeEvent = (changedValues: ChangedValues) => {
    if(changedValues.hasOwnProperty('phone')){
      setPhoneNumber(changedValues?.phone!)
    }else if(changedValues.hasOwnProperty('code')) {
      setCodeNumber(changedValues?.code!)
    }
  };

  const submit = () => {
    form.validateFields().then(() => {
      let params = {
        code: codeNumber,
        phone: phoneNumber
      };
      if(type === 1){
        changeUserPhone(params)
      }else if(type === 0) {
        bindUserPhone(params)
      }
    }).then(() => {
      closeChangePhoneModal();
      reload();
    })
  }

  return (
    <Modal
      className={styles.modal}
      style={{width: 200}}
      visible={visble}
      title={typeTitle}
      bodyStyle={{ padding: "0px 20px" }}
      destroyOnClose width={750}
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
            onBlur={testNumberRule}
            className={styles.loginInput}
            type="text"
          />
        </Form.Item>
        <Form.Item
          className={styles.verificationCode}
          name="code"
          rules={loginRules['phone'].verificationCode}
        >
          <VerificationCode canSend={canSendCode} type={1} phoneNumber={phoneNumber} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ChangePhoneModal;