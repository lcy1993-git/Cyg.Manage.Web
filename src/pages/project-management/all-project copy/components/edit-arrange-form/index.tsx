import React from 'react';
import { TreeSelect, Divider } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import { getGroupInfo } from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';
import uuid from 'node-uuid';

interface EditArrangeFormProps {
  allotCompanyId?: string;
  canEdit?: any;
}

const EditArrangeForm: React.FC<EditArrangeFormProps> = (props) => {
  const { allotCompanyId = '', canEdit } = props;
  const {
    canEditDesign,
    canEditSurvey,
    canEditInternalAudit1,
    canEditInternalAudit2,
    canEditInternalAudit3,
    canEditInternalAudit4,
  } = canEdit;

  const { data: surveyData = [] } = useRequest(() => getGroupInfo('4', allotCompanyId), {
    refreshDeps: [allotCompanyId],
  });

  const { data: designData = [] } = useRequest(() => getGroupInfo('8', allotCompanyId), {
    refreshDeps: [allotCompanyId],
  });

  const { data: auditData = [] } = useRequest(() => getGroupInfo('16', allotCompanyId), {
    refreshDeps: [allotCompanyId],
  });

  const mapTreeData = (data: any) => {
    if (data.children && data.children.length > 0) {
      return {
        title: data.text,
        value: data.id,
        key: uuid.v1(),
        disabled: true,
        children: data.children ? data.children.map(mapTreeData) : [],
      };
    }
    return {
      title: data.text,
      value: data.id,
      key: uuid.v1(),
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  return (
    <>
      {canEditSurvey ? (
        <CyFormItem label="勘察" name="surveyUser" required>
          <TreeSelect
            key="editSurveyUser"
            style={{ width: '100%' }}
            treeData={surveyData.map(mapTreeData)}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      ) : (
        <CyFormItem label="勘察" name="surveyUser" required>
          <TreeSelect
            disabled
            key="editSurveyUser"
            style={{ width: '100%' }}
            treeData={surveyData.map(mapTreeData)}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      )}

      {canEditDesign ? (
        <CyFormItem label="设计" name="designUser" required>
          <TreeSelect
            key="editDesignUser"
            style={{ width: '100%' }}
            treeData={designData.map(mapTreeData)}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      ) : (
        <CyFormItem label="设计" name="designUser" required>
          <TreeSelect
            disabled
            key="editDesignUser"
            style={{ width: '100%' }}
            treeData={designData.map(mapTreeData)}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      )}

      {/* <Divider>设计校审</Divider> */}
      <div style={{ display: 'none' }}>
        {canEditInternalAudit1 ? (
          <CyFormItem label="校对" name="designAssessUser1">
            <TreeSelect
              key="editDesignAssessUser1"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        ) : (
          <CyFormItem label="校对" name="designAssessUser1">
            <TreeSelect
              disabled
              key="editDesignAssessUser1"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        )}

        {canEditInternalAudit2 ? (
          <CyFormItem label="校核" name="designAssessUser2">
            <TreeSelect
              key="editDesignAssessUser2"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        ) : (
          <CyFormItem label="校核" name="designAssessUser2">
            <TreeSelect
              disabled
              key="editDesignAssessUser2"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        )}
        {canEditInternalAudit3 ? (
          <CyFormItem label="审核" name="designAssessUser3">
            <TreeSelect
              key="editDesignAssessUser3"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        ) : (
          <CyFormItem label="审核" name="designAssessUser3">
            <TreeSelect
              disabled
              key="editDesignAssessUser3"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        )}

        {canEditInternalAudit4 ? (
          <CyFormItem label="审定" name="designAssessUser4" required>
            <TreeSelect
              key="editDesignAssessUser4"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        ) : (
          <CyFormItem label="审定" name="designAssessUser4" required>
            <TreeSelect
              disabled
              key="editDesignAssessUser4"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        )}
      </div>
    </>
  );
};

export default EditArrangeForm;
