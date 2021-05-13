import React, { useEffect, useState } from 'react';
import { TreeSelect, Divider, message } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import {
  Arrangement,
  IsArrangement,
  getCompanyName,
  getGroupInfo,
} from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';
import Search from 'antd/lib/input/Search';
import uuid from 'node-uuid';

interface GetGroupUserProps {
  onChange?: (checkedValue: string) => void;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string;
}

const ExternalArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const { onChange, getCompanyInfo, defaultType = '2', allotCompanyId = '' } = props;

  const { data: companyInfo, run: getCompanyInfoEvent } = useRequest(getCompanyName, {
    manual: true,
  });

  const [checkedValue, setCheckedValue] = useState<string>('2');

  const { data: surveyData = [] } = useRequest(() => getGroupInfo('4', allotCompanyId));

  const { data: designData = [] } = useRequest(() => getGroupInfo('8', allotCompanyId));

  const { data: auditData = [] } = useRequest(() => getGroupInfo('16', allotCompanyId));

  const { data: groupData = [] } = useRequest(() => getTreeSelectData());

  const mapTreeData = (data: any) => {
    if (data.children && data.children.length > 0 && checkedValue != '3') {
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

  const typeChange = (value: string) => {
    setCheckedValue(value);
    onChange?.(value);
  };

  const searchEvent = async (value: string) => {
    if (value == '') {
      message.warning('请输入单位账户');
      return;
    }
    const res = await getCompanyInfoEvent(value);
    if (res == undefined) {
      message.error('账户不存在');
      return;
    }
    getCompanyInfo?.(res);
  };

  useEffect(() => {
    if (defaultType) {
      setCheckedValue(defaultType);
      onChange?.(defaultType);
    }
  }, [defaultType]);

  return <></>;
};

export default ExternalArrangeForm;
