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
import moment, { Moment } from 'moment';
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
  startTime?: Moment;
  endTime?: Moment;
}

const CopyProjectModal: React.FC<CopyProjectModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [requestLoading, setRequestLoading] = useState(false);
  const [form] = Form.useForm();

  const {
    projectId,
    changeFinishEvent,
    areaId,
    company,
    engineerId,
    companyName,
    startTime,
    endTime,
  } = props;

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
        disclosureRange:
          projectInfo?.dataSourceType === 2
            ? '“无需现场数据”项目，免设置此条目'
            : projectInfo?.dataSourceType === 1
            ? '“点位导入”项目，免设置此条目'
            : projectInfo?.disclosureRange,
        pileRange:
          projectInfo?.dataSourceType === 2
            ? '“无需现场数据”项目，免设置此条目'
            : projectInfo?.dataSourceType === 1
            ? '“点位导入”项目，免设置此条目'
            : projectInfo?.pileRange,
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
          totalInvest: value.totalInvest ? value.totalInvest : 0,
          disclosureRange:
            value.disclosureRange === '“无需现场数据”项目，免设置此条目' ||
            value.disclosureRange === '“点位导入”项目，免设置此条目'
              ? 0
              : value.disclosureRange,
          pileRange:
            value.pileRange === '“无需现场数据”项目，免设置此条目' ||
            value.pileRange === '“点位导入”项目，免设置此条目'
              ? 0
              : value.pileRange,
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
      width={780}
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
          projectId={projectId}
          form={form}
          engineerStart={startTime}
          engineerEnd={endTime}
        />
      </Form>
    </Modal>
  );
};

export default CopyProjectModal;
