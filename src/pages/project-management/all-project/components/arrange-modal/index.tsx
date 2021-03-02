import { useControllableValue } from 'ahooks';
import { Form, message } from 'antd';
import { Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import ArrangeForm from '../arrange-form';
import { saveArrange } from '@/services/project-management/all-project';

interface ArrangeModalProps {
  projectIds: string[];
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
}

const ArrangeModal: React.FC<ArrangeModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const { projectIds } = props;
  console.log(projectIds);

  const [selectType, setSelectType] = useState<string>('');

  const [form] = Form.useForm();

  const saveInfo = () => {
    form.validateFields().then(async (values) => {
      console.log(projectIds);
      const arrangeInfo = Object.assign(
        {
          allotType: selectType,
          projectIds: projectIds,
          surveyUser: '',
          designUser: '',
          designAssessUser1: '',
          designAssessUser2: '',
          designAssessUser3: '',
          designAssessUser4: '',
          allotCompanyGroup: '',
          allotOrganizeUser: '',
        },
        values,
      );
      await saveArrange(arrangeInfo);
      message.success('操作成功！');
    });
  };

  return (
    <Modal
      title="项目安排"
      width={680}
      visible={state as boolean}
      okText="提交"
      onOk={() => saveInfo()}
      onCancel={() => setState(false)}
    >
      <Form form={form}>
        <ArrangeForm onChange={(value) => setSelectType(value)} />
      </Form>
    </Modal>
  );
};

export default ArrangeModal;
