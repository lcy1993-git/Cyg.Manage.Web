import { editProject, getProjectInfo, inheritProject } from '@/services/project-management/all-project';
import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import moment, { Moment } from 'moment';
import CreateProjectForm from '../create-project-form';
import { isNumber } from 'lodash';

interface ProjectInheritModalProps {
  projectId: string;
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  areaId: string;
  company: string;
  companyName?: string;
  status: number;
  startTime?: Moment;
  endTime?: Moment;
  engineerId: string;
}

const ProjectInheritModal: React.FC<ProjectInheritModalProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [requestLoading, setRequestLoading] = useState(false);
  const [form] = Form.useForm();

  const { projectId, changeFinishEvent, areaId, company, companyName, status, startTime, endTime, engineerId} =
    props;

  const { data: projectInfo, run } = useRequest(() => getProjectInfo(projectId), {
    manual: true,
    onSuccess: (res) => {
      const { dataSourceType, disclosureRange, pileRange } = projectInfo!;
      const handleDisclosureRange =
        dataSourceType === 2 ? '“无需现场数据”项目，免设置此条目' : disclosureRange;
      const handlePileRange = dataSourceType === 2 ? '“无需现场数据”项目，免设置此条目' : pileRange;
      form.setFieldsValue({
        ...projectInfo,
        startTime: projectInfo?.startTime ? moment(projectInfo?.startTime) : null,
        endTime: projectInfo?.endTime ? moment(projectInfo?.endTime) : null,
        deadline: projectInfo?.deadline ? moment(projectInfo?.deadline) : null,
        natures: (projectInfo?.natures ?? []).map((item: any) => item.value),
        isAcrossYear: projectInfo?.isAcrossYear ? 'true' : 'false',
        disclosureRange: handleDisclosureRange,
        pileRange: handlePileRange,
        dataSourceType: projectInfo?.dataSourceType === 1 ? 0 : projectInfo?.dataSourceType,
        stage: isNumber(projectInfo?.stage) ? projectInfo?.stage + 1 : 1,
      });
    },
  });

  useEffect(() => {
    if (state) {
      run();
    }
  }, [state]);

  const sureProjectInheritEvent = () => {
    // TODO 做保存接口
    form.validateFields().then(async (value) => {
      try {
        await inheritProject({
          inheritProjectId: projectId,
          engineerId,
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
        message.success('项目已开始进行继承');
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
      title="项目继承"
      centered
      width={800}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => setState(false)}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={requestLoading} onClick={() => sureProjectInheritEvent()}>
          保存
        </Button>,
      ]}
      onOk={() => sureProjectInheritEvent()}
      onCancel={() => setState(false)}
    >
      <Form form={form} preserve={false}>
        <CreateProjectForm
          isInherit={true}
          areaId={areaId}
          company={company}
          companyName={companyName}
          status={status}
          projectId={projectId}
          engineerStart={startTime}
          engineerEnd={endTime}
          form={form}
        />
      </Form>
    </Modal>
  );
};

export default ProjectInheritModal;
