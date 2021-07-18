import React, { useEffect, useState } from 'react';
import { TreeSelect, message } from 'antd';
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
import ReadonlyItem from '@/components/readonly-item';
import { getTreeSelectData } from '@/services/operation-config/company-group';
import uuid from 'node-uuid';

interface GetGroupUserProps {
  onChange?: (checkedValue: string) => void;
  getCompanyInfo?: (companyInfo: any) => void;
  defaultType?: string;
  allotCompanyId?: string | undefined;
  dataSourceType?: number;
}

const ArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const {
    onChange,
    getCompanyInfo,
    defaultType = '2',
    allotCompanyId = '',
    dataSourceType,
  } = props;

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

  return (
    <>
      <CyFormItem label="安排方式">
        <div>
          <EnumSelect
            value={checkedValue}
            onChange={(value) => typeChange(value as string)}
            enumList={allotCompanyId ? IsArrangement : Arrangement}
          />
        </div>
      </CyFormItem>
      {(checkedValue === '2' || checkedValue === '4') && (
        <>
          {dataSourceType === 2 ? (
            <CyFormItem label="勘察" name="surveyUser" required>
              <TreeSelect
                key="surveyUser"
                style={{ width: '100%' }}
                treeData={surveyData.map(mapTreeData)}
                placeholder="“无需现场数据”项目，免安排勘察人员"
                treeDefaultExpandAll
                disabled
              />
            </CyFormItem>
          ) : dataSourceType === 1 ? (
            <CyFormItem label="勘察" name="surveyUser" required>
              <TreeSelect
                key="surveyUser"
                style={{ width: '100%' }}
                treeData={surveyData.map(mapTreeData)}
                placeholder="“点位导入”项目，免安排勘察人员"
                treeDefaultExpandAll
                disabled
              />
            </CyFormItem>
          ) : dataSourceType === -1 ? (
            <CyFormItem label="勘察" name="surveyUser" required>
              <TreeSelect
                key="surveyUser"
                style={{ width: '100%' }}
                treeData={surveyData.map(mapTreeData)}
                placeholder="免安排勘察人员"
                treeDefaultExpandAll
                disabled
              />
            </CyFormItem>
          ) : (
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
          )}

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
          {/* <Divider>设计校审</Divider> */}
          <div style={{ display: 'none' }}>
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
            <CyFormItem label="审定" name="designAssessUser4">
              <TreeSelect
                key="designAssessUser4"
                style={{ width: '100%' }}
                treeData={auditData.map(mapTreeData)}
                placeholder="请选择"
                treeDefaultExpandAll
                allowClear
              />
            </CyFormItem>
          </div>
        </>
      )}
      {checkedValue === '1' && (
        <>
          <CyFormItem label="单位">
            <div>
              <Search
                placeholder="请输入管理员用户名或手机号码"
                onSearch={(value) => searchEvent(value)}
              />
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
