import { useControllableValue } from 'ahooks';
import { Form, message, Tabs } from 'antd';
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

const { TabPane } = Tabs;

const ArrangeModal: React.FC<ArrangeModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [companyInfo, setCompanyInfo] = useState<any>();
  const { projectIds, finishEvent, defaultSelectType = '2', allotCompanyId } = props;

  const [arrangeType, setArrangeType] = useState<string>('');

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
      width={680}
      visible={state as boolean}
      okText="提交"
      destroyOnClose
      onOk={() => saveInfo()}
      onCancel={() => closeModalEvent()}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="项目安排" key="1">
          <Form form={form} preserve={false}>
            <ArrangeForm
              defaultType={defaultSelectType}
              allotCompanyId={allotCompanyId}
              getCompanyInfo={getCompanyInfo}
              onChange={(value) => setSelectType(value)}
              // checkArrangeType={setArrangeType}
            />
          </Form>
        </TabPane>
        {(selectType === '2' || selectType === '4') && (
          <TabPane tab="外审安排" key="2">
            Tab 2
          </TabPane>
        )}
        {(selectType === '1' || selectType === '3') && (
          <TabPane tab="外审安排" disabled key="2">
            Tab 2
          </TabPane>
        )}
      </Tabs>
    </Modal>
  );
};

export default ArrangeModal;
