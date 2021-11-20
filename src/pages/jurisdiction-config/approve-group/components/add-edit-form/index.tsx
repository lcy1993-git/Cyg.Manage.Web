import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import { GetUserTreeByGroup } from '@/services/personnel-config/company-user';

import rules from './rule';

interface CompanyGroupFormProps {
  id?: string;
  groupId?: string;
}

const ApproveGroupForm: React.FC<CompanyGroupFormProps> = (props) => {
  //   const mapTreeData = (data: any) => {
  //     return {
  //       title: data.text,
  //       value: data.id,
  //       children: data.children.map(mapTreeData),
  //     };
  //   };

  return (
    <>
      <CyFormItem label="名称" name="name" required rules={rules.name}>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="审批责任人" name="userId" required rules={rules.userId}>
        <UrlSelect
          showSearch
          url="/ProjectApproveGroup/GetUserList"
          titlekey="text"
          valuekey="id"
          placeholder="请选择审批责任人"
          extraParams={{ category: 1 }}
          requestType="post"
        />
      </CyFormItem>

      <CyFormItem label="成员" name="userIds">
        <UrlSelect
          mode="multiple"
          showSearch
          url="/ProjectApproveGroup/GetUserList"
          extraParams={{ category: 2 }}
          titlekey="text"
          valuekey="id"
          placeholder="请选择组别成员"
          requestType="post"
        />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <Input.TextArea showCount maxLength={200} />
      </CyFormItem>
    </>
  );
};

export default ApproveGroupForm;
