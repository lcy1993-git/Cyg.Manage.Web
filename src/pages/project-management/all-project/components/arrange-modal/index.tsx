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
  finishEvent?: () => void;
  defaultSelectType?: string;
  allotCompanyId?: string;
}

const ArrangeModal: React.FC<ArrangeModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [companyInfo, setCompanyInfo] = useState<any>();
  const { projectIds, finishEvent, defaultSelectType = '2', allotCompanyId } = props;

  const [selectType, setSelectType] = useState<string>('');

  const [form] = Form.useForm();

  const getCompanyInfo = (companyInfo: any) => {
    setCompanyInfo(companyInfo);
  };

  const saveInfo = () => {
    form.validateFields().then(async (values) => {
      if (selectType === '2') {
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
          },
          values,
        );
        await saveArrange(arrangeInfo);
      }
      if (selectType === '1') {
        if (companyInfo === undefined) {
          message.error('请输入组织账户');
          return;
        }
        const arrangeInfo = Object.assign(
          {
            allotType: selectType,
            projectIds: projectIds,
            allotOrganizeUser: companyInfo.value,
          },
          values,
        );
        await saveArrange(arrangeInfo);
      }

      if (selectType === '3') {
        const arrangeInfo = Object.assign(
          {
            allotType: selectType,
            projectIds: projectIds,
            allotCompanyGroup: '',
          },
          values,
        );
        await saveArrange(arrangeInfo);
      }

      if (selectType === '4') {
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
          },
          values,
        );
        await saveArrange(arrangeInfo);
      }
      message.success('操作成功！');
      finishEvent?.();
      form.resetFields();
    });
  };

  const closeModalEvent = () => {
    setState(false);
    form.resetFields();
  };

  return (
    <Modal
      maskClosable={false}
      title="项目安排"
      width={680}
      visible={state as boolean}
      okText="提交"
      destroyOnClose
      onOk={() => saveInfo()}
      onCancel={() => closeModalEvent()}
    >
      <Form form={form} preserve={false}>
        <ArrangeForm
          defaultType={defaultSelectType}
          allotCompanyId={allotCompanyId}
          getCompanyInfo={getCompanyInfo}
          onChange={(value) => setSelectType(value)}
        />
      </Form>
    </Modal>
  );
};

export default ArrangeModal;
