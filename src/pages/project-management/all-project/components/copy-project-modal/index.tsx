import {
  copyProject,
  editProject,
  getProjectInfo,
} from '@/services/project-management/all-project';
import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useRequest } from 'ahooks';
import moment from 'moment';
import CreateProjectForm from '../create-project-form';

interface CopyProjectModalProps {
  projectId: string;
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  areaId: string;
  company: string;
  engineerId: string;
  companyName: string;
}

const CopyProjectModal: React.FC<CopyProjectModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [requestLoading, setRequestLoading] = useState(false);
  const [form] = Form.useForm();

  const { projectId, changeFinishEvent, areaId, company, engineerId, companyName } = props;

  const { data: projectInfo } = useRequest(() => getProjectInfo(projectId), {
    ready: !!projectId,
    refreshDeps: [projectId],
    onSuccess: (res) => {
      form.setFieldsValue({
        ...projectInfo,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.startTime ? moment(projectInfo?.deadline) : null,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
      });
    },
  });

  const edit = () => {
    form.validateFields().then(async (value) => {
      try {
        await copyProject({
          copyProjectId: projectId,
          engineerId: engineerId,
          ...value,
        });
        message.success('项目复制成功');
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

  return (
    <Modal
      maskClosable={false}
      title="复制项目"
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
      <Form form={form} preserve={false}>
        <CreateProjectForm
          companyName={companyName}
          areaId={areaId}
          company={company}
          projectInfo={projectInfo}
        />
      </Form>
    </Modal>
  );
};

export default CopyProjectModal;
