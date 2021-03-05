import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import EditArrangeForm from '../edit-arrange-form';
import { editArrange, getProjectInfo } from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';

interface EditArrangeProps {
  projectIds: string[];
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
}

const EditArrangeModal: React.FC<EditArrangeProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [requestLoading, setRequestLoading] = useState(false);
  const [form] = Form.useForm();

  const { projectIds, changeFinishEvent } = props;

  const {data: projectInfo, run} = useRequest(getProjectInfo,{
    manual: true,
    onSuccess: () => {
      console.log(projectInfo)
    }
  })

  const edit = () => {
    form.validateFields().then(async (value) => {
      try {
        const arrangeInfo = Object.assign(
          {
            projectIds: projectIds,
            surveyUser: '',
            designUser: '',
            designAssessUser1: '',
            designAssessUser2: '',
            designAssessUser3: '',
            designAssessUser4: '',
          },
          value,
        );
        await editArrange(arrangeInfo);
        message.success('安排信息更新成功');
        setState(false);
        form.resetFields();
        changeFinishEvent?.();
      } catch (msg) {
        console.error(msg);
      } finally {
        setRequestLoading(false);
      }
    });
  };

  useEffect(() => {
    if(projectIds.length === 1) {
      run(projectIds[0])
    }
  }, [JSON.stringify(projectIds)])

  return (
    <Modal
      title="修改安排信息"
      width={750}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => edit()}>
          保存
        </Button>,
      ]}
      onOk={() => edit()}
      onCancel={() => setState(false)}
    >
      <Form form={form}>
        <EditArrangeForm />
      </Form>
    </Modal>
  );
};

export default EditArrangeModal;
