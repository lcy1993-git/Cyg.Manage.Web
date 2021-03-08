import React, { useEffect, useState } from 'react';
import { TreeSelect, Divider } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import {
  Arrangement,
  getCompanyName,
  getGroupInfo,
} from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';
import Search from 'antd/lib/input/Search';
import ReadonlyItem from '@/components/readonly-item';
import { getTreeSelectData } from '@/services/operation-config/company-group';

interface GetGroupUserProps {
  onChange?: (checkedValue: string) => void;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string
}

const ArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const { onChange, getCompanyInfo, defaultType = '2', allotCompanyId = "" } = props;

  const { data: companyInfo, run: getCompanyInfoEvent } = useRequest(getCompanyName, {
    manual: true,
  });

  const [checkedValue, setCheckedValue] = useState<string>('2');

  const { data: surveyData = [] } = useRequest(() => getGroupInfo('4',allotCompanyId));

  const { data: designData = [] } = useRequest(() => getGroupInfo('8',allotCompanyId));

  const { data: auditData = [] } = useRequest(() => getGroupInfo('16',allotCompanyId));

  const { data: groupData = []} = useRequest(() => getTreeSelectData());

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };


  const typeChange = (value: string) => {
    setCheckedValue(value);
    onChange?.(value);
  };

  const searchEvent = async (value: string) => {
    const res = await getCompanyInfoEvent(value);
    getCompanyInfo?.(res);
  };

  useEffect(() => {
    if (defaultType) {
      setCheckedValue(defaultType);
      onChange?.(defaultType);
    }
  }, [defaultType]);

  return (
    <>
      <CyFormItem label="安排方式">
        <div>
          <EnumSelect
            value={checkedValue}
            onChange={(value) => typeChange(value as string)}
            enumList={Arrangement}
          />
        </div>
      </CyFormItem>
      {checkedValue === '2' && (
        <>
          <CyFormItem label="勘察" name="surveyUser" required>
            <TreeSelect
              key="surveyUser"
              style={{ width: '100%' }}
              treeData={surveyData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>

          <CyFormItem label="设计" name="designUser" required>
            <TreeSelect
              key="designUser"
              style={{ width: '100%' }}
              treeData={designData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>

          <Divider>设计校审</Divider>

          <CyFormItem label="校对" name="designAssessUser1">
            <TreeSelect
              key="designAssessUser1"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
          <CyFormItem label="校核" name="designAssessUser2">
            <TreeSelect
              key="designAssessUser2"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
          <CyFormItem label="审核" name="designAssessUser3">
            <TreeSelect
              key="designAssessUser3"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
          <CyFormItem label="审定" name="designAssessUser4" required>
            <TreeSelect
              key="designAssessUser4"
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </>
      )}
      {checkedValue === '1' && (
        <>
          <CyFormItem label="单位">
            <div>
              <Search placeholder="请输入单位" onSearch={(value) => searchEvent(value)} />
            </div>
          </CyFormItem>
          <ReadonlyItem label="单位名称" align="left">
            {companyInfo?.text}
          </ReadonlyItem>
        </>
      )}
      {checkedValue === '3' && (
        <>
          <CyFormItem label="部组" name="allotCompanyGroup">
            <TreeSelect
              style={{ width: '100%' }}
              treeData={groupData?.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </>
      )}
    </>
  );
};

export default ArrangeForm;
