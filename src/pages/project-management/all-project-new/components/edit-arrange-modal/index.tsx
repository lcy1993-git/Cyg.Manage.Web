import { useControllableValue } from 'ahooks';
import { Button } from 'antd';
import { Form, message, Modal } from 'antd';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import EditArrangeForm from '../edit-arrange-form';
import {
  editArrange,
  getAllotUsers,
  getProjectInfo,
} from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';
import { Tabs } from 'antd';
import SelectAddListForm from '../select-add-list-form';
import { UserInfo } from '@/services/project-management/select-add-list-form';

interface EditArrangeProps {
  projectIds: string[];
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent: () => void;
  allotCompanyId?: string;
  canEdit?: any;
  dataSourceType?: number;
}

const { TabPane } = Tabs;

const EditArrangeModal: React.FC<EditArrangeProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [requestLoading, setRequestLoading] = useState(false);
  const [form] = Form.useForm();

  const [arrangePeople, setArrangePeople] = useState<UserInfo[]>([]); //添加的外审人员列表
  const [initPeople, setInitPeople] = useState<UserInfo[]>([]);

  const { projectIds, changeFinishEvent, allotCompanyId, canEdit, dataSourceType } = props;
  const {
    canEditDesign,
    canEditSurvey,
    canEditDesignAssessUser1,
    canEditDesignAssessUser2,
    canEditDesignAssessUser3,
    canEditDesignAssessUser4,
    canEditCostAuditUser1,
    canEditCostAuditUser2,
    canEditCostAuditUser3,
  } = canEdit;

  const { data: projectInfo, run } = useRequest(getProjectInfo, {
    manual: true,
    onSuccess: () => {
      const { allots } = projectInfo ?? {};
      if (allots && allots.length > 0) {
        const latestAllot = allots[allots?.length - 1];
        const allotType = latestAllot.allotType;
        const users = latestAllot.users;

        if (allotType === 2 || allotType === 4) {
          let personObj = {};
          users
            .filter(
              (item: any) => item.key.value === 1 || item.key.value === 2 || item.key.value === 3,
            )
            .forEach((item: any) => {
              if (item.key.value === 1) {
                personObj['surveyUser'] = (item.value ?? [])[0].userId;
              }
              if (item.key.value === 2) {
                personObj['designUser'] = (item.value ?? [])[0].userId;
              }
              if (item.key.value === 3) {
                personObj['costUser'] = (item.value ?? [])[0].userId;
              }
            });
          let auditPersonObj = {};
          users
            .filter((item: any) => item.key.value === 4)
            .forEach((item: any) => {
              const auditPersonArray = item.value ?? [];
              auditPersonArray.forEach((ite: any) => {
                if (ite.auditSubType !== 0) {
                  auditPersonObj[`designAssessUser${ite.auditSubType}`] = ite.userId;
                }
              });
            });
          let costAuditPerson = {};
          users
            .filter((item: any) => item.key.value === 5)
            .forEach((item: any) => {
              const auditPersonArray = item.value ?? [];
              auditPersonArray.forEach((ite: any) => {
                if (ite.costAuditSubType !== 0) {
                  costAuditPerson[`costAuditUser${ite.costAuditSubType}`] = ite.userId;
                }
              });
            });
          console.log(costAuditPerson);

          form.setFieldsValue({
            ...personObj,
            ...auditPersonObj,
            ...costAuditPerson,
          });
        }
      }
    },
  });

  const { run: getOuterPeople } = useRequest(getAllotUsers, {
    manual: true,
    onSuccess: (res) => {
      const handleData = res?.map((item: any) => {
        return {
          value: item.userId,
          text: item.userNameText,
        };
      });
      setInitPeople(handleData ?? []);
    },
  });

  const edit = () => {
    form.validateFields().then(async (value) => {
      try {
        if (!canEditDesign) {
          value.designUser = '';
        }
        if (!canEditSurvey) {
          value.surveyUser = '';
        }
        if (!canEditDesignAssessUser1) {
          value.designAssessUser1 = '';
        }
        if (!canEditDesignAssessUser2) {
          value.designAssessUser2 = '';
        }
        if (!canEditDesignAssessUser3) {
          value.designAssessUser3 = '';
        }
        if (!canEditDesignAssessUser4) {
          value.designAssessUser4 = '';
        }
        if (!canEditCostAuditUser1) {
          value.costAuditUser1 = '';
        }
        if (!canEditCostAuditUser2) {
          value.costAuditUser2 = '';
        }
        if (!canEditCostAuditUser3) {
          value.costAuditUser3 = '';
        }

        const outerAuditUsers = arrangePeople?.map((item) => item.value);

        const arrangeInfo = Object.assign(
          {
            projectIds: projectIds,
            surveyUser: '',
            designUser: '',
            costUser: '',
            designAssessUser1: '',
            designAssessUser2: '',
            designAssessUser3: '',
            designAssessUser4: '',
            costAuditUser1: '',
            costAuditUser2: '',
            costAuditUser3: '',
          },
          value,
        );

        arrangeInfo.outerAuditUsers = outerAuditUsers;

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
    if (projectIds.length === 1) {
      if (state) {
        run(projectIds[0]);
        getOuterPeople(projectIds[0], 6);
      }
    }
  }, [JSON.stringify(projectIds), state]);

  const modalCloseEvent = () => {
    form.resetFields();
    setState(false);
  };

  return (
    <Modal
      maskClosable={false}
      title="修改安排信息"
      width={750}
      visible={state as boolean}
      destroyOnClose
      bodyStyle={{
        padding: `20px`,
      }}
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
      <Form form={form} preserve={false}>
        <EditArrangeForm
          allotCompanyId={allotCompanyId}
          canEdit={canEdit}
          dataSourceType={dataSourceType}
        />
      </Form>
    </Modal>
  );
};

export default EditArrangeModal;
