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
      const {allots} = projectInfo ?? {};
      if(allots && allots.length > 0) {
        const latestAllot = allots[allots?.length - 1];
        const allotType = latestAllot.allotType;
        const users = latestAllot.users;
        if(allotType === 2) {
          console.log(users)
          let personObj = {};
          users.filter((item: any) => item.key.value === 1 || item.key.value === 2).forEach((item: any) => {
            if(item.key.value === 1) {
              personObj["surveyUser"] = (item.value ?? [])[0].userId;
            }
            if(item.key.value === 2) {
              personObj["designUser"] = (item.value ?? [])[0].userId;
            }
          })
          let auditPersonObj = {};
          users.filter((item: any) => item.key.value === 4).forEach((item: any) => {
            const auditPersonArray = item.value ?? [];
            auditPersonArray.forEach((ite: any) => {
              if(ite.auditSubType !== 0) {
                auditPersonObj[`designAssessUser${ite.auditSubType}`] = ite.userId;
              }
            })
          })
          form.setFieldsValue({
            ...personObj,
            ...auditPersonObj
          })
        }
      }
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
      if(state) {
        run(projectIds[0])
      }
    }
  }, [JSON.stringify(projectIds),state])
  

  const modalCloseEvent = () => {
    form.resetFields();
    setState(false)
  }

  return (
    <Modal
      title="修改安排信息"
      width={750}
      visible={state as boolean}
      destroyOnClose
      footer={[
        <Button key="cancle" onClick={() => modalCloseEvent()}>
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
